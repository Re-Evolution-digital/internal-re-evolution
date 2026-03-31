'use client'

import { motion } from 'framer-motion'
import { GalaxyBackground } from '@/components/ui/GalaxyBackground'

interface BlogHeroProps {
  headline1: string
  headline2: string
  subtitle: string
  tags: string[]
  locale: string
}

// ── Card label translations ───────────────────────────────────────────────────

const CARD_LABELS: Record<string, {
  searches: string; clicks: string; directions: string
  visits: string; lastMonth: string
  automation: string; form: string; opsMonth: string
}> = {
  pt: { searches: 'Pesquisas', clicks: 'Cliques', directions: 'Direções', visits: 'Visitas', lastMonth: 'último mês', automation: 'Automação ativa', form: 'Formulário', opsMonth: 'op/mês ativas' },
  en: { searches: 'Searches', clicks: 'Clicks', directions: 'Directions', visits: 'Visits', lastMonth: 'last month', automation: 'Active automation', form: 'Form', opsMonth: 'ops/month active' },
  es: { searches: 'Búsquedas', clicks: 'Clics', directions: 'Rutas', visits: 'Visitas', lastMonth: 'último mes', automation: 'Automatización activa', form: 'Formulario', opsMonth: 'op/mes activas' },
}

// ── Floating card mockups ────────────────────────────────────────────────────

function GbpCard({ l }: { l: typeof CARD_LABELS['pt'] }) {
  return (
    <div className="w-52 rounded-xl border border-brand-yellow/30 bg-[#010e30]/80 p-4 backdrop-blur-sm shadow-[0_0_24px_rgba(255,199,0,0.06)]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1l1.5 3 3 .5-2.25 2 .75 3L6 8l-3 1.5.75-3L1.5 4.5l3-.5z" fill="#ffc700" opacity="0.9"/>
          </svg>
        </div>
        <div className="h-2 w-24 bg-white/20 rounded-full" />
      </div>
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="#ffc700" opacity="0.9">
            <path d="M5 1l1.2 2.6 2.8.4-2 1.9.5 2.8L5 7.4l-2.5 1.3.5-2.8-2-1.9 2.8-.4z"/>
          </svg>
        ))}
        <span className="text-[10px] text-white/50 ml-1">4.9</span>
      </div>
      {/* Metric bars */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="h-1.5 rounded-full bg-brand-yellow/60" style={{ width: '72%' }} />
          <span className="text-[9px] text-white/40">{l.searches}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 rounded-full bg-white/25" style={{ width: '48%' }} />
          <span className="text-[9px] text-white/40">{l.clicks}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 rounded-full bg-brand-yellow/30" style={{ width: '85%' }} />
          <span className="text-[9px] text-white/40">{l.directions}</span>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ l }: { l: typeof CARD_LABELS['pt'] }) {
  return (
    <div className="w-44 rounded-xl border border-white/10 bg-[#010e30]/70 p-4 backdrop-blur-sm shadow-[0_0_24px_rgba(255,199,0,0.04)]">
      <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">{l.visits}</p>
      <p className="text-2xl font-bold text-brand-yellow leading-none mb-3">+247%</p>
      {/* Mini bar chart */}
      <div className="flex items-end gap-1 h-10">
        {[30, 45, 35, 60, 50, 75, 65, 90, 80, 100].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background: i >= 7 ? '#ffc700' : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
      <p className="text-[9px] text-white/30 mt-2">{l.lastMonth}</p>
    </div>
  )
}

function AutomationCard({ l }: { l: typeof CARD_LABELS['pt'] }) {
  const steps = [l.form, 'CRM', 'WhatsApp']
  return (
    <div className="w-52 rounded-xl border border-brand-yellow/20 bg-[#010e30]/75 p-4 backdrop-blur-sm shadow-[0_0_24px_rgba(255,199,0,0.05)]">
      <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">{l.automation}</p>
      <div className="flex items-center gap-1">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center gap-1 w-full">
              <div className="w-7 h-7 rounded-lg border border-brand-yellow/40 bg-brand-yellow/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-brand-yellow/70" />
              </div>
              <span className="text-[8px] text-white/40 text-center leading-tight">{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-4 h-px bg-brand-yellow/30 shrink-0 mb-3" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[9px] text-white/40">2.500 {l.opsMonth}</span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BlogHero({ headline1, headline2, subtitle, tags, locale }: BlogHeroProps) {
  const l = CARD_LABELS[locale] ?? CARD_LABELS['pt']
  return (
    <section
      className="relative w-full overflow-hidden bg-brand-dark"
      style={{ minHeight: 320, height: 'clamp(320px, 37.5vw, 600px)' }}
      aria-label="Blog hero"
    >
      {/* ── Stars (canvas — same as Hero / Header) ── */}
      <GalaxyBackground zoneRatio={1} starCount={180} />

      {/* ── Yellow grid overlay ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(rgba(255,199,0,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,199,0,0.14) 1px, transparent 1px)`,
          backgroundSize: '52px 52px',
        }}
      />

      {/* ── Decorative circles (top-right) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 w-[480px] h-[480px] rounded-full border border-brand-yellow/12"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 w-[280px] h-[280px] rounded-full border border-brand-yellow/08"
      />

      {/* ── Main content ──
           pt-20 empurra o conteúdo para baixo do header fixo (~72 px)
           e re-centra verticalmente no espaço visível restante.
      ── */}
      <div className="relative z-10 flex h-full items-center pt-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* Left: accent bar + text */}
        <div className="flex gap-5 items-stretch flex-1 min-w-0">
          {/* Vertical golden bar */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-1 rounded-full bg-brand-yellow shrink-0"
            style={{ transformOrigin: 'top' }}
          />

          <div className="flex flex-col justify-center py-6">
            {/* Eyebrow */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs font-semibold tracking-[0.2em] text-brand-yellow/60 uppercase mb-3"
            >
              Re-Evolution · Blog
            </motion.span>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="font-bold leading-[1.1] mb-1"
            >
              <span className="block text-white text-4xl sm:text-5xl lg:text-[3.5rem]">
                {headline1}
              </span>
              <span className="block text-brand-yellow text-3xl sm:text-4xl lg:text-[3rem]">
                {headline2}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4 max-w-sm text-sm sm:text-base text-[#8da4c8] leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium text-white/80 rounded-full border border-white/10"
                  style={{ background: 'rgba(1, 14, 48, 0.75)' }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right: floating card mockups — hidden below lg
            Posições calibradas para compensar o header fixo (~72 px):
            – GBP card:   top 108 px  (header + 36 px de margem)
            – Stats card: top 230 px  (abaixo do GBP)
            – Automation: bottom 36 px (bom, não mexer)
        ── */}
        <div
          className="relative shrink-0 hidden lg:block"
          style={{ width: 340, height: '100%' }}
          aria-hidden="true"
        >
          {/* Card 1 — GBP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            style={{ position: 'absolute', top: 108, right: 60, rotate: -3 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
            >
              <GbpCard l={l} />
            </motion.div>
          </motion.div>

          {/* Card 2 — Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
            style={{ position: 'absolute', top: 230, right: 8, rotate: 2 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
            >
              <StatsCard l={l} />
            </motion.div>
          </motion.div>

          {/* Card 3 — Automation (posição boa, não mexer) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
            style={{ position: 'absolute', bottom: 36, right: 40, rotate: -1.5 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
            >
              <AutomationCard l={l} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
