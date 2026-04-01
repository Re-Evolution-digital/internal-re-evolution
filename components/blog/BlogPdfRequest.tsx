'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface BlogPdfRequestProps {
  locale: string
  articleSlug: string
  articleTitle: string
}

export default function BlogPdfRequest({ locale, articleSlug, articleTitle }: BlogPdfRequestProps) {
  const t = useTranslations('blog.pdfRequest')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/blog/pdf-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: locale, articleSlug, articleTitle }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 mb-8">
      <div className="rounded-2xl border border-brand-yellow/25 bg-brand-dark/5 px-6 py-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/25 flex items-center justify-center mt-0.5">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="4" y="2" width="12" height="16" rx="2" stroke="#ffc700" strokeWidth="1.6"/>
              <path d="M7 7h6M7 10h6M7 13h4" stroke="#ffc700" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-brand-dark text-base mb-0.5">
              {t('title')}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {t('subtitle')}
            </p>

            {status === 'success' ? (
              <p className="text-green-600 font-semibold text-sm">
                ✓ {t('success')}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                {/* Honeypot */}
                <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('placeholder')}
                  required
                  className="flex-1 px-3.5 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-yellow transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-4 py-2 bg-brand-dark text-white font-semibold text-sm rounded-lg hover:bg-brand-dark/80 transition-colors disabled:opacity-60 shrink-0"
                >
                  {status === 'loading' ? '...' : t('button')}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-red-500 text-xs mt-2">{t('error')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
