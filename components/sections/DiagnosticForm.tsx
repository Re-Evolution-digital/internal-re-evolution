'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

function getLocale(path: string) { return path.split('/')[1] ?? 'pt' }

function buildSchema(errors: Record<string, string>) {
  return z.object({
    name: z.string().min(2, errors.nameRequired),
    email: z
      .string()
      .min(1, errors.emailRequired)
      .email(errors.emailInvalid),
    phone: z
      .string()
      .min(1, errors.phoneRequired)
      .refine(
        (v) => /^\+?[\d\s\-\(\)\.]{7,25}$/.test(v) && v.replace(/\D/g, '').length >= 7,
        errors.phoneInvalid
      ),
    business_type: z.string().min(1, errors.businessTypeRequired),
    main_problem: z.string().max(300, errors.mainProblemMax).optional(),
    gdpr_consent: z.literal<boolean>(true, {
      errorMap: () => ({ message: errors.gdprRequired }),
    }),
    honeypot: z.string().max(0).optional(),
  })
}

type FormData = {
  name: string
  email: string
  phone: string
  business_type: string
  main_problem?: string
  gdpr_consent: boolean
  honeypot?: string
}

export default function DiagnosticForm() {
  const t = useTranslations('diagnostic')
  const tForm = useTranslations('diagnostic.form')
  const pathname = usePathname()
  const locale = getLocale(pathname)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const errors = {
    nameRequired: tForm('errors.nameRequired'),
    emailRequired: tForm('errors.emailRequired'),
    emailInvalid: tForm('errors.emailInvalid'),
    phoneRequired: tForm('errors.phoneRequired'),
    phoneInvalid: tForm('errors.phoneInvalid'),
    businessTypeRequired: tForm('errors.businessTypeRequired'),
    gdprRequired: tForm('errors.gdprRequired'),
    mainProblemMax: tForm('errors.mainProblemMax'),
  }

  const schema = buildSchema(errors)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gdpr_consent: false },
  })

  const businessTypes = tForm.raw('businessTypes') as string[]
  const mainProblemValue = watch('main_problem') ?? ''

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setServerError('')
    trackEvent(GA_EVENTS.FORM_SUBMIT, { form_name: 'diagnostico', business_type: data.business_type })

    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, gdpr_consent: true, language: locale, phone: data.phone.trim() }),
      })
      if (!res.ok) throw new Error()
      trackEvent(GA_EVENTS.FORM_SUCCESS, { form_name: 'diagnostico' })
      setSubmitted(true)
    } catch {
      setServerError(tForm('serverError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="diagnostico"
      className="relative py-20 overflow-hidden"
      data-section="diagnostic"
      aria-labelledby="diagnostic-title"
    >
      {/* Imagem de fundo */}
      <Image
        src="/images/form/diagnostico-gratuito-background.png"
        alt=""
        fill
        className="object-cover object-center"
        aria-hidden="true"
      />
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-brand-dark/82" aria-hidden="true" />
      {/* Dot clusters */}
      <svg className="absolute top-8 left-8 opacity-[0.15] pointer-events-none" width="66" height="66" viewBox="0 0 66 66" fill="none" aria-hidden="true">
        {[4,26,48].flatMap(x => [4,26,48].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#ffc700"/>
        )))}
      </svg>
      <svg className="absolute bottom-8 right-8 opacity-[0.15] pointer-events-none" width="88" height="88" viewBox="0 0 88 88" fill="none" aria-hidden="true">
        {[4,26,48,70].flatMap(x => [4,26,48,70].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#ffc700"/>
        )))}
      </svg>

      {/* Faixa amarela diagonal no topo — slide 16 */}
      <div className="absolute top-0 left-0 right-0 z-20" aria-hidden="true">
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

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 id="diagnostic-title" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2">
            {t('title')}
          </h2>
          <div className="h-1 w-16 bg-brand-yellow rounded-full mx-auto mt-2 mb-4" aria-hidden="true" />
          <p className="text-white/70 text-lg">{t('subtitle')}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 border border-white/20 rounded-3xl py-20 px-8 text-center flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="text-7xl mb-6"
              >
                🎉
              </motion.div>
              <h3 className="text-3xl font-extrabold text-white mb-3">{tForm('success')}</h3>
              <div className="h-1 w-12 bg-brand-yellow rounded-full mb-4" aria-hidden="true" />
              <p className="text-white/70 text-lg max-w-sm">{tForm('successSub')}</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              onFocus={() => trackEvent(GA_EVENTS.FORM_START, { form_name: 'diagnostico' })}
              noValidate
              className="bg-white/5 rounded-3xl p-6 sm:p-8 space-y-5 border border-white/10"
            >
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                aria-hidden="true"
                className="absolute opacity-0 h-0 w-0 pointer-events-none"
                {...register('honeypot')}
              />

              {/* Name */}
              <div>
                <label htmlFor="diag-name" className="block text-white/80 text-sm font-semibold mb-1.5">
                  {tForm('name')} *
                </label>
                <input
                  id="diag-name"
                  type="text"
                  autoComplete="name"
                  placeholder={tForm('namePlaceholder')}
                  {...register('name')}
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? 'diag-name-error' : undefined}
                  className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${
                    formErrors.name ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'
                  }`}
                />
                {formErrors.name && (
                  <p id="diag-name-error" role="alert" className="text-red-400 text-xs mt-1">
                    {formErrors.name.message}
                  </p>
                )}
              </div>

              {/* Email + Phone — two columns on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="diag-email" className="block text-white/80 text-sm font-semibold mb-1.5">
                    {tForm('email')} *
                  </label>
                  <input
                    id="diag-email"
                    type="email"
                    autoComplete="email"
                    placeholder={tForm('emailPlaceholder')}
                    {...register('email')}
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? 'diag-email-error' : undefined}
                    className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${
                      formErrors.email ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'
                    }`}
                  />
                  {formErrors.email && (
                    <p id="diag-email-error" role="alert" className="text-red-400 text-xs mt-1">
                      {formErrors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="diag-phone" className="block text-white/80 text-sm font-semibold mb-1.5">
                    {tForm('phone')} *
                  </label>
                  <input
                    id="diag-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder={tForm('phonePlaceholder')}
                    {...register('phone')}
                    aria-invalid={!!formErrors.phone}
                    aria-describedby={formErrors.phone ? 'diag-phone-error' : undefined}
                    className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${
                      formErrors.phone ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'
                    }`}
                  />
                  {formErrors.phone && (
                    <p id="diag-phone-error" role="alert" className="text-red-400 text-xs mt-1">
                      {formErrors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Business type */}
              <div>
                <label htmlFor="diag-business" className="block text-white/80 text-sm font-semibold mb-1.5">
                  {tForm('businessType')} *
                </label>
                <select
                  id="diag-business"
                  {...register('business_type')}
                  aria-invalid={!!formErrors.business_type}
                  className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all appearance-none ${
                    formErrors.business_type ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'
                  }`}
                >
                  <option value="" className="text-gray-900">{tForm('businessTypePlaceholder')}</option>
                  {businessTypes.map((bt) => (
                    <option key={bt} value={bt} className="text-gray-900">{bt}</option>
                  ))}
                </select>
                {formErrors.business_type && (
                  <p role="alert" className="text-red-400 text-xs mt-1">
                    {formErrors.business_type.message}
                  </p>
                )}
              </div>

              {/* Main problem */}
              <div>
                <label htmlFor="diag-problem" className="block text-white/80 text-sm font-semibold mb-1.5">
                  {tForm('mainProblem')}
                </label>
                <textarea
                  id="diag-problem"
                  rows={3}
                  maxLength={300}
                  placeholder={tForm('mainProblemPlaceholder')}
                  {...register('main_problem')}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all resize-none"
                />
                <p className="text-white/30 text-xs mt-1 text-right">{mainProblemValue.length}/300</p>
              </div>

              {/* GDPR */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('gdpr_consent')}
                    aria-invalid={!!formErrors.gdpr_consent}
                    className="mt-0.5 w-5 h-5 rounded border-white/20 bg-white/10 text-brand-yellow focus:ring-brand-yellow"
                  />
                  <span className="text-white/70 text-sm">
                    {tForm('gdpr')}{' '}
                    <Link
                      href={`/${locale}/privacy-policy`}
                      className="underline text-brand-yellow hover:text-brand-yellow/80"
                    >
                      {tForm('gdprLink')}
                    </Link>
                  </span>
                </label>
                {formErrors.gdpr_consent && (
                  <p role="alert" className="text-red-400 text-xs mt-1 ml-8">
                    {formErrors.gdpr_consent.message}
                  </p>
                )}
              </div>

              {serverError && (
                <p role="alert" className="text-red-400 text-sm text-center">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-yellow text-brand-dark font-bold text-base py-4 rounded-2xl hover:brightness-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {tForm('loading')}
                  </>
                ) : tForm('submit')}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
