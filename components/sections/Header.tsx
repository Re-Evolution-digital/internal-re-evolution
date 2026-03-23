'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'
import { clientData } from '@/data/client-info'

const locales = [
  { code: 'pt', label: 'PT', flag: '/images/flags/pt.svg' },
  { code: 'en', label: 'EN', flag: '/images/flags/gb.svg' },
  { code: 'es', label: 'ES', flag: '/images/flags/es.svg' },
]

function getLocaleFromPath(path: string): string {
  return path.split('/')[1] ?? 'pt'
}

export default function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const locale = getLocaleFromPath(pathname)

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function switchLocale(newLocale: string) {
    const from = locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    trackEvent(GA_EVENTS.LANGUAGE_SWITCH, { from, to: newLocale })
    router.push(`/${newLocale}${pathWithoutLocale}`)
    setLangOpen(false)
  }

  const navLinks = [
    { href: `/${locale}/#servicos`, label: t('services') },
    { href: `/${locale}/#como-funciona`, label: t('howItWorks') },
    { href: `/${locale}/#precos`, label: t('pricing') },
    { href: `/${locale}/#casos`, label: t('cases') },
    { href: `/${locale}/#blog`, label: t('blog') },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-brand-dark/75 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-brand-dark/70 to-transparent backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <Image
              src={clientData.brand.logoSvg}
              alt={clientData.business.name}
              width={140}
              height={40}
              className="h-8 w-auto md:h-10"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-brand-yellow transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side: lang + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                aria-expanded={langOpen}
                className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white px-2 py-1 rounded-lg transition-colors"
              >
                <Image src={locales.find((l) => l.code === locale)?.flag ?? ''} alt={locale.toUpperCase()} width={20} height={14} className="rounded-sm object-cover" />
                <span className="font-medium">{locales.find((l) => l.code === locale)?.label}</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {locales.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => switchLocale(l.code)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm w-full text-left hover:bg-gray-50 transition-colors ${
                          l.code === locale ? 'font-bold text-brand-dark' : 'text-gray-700'
                        }`}
                      >
                        <Image src={l.flag} alt={l.label} width={20} height={14} className="rounded-sm object-cover" />
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <a
              href={`/${locale}/#diagnostico`}
              onClick={() => trackEvent(GA_EVENTS.CTA_CLICK, { cta_name: 'header_cta', section: 'header', language: locale })}
              className="bg-brand-yellow text-brand-dark text-sm font-bold px-5 py-2.5 rounded-xl hover:brightness-105 transition-all"
            >
              {t('cta')}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Cobro band — parallelogram, fades on scroll */}
      <div
        className={`relative h-3 transition-opacity duration-500 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-brand-yellow/90"
          style={{ clipPath: 'polygon(24px 0, 100% 0, calc(100% - 24px) 100%, 0 100%)' }}
        />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-brand-dark border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-white/80 hover:text-brand-yellow text-base font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-2">
                  {locales.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { switchLocale(l.code); setMenuOpen(false) }}
                      className={`flex items-center gap-1.5 text-sm px-2 py-1 rounded ${l.code === locale ? 'text-brand-yellow font-bold' : 'text-white/70'}`}
                    >
                      <Image src={l.flag} alt={l.label} width={20} height={14} className="rounded-sm object-cover" />
                      {l.label}
                    </button>
                  ))}
                </div>
                <a
                  href={`/${locale}/#diagnostico`}
                  onClick={() => setMenuOpen(false)}
                  className="bg-brand-yellow text-brand-dark text-sm font-bold px-4 py-2 rounded-xl"
                >
                  {t('cta')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
