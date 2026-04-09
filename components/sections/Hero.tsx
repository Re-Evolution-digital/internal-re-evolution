'use client'


import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'
import { anchorClick } from '@/lib/scroll'
import { DragonScaleOverlay } from '@/components/ui/DragonScaleOverlay'
import { HeroPhoneDeck } from '@/components/ui/HeroPhoneDeck'

function getLocale(path: string) { return path.split('/')[1] ?? 'pt' }

export default function Hero() {
  const t = useTranslations('hero')
  const pathname = usePathname()
  const locale = getLocale(pathname)

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-white"
      data-section="hero"
      aria-label="Secção principal"
    >
      {/* Efeito iridescente — atrás de tudo */}
      <DragonScaleOverlay className="z-[0]" />

      {/* Foto — full width, efeito quilha (keel) — azul escuro à esquerda, foto visível à direita */}
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden="true">
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
            background: 'linear-gradient(82deg, rgba(255,255,255,0.10) 28%, rgba(255,255,255,0.07) 42%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.02) 72%, rgba(255,255,255,0) 100%)',
          }}
        />
      </div>

      {/* Grid subtil — apenas lado esquerdo */}
      <div
        className="absolute inset-y-0 left-0 w-[55%] opacity-[0.05] pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28 md:pt-32">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

          {/* Esquerda: texto */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-brand-dark/65 text-brand-yellow text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-md backdrop-blur-sm"
            >
              {t('badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-brand-dark leading-tight mb-6 [text-shadow:0_0_18px_rgba(255,255,255,1),0_0_36px_rgba(255,255,255,0.75),0_2px_4px_rgba(255,255,255,0.9)]"
            >
              {t('title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-brand-dark/75 leading-relaxed mb-8 max-w-xl [text-shadow:0_0_14px_rgba(255,255,255,1),0_0_28px_rgba(255,255,255,0.7)]"
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
                onClick={(e) => { anchorClick('diagnostico', e); trackEvent(GA_EVENTS.CTA_CLICK, { cta_name: 'hero_primary', section: 'hero', language: locale }) }}
                className="inline-flex items-center justify-center bg-brand-yellow text-brand-dark font-bold text-base px-8 py-4 rounded-2xl hover:brightness-105 active:scale-95 transition-all shadow-lg shadow-brand-yellow/25"
              >
                {t('ctaPrimary')}
              </a>
              <a
                href={`/${locale}/#como-funciona`}
                onClick={(e) => { anchorClick('como-funciona', e); trackEvent(GA_EVENTS.CTA_CLICK, { cta_name: 'hero_secondary', section: 'hero', language: locale }) }}
                className="inline-flex items-center justify-center border-2 border-brand-dark/40 text-brand-dark font-semibold text-base px-8 py-4 rounded-2xl hover:border-brand-dark/70 hover:bg-brand-dark/8 active:scale-95 transition-all"
              >
                {t('ctaSecondary')}
              </a>
            </motion.div>
          </div>

          {/* Direita: baralho de 3 telemóveis — desktop apenas */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
            className="hidden lg:flex lg:justify-center lg:items-center"
            aria-hidden="true"
          >
            <HeroPhoneDeck />
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
        <div className="w-6 h-10 border-2 border-brand-dark/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-brand-dark/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
