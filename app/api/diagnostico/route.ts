import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { sendEmail, buildClientEmailHtml, buildInternalDiagnosticoEmail, formatPTDate } from '@/lib/email'
import { sendTelegram, telegramDiagnosticoLead } from '@/lib/telegram'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(5).max(50),
  business_type: z.string().min(1).max(100),
  main_problem: z.string().max(300).optional(),
  language: z.string().max(10).optional(),
  gdpr_consent: z.literal(true),
  honeypot: z.string().max(0).optional(),
})

function getIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown'
}

export async function POST(req: Request) {
  const ip = getIP(req)
  if (!rateLimit(ip, 5, 60_000)) {
    return Response.json({ error: 'Demasiados pedidos. Tente novamente em breve.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Pedido inválido.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Dados inválidos.', details: parsed.error.flatten() }, { status: 422 })
  }

  // Honeypot — ignorar bots silenciosamente
  const raw = body as Record<string, unknown>
  if (raw.honeypot && String(raw.honeypot).length > 0) {
    return Response.json({ ok: true })
  }

  const { name, email, phone, business_type, main_problem, language = 'pt' } = parsed.data
  const timestamp = formatPTDate(new Date())
  const reevoEmail = process.env.REEVO_EMAIL ?? 'geral@re-evolution.pt'
  const firstName = name.split(' ')[0] ?? name

  // Telegram — notificação imediata
  await sendTelegram(telegramDiagnosticoLead({
    name,
    email,
    phone,
    language,
    business_type,
    main_problem: main_problem ?? 'Não indicado',
    timestamp,
  }))

  // Email interno — equipa Re-Evolution (sempre enviado)
  await sendEmail({
    to: reevoEmail,
    subject: `📋 Novo Diagnóstico — ${name} | ${business_type}`,
    html: buildInternalDiagnosticoEmail({ name, email, phone, business_type, main_problem: main_problem ?? '—', timestamp }),
  })

  // Email para o cliente — sempre enviado (email é campo obrigatório)
  const subjects: Record<string, string> = {
    pt: `${firstName}, o seu diagnóstico gratuito está a caminho ✨`,
    en: `${firstName}, your free diagnosis is on its way ✨`,
    es: `${firstName}, tu diagnóstico gratuito está en camino ✨`,
  }
  const subject = subjects[language.slice(0, 2)] ?? subjects.en
  await sendEmail({
    to: email,
    bcc: reevoEmail,
    subject,
    html: buildClientEmailHtml({ name: firstName, source: 'diagnostico', language }),
  })

  return Response.json({ ok: true })
}
