import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { appendToSheet } from '@/lib/google-sheets'
import { sendTelegram, telegramBlogSubscribe } from '@/lib/telegram'
import { formatPTDate } from '@/lib/email'

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

  // Google Sheets — aba "Subscritores"
  // Colunas: Mail | Língua | Conteúdo pretendido | Data/Hora
  await appendToSheet('Subscritores', [email, language.toUpperCase(), 'Todas as publicações', timestamp])

  // Telegram
  await sendTelegram(telegramBlogSubscribe({ email, language, timestamp }))

  return Response.json({ ok: true })
}
