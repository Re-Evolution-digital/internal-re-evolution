/**
 * Google Sheets API v4 — helper para appending rows.
 * Usa Web Crypto API (compatível com Cloudflare Workers + nodejs_compat).
 * Autentica via Service Account JWT → OAuth2 access token.
 *
 * Sheets esperadas no mesmo Spreadsheet:
 *   - "Subscritores"   → newsletter do blog
 *   - "PDF Requests"   → pedidos de artigo em PDF
 */

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'

// ── JWT helpers ───────────────────────────────────────────────────────────────

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

async function signJwt(email: string, privateKeyPem: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)

  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(
    JSON.stringify({
      iss: email,
      scope: SHEETS_SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    })
  )

  const signingInput = `${header}.${payload}`

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

  return `${signingInput}.${base64url(signature)}`
}

async function getAccessToken(): Promise<string | null> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_PRIVATE_KEY

  if (!email || !rawKey) return null

  // GitHub Secrets escapam \n como \\n — normalizar
  const privateKeyPem = rawKey.replace(/\\n/g, '\n')

  try {
    const jwt = await signJwt(email, privateKeyPem)

    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })

    if (!res.ok) return null
    const data = await res.json() as { access_token?: string }
    return data.access_token ?? null
  } catch {
    return null
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export type SheetName = 'Subscritores' | 'PDF Requests'

/**
 * Appends a row to the specified sheet tab.
 * Silently fails if credentials are missing or request fails.
 */
export async function appendToSheet(
  sheet: SheetName,
  row: string[]
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID
  if (!spreadsheetId) return

  const token = await getAccessToken()
  if (!token) return

  const range = encodeURIComponent(`${sheet}!A1`)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`

  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [row] }),
  }).catch(() => { /* non-critical */ })
}
