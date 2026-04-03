'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function HowItWorks() {
  const t = useTranslations('howItWorks')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const steps = t.raw('steps') as Array<{ emoji: string; title: string; description: string }>

  return (
    <section id="como-funciona" className="relative py-20 bg-brand-dark overflow-hidden" data-section="how-it-works" aria-labelledby="how-title">
      {/* Dot clusters */}
      <svg className="absolute top-6 right-6 opacity-[0.18] pointer-events-none" width="88" height="88" viewBox="0 0 88 88" fill="none" aria-hidden="true">
        {[4,26,48,70].flatMap(x => [4,26,48,70].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#ffc700"/>
        )))}
      </svg>
      <svg className="absolute bottom-6 left-6 opacity-[0.18] pointer-events-none" width="66" height="66" viewBox="0 0 66 66" fill="none" aria-hidden="true">
        {[4,26,48].flatMap(x => [4,26,48].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#ffc700"/>
        )))}
      </svg>
      {/* Faixa amarela diagonal no topo */}
      <div className="absolute top-0 left-0 right-0 z-10" aria-hidden="true">
        <div
          className="bg-brand-yellow pl-24 pr-24 py-3 flex items-center gap-3"
          style={{ clipPath: 'polygon(80px 0, 100% 0, calc(100% - 80px) 100%, 0 100%)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-dark/40 shrink-0" />
          <span className="text-brand-dark font-bold text-sm tracking-widest uppercase">
            {t('yellowStripe')}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14 mt-6 sm:mt-0"
        >
          <h2 id="how-title" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2">
            {t('title')}
          </h2>
          <div className="h-1 w-16 bg-brand-yellow rounded-full mx-auto mt-2 mb-3" aria-hidden="true" />
          <p className="text-white/60 text-lg">{t('subtitle')}</p>
        </motion.div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:flex items-start gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
                  className="absolute top-8 left-1/2 w-full h-0.5 bg-brand-yellow/30 origin-left"
                  style={{ transformOrigin: 'left center' }}
                  aria-hidden="true"
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center px-4"
              >
                {/* Step number bubble */}
                <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center text-2xl mb-4 shadow-lg shadow-brand-yellow/25">
                  {step.emoji}
                </div>
                <span className="text-brand-yellow/60 text-xs font-bold tracking-widest uppercase mb-1">
                  {t('step')} {i + 1}
                </span>
                <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center text-xl shrink-0">
                  {step.emoji}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-brand-yellow/20 my-2" aria-hidden="true" />
                )}
              </div>
              <div className="pb-8">
                <span className="text-brand-yellow/60 text-xs font-bold tracking-widest uppercase">
                  {t('step')} {i + 1}
                </span>
                <h3 className="text-white font-bold text-base mt-1 mb-1">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
