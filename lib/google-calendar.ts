/**
 * Google Calendar API v3 — verifica disponibilidade e cria eventos.
 * Usa o mesmo Service Account já configurado para Google Sheets.
 * O calendário deve estar partilhado com o email da service account
 * com permissão "Fazer alterações a eventos".
 *
 * Horário de funcionamento:
 *   Segunda a Quinta: 09:00–17:00
 *   Sexta:            09:00–13:00
 *   Sábado, Domingo, Feriados Nacionais: encerrado
 *
 * Duração dos slots: 30 minutos
 */

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const CALENDAR_TZ = 'Europe/Lisbon'
const SLOT_DURATION_MIN = 30

// ── JWT helpers (mesma lógica que google-sheets.ts, scope diferente) ──────────

function base64url(data: ArrayBuffer | string): string {
  const bytes =
    typeof data === 'string'
      ? new TextEncoder().encode(data)
      : new Uint8Array(data)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function pemToDer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '')
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

async function getCalendarToken(): Promise<string | null> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_PRIVATE_KEY
  if (!email || !rawKey) return null

  const privateKeyPem = rawKey.replace(/\\n/g, '\n')
  const now = Math.floor(Date.now() / 1000)

  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(
    JSON.stringify({
      iss: email,
      scope: CALENDAR_SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    })
  )
  const signingInput = `${header}.${payload}`

  try {
    const key = await crypto.subtle.importKey(
      'pkcs8',
      pemToDer(privateKeyPem),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      key,
      new TextEncoder().encode(signingInput)
    )
    const jwt = `${signingInput}.${base64url(signature)}`

    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => res.status.toString())
      console.error('[Calendar] getToken failed:', errText)
      return null
    }
    const data = (await res.json()) as { access_token?: string }
    return data.access_token ?? null
  } catch (err) {
    console.error('[Calendar] getToken exception:', err)
    return null
  }
}

// ── Feriados nacionais portugueses ────────────────────────────────────────────

/** Feriados fixos no formato MM-DD */
const PT_HOLIDAYS_FIXED = new Set([
  '01-01', // Ano Novo
  '04-25', // Dia da Liberdade
  '05-01', // Dia do Trabalhador
  '06-10', // Dia de Portugal
  '08-15', // Assunção de Nossa Senhora
  '10-05', // Implantação da República
  '11-01', // Todos os Santos
  '12-01', // Restauração da Independência
  '12-08', // Imaculada Conceição
  '12-25', // Natal
])

/** Feriados variáveis (Carnaval, Sexta-feira Santa, Corpus Christi) */
const PT_HOLIDAYS_VARIABLE = new Set([
  // 2026 — Páscoa: 5 abr
  '2026-02-17', // Carnaval (47 dias antes)
  '2026-04-03', // Sexta-feira Santa
  '2026-06-04', // Corpus Christi (60 dias depois)
  // 2027 — Páscoa: 28 mar
  '2027-02-09',
  '2027-03-26',
  '2027-05-27',
  // 2028 — Páscoa: 16 abr
  '2028-02-29',
  '2028-04-14',
  '2028-06-15',
])

function isHoliday(dateStr: string): boolean {
  const mmdd = dateStr.slice(5) // "MM-DD"
  return PT_HOLIDAYS_FIXED.has(mmdd) || PT_HOLIDAYS_VARIABLE.has(dateStr)
}

// ── Conversão de timezone ─────────────────────────────────────────────────────

/**
 * Converte uma hora local em Lisboa (dateStr="YYYY-MM-DD", hour, minute)
 * para um objecto Date em UTC, respeitando o horário de verão.
 */
function lisbonTimeToUtc(dateStr: string, hour: number, minute: number): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  // Aproximação inicial: UTC = hora pretendida
  const approx = new Date(Date.UTC(y, m - 1, d, hour, minute))

  // Descobre o que o formatter diz que é a hora em Lisboa nesse instante UTC
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: CALENDAR_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const parts = fmt.formatToParts(approx)
  const lH = parseInt(parts.find((p) => p.type === 'hour')!.value) % 24
  const lM = parseInt(parts.find((p) => p.type === 'minute')!.value)

  // diff = minutos que Lisboa está à frente do UTC neste instante
  const diff = (lH * 60 + lM) - (hour * 60 + minute)
  return new Date(approx.getTime() - diff * 60_000)
}

/** Devolve a data actual em Lisboa no formato "YYYY-MM-DD" */
function todayLisbon(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: CALENDAR_TZ }).format(new Date())
}

/** Avança N dias a partir de "YYYY-MM-DD" */
function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** 0=Dom, 1=Seg, ..., 6=Sáb — baseado na data "YYYY-MM-DD" */
function dayOfWeek(dateStr: string): number {
  return new Date(dateStr + 'T12:00:00Z').getUTCDay()
}

/** Devolve true se o dia é dia útil (não feriado, não fim-de-semana) */
function isWorkingDay(dateStr: string): boolean {
  const dow = dayOfWeek(dateStr)
  if (dow === 0 || dow === 6) return false // domingo ou sábado
  return !isHoliday(dateStr)
}

// ── Geração de slots ──────────────────────────────────────────────────────────

export interface TimeSlot {
  time: string       // "09:00" — hora em Lisboa
  isoStart: string   // ISO 8601 UTC
  isoEnd: string     // ISO 8601 UTC
  available: boolean // false = slot ocupado no calendário
}

export interface DaySlots {
  date: string    // "YYYY-MM-DD"
  slots: TimeSlot[]
}

/** Gera todos os slots teóricos para um dia útil (sem verificar o calendário) */
function generateAllSlots(dateStr: string): TimeSlot[] {
  const dow = dayOfWeek(dateStr)
  // Sexta (5): 9h–13h, restantes dias úteis: 9h–17h
  const endHour = dow === 5 ? 13 : 17
  const slots: TimeSlot[] = []

  for (let h = 9; h < endHour; h++) {
    for (const m of [0, 30]) {
      const slotStart = lisbonTimeToUtc(dateStr, h, m)
      const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MIN * 60_000)
      const label = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      slots.push({
        time: label,
        isoStart: slotStart.toISOString(),
        isoEnd: slotEnd.toISOString(),
        available: true, // redefinido em getAvailableSlots após consulta free/busy
      })
    }
  }
  return slots
}

// ── Free/Busy API ─────────────────────────────────────────────────────────────

interface BusyInterval {
  start: string
  end: string
}

async function getFreeBusyIntervals(
  token: string,
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<BusyInterval[]> {
  const url = 'https://www.googleapis.com/calendar/v3/freeBusy'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: CALENDAR_TZ,
      items: [{ id: calendarId }],
    }),
  })
  if (!res.ok) return []
  const data = (await res.json()) as {
    calendars?: Record<string, { busy?: BusyInterval[] }>
  }
  return data.calendars?.[calendarId]?.busy ?? []
}

function slotOverlapsBusy(slot: TimeSlot, busy: BusyInterval[]): boolean {
  const s = new Date(slot.isoStart).getTime()
  const e = new Date(slot.isoEnd).getTime()
  return busy.some((b) => {
    const bs = new Date(b.start).getTime()
    const be = new Date(b.end).getTime()
    return s < be && e > bs
  })
}

// ── API pública ───────────────────────────────────────────────────────────────

/**
 * Devolve os slots disponíveis para os próximos `days` dias úteis.
 * Filtra os slots que já passaram e os que estão ocupados no calendário.
 */
export async function getAvailableSlots(days = 14): Promise<DaySlots[]> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) return []

  const token = await getCalendarToken()
  if (!token) return []

  // Recolhe os próximos `days` dias úteis
  const workingDays: string[] = []
  let cursor = addDays(todayLisbon(), 1) // começa amanhã
  while (workingDays.length < days) {
    if (isWorkingDay(cursor)) workingDays.push(cursor)
    cursor = addDays(cursor, 1)
  }

  if (workingDays.length === 0) return []

  // Intervalo para o free/busy: do início do primeiro dia ao fim do último
  const timeMin = lisbonTimeToUtc(workingDays[0], 8, 0).toISOString()
  const timeMax = lisbonTimeToUtc(workingDays[workingDays.length - 1], 18, 0).toISOString()

  const busy = await getFreeBusyIntervals(token, calendarId, timeMin, timeMax).catch(() => [] as BusyInterval[])
  const now = Date.now()

  const result: DaySlots[] = []
  for (const dateStr of workingDays) {
    const allSlots = generateAllSlots(dateStr)
    const slotsForDay = allSlots
      .filter((s) => new Date(s.isoStart).getTime() > now) // remove slots já passados
      .map((s) => ({ ...s, available: !slotOverlapsBusy(s, busy) })) // marca ocupados
    if (slotsForDay.length > 0) {
      result.push({ date: dateStr, slots: slotsForDay })
    }
  }

  return result
}

// ── Criação de evento ─────────────────────────────────────────────────────────

export interface BookingDetails {
  name: string
  email: string
  phone: string
  business_type: string
  slot_start: string // ISO UTC
  slot_end: string   // ISO UTC
  language?: string
}

/**
 * Cria um evento no Google Calendar.
 * Devolve o ID do evento criado, ou null se falhar.
 */
export async function createCalendarEvent(booking: BookingDetails): Promise<string | null> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) return null

  const token = await getCalendarToken()
  if (!token) return null

  const event = {
    summary: `Diagnóstico Re-Evolution — ${booking.name}`,
    description: [
      `📞 Telefone: ${booking.phone}`,
      `📧 Email: ${booking.email}`,
      `🏢 Negócio: ${booking.business_type}`,
      '',
      'Agendamento via site re-evolution.pt',
    ].join('\n'),
    start: { dateTime: booking.slot_start, timeZone: CALENDAR_TZ },
    end: { dateTime: booking.slot_end, timeZone: CALENDAR_TZ },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 },
        { method: 'popup', minutes: 15 },
      ],
    },
    conferenceData: undefined,
  }

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendNotifications=true`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => res.status.toString())
      console.error(`[Calendar] createEvent failed ${res.status}:`, errText)
      return null
    }
    const data = (await res.json()) as { id?: string }
    return data.id ?? null
  } catch (err) {
    console.error('[Calendar] createEvent exception:', err)
    return null
  }
}

/** Formata um ISO UTC em "Sex, 4 Abr às 09:00" para PT */
export function formatSlotLabel(isoStart: string): string {
  const d = new Date(isoStart)
  const weekday = d.toLocaleDateString('pt-PT', { weekday: 'short', timeZone: CALENDAR_TZ })
  const day = d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', timeZone: CALENDAR_TZ })
  const time = d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', timeZone: CALENDAR_TZ })
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} às ${time}`
}
