'use client'

import { useState, useRef, useEffect, Fragment } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'
import { anchorClick } from '@/lib/scroll'

const flowKeys = ['chatbot', 'scheduling', 'crm', 'reviews'] as const
type FlowKey = typeof flowKeys[number]

type FNode = { icon: string; label: string; sub?: string }
type FStep =
  | { t: 'node'; node: FNode }
  | { t: 'fork'; branches: FNode[][] }

const FLOW_COLORS: Record<FlowKey, string> = {
  chatbot: '#4f46e5',
  scheduling: '#0ea5e9',
  crm: '#10b981',
  reviews: '#f59e0b',
}

type FlowT = { milestones: string[]; journeyStart: string; journeyEnd: string; steps: FStep[] }

function getLocale(path: string) { return path.split('/')[1] ?? 'pt' }

// ─── Column helper ─────────────────────────────────────────────────────────────

type FlowCol = { type: 'seq'; node: FNode } | { type: 'fork'; nodes: (FNode | null)[] }

function getFlowColumns(steps: FStep[]): FlowCol[] {
  const seqNodes = (steps.filter(s => s.t === 'node') as { t: 'node'; node: FNode }[]).map(s => s.node)
  const fork = steps.find(s => s.t === 'fork') as { t: 'fork'; branches: FNode[][] } | undefined
  const cols: FlowCol[] = seqNodes.map(node => ({ type: 'seq', node }))
  if (fork) {
    const maxLen = Math.max(...fork.branches.map(b => b.length))
    for (let ci = 0; ci < maxLen; ci++) {
      cols.push({ type: 'fork', nodes: fork.branches.map(b => b[ci] ?? null) })
    }
  }
  return cols
}

// ─── Flow node ────────────────────────────────────────────────────────────────

function FlowNode({ node, color, delay, wide }: { node: FNode; color: string; delay: number; wide?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`flex flex-col items-center gap-1.5 rounded-xl p-2.5 border shrink-0 text-center ${wide ? 'w-32' : 'w-24'}`}
      style={{ borderColor: `${color}50`, backgroundColor: `${color}10` }}
    >
      <span className="text-lg leading-none">{node.icon}</span>
      <p className="text-[11px] font-semibold text-gray-800 leading-tight break-words">{node.label}</p>
      {node.sub && <p className="text-[10px] text-gray-400 leading-tight break-words">{node.sub}</p>}
    </motion.div>
  )
}

// ─── Arrows ───────────────────────────────────────────────────────────────────

function RightArrow({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="flex items-center shrink-0 px-1"
      aria-hidden="true"
    >
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
        <line x1="0" y1="5" x2="13" y2="5" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
        <path d="M9 1.5L14.5 5L9 8.5" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  )
}

function DownArrow({ color }: { color: string }) {
  return (
    <div className="flex justify-center py-1.5" aria-hidden="true">
      <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
        <line x1="5" y1="0" x2="5" y2="11" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
        <path d="M1.5 8L5 13.5L8.5 8" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ─── Wave journey cursor ──────────────────────────────────────────────────────

function WaveSegment({ color, state }: { color: string; state: 'future' | 'active' | 'past' }) {
  return (
    <div className="flex-1 flex items-center justify-center gap-0.5 px-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full shrink-0"
          style={{ width: 3, height: 3, background: state === 'future' ? `${color}20` : color }}
          animate={state === 'active' ? {
            y: [0, -3.5, 0, 3.5, 0],
            opacity: [0.4, 1, 0.4, 1, 0.4],
          } : { opacity: state === 'past' ? 0.65 : 0.2 }}
          transition={state === 'active' ? {
            duration: 0.75, repeat: Infinity, delay: i * 0.075, ease: 'easeInOut',
          } : {}}
        />
      ))}
    </div>
  )
}

function MilestoneDot({ lit, color, pulse }: { lit: boolean; color: string; pulse: boolean }) {
  return (
    <motion.div
      className="w-3.5 h-3.5 rounded-full border-2 shrink-0"
      animate={pulse
        ? { background: color, borderColor: color, scale: [1, 1.45, 1], boxShadow: [`0 0 0 0 ${color}60`, `0 0 0 6px ${color}00`] }
        : { background: lit ? color : '#ffffff', borderColor: lit ? color : `${color}30`, scale: 1 }
      }
      transition={{ duration: 0.35 }}
    />
  )
}

const CONNECTOR_CLS = 'w-10 shrink-0'

function JourneyCursor({ color, stages, journeyStart, journeyEnd }: {
  color: string; stages: string[]; journeyStart: string; journeyEnd: string
}) {
  const n = stages.length
  const [stageIndex, setStageIndex] = useState(0)
  const [prevStage, setPrevStage] = useState(0)

  useEffect(() => {
    let step = 0
    setStageIndex(0)
    setPrevStage(0)
    const STEP_MS = 1400
    const END_PAUSE_MS = 2000
    let tid: ReturnType<typeof setTimeout>
    function advance() {
      const prev = step
      step = step < n - 1 ? step + 1 : 0
      setPrevStage(prev)
      setStageIndex(step)
      tid = setTimeout(advance, step === 0 ? STEP_MS : step === n - 1 ? END_PAUSE_MS : STEP_MS)
    }
    tid = setTimeout(advance, STEP_MS)
    return () => clearTimeout(tid)
  }, [color, n])

  return (
    <div className="mt-5 select-none">
      <div className="flex items-end h-10 mb-1">
        {stages.map((stage, i) => (
          <Fragment key={i}>
            <div className="flex-1 flex justify-center items-end">
              <AnimatePresence mode="wait">
                {stageIndex === i && (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.85 }}
                    transition={{ duration: 0.22 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap text-white shadow-md"
                      style={{ background: color }}
                    >
                      {stage}
                    </div>
                    <div className="w-0 h-0 mt-0.5"
                      style={{ borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `5px solid ${color}` }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {i < n - 1 && <div className={CONNECTOR_CLS} />}
          </Fragment>
        ))}
      </div>

      <div className="flex items-center">
        {stages.map((_, i) => {
          const segState: 'future' | 'active' | 'past' =
            i >= n - 1 ? 'past'
              : stageIndex > i ? 'past'
                : stageIndex === i ? 'active' : 'future'
          const isLit = stageIndex >= i
          const isPulse = stageIndex === i && prevStage < i
          return (
            <Fragment key={i}>
              <div className="flex-1 flex justify-center">
                <MilestoneDot lit={isLit} color={color} pulse={isPulse} />
              </div>
              {i < n - 1 && (
                <div className={CONNECTOR_CLS}>
                  <WaveSegment color={color} state={segState} />
                </div>
              )}
            </Fragment>
          )
        })}
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-[11px] font-semibold" style={{ color }}>{journeyStart}</span>
        <span className="text-[11px] font-semibold" style={{ color }}>{journeyEnd}</span>
      </div>
    </div>
  )
}

// ─── Desktop horizontal flow renderer ─────────────────────────────────────────

function FlowRenderer({ steps, color, milestones, journeyStart, journeyEnd }: {
  steps: FStep[]; color: string; milestones: string[]; journeyStart: string; journeyEnd: string
}) {
  const cols = getFlowColumns(steps)
  const n = cols.length
  let delay = 0

  return (
    <div>
      <div className="flex items-stretch w-full">
        {cols.map((col, ci) => {
          const d = delay; delay += col.type === 'seq' ? 0.15 : 0.12
          const hasConnector = ci < n - 1
          const nextIsFork = hasConnector && cols[ci + 1].type === 'fork'
          const useSeparator = col.type === 'seq' && nextIsFork

          // Count real nodes in this fork column
          const realNodes = col.type === 'fork' ? col.nodes.filter(Boolean) : []
          const isSingleNode = col.type === 'fork' && realNodes.length === 1

          return (
            <Fragment key={ci}>
              <div className="flex-1 flex flex-col items-center justify-center">
                {col.type === 'seq' ? (
                  <FlowNode node={col.node} color={color} delay={d} />
                ) : isSingleNode ? (
                  // Single real node — render centered, no placeholder
                  <FlowNode node={realNodes[0]!} color={color} delay={d} wide />
                ) : (
                  // Multiple nodes — stacked per branch
                  <div className="flex flex-col gap-3 items-center">
                    {col.nodes.map((node, bi) =>
                      node
                        ? <FlowNode key={bi} node={node} color={color} delay={d + bi * 0.08} wide />
                        : <div key={bi} className="h-[72px] w-32" />
                    )}
                  </div>
                )}
              </div>

              {hasConnector && (
                <div className={`${CONNECTOR_CLS} flex items-center justify-center`}>
                  {useSeparator ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: d + 0.1 }}
                      className="h-full w-px rounded-full"
                      style={{ background: `${color}30` }}
                      aria-hidden="true"
                    />
                  ) : (
                    <RightArrow color={color} delay={d + 0.1} />
                  )}
                </div>
              )}
            </Fragment>
          )
        })}
      </div>

      <JourneyCursor
        color={color}
        stages={milestones}
        journeyStart={journeyStart}
        journeyEnd={journeyEnd}
      />
    </div>
  )
}

// ─── Mobile vertical flow renderer ────────────────────────────────────────────

function FlowRendererMobile({ steps, color, milestones, journeyStart, journeyEnd }: {
  steps: FStep[]; color: string; milestones: string[]; journeyStart: string; journeyEnd: string
}) {
  return (
    <div>
      {steps.map((step, si) => {
        const isLast = si === steps.length - 1
        if (step.t === 'node') {
          return (
            <div key={si} className="flex flex-col items-center">
              <FlowNode node={step.node} color={color} delay={si * 0.1} />
              {!isLast && <DownArrow color={color} />}
            </div>
          )
        }
        // Fork — shown as 2-column grid, branches stack vertically within each column
        return (
          <div key={si}>
            <div className="grid grid-cols-2 gap-2 mt-0">
              {step.branches.map((branch, bi) => (
                <div key={bi} className="flex flex-col items-center gap-0">
                  {branch.map((node, ni) => (
                    <div key={ni} className="flex flex-col items-center">
                      <FlowNode node={node} color={color} delay={(si + ni + bi) * 0.08} />
                      {ni < branch.length - 1 && <DownArrow color={color} />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Milestone cursor — standalone horizontal bar below the vertical flow */}
      <JourneyCursor
        color={color}
        stages={milestones}
        journeyStart={journeyStart}
        journeyEnd={journeyEnd}
      />
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AutomationsDemo() {
  const t = useTranslations('automations')
  const pathname = usePathname()
  const locale = getLocale(pathname)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState<FlowKey>('chatbot')

  const tabs = t.raw('tabs') as string[]
  const businessExamples = t.raw('businessExamples') as string[]
  const automationsList = t.raw('automationsList') as string[]
  const flowsT = t.raw('flows') as Record<FlowKey, FlowT>
  const flow = { color: FLOW_COLORS[active], ...flowsT[active] }
  const activeIndex = flowKeys.indexOf(active)

  return (
    <section id="automacoes" className="relative bg-gray-50" data-section="automations" aria-labelledby="auto-title">
      <div className="relative z-10" aria-hidden="true">
        <div
          className="bg-brand-yellow pl-12 pr-12 sm:pl-24 sm:pr-24 py-1.5 sm:py-3 flex items-center justify-end gap-3 [clip-path:polygon(40px_0,100%_0,calc(100%_-_40px)_100%,0_100%)] sm:[clip-path:polygon(80px_0,100%_0,calc(100%_-_80px)_100%,0_100%)]"
        >
          <span className="text-brand-dark font-bold text-xs sm:text-sm tracking-wide sm:tracking-widest uppercase">{t('yellowStripe')}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-dark/40 shrink-0" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20" ref={ref}>
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
        <div className="flex flex-wrap justify-center gap-2 mb-6" role="tablist">
          {flowKeys.map((key, i) => (
            <button
              key={key}
              role="tab"
              aria-selected={active === key}
              aria-controls={`panel-${key}`}
              onClick={() => { setActive(key); trackEvent(GA_EVENTS.DEMO_TAB_CLICK, { business_type: key }) }}
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
          {/* Business example badge — left-aligned, colour-accented */}
          <div className="mb-5">
            <span
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border"
              style={{ borderColor: `${flow.color}35`, backgroundColor: `${flow.color}0d` }}
            >
              <span className="text-xs font-medium text-gray-400">{t('exampleLabel')}</span>
              <span className="text-base font-bold" style={{ color: flow.color }}>
                {businessExamples[activeIndex]}
              </span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Desktop: horizontal flow */}
              <div className="hidden md:block">
                <FlowRenderer
                  steps={flow.steps}
                  color={flow.color}
                  milestones={flow.milestones}
                  journeyStart={flow.journeyStart}
                  journeyEnd={flow.journeyEnd}
                />
              </div>

              {/* Mobile: vertical flow */}
              <div className="md:hidden">
                <FlowRendererMobile
                  steps={flow.steps}
                  color={flow.color}
                  milestones={flow.milestones}
                  journeyStart={flow.journeyStart}
                  journeyEnd={flow.journeyEnd}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* All automations list */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55 }}
          className="mt-7"
        >
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            {t('automationsListTitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {automationsList.map((item, i) => (
              <span
                key={i}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full font-medium"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 italic">{t('automationsListNote')}</p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <a
            href={`/${locale}/#diagnostico`}
            onClick={(e) => { anchorClick('diagnostico', e); trackEvent(GA_EVENTS.CTA_CLICK, { cta_name: 'automations_cta', section: 'automations', language: locale }) }}
            className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark font-bold px-8 py-4 rounded-2xl hover:brightness-105 active:scale-95 transition-all shadow-md"
          >
            {t('cta')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
