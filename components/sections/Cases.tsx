'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function Cases() {
  const t = useTranslations('cases')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const testimonials = t.raw('testimonials') as Array<{
    quote: string; author: string; location: string; tags: string[]
  }>

  return (
    <section id="casos" className="py-20 bg-gray-50" data-section="cases" aria-labelledby="cases-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.h2
          id="cases-title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-dark text-center mb-2"
        >
          {t('title')}
        </motion.h2>
        <div className="h-1 w-16 bg-brand-yellow rounded-full mx-auto mt-2 mb-12" aria-hidden="true" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main testimonial */}
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <svg className="w-8 h-8 text-brand-yellow mb-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>
              <div>
                <p className="font-bold text-brand-dark">{item.author}</p>
                <p className="text-gray-500 text-sm">{item.location}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map((tag) => (
                    <span key={tag} className="bg-brand-yellow/15 text-brand-dark text-xs font-semibold px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Placeholder slots */}
          {[1, 2].map((i) => (
            <motion.div
              key={`placeholder-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={`bg-white rounded-3xl p-8 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center min-h-[200px] ${i === 1 ? 'md:col-start-3 md:row-start-1' : ''}`}
            >
              <div className="text-4xl mb-3 opacity-30">🏢</div>
              <p className="text-gray-400 font-medium">{t('comingSoon')}</p>
              <p className="text-gray-300 text-sm mt-1">Em breve</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
