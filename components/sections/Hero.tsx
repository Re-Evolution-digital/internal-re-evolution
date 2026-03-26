'use client'


import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'
import { GalaxyBackground } from '@/components/ui/GalaxyBackground'

function getLocale(path: string) { return path.split('/')[1] ?? 'pt' }

export default function Hero() {
  const t = useTranslations('hero')
  const pathname = usePathname()
  const locale = getLocale(pathname)

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark"
      data-section="hero"
      aria-label="Secção principal"
    >
      {/* Foto — full width, efeito quilha (keel) — azul escuro à esquerda, foto visível à direita */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/images/hero/hero-background.png"
          alt=""
          fill
          className="object-cover object-[50%_50%]"
          priority
        />
        {/* Gradient quilha: zona escura larga na base, estreita no topo (slide 1) */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(82deg, rgba(1,27,84,0.97) 32%, rgba(1,27,84,0.88) 45%, rgba(1,27,84,0.45) 54%, rgba(0,0,0,0.18) 60%, transparent 68%)',
          }}
        />
      </div>

      {/* Grid subtil — apenas lado esquerdo */}
      <div
        className="absolute inset-y-0 left-0 w-[55%] opacity-[0.05] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <GalaxyBackground />

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28 md:pt-32">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

          {/* Esquerda: texto */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
            >
              {t('badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6"
            >
              {t('title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-white/75 leading-relaxed mb-8 max-w-xl"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <a
                href={`/${locale}/#diagnostico`}
                onClick={() => trackEvent(GA_EVENTS.CTA_CLICK, { cta_name: 'hero_primary', section: 'hero', language: locale })}
                className="inline-flex items-center justify-center bg-brand-yellow text-brand-dark font-bold text-base px-8 py-4 rounded-2xl hover:brightness-105 active:scale-95 transition-all shadow-lg shadow-brand-yellow/25"
              >
                {t('ctaPrimary')}
              </a>
              <a
                href={`/${locale}/#como-funciona`}
                onClick={() => trackEvent(GA_EVENTS.CTA_CLICK, { cta_name: 'hero_secondary', section: 'hero', language: locale })}
                className="inline-flex items-center justify-center border-2 border-white/40 text-white font-semibold text-base px-8 py-4 rounded-2xl hover:border-white/80 hover:bg-white/10 active:scale-95 transition-all"
              >
                {t('ctaSecondary')}
              </a>
            </motion.div>
          </div>

          {/* Direita: mockup telemóvel — desktop apenas */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
            className="hidden lg:flex lg:justify-center"
            aria-hidden="true"
          >
            <div className="relative w-52 xl:w-60 pt-10 pb-10">
              {/* Badge acima */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl px-3 py-1.5 text-xs font-semibold text-brand-dark whitespace-nowrap border border-gray-100 z-10"
              >
                {t('phone.topBadge')}
              </motion.div>

              {/* Phone frame */}
              <div className="relative bg-gradient-to-b from-brand-dark to-[#010e30] rounded-[2rem] p-2.5 shadow-2xl border border-white/15">
                <div className="bg-white rounded-[1.6rem] overflow-hidden aspect-[9/19]">
                  <div className="bg-gray-50 px-4 py-1.5 flex justify-between items-center border-b border-gray-100">
                    <span className="text-gray-400 text-xs font-medium">9:41</span>
                    <div className="flex gap-1 items-center">
                      <div className="w-3 h-1.5 bg-gray-400 rounded-sm" />
                      <div className="w-1 h-1.5 bg-gray-300 rounded-sm" />
                    </div>
                  </div>
                  <div className="p-3 space-y-2.5 bg-gray-50">
                    <div className="bg-brand-yellow/20 border border-brand-yellow/40 rounded-xl p-2.5">
                      <p className="text-brand-dark text-xs font-semibold mb-0.5">{t('phone.notification')}</p>
                      <p className="text-gray-600 text-xs">{t('phone.customer')}</p>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100">
                      <p className="text-gray-400 text-xs mb-1">{t('phone.bookingsLabel')}</p>
                      <div className="flex justify-between items-end">
                        <span className="text-xl font-bold text-brand-dark">12</span>
                        <span className="text-green-500 text-xs font-semibold">↑ +3</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="bg-white rounded-xl p-2 text-center border border-gray-100 shadow-sm">
                        <p className="text-gray-400 text-xs">WhatsApp</p>
                        <p className="text-green-500 font-bold text-xs mt-0.5">✓ Auto</p>
                      </div>
                      <div className="bg-white rounded-xl p-2 text-center border border-gray-100 shadow-sm">
                        <p className="text-gray-400 text-xs">Sheets</p>
                        <p className="text-brand-dark font-bold text-xs mt-0.5">✓ Sync</p>
                      </div>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                        className="h-1.5 bg-gray-200 rounded-full"
                        style={{ width: `${80 - i * 10}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge abaixo */}
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-brand-yellow rounded-xl shadow-xl px-3 py-1.5 text-xs font-semibold text-brand-dark whitespace-nowrap z-10"
              >
                {t('phone.bottomBadge')}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Faixa amarela diagonal — assinatura da marca (slide 1 & 16) */}
      <div className="absolute bottom-0 left-0 right-0 z-20" aria-hidden="true">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-brand-yellow pl-24 pr-24 py-3.5 flex items-center gap-3"
          style={{ clipPath: 'polygon(80px 0, 100% 0, calc(100% - 80px) 100%, 0 100%)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-dark/40 shrink-0" />
          <span className="text-brand-dark font-bold text-sm tracking-widest uppercase">
            {t('yellowStripe')}
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-20 right-8 z-10"
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-white/25 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
