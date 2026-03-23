'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

const flowKeys = ['restaurant', 'lawyer', 'clinic', 'realestate'] as const
type FlowKey = typeof flowKeys[number]

const flowColors: Record<FlowKey, string> = {
  restaurant: '#25d366',
  lawyer: '#4f46e5',
  clinic: '#0ea5e9',
  realestate: '#f59e0b',
}

const flowIcons: Record<FlowKey, string[]> = {
  restaurant: ['📱', '💬', '📊', '📧'],
  lawyer: ['💻', '🤖', '📅', '🔔'],
  clinic: ['📋', '✅', '📊', '📱'],
  realestate: ['🌐', '🤖', '👤', '📞'],
}

function getLocale(path: string) { return path.split('/')[1] ?? 'pt' }

export default function AutomationsDemo() {
  const t = useTranslations('automations')
  const pathname = usePathname()
  const locale = getLocale(pathname)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState<FlowKey>('restaurant')

  const tabs = t.raw('tabs') as string[]
  const flows = t.raw('flows') as Record<FlowKey, Array<{ label: string }>>

  function handleTabClick(key: FlowKey, index: number) {
    setActive(key)
    trackEvent(GA_EVENTS.DEMO_TAB_CLICK, { business_type: key })
  }

  return (
    <section id="automacoes" className="relative py-20 bg-gray-50" data-section="automations" aria-labelledby="auto-title">
      {/* Faixa amarela — corte transversal no INÍCIO (lado esquerdo) */}
      <div className="absolute top-0 left-0 right-0 z-10" aria-hidden="true">
        <div
          className="bg-brand-yellow pl-24 pr-24 py-3 flex items-center justify-end gap-3"
          style={{ clipPath: 'polygon(80px 0, 100% 0, calc(100% - 80px) 100%, 0 100%)' }}
        >
          <span className="text-brand-dark font-bold text-sm tracking-widest uppercase">
            Automação · Trabalha Enquanto Descansas
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-dark/40 shrink-0" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 id="auto-title" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-dark mb-3">
            {t('title')}
          </h2>
          <p className="text-gray-600 text-lg">{t('subtitle')}</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist">
          {flowKeys.map((key, i) => (
            <button
              key={key}
              role="tab"
              aria-selected={active === key}
              aria-controls={`panel-${key}`}
              onClick={() => handleTabClick(key, i)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                active === key
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-dark'
              }`}
            >
              {tabs[i]}
            </button>
          ))}
        </div>

        {/* Flow panel */}
        <div
          id={`panel-${active}`}
          role="tabpanel"
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Flow nodes */}
              <div className="flex flex-col md:flex-row items-center gap-0 md:gap-0">
                {flows[active].map((node, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-center flex-1">
                    {/* Node */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex flex-col items-center gap-2 flex-1 py-4 px-2"
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                        style={{ backgroundColor: `${flowColors[active]}20`, border: `2px solid ${flowColors[active]}40` }}
                      >
                        {flowIcons[active][i]}
                      </div>
                      <p className="text-sm text-center text-gray-700 font-medium max-w-[120px]">
                        {node.label}
                      </p>
                    </motion.div>

                    {/* Arrow */}
                    {i < flows[active].length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.15 + 0.1 }}
                        className="text-gray-300 text-2xl rotate-90 md:rotate-0 my-1 md:my-0"
                        aria-hidden="true"
                      >
                        →
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Animated pulse line */}
              <div className="hidden md:block mt-6 mx-8">
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: flowColors[active] }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <a
            href={`/${locale}/#diagnostico`}
            onClick={() => trackEvent(GA_EVENTS.CTA_CLICK, { cta_name: 'automations_cta', section: 'automations', language: locale })}
            className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark font-bold px-8 py-4 rounded-2xl hover:brightness-105 active:scale-95 transition-all shadow-md"
          >
            {t('cta')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
