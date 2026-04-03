import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { appendToSheet, isEmailInSheet } from '@/lib/google-sheets'
import { sendTelegram, telegramBlogSubscribe } from '@/lib/telegram'
import { formatPTDate, sendEmail, buildBlogSubscribeEmail, buildBlogAlreadySubscribedEmail } from '@/lib/email'
import { generateUnsubscribeUrl } from '@/lib/unsubscribe'

const schema = z.object({
  email: z.string().email().max(200),
  language: z.string().max(10).optional(),
  honeypot: z.string().max(0).optional(),
})

function getIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown'
}

export async function POST(req: Request) {
  const ip = getIP(req)
  if (!rateLimit(ip, 5, 60_000)) {
    return Response.json({ error: 'Demasiados pedidos. Tente novamente.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Pedido inválido.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Email inválido.' }, { status: 422 })
  }

  const raw = body as Record<string, unknown>
  if (raw.honeypot && String(raw.honeypot).length > 0) {
    return Response.json({ ok: true })
  }

  const { email, language = 'pt' } = parsed.data
  const timestamp = formatPTDate(new Date())

  // Se o email está em Cancelados, permite re-subscrição (ignora o check de já subscrito)
  const isCancelled = await isEmailInSheet('Cancelados', email)

  // Verificar se o email já está subscrito (e não cancelou)
  if (!isCancelled) {
    const alreadySubscribed = await isEmailInSheet('Subscritores', email)
    if (alreadySubscribed) {
      const unsubscribeUrl = await generateUnsubscribeUrl(email, language)
      const subjectMap: Record<string, string> = {
        pt: 'Já estás subscrito — Blog Re-Evolution',
        en: 'You\'re already subscribed — Re-Evolution Blog',
        es: 'Ya estás suscrito — Blog Re-Evolution',
      }
      await sendEmail({
        to: email,
        subject: subjectMap[language] ?? subjectMap.en,
        html: buildBlogAlreadySubscribedEmail({ email, language, unsubscribeUrl }),
      })
      return Response.json({ already: true })
    }
  }

  // Google Sheets — aba "Subscritores"
  // Colunas: Mail | Língua | Conteúdo pretendido | Data/Hora
  await appendToSheet('Subscritores', [email, language.toUpperCase(), 'Todas as publicações', timestamp])

  // Telegram
  await sendTelegram(telegramBlogSubscribe({ email, language, timestamp }))

  // Email de confirmação ao subscritor
  const unsubscribeUrl = await generateUnsubscribeUrl(email, language)
  const subjectMap: Record<string, string> = {
    pt: 'Subscrição confirmada — Blog Re-Evolution',
    en: 'Subscription confirmed — Re-Evolution Blog',
    es: 'Suscripción confirmada — Blog Re-Evolution',
  }
  await sendEmail({
    to: email,
    subject: subjectMap[language] ?? subjectMap.en,
    html: buildBlogSubscribeEmail({ email, language, unsubscribeUrl }),
  })

  return Response.json({ ok: true })
}
