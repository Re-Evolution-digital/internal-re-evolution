'use client'

import { useState, useRef, useEffect, Fragment } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

const flowKeys = ['restaurant', 'lawyer', 'clinic', 'realestate'] as const
type FlowKey = typeof flowKeys[number]

type FNode = { icon: string; label: string; sub?: string }
type FStep =
  | { t: 'node'; node: FNode }
  | { t: 'fork'; branches: FNode[][] }

const FLOWS: Record<FlowKey, { color: string; steps: FStep[]; milestones: string[]; journeyStart: string; journeyEnd: string }> = {
  restaurant: {
    color: '#25d366',
    milestones: ['Reserva recebida', 'Equipa notificada', 'Cliente confirmado'],
    journeyStart: 'Primeira reserva',
    journeyEnd: 'Mesa garantida',
    steps: [
      { t: 'node', node: { icon: '📱', label: 'Reserva online' } },
      {
        t: 'fork', branches: [
          [
            { icon: '💬', label: 'Notificação WhatsApp/Telegram' },
            { icon: '✅', label: 'Confirmação ao cliente' },
          ],
          [
            { icon: '📊', label: 'Dados no Google Sheets' },
          ],
        ],
      },
    ],
  },
  lawyer: {
    color: '#4f46e5',
    milestones: ['Pedido recebido', 'Lead qualificado', 'Consulta agendada', 'Lembrete enviado'],
    journeyStart: 'Primeiro contacto',
    journeyEnd: 'Caso em mãos',
    steps: [
      { t: 'node', node: { icon: '💻', label: 'Pedido de consulta' } },
      { t: 'node', node: { icon: '🤖', label: 'Qualificação automática' } },
      {
        t: 'fork', branches: [
          [
            { icon: '📅', label: 'Agendamento por email' },
            { icon: '🔔', label: 'Lembrete 24h antes' },
          ],
          [
            { icon: '📁', label: 'Registo no CRM' },
          ],
        ],
      },
    ],
  },
  clinic: {
    color: '#0ea5e9',
    milestones: ['Marcação feita', 'Paciente confirmado', 'Lembrete enviado'],
    journeyStart: 'Novo paciente',
    journeyEnd: 'Consulta garantida',
    steps: [
      { t: 'node', node: { icon: '📋', label: 'Marcação online' } },
      {
        t: 'fork', branches: [
          [
            { icon: '✅', label: 'Confirmação SMS/WhatsApp' },
            { icon: '🔔', label: 'Lembrete dia anterior' },
          ],
          [
            { icon: '📊', label: 'Registo no sistema' },
          ],
        ],
      },
    ],
  },
  realestate: {
    color: '#f59e0b',
    milestones: ['Lead captada', 'Lead qualificada', 'Consultor alertado', 'Follow-up activo'],
    journeyStart: 'Visita ao site',
    journeyEnd: 'Negócio fechado',
    steps: [
      { t: 'node', node: { icon: '🌐', label: 'Lead entra pelo site' } },
      { t: 'node', node: { icon: '🤖', label: 'Qualificação pelo ChatBot' } },
      {
        t: 'fork', branches: [
          [
            { icon: '📱', label: 'Telegram do consultor' },
            { icon: '👤', label: 'Follow-up do consultor' },
          ],
          [
            { icon: '📊', label: 'Google Contacts / CRM' },
            { icon: '🔄', label: 'Follow-up automático', sub: 'se não converteu · 2 meses' },
          ],
        ],
      },
    ],
  },
}

function getLocale(path: string) { return path.split('/')[1] ?? 'pt' }

// ─── Helper: reorganise steps into flat columns ────────────────────────────────

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

// ─── Flow node (vertical layout — icon on top, label below) ──────────────────

function FlowNode({ node, color, delay }: { node: FNode; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 border shrink-0 w-24 text-center"
      style={{ borderColor: `${color}50`, backgroundColor: `${color}10` }}
    >
      <span className="text-lg leading-none">{node.icon}</span>
      <p className="text-[11px] font-semibold text-gray-800 leading-tight">{node.label}</p>
      {node.sub && <p className="text-[10px] text-gray-400 leading-tight">{node.sub}</p>}
    </motion.div>
  )
}

// ─── Horizontal arrow ─────────────────────────────────────────────────────────

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

// ─── Journey cursor (opções 2 + 4 + 5 combinadas) ────────────────────────────

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
            duration: 0.75,
            repeat: Infinity,
            delay: i * 0.075,
            ease: 'easeInOut',
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

// ─── Connector width shared between flow columns and cursor track ────────────
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

    const STEP_MS = 1400     // tempo entre marcos
    const END_PAUSE_MS = 2000 // pausa no último marco

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
      {/* Label row — flat: flex-1 per column, w-10 per gap (mirrors flow exactly) */}
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

      {/* Milestone + wave track — flat: flex-1 per dot, w-10 per wave (mirrors flow exactly) */}
      <div className="flex items-center">
        {stages.map((_, i) => {
          const segState: 'future' | 'active' | 'past' =
            i >= n - 1 ? 'past'
              : stageIndex > i ? 'past'
                : stageIndex === i ? 'active'
                  : 'future'
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

      {/* Journey labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[11px] font-semibold" style={{ color }}>{journeyStart}</span>
        <span className="text-[11px] font-semibold" style={{ color }}>{journeyEnd}</span>
      </div>
    </div>
  )
}

// ─── Flow renderer — colunas de largura igual, ocupa toda a área ─────────────

function FlowRenderer({ steps, color, milestones, journeyStart, journeyEnd }: {
  steps: FStep[]; color: string; milestones: string[]; journeyStart: string; journeyEnd: string
}) {
  const cols = getFlowColumns(steps)
  const n = cols.length

  let delay = 0

  return (
    <div>
      {/* Full-width flow — flat: flex-1 per column, w-10 per connector (mirrors cursor) */}
      <div className="flex items-stretch w-full">
        {cols.map((col, ci) => {
          const d = delay; delay += col.type === 'seq' ? 0.15 : 0.12
          const hasConnector = ci < n - 1
          const nextIsFork = hasConnector && cols[ci + 1].type === 'fork'
          const useSeparator = col.type === 'seq' && nextIsFork

          return (
            <Fragment key={ci}>
              {/* Column content — flex-1 so it lines up with the milestone dot below */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {col.type === 'seq' ? (
                  <FlowNode node={col.node} color={color} delay={d} />
                ) : (
                  <div className="flex flex-col gap-3 items-center">
                    {col.nodes.map((node, bi) =>
                      node
                        ? <FlowNode key={bi} node={node} color={color} delay={d + bi * 0.08} />
                        : <div key={bi} className="h-[72px] w-24" />
                    )}
                  </div>
                )}
              </div>

              {/* Connector — same w-10 as wave segments below */}
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

      {/* Journey cursor — mesma estrutura de colunas para alinhamento perfeito */}
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
  const [active, setActive] = useState<FlowKey>('restaurant')

  const tabs = t.raw('tabs') as string[]
  const flow = FLOWS[active]

  return (
    <section id="automacoes" className="relative py-20 bg-gray-50" data-section="automations" aria-labelledby="auto-title">
      <div className="absolute top-0 left-0 right-0 z-10" aria-hidden="true">
        <div
          className="bg-brand-yellow pl-24 pr-24 py-3 flex items-center justify-end gap-3"
          style={{ clipPath: 'polygon(80px 0, 100% 0, calc(100% - 80px) 100%, 0 100%)' }}
        >
          <span className="text-brand-dark font-bold text-sm tracking-widest uppercase">{t('yellowStripe')}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-dark/40 shrink-0" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
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
        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist">
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
        <div id={`panel-${active}`} role="tabpanel"
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FlowRenderer
                steps={flow.steps}
                color={flow.color}
                milestones={flow.milestones}
                journeyStart={flow.journeyStart}
                journeyEnd={flow.journeyEnd}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <a
            href={`/${locale}/#diagnostico`}
            onClick={() => trackEvent(GA_EVENTS.CTA_CLICK, { cta_name: 'automations_cta', section: 'automations', language: locale })}
            className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark font-bold px-8 py-4 rounded-2xl hover:brightness-105 active:scale-95 transition-all shadow-md"
          >
            {t('cta')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
