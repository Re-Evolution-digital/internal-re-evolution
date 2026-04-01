'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface BlogSubscribeProps {
  locale: string
  /** 'banner' = faixa horizontal (homepage / rodapé do blog listing) */
  variant?: 'banner'
}

export default function BlogSubscribe({ locale, variant = 'banner' }: BlogSubscribeProps) {
  const t = useTranslations('blog.subscribe')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/blog/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: locale }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="w-full bg-brand-dark py-10 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 mb-4">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M2 4h16v12H2V4zm0 0l8 7 8-7" stroke="#ffc700" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h3 className="text-white font-bold text-lg sm:text-xl mb-1">
          {t('title')}
        </h3>
        <p className="text-[#8da4c8] text-sm mb-6 max-w-md mx-auto">
          {t('subtitle')}
        </p>

        {status === 'success' ? (
          <p className="text-brand-yellow font-semibold text-sm py-3">
            ✓ {t('success')}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            {/* Honeypot */}
            <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('placeholder')}
              required
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2.5 bg-brand-yellow text-brand-dark font-bold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 shrink-0"
            >
              {status === 'loading' ? '...' : t('button')}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-400 text-xs mt-2">{t('error')}</p>
        )}

        <p className="text-white/30 text-xs mt-4">{t('privacy')}</p>
      </div>
    </div>
  )
}
