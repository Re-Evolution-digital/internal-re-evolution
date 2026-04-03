import { getAvailableSlots } from '@/lib/google-calendar'
import { rateLimit } from '@/lib/rate-limit'

function getIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown'
}

export async function GET(req: Request) {
  const ip = getIP(req)
  // Limite generoso: o componente só chama uma vez por sessão
  if (!rateLimit(ip, 20, 60_000)) {
    return Response.json({ error: 'Demasiados pedidos.' }, { status: 429 })
  }

  try {
    const days = await getAvailableSlots(14)
    return Response.json({ days }, { status: 200 })
  } catch {
    return Response.json({ days: [] }, { status: 200 })
  }
}
