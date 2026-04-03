/**
 * Gera um ficheiro .ics (iCalendar) para adicionar a reunião ao calendário.
 * Suporta Apple Calendar, Outlook, Thunderbird e qualquer app compatível com iCal.
 *
 * Parâmetros (query string):
 *   title  — título do evento
 *   start  — início em ISO UTC (ex: 2026-04-04T08:00:00.000Z)
 *   end    — fim em ISO UTC
 *   desc   — descrição (opcional)
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const title = url.searchParams.get('title') ?? 'Reunião Re-Evolution'
  const start = url.searchParams.get('start') ?? ''
  const end = url.searchParams.get('end') ?? ''
  const desc = url.searchParams.get('desc') ?? ''

  if (!start || !end) {
    return new Response('Parâmetros em falta.', { status: 400 })
  }

  /** Converte ISO UTC para "YYYYMMDDTHHmmssZ" */
  function icsDate(iso: string): string {
    return iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  }

  /** Escapa caracteres especiais para iCal (RFC 5545) */
  function icsEscape(str: string): string {
    return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
  }

  const uid = `reevo-${Date.now()}-${Math.random().toString(36).slice(2)}@re-evolution.pt`
  const now = icsDate(new Date().toISOString())

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Re-Evolution//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsEscape(title)}`,
    `DESCRIPTION:${icsEscape(desc)}`,
    'ORGANIZER;CN=Re-Evolution:mailto:geral@re-evolution.pt',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="reuniao-re-evolution.ics"',
      'Cache-Control': 'no-store',
    },
  })
}
