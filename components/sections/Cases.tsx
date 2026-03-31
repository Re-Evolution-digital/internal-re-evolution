'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'

function BrowserWindow({ label, labelStyle, chrome, children }: {
  label: string
  labelStyle: 'dark' | 'yellow'
  chrome?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 min-w-0 rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white flex flex-col">
      {/* Browser chrome */}
      <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center gap-2 shrink-0">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          {chrome}
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
          labelStyle === 'yellow'
            ? 'bg-brand-yellow text-brand-dark'
            : 'bg-gray-700 text-white'
        }`}>
          {label}
        </span>
      </div>
      {/* Content */}
      <div className="relative flex-1" style={{ height: '360px' }}>
        {children}
      </div>
    </div>
  )
}

export default function Cases() {
  const t = useTranslations('cases')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const stats = t.raw('story.stats') as Array<{ value: string; label: string }>

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

        {/* Main case study */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8"
        >
          <div className="flex flex-col">
            {/* Top: story */}
            <div className="p-8 lg:p-10 flex flex-col lg:flex-row lg:items-end gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-brand-yellow/20 text-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {t('story.badge')}
                  </span>
                  <span className="text-gray-400 text-xs">{t('story.location')}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-brand-dark mb-3 leading-tight">
                  {t('story.headline')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
                  {t('story.narrative')}
                </p>

                {/* Stats strip */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {stats.map((s, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-xl sm:text-2xl font-extrabold text-brand-dark">{s.value}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-snug">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="border-l-4 border-brand-yellow pl-4">
                <svg className="w-6 h-6 text-brand-yellow mb-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className="text-gray-700 text-sm leading-relaxed italic mb-3">
                  &ldquo;{t('story.quote')}&rdquo;
                </blockquote>
                <p className="font-bold text-brand-dark text-sm">{t('story.author')}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(t.raw('story.tags') as string[]).map((tag) => (
                    <span key={tag} className="bg-brand-yellow/15 text-brand-dark text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: browser windows */}
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-gray-100 gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Before — video */}
                <BrowserWindow label={t('story.tabBefore')} labelStyle="dark">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src="/videos/arcadas-old.mp4"
                  />
                </BrowserWindow>

                {/* After — iframe */}
                <BrowserWindow
                  label={t('story.tabAfter')}
                  labelStyle="yellow"
                  chrome={
                    <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-500 w-full min-w-0">
                      <svg className="w-3 h-3 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                      <span className="truncate">arcadasdofado.com</span>
                      <a
                        href="https://www.arcadasdofado.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto shrink-0 hover:text-brand-dark"
                        title={t('story.visitLabel')}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  }
                >
                  <iframe
                    src="https://www.arcadasdofado.com"
                    className="w-full h-full border-0"
                    title="Arcadas do Fado — novo site"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </BrowserWindow>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
