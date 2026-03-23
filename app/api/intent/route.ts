import { rateLimit } from '@/lib/rate-limit'

function getIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown'
}

function formatPTDate(date: Date): string {
  return date.toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })
}

export async function POST(req: Request) {
  const intentEnabled = process.env.INTENT_ALERTS_ENABLED === 'true'
  if (!intentEnabled) {
    return Response.json({ ok: true })
  }

  const ip = getIP(req)
  if (!rateLimit(ip, 10, 60_000)) {
    return Response.json({ error: 'Too many requests.' }, { status: 429 })
  }

  const timestamp = formatPTDate(new Date())
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID

  if (telegramToken && telegramToken !== 'placeholder' && telegramChatId) {
    const message = `👀 Alguém passou 30s+ na secção de preços — ${timestamp}`
    await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
      }),
    }).catch(() => { /* non-critical */ })
  }

  return Response.json({ ok: true })
}
