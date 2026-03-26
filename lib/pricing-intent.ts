'use client'

import { trackEvent, GA_EVENTS } from './analytics'

export function initPricingIntent() {
  const section = document.querySelector('#precos')
  if (!section) return

  let visibleSince: number | null = null
  let alerted = false

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleSince = Date.now()
        } else {
          visibleSince = null
        }
      }
    },
    { threshold: 0.5 }
  )

  observer.observe(section)

  const interval = setInterval(() => {
    if (alerted || visibleSince === null) return
    const duration = (Date.now() - visibleSince) / 1000
    if (duration >= 30) {
      alerted = true
      trackEvent(GA_EVENTS.PRICING_INTENT, { section: 'pricing', duration: 30 })

      fetch('/api/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: new Date().toISOString() }),
      }).catch(() => {
        // silent fail — non-critical
      })

      clearInterval(interval)
    }
  }, 1000)

  return () => {
    observer.disconnect()
    clearInterval(interval)
  }
}
