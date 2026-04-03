import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { createCalendarEvent, formatSlotLabel } from '@/lib/google-calendar'
import { sendEmail, buildBookingConfirmationEmail, buildInternalBookingEmail, formatPTDate } from '@/lib/email'
import { sendTelegram, telegramBookingLead } from '@/lib/telegram'
import { appendToSheet } from '@/lib/google-sheets'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(5).max(50),
  business_type: z.string().min(1).max(100),
  slot_start: z.string().min(1),   // ISO UTC
  slot_end: z.string().min(1),     // ISO UTC
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

  // Honeypot
  const raw = body as Record<string, unknown>
  if (raw.honeypot && String(raw.honeypot).length > 0) {
    return Response.json({ ok: true })
  }

  const { name, email, phone, business_type, slot_start, slot_end, language = 'pt' } = parsed.data
  const timestamp = formatPTDate(new Date())
  const slotLabel = formatSlotLabel(slot_start)
  const reevoEmail = process.env.REEVO_EMAIL ?? 'geral@re-evolution.pt'
  const firstName = name.split(' ')[0] ?? name

  // Cria evento no Google Calendar (crítico — falha retorna erro ao utilizador)
  const eventId = await createCalendarEvent({ name, email, phone, business_type, slot_start, slot_end, language })
  if (!eventId) {
    return Response.json(
      { error: 'Não foi possível confirmar o agendamento. Tente novamente ou utilize o formulário de contacto.' },
      { status: 503 }
    )
  }

  // Notificações não-críticas em paralelo
  await Promise.allSettled([
    // Telegram
    sendTelegram(telegramBookingLead({ name, email, phone, language, business_type, slot_label: slotLabel, timestamp })),

    // Email interno
    sendEmail({
      to: reevoEmail,
      subject: `📅 Novo Agendamento — ${name} | ${slotLabel}`,
      html: buildInternalBookingEmail({ name, email, phone, business_type, slot_label: slotLabel, slot_start, timestamp }),
    }),

    // Email de confirmação para o cliente
    sendEmail({
      to: email,
      bcc: reevoEmail,
      subject: `${firstName}, a sua reunião está confirmada — ${slotLabel}`,
      html: buildBookingConfirmationEmail({ name, slotLabel, slotStart: slot_start, slotEnd: slot_end, language }),
    }),

    // Google Sheets — aba "Agendamentos"
    appendToSheet('Agendamentos', [
      timestamp,
      name,
      email,
      phone,
      business_type,
      slotLabel,
      slot_start,
      language,
      eventId,
    ]),
  ])

  return Response.json({ ok: true, slot_label: slotLabel })
}
