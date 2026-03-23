// Edge-compatible in-memory rate limiter
// For production, use Cloudflare KV for distributed rate limiting

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const key = ip
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true // allowed
  }

  if (entry.count >= limit) {
    return false // blocked
  }

  entry.count++
  return true // allowed
}

// Cleanup old entries periodically (Edge-safe, best-effort)
export function cleanupRateLimitStore() {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}
