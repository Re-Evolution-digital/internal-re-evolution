/**
 * Unsubscribe — HMAC-SHA256 helpers para links seguros de cancelamento.
 * Usa Web Crypto API (compatível com Cloudflare Workers + nodejs_compat).
 *
 * O segredo UNSUBSCRIBE_SECRET deve estar em .env.local (dev) e GitHub Secrets (prod).
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://re-evolution.pt'

async function hmacSha256(message: string): Promise<string> {
  const secret = process.env.UNSUBSCRIBE_SECRET ?? 'dev-secret-change-in-prod'
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message.toLowerCase()))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Gera a assinatura HMAC para um email. */
export async function generateUnsubscribeSig(email: string): Promise<string> {
  return hmacSha256(email)
}

/** Verifica se a assinatura corresponde ao email (timing-safe via comparação hex). */
export async function verifyUnsubscribeSig(email: string, sig: string): Promise<boolean> {
  if (!sig || sig.length !== 64) return false
  const expected = await hmacSha256(email)
  // Comparação character-a-character para evitar timing attacks
  if (expected.length !== sig.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  }
  return diff === 0
}

/** Gera o URL completo de cancelamento para incluir nos emails do blog. */
export async function generateUnsubscribeUrl(email: string, language = 'pt'): Promise<string> {
  const sig = await generateUnsubscribeSig(email)
  const params = new URLSearchParams({ email, sig, lang: language })
  return `${BASE_URL}/api/blog/unsubscribe?${params.toString()}`
}
