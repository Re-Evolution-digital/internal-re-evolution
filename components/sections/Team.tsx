'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function Team() {
  const t = useTranslations('team')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="equipa" className="relative py-20 bg-white overflow-hidden" data-section="team" aria-labelledby="team-title">

      {/* Top yellow stripe */}
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

      {/* Bottom yellow stripe */}
      <div className="absolute bottom-0 left-0 right-0 z-10" aria-hidden="true">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 mt-6 sm:mt-0"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-brand-yellow bg-brand-yellow/10 px-3 py-1 rounded-full">
            {t('label')}
          </span>
          <h2
            id="team-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-dark mt-4 mb-2"
          >
            {t('title')}
          </h2>
          <div className="h-1 w-16 bg-brand-yellow rounded-full mx-auto mt-2" aria-hidden="true" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="bg-brand-dark rounded-3xl overflow-hidden shadow-xl flex flex-col lg:flex-row"
        >
          {/* Photo */}
          <div className="lg:w-72 xl:w-80 shrink-0 flex items-center justify-center p-8">
            <Image
              src="/images/team/carlos_vale.png"
              alt={`${t('name')} — ${t('role')}`}
              width={260}
              height={260}
              className="w-52 h-52 lg:w-60 lg:h-60 object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
            <svg
              className="w-10 h-10 text-brand-yellow mb-4 opacity-75"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <blockquote className="text-white/85 text-base sm:text-lg leading-relaxed italic mb-8">
              {t('quote')}
            </blockquote>

            <div className="border-t border-white/10 pt-6">
              <p className="font-extrabold text-white text-lg">{t('name')}</p>
              <p className="text-brand-yellow text-sm font-semibold mt-0.5">{t('role')}</p>
              <p className="text-white/50 text-sm mt-3 leading-relaxed">{t('tagline')}</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
