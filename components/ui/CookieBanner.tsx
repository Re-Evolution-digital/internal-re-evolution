'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type ConsentState = {
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const CONSENT_KEY = 'reevo_cookie_consent'

function getLocaleFromPath(path: string): string {
  const segments = path.split('/')
  return segments[1] ?? 'pt'
}

export default function CookieBanner() {
  const t = useTranslations('cookies')
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)

  const [visible, setVisible] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [prefs, setPrefs] = useState<ConsentState>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Respect DNT
    if (navigator.doNotTrack === '1') {
      saveConsent({ necessary: true, functional: false, analytics: false, marketing: false })
      return
    }
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) {
      setVisible(true)
    }

    // Listen for external trigger (e.g. footer "Definições de Cookies" link)
    const handleOpenSettings = () => setShowModal(true)
    window.addEventListener('reevo:open-cookie-settings', handleOpenSettings)
    return () => window.removeEventListener('reevo:open-cookie-settings', handleOpenSettings)
  }, [])

  function saveConsent(consent: ConsentState) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
    setVisible(false)
    setShowModal(false)
    // Load GA4 if analytics consent given
    if (consent.analytics && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('reevo:analytics-consent'))
    }
  }

  function acceptAll() {
    const consent: ConsentState = { necessary: true, functional: true, analytics: true, marketing: true }
    setPrefs(consent)
    saveConsent(consent)
  }

  function acceptNecessary() {
    saveConsent({ necessary: true, functional: false, analytics: false, marketing: false })
  }

  function savePreferences() {
    saveConsent(prefs)
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl p-4 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={t('banner.title')}
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-brand-dark mb-1">{t('banner.title')}</p>
                <p className="text-sm text-gray-600">
                  {t('banner.description')}{' '}
                  <Link href={`/${locale}/cookie-policy`} className="underline text-brand-dark hover:text-brand-yellow">
                    {t('banner.learnMore')}
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:border-brand-dark transition-colors"
                >
                  {t('banner.manage')}
                </button>
                <button
                  onClick={acceptNecessary}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:border-brand-dark transition-colors"
                >
                  {t('banner.acceptNecessary')}
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 text-sm bg-brand-yellow text-brand-dark font-bold rounded-xl hover:brightness-105 transition-all"
                >
                  {t('banner.acceptAll')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-brand-dark mb-4">{t('modal.title')}</h2>
              <div className="space-y-4">
                {(['necessary', 'functional', 'analytics', 'marketing'] as const).map((cat) => (
                  <div key={cat} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-semibold text-brand-dark">{t(`modal.categories.${cat}.name`)}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{t(`modal.categories.${cat}.description`)}</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={cat === 'necessary' ? true : prefs[cat]}
                      disabled={cat === 'necessary'}
                      onClick={() => {
                        if (cat === 'necessary') return
                        setPrefs((p) => ({ ...p, [cat]: !p[cat] }))
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow disabled:cursor-not-allowed ${
                        (cat === 'necessary' || prefs[cat]) ? 'bg-brand-yellow' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                          (cat === 'necessary' || prefs[cat]) ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-xl text-sm hover:border-brand-dark transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={savePreferences}
                  className="flex-1 py-2 bg-brand-yellow text-brand-dark font-bold rounded-xl text-sm hover:brightness-105 transition-all"
                >
                  {t('modal.save')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
