'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'

const serviceIcons = [
  // Monitor/Web
  <svg key="web" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>,
  // Bolt
  <svg key="auto" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
  // Chat/AI
  <svg key="ai" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>,
]

export default function Services() {
  const t = useTranslations('services')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const pillars = t.raw('pillars') as Array<{ title: string; description: string; features: string[] }>

  return (
    <section id="servicos" className="py-20 bg-white" data-section="services" aria-labelledby="services-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.h2
          id="services-title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-dark text-center mb-2"
        >
          {t('title')}
        </motion.h2>
        <div className="h-1 w-16 bg-brand-yellow rounded-full mx-auto mt-2 mb-12" aria-hidden="true" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-brand-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Faixa amarela diagonal — cabeçalho do card (slide 9) */}
              <div
                className="bg-brand-yellow pl-14 pr-5 py-4 flex items-center gap-3"
                style={{ clipPath: 'polygon(44px 0, 100% 0, 100% 100%, 0 100%)' }}
              >
                <div className="w-10 h-10 bg-brand-dark/20 rounded-full flex items-center justify-center text-brand-dark shrink-0 group-hover:scale-110 transition-transform">
                  {serviceIcons[i]}
                </div>
                <h3 className="text-brand-dark font-extrabold text-base leading-tight pr-10">{pillar.title}</h3>
              </div>

              {/* Conteúdo */}
              <div className="p-6 pt-5">
                <p className="text-white/65 leading-relaxed mb-5 text-sm">{pillar.description}</p>
                <ul className="space-y-2.5">
                  {pillar.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm text-white/80">
                      <svg className="w-4 h-4 text-brand-yellow shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
