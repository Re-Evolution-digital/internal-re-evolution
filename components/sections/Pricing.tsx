'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { initPricingIntent } from '@/lib/pricing-intent'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

function getLocale(path: string) { return path.split('/')[1] ?? 'pt' }

export default function Pricing() {
  const t = useTranslations('pricing')
  const pathname = usePathname()
  const locale = getLocale(pathname)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    const cleanup = initPricingIntent()
    return cleanup
  }, [])

  const packages = t.raw('packages') as Array<{
    id: string; name: string; badge: string; price: string;
    priceMonthly?: string; priceSuffix: string; features: string[]; cta: string
  }>

  return (
    <section id="precos" className="py-20 bg-white" data-section="pricing" aria-labelledby="pricing-title">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-3xl p-8 border-2 transition-all ${
                i === 0
                  ? 'border-brand-yellow bg-brand-dark text-white'
                  : 'border-gray-100 bg-white hover:border-brand-dark'
              }`}
            >
              {/* Badge */}
              <span
                className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${
                  i === 0 ? 'bg-brand-yellow text-brand-dark' : 'bg-brand-dark text-white'
                }`}
              >
                {pkg.badge}
              </span>

              <h3 className={`text-xl font-bold mb-2 ${i === 0 ? 'text-white' : 'text-brand-dark'}`}>
                {pkg.name}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-2">
                  <span className={`text-5xl font-black ${i === 0 ? 'text-brand-yellow' : 'text-brand-dark'}`}>
                    {pkg.price}
                  </span>
                  {pkg.priceMonthly && (
                    <span className={`text-lg font-bold mb-1 ${i === 0 ? 'text-brand-yellow' : 'text-brand-dark'}`}>
                      {pkg.priceMonthly}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${i === 0 ? 'text-white/60' : 'text-gray-500'}`}>
                  {pkg.priceSuffix}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <svg
                      className={`w-5 h-5 shrink-0 ${i === 0 ? 'text-brand-yellow' : 'text-brand-dark'}`}
                      fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm ${i === 0 ? 'text-white/85' : 'text-gray-700'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={`/${locale}/#diagnostico`}
                onClick={() => trackEvent(GA_EVENTS.CTA_CLICK, { cta_name: `pricing_${pkg.id}`, section: 'pricing', language: locale })}
                className={`block text-center font-bold py-4 rounded-2xl transition-all hover:brightness-105 active:scale-95 ${
                  i === 0
                    ? 'bg-brand-yellow text-brand-dark'
                    : 'bg-brand-dark text-white hover:bg-brand-dark/90'
                }`}
              >
                {pkg.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Add-ons note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-2xl p-5 text-center text-gray-600 text-sm"
        >
          <p>{t('note')}</p>
        </motion.div>

        <p className="text-center text-gray-400 text-xs mt-4">{t('footer')}</p>
      </div>
    </section>
  )
}
