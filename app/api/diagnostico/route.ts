export const runtime = 'edge'

import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  name: z.string().min(2).max(100),
  contact: z.string().min(5).max(200),
  business_type: z.string().min(1).max(100),
  main_problem: z.string().max(300).optional(),
  gdpr_consent: z.literal(true),
  honeypot: z.string().max(0).optional(), // must be empty
})

function getIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown'
}

function formatPTDate(date: Date): string {
  return date.toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })
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

  const { name, contact, business_type, main_problem } = parsed.data

  // Honeypot check
  const data = body as Record<string, unknown>
  if (data.honeypot && String(data.honeypot).length > 0) {
    return Response.json({ ok: true }) // silent ignore bots
  }

  const timestamp = formatPTDate(new Date())
  const isoTimestamp = new Date().toISOString()

  const env = process.env

  // Action 1 — Telegram notification
  const telegramToken = env.TELEGRAM_BOT_TOKEN
  const telegramChatId = env.TELEGRAM_CHAT_ID
  if (telegramToken && telegramToken !== 'placeholder' && telegramChatId) {
    const message = [
      '🔔 *Novo Diagnóstico Re-Evolution*',
      '',
      `👤 Nome: ${name}`,
      `📞 Contacto: ${contact}`,
      `🏢 Negócio: ${business_type}`,
      `💬 Problema: ${main_problem ?? 'Não indicado'}`,
      `📅 Data: ${timestamp}`,
      `🌐 Fonte: formulário-site`,
    ].join('\n')

    await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    }).catch(() => { /* non-critical */ })
  }

  // Action 2 & 3 — Make webhook (email confirmation + CRM)
  const makeWebhook = env.MAKE_DIAGNOSTICO_WEBHOOK
  if (makeWebhook && makeWebhook !== 'placeholder') {
    await fetch(makeWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        contact,
        business_type,
        main_problem: main_problem ?? '',
        gdpr_consent: true,
        timestamp: isoTimestamp,
        source: 'diagnostico-form',
      }),
    }).catch(() => { /* non-critical */ })
  }

  return Response.json({ ok: true })
}
