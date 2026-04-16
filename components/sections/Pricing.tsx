'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { initPricingIntent } from '@/lib/pricing-intent'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'
import { anchorClick } from '@/lib/scroll'

function getLocale(path: string) { return path.split('/')[1] ?? 'pt' }

type Package = {
  id: string
  name: string
  badge: string
  price: string
  priceMonthly?: string
  priceSuffix: string
  features: string[]
  footnote?: string
  cta: string
  comingSoon?: boolean
}

type ComparisonRow = {
  label: string
  essencial: string
  managed: string
  marketing: string
}

type ComparisonCategory = {
  name: string
  rows: ComparisonRow[]
}

type Comparison = {
  title: string
  showLabel: string
  hideLabel: string
  featureHeader: string
  categories: ComparisonCategory[]
  footnotes: string[]
}

function CellValue({ value }: { value: string }) {
  if (value === '✓') {
    return (
      <svg className="w-5 h-5 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )
  }
  if (value === '—') {
    return <span className="text-gray-300 text-lg leading-none">—</span>
  }
  return <span className="text-gray-700 text-xs sm:text-sm">{value}</span>
}

export default function Pricing() {
  const t = useTranslations('pricing')
  const pathname = usePathname()
  const locale = getLocale(pathname)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    const cleanup = initPricingIntent()
    return cleanup
  }, [])

  const packages = t.raw('packages') as Package[]
  const comparison = t.raw('comparison') as Comparison

  return (
    <section id="precos" className="py-20 bg-white" data-section="pricing" aria-labelledby="pricing-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 id="pricing-title" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-dark mb-2">
            {t('title')}
          </h2>
          <div className="h-1 w-16 bg-brand-yellow rounded-full mx-auto mt-2 mb-3" aria-hidden="true" />
          <p className="text-gray-600 text-lg">{t('subtitle')}</p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-3xl p-7 border-2 transition-all flex flex-col ${
                i === 0
                  ? 'border-brand-yellow bg-brand-dark text-white'
                  : 'border-gray-100 bg-white hover:border-brand-dark'
              }`}
            >
              {/* "Em construção" overlay */}
              {pkg.comingSoon && (
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-10" aria-hidden="true">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[175%] h-10 bg-red-600/75 -rotate-[28deg]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[175%] h-10 bg-red-600/75 rotate-[28deg]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-red-700 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-xl uppercase tracking-widest whitespace-nowrap border-2 border-white/20">
                      Em construção
                    </span>
                  </div>
                </div>
              )}

              {/* Badge */}
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 self-start ${
                i === 0
                  ? 'bg-brand-yellow text-brand-dark'
                  : i === 1
                  ? 'bg-brand-dark text-white'
                  : 'bg-brand-yellow text-brand-dark'
              }`}>
                {pkg.badge}
              </span>

              <h3 className={`text-xl font-bold mb-3 ${i === 0 ? 'text-white' : 'text-brand-dark'}`}>
                {pkg.name}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-2 flex-wrap">
                  <span className={`text-4xl font-black ${
                    i === 0 ? 'text-brand-yellow' : 'text-brand-dark'
                  }`}>
                    {pkg.price}
                  </span>
                  {pkg.priceMonthly && (
                    <span className={`text-sm font-semibold mb-1 ${
                      i === 0 ? 'text-brand-yellow/80' : 'text-gray-600'
                    }`}>
                      {pkg.priceMonthly}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${i === 0 ? 'text-white/60' : 'text-gray-500'}`}>
                  {pkg.priceSuffix}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-5 flex-1">
                {pkg.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2.5">
                    <svg
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        i === 0 ? 'text-brand-yellow' : 'text-brand-dark'
                      }`}
                      fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm ${
                      i === 0 ? 'text-white/85' : 'text-gray-700'
                    }`}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Footnote */}
              {pkg.footnote && (
                <p className={`text-xs mb-5 ${i === 0 ? 'text-white/45' : 'text-gray-400'}`}>
                  {pkg.footnote}
                </p>
              )}

              {/* CTA */}
              <a
                href={pkg.comingSoon ? undefined : `/${locale}/#diagnostico`}
                onClick={(e) => { if (!pkg.comingSoon) { anchorClick('diagnostico', e); trackEvent(GA_EVENTS.CTA_CLICK, { cta_name: `pricing_${pkg.id}`, section: 'pricing', language: locale }) } }}
                aria-disabled={pkg.comingSoon}
                className={`block text-center font-bold py-3.5 rounded-2xl transition-all mt-auto ${
                  pkg.comingSoon
                    ? 'bg-gray-200 text-gray-400 cursor-default pointer-events-none'
                    : i === 0
                    ? 'bg-brand-yellow text-brand-dark hover:brightness-105 active:scale-95'
                    : 'bg-brand-dark text-white hover:bg-brand-dark/90 active:scale-95'
                }`}
              >
                {pkg.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Comparison toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mb-4"
        >
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark border border-gray-200 px-5 py-2.5 rounded-full hover:bg-gray-50 transition-all"
          >
            <span>{showComparison ? comparison.hideLabel : comparison.showLabel}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${showComparison ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </motion.div>

        {/* Comparison table */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="bg-gray-50 rounded-3xl p-5 sm:p-8 mb-4">
                <h3 className="text-lg font-bold text-brand-dark text-center mb-6">{comparison.title}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[580px] text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left pb-3 text-gray-500 font-medium w-[38%] pr-4">
                          {comparison.featureHeader}
                        </th>
                        {packages.map((pkg) => (
                          <th key={pkg.id} className={`pb-3 text-center font-bold text-xs sm:text-sm ${
                            pkg.comingSoon ? 'text-gray-400' : 'text-brand-dark'
                          }`}>
                            {pkg.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.categories.flatMap((cat, ci) => [
                        <tr key={`cat-${ci}`}>
                          <td colSpan={4} className="pt-5 pb-1.5 font-bold text-brand-dark text-xs uppercase tracking-wider">
                            {cat.name}
                          </td>
                        </tr>,
                        ...cat.rows.map((row, ri) => (
                          <tr key={`row-${ci}-${ri}`} className="border-b border-gray-100">
                            <td className="py-2.5 text-gray-600 pr-4 text-xs sm:text-sm">{row.label}</td>
                            <td className="py-2.5 text-center"><CellValue value={row.essencial} /></td>
                            <td className="py-2.5 text-center"><CellValue value={row.managed} /></td>
                            <td className="py-2.5 text-center"><CellValue value={row.marketing} /></td>
                          </tr>
                        ))
                      ])}
                    </tbody>
                  </table>
                </div>

                {/* Footnotes */}
                <div className="mt-5 space-y-1 border-t border-gray-200 pt-4">
                  {comparison.footnotes.map((note, ni) => (
                    <p key={ni} className="text-xs text-gray-400">{note}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-gray-400 text-xs mt-2">{t('footer')}</p>
      </div>
    </section>
  )
}
