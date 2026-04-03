'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

// ── Types ─────────────────────────────────────────────────────────────────────

type Mode = 'select' | 'calendar' | 'contact'

interface TimeSlot {
  time: string
  isoStart: string
  isoEnd: string
}
interface DaySlots {
  date: string
  slots: TimeSlot[]
}

type FormData = {
  name: string
  email: string
  phone: string
  business_type: string
  gdpr_consent: boolean
  honeypot?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getLocale(path: string) { return path.split('/')[1] ?? 'pt' }

function buildSchema(errors: Record<string, string>) {
  return z.object({
    name: z.string().min(2, errors.nameRequired),
    email: z.string().min(1, errors.emailRequired).email(errors.emailInvalid),
    phone: z
      .string()
      .min(1, errors.phoneRequired)
      .refine(
        (v) => /^\+?[\d\s\-\(\)\.]{7,25}$/.test(v) && v.replace(/\D/g, '').length >= 7,
        errors.phoneInvalid
      ),
    business_type: z.string().min(1, errors.businessTypeRequired),
    gdpr_consent: z.literal<boolean>(true, { errorMap: () => ({ message: errors.gdprRequired }) }),
    honeypot: z.string().max(0).optional(),
  })
}

/** Formata "YYYY-MM-DD" para "Seg, 5 Abr" conforme locale */
function formatDateLabel(dateStr: string, locale: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString(locale === 'pt' ? 'pt-PT' : locale === 'es' ? 'es-ES' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DiagnosticForm() {
  const t = useTranslations('diagnostic')
  const tForm = useTranslations('diagnostic.form')
  const tCal = useTranslations('diagnostic.calendar')
  const pathname = usePathname()
  const locale = getLocale(pathname)

  // ── Mode ──────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<Mode>('select')
  const [submitted, setSubmitted] = useState(false)
  const [submittedLabel, setSubmittedLabel] = useState('')
  const [submittedMode, setSubmittedMode] = useState<'calendar' | 'contact'>('contact')

  // ── Calendar state ────────────────────────────────────────────────────────
  const [slotsData, setSlotsData] = useState<DaySlots[] | null>(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  // ── Submit state ──────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  // ── Form ──────────────────────────────────────────────────────────────────
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
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gdpr_consent: false },
  })

  // ── Handlers ──────────────────────────────────────────────────────────────

  const fetchSlots = useCallback(async () => {
    if (slotsData || slotsLoading) return
    setSlotsLoading(true)
    setSlotsError(false)
    try {
      const res = await fetch('/api/agenda/slots')
      if (!res.ok) throw new Error()
      const data = await res.json() as { days: DaySlots[] }
      setSlotsData(data.days)
      if (data.days.length > 0) setSelectedDate(data.days[0].date)
    } catch {
      setSlotsError(true)
    } finally {
      setSlotsLoading(false)
    }
  }, [slotsData, slotsLoading])

  const handleSelectMode = (m: Mode) => {
    setMode(m)
    setServerError('')
    if (m === 'calendar') fetchSlots()
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setServerError('')
    trackEvent(GA_EVENTS.FORM_SUBMIT, { form_name: mode === 'calendar' ? 'agendamento' : 'diagnostico', business_type: data.business_type })

    if (mode === 'calendar') {
      if (!selectedSlot) {
        setServerError(tCal('selectSlotError'))
        setLoading(false)
        return
      }
      try {
        const res = await fetch('/api/agenda/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            gdpr_consent: true,
            language: locale,
            phone: data.phone.trim(),
            slot_start: selectedSlot.isoStart,
            slot_end: selectedSlot.isoEnd,
          }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({})) as { error?: string }
          throw new Error(err.error ?? '')
        }
        const result = await res.json() as { slot_label?: string }
        trackEvent(GA_EVENTS.FORM_SUCCESS, { form_name: 'agendamento' })
        setSubmittedLabel(result.slot_label ?? selectedSlot.time)
        setSubmittedMode('calendar')
        setSubmitted(true)
      } catch (err) {
        const msg = err instanceof Error && err.message ? err.message : tForm('serverError')
        setServerError(msg)
      } finally {
        setLoading(false)
      }
    } else {
      try {
        const res = await fetch('/api/diagnostico', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, gdpr_consent: true, language: locale, phone: data.phone.trim() }),
        })
        if (!res.ok) throw new Error()
        trackEvent(GA_EVENTS.FORM_SUCCESS, { form_name: 'diagnostico' })
        setSubmittedMode('contact')
        setSubmitted(true)
      } catch {
        setServerError(tForm('serverError'))
      } finally {
        setLoading(false)
      }
    }
  }

  // ── Slots for selected date ───────────────────────────────────────────────
  const currentDaySlots = slotsData?.find((d) => d.date === selectedDate)?.slots ?? []

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      id="diagnostico"
      className="relative py-20 overflow-hidden"
      data-section="diagnostic"
      aria-labelledby="diagnostic-title"
    >
      {/* Background */}
      <Image
        src="/images/form/diagnostico-gratuito-background.png"
        alt=""
        fill
        className="object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-brand-dark/82" aria-hidden="true" />

      {/* Dot clusters */}
      <svg className="absolute top-8 left-8 opacity-[0.15] pointer-events-none" width="66" height="66" viewBox="0 0 66 66" fill="none" aria-hidden="true">
        {[4, 26, 48].flatMap(x => [4, 26, 48].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#ffc700" />
        )))}
      </svg>
      <svg className="absolute bottom-8 right-8 opacity-[0.15] pointer-events-none" width="88" height="88" viewBox="0 0 88 88" fill="none" aria-hidden="true">
        {[4, 26, 48, 70].flatMap(x => [4, 26, 48, 70].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#ffc700" />
        )))}
      </svg>

      {/* Yellow stripe */}
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
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 id="diagnostic-title" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2">
            {t('title')}
          </h2>
          <div className="h-1 w-16 bg-brand-yellow rounded-full mx-auto mt-2 mb-4" aria-hidden="true" />
          <p className="text-white/70 text-base">{t('subtitle')}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            /* ── Success ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 border border-white/20 rounded-3xl py-16 px-8 text-center flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="text-6xl mb-5"
              >
                {submittedMode === 'calendar' ? '🗓' : '🎉'}
              </motion.div>
              <h3 className="text-2xl font-extrabold text-white mb-2">
                {submittedMode === 'calendar' ? tCal('success') : tForm('success')}
              </h3>
              <div className="h-1 w-10 bg-brand-yellow rounded-full mb-4" aria-hidden="true" />
              {submittedMode === 'calendar' && submittedLabel && (
                <p className="text-brand-yellow font-bold text-lg mb-3">🗓 {submittedLabel}</p>
              )}
              <p className="text-white/70 text-base max-w-sm">
                {submittedMode === 'calendar' ? tCal('successSub') : tForm('successSub')}
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* ── Option cards ── */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* Calendar option */}
                <button
                  type="button"
                  onClick={() => handleSelectMode('calendar')}
                  className={`group rounded-2xl border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-brand-yellow ${
                    mode === 'calendar'
                      ? 'bg-brand-yellow/15 border-brand-yellow'
                      : 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="text-2xl mb-1.5">📅</div>
                  <p className={`font-bold text-sm leading-tight mb-1 ${mode === 'calendar' ? 'text-brand-yellow' : 'text-white'}`}>
                    {t('optionCalendar.badge')}
                  </p>
                  <p className="text-white/50 text-xs leading-snug">{t('optionCalendar.description')}</p>
                  {mode === 'calendar' && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                      <span className="text-brand-yellow text-xs font-semibold">Selecionado</span>
                    </div>
                  )}
                </button>

                {/* Contact option */}
                <button
                  type="button"
                  onClick={() => handleSelectMode('contact')}
                  className={`group rounded-2xl border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-brand-yellow ${
                    mode === 'contact'
                      ? 'bg-brand-yellow/15 border-brand-yellow'
                      : 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="text-2xl mb-1.5">⚡</div>
                  <p className={`font-bold text-sm leading-tight mb-1 ${mode === 'contact' ? 'text-brand-yellow' : 'text-white'}`}>
                    {t('optionContact.badge')}
                  </p>
                  <p className="text-white/50 text-xs leading-snug">{t('optionContact.description')}</p>
                  {mode === 'contact' && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                      <span className="text-brand-yellow text-xs font-semibold">Selecionado</span>
                    </div>
                  )}
                </button>
              </div>

              {/* ── Panel ── */}
              <AnimatePresence mode="wait">

                {/* ─── Calendar panel ─── */}
                {mode === 'calendar' && (
                  <motion.div
                    key="calendar-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-white/5 rounded-3xl p-5 sm:p-7 border border-white/10 space-y-5"
                  >
                    {/* Loading slots */}
                    {slotsLoading && (
                      <div className="flex items-center justify-center gap-3 py-8 text-white/60">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-sm">{tCal('loading')}</span>
                      </div>
                    )}

                    {/* Error loading slots */}
                    {slotsError && (
                      <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 text-sm text-red-300 text-center">
                        {tCal('error')}
                      </div>
                    )}

                    {/* No slots at all */}
                    {!slotsLoading && !slotsError && slotsData && slotsData.length === 0 && (
                      <div className="text-center py-6 text-white/60 text-sm">
                        {tCal('noAvailability')}
                      </div>
                    )}

                    {/* Date + time pickers */}
                    {!slotsLoading && !slotsError && slotsData && slotsData.length > 0 && (
                      <>
                        {/* Date row */}
                        <div>
                          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2.5">
                            {tCal('selectDate')}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {slotsData.map((day) => (
                              <button
                                key={day.date}
                                type="button"
                                onClick={() => { setSelectedDate(day.date); setSelectedSlot(null) }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-yellow ${
                                  selectedDate === day.date
                                    ? 'bg-brand-yellow text-brand-dark'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                                }`}
                              >
                                {formatDateLabel(day.date, locale)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Time slots */}
                        {selectedDate && (
                          <div>
                            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2.5">
                              {tCal('selectTime')}
                            </p>
                            {currentDaySlots.length === 0 ? (
                              <p className="text-white/40 text-sm">{tCal('noSlots')}</p>
                            ) : (
                              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                {currentDaySlots.map((slot) => (
                                  <button
                                    key={slot.isoStart}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`py-2 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-brand-yellow ${
                                      selectedSlot?.isoStart === slot.isoStart
                                        ? 'bg-brand-yellow text-brand-dark ring-2 ring-brand-yellow'
                                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                                    }`}
                                  >
                                    {slot.time}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Selected slot summary */}
                        {selectedSlot && (
                          <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
                            <span className="text-brand-yellow">🗓</span>
                            <span className="text-white text-sm font-semibold">
                              {selectedDate && formatDateLabel(selectedDate, locale)} às {selectedSlot.time}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Shared form (visible when slots loaded or on error to allow fallback) */}
                    {!slotsLoading && (
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        onFocus={() => trackEvent(GA_EVENTS.FORM_START, { form_name: 'agendamento' })}
                        noValidate
                        className="space-y-4 border-t border-white/10 pt-5"
                      >
                        <input type="text" tabIndex={-1} aria-hidden="true" className="absolute opacity-0 h-0 w-0 pointer-events-none" {...register('honeypot')} />

                        {/* Name */}
                        <div>
                          <label htmlFor="cal-name" className="block text-white/80 text-xs font-semibold mb-1.5">{tForm('name')} *</label>
                          <input
                            id="cal-name"
                            type="text"
                            autoComplete="name"
                            placeholder={tForm('namePlaceholder')}
                            {...register('name')}
                            className={`w-full bg-white/10 border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${formErrors.name ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'}`}
                          />
                          {formErrors.name && <p role="alert" className="text-red-400 text-xs mt-1">{formErrors.name.message}</p>}
                        </div>

                        {/* Email + Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="cal-email" className="block text-white/80 text-xs font-semibold mb-1.5">{tForm('email')} *</label>
                            <input
                              id="cal-email"
                              type="email"
                              autoComplete="email"
                              placeholder={tForm('emailPlaceholder')}
                              {...register('email')}
                              className={`w-full bg-white/10 border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${formErrors.email ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'}`}
                            />
                            {formErrors.email && <p role="alert" className="text-red-400 text-xs mt-1">{formErrors.email.message}</p>}
                          </div>
                          <div>
                            <label htmlFor="cal-phone" className="block text-white/80 text-xs font-semibold mb-1.5">{tForm('phone')} *</label>
                            <input
                              id="cal-phone"
                              type="tel"
                              autoComplete="tel"
                              placeholder={tForm('phonePlaceholder')}
                              {...register('phone')}
                              className={`w-full bg-white/10 border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${formErrors.phone ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'}`}
                            />
                            {formErrors.phone && <p role="alert" className="text-red-400 text-xs mt-1">{formErrors.phone.message}</p>}
                          </div>
                        </div>

                        {/* Business type */}
                        <div>
                          <label htmlFor="cal-business" className="block text-white/80 text-xs font-semibold mb-1.5">{tForm('businessType')} *</label>
                          <input
                            id="cal-business"
                            type="text"
                            placeholder={tForm('businessTypePlaceholder')}
                            {...register('business_type')}
                            className={`w-full bg-white/10 border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${formErrors.business_type ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'}`}
                          />
                          {formErrors.business_type && <p role="alert" className="text-red-400 text-xs mt-1">{formErrors.business_type.message}</p>}
                        </div>

                        {/* GDPR */}
                        <div>
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              {...register('gdpr_consent')}
                              className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/10 text-brand-yellow focus:ring-brand-yellow"
                            />
                            <span className="text-white/60 text-xs">
                              {tForm('gdpr')}{' '}
                              <Link href={`/${locale}/privacy-policy`} className="underline text-brand-yellow hover:text-brand-yellow/80">
                                {tForm('gdprLink')}
                              </Link>
                            </span>
                          </label>
                          {formErrors.gdpr_consent && <p role="alert" className="text-red-400 text-xs mt-1 ml-7">{formErrors.gdpr_consent.message}</p>}
                        </div>

                        {serverError && <p role="alert" className="text-red-400 text-sm text-center">{serverError}</p>}

                        <button
                          type="submit"
                          disabled={loading || (!!slotsData && !selectedSlot)}
                          className="w-full bg-brand-yellow text-brand-dark font-bold text-sm py-3.5 rounded-2xl hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              {tCal('booking')}
                            </>
                          ) : slotsData && !selectedSlot ? (
                            tCal('selectSlotHint')
                          ) : (
                            tCal('book')
                          )}
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}

                {/* ─── Contact panel ─── */}
                {mode === 'contact' && (
                  <motion.form
                    key="contact-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    onSubmit={handleSubmit(onSubmit)}
                    onFocus={() => trackEvent(GA_EVENTS.FORM_START, { form_name: 'diagnostico' })}
                    noValidate
                    className="bg-white/5 rounded-3xl p-5 sm:p-7 border border-white/10 space-y-4"
                  >
                    <input type="text" tabIndex={-1} aria-hidden="true" className="absolute opacity-0 h-0 w-0 pointer-events-none" {...register('honeypot')} />

                    {/* Name */}
                    <div>
                      <label htmlFor="diag-name" className="block text-white/80 text-xs font-semibold mb-1.5">{tForm('name')} *</label>
                      <input
                        id="diag-name"
                        type="text"
                        autoComplete="name"
                        placeholder={tForm('namePlaceholder')}
                        {...register('name')}
                        className={`w-full bg-white/10 border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${formErrors.name ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'}`}
                      />
                      {formErrors.name && <p role="alert" className="text-red-400 text-xs mt-1">{formErrors.name.message}</p>}
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="diag-email" className="block text-white/80 text-xs font-semibold mb-1.5">{tForm('email')} *</label>
                        <input
                          id="diag-email"
                          type="email"
                          autoComplete="email"
                          placeholder={tForm('emailPlaceholder')}
                          {...register('email')}
                          className={`w-full bg-white/10 border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${formErrors.email ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'}`}
                        />
                        {formErrors.email && <p role="alert" className="text-red-400 text-xs mt-1">{formErrors.email.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="diag-phone" className="block text-white/80 text-xs font-semibold mb-1.5">{tForm('phone')} *</label>
                        <input
                          id="diag-phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder={tForm('phonePlaceholder')}
                          {...register('phone')}
                          className={`w-full bg-white/10 border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${formErrors.phone ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'}`}
                        />
                        {formErrors.phone && <p role="alert" className="text-red-400 text-xs mt-1">{formErrors.phone.message}</p>}
                      </div>
                    </div>

                    {/* Business type */}
                    <div>
                      <label htmlFor="diag-business" className="block text-white/80 text-xs font-semibold mb-1.5">{tForm('businessType')} *</label>
                      <input
                        id="diag-business"
                        type="text"
                        placeholder={tForm('businessTypePlaceholder')}
                        {...register('business_type')}
                        className={`w-full bg-white/10 border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${formErrors.business_type ? 'border-red-400' : 'border-white/20 focus:border-brand-yellow'}`}
                      />
                      {formErrors.business_type && <p role="alert" className="text-red-400 text-xs mt-1">{formErrors.business_type.message}</p>}
                    </div>

                    {/* GDPR */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('gdpr_consent')}
                          className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/10 text-brand-yellow focus:ring-brand-yellow"
                        />
                        <span className="text-white/60 text-xs">
                          {tForm('gdpr')}{' '}
                          <Link href={`/${locale}/privacy-policy`} className="underline text-brand-yellow hover:text-brand-yellow/80">
                            {tForm('gdprLink')}
                          </Link>
                        </span>
                      </label>
                      {formErrors.gdpr_consent && <p role="alert" className="text-red-400 text-xs mt-1 ml-7">{formErrors.gdpr_consent.message}</p>}
                    </div>

                    {serverError && <p role="alert" className="text-red-400 text-sm text-center">{serverError}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-yellow text-brand-dark font-bold text-sm py-3.5 rounded-2xl hover:brightness-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
