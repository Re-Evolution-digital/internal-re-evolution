'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// ── Screen contents ────────────────────────────────────────────────────────
// Three dramatic screens showing automation in action.

function TelegramScreen() {
  return (
    <div className="flex flex-col h-full bg-[#1c2733] text-white">
      {/* Telegram header */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-[#17212b] border-b border-white/10 shrink-0">
        <div className="w-7 h-7 rounded-full bg-[#2b9cff] flex items-center justify-center text-[10px] font-bold shrink-0">R</div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold leading-none text-white truncate">Reevo Bot</p>
          <p className="text-[8px] text-white/40 mt-0.5">online</p>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 px-2 py-2 space-y-1.5 overflow-hidden">
        {/* Bot message */}
        <div className="flex justify-start">
          <div className="bg-[#182533] rounded-lg rounded-tl-none px-2.5 py-1.5 max-w-[85%]">
            <p className="text-[9px] text-white/90 leading-relaxed">🤖 <span className="font-semibold">Nova marcação!</span></p>
            <p className="text-[9px] text-white/70 mt-0.5">📅 Sex, 14 Mar · 14:30</p>
            <p className="text-[9px] text-white/70">👤 João Silva</p>
            <p className="text-[9px] text-white/70">📍 Lisboa</p>
            <p className="text-[8px] text-white/40 mt-1 text-right">14:32 ✓✓</p>
          </div>
        </div>
        {/* Automated reply */}
        <div className="flex justify-end">
          <div className="bg-[#2b5278] rounded-lg rounded-tr-none px-2.5 py-1.5 max-w-[80%]">
            <p className="text-[9px] text-white/90 leading-relaxed">✅ Confirmado automaticamente</p>
            <p className="text-[8px] text-white/50 mt-1 text-right">14:32 ✓✓</p>
          </div>
        </div>
        {/* Another notification */}
        <div className="flex justify-start">
          <div className="bg-[#182533] rounded-lg rounded-tl-none px-2.5 py-1.5 max-w-[85%]">
            <p className="text-[9px] text-white/90">📊 Hoje: <span className="font-bold text-[#2b9cff]">8 marcações</span></p>
            <p className="text-[9px] text-white/70">↑ +3 face à semana passada</p>
            <p className="text-[8px] text-white/40 mt-1 text-right">14:33 ✓✓</p>
          </div>
        </div>
      </div>
      {/* Input bar */}
      <div className="px-2 py-2 bg-[#17212b] flex items-center gap-1.5 shrink-0">
        <div className="flex-1 bg-[#242f3d] rounded-full px-2.5 py-1">
          <p className="text-[8px] text-white/30">Mensagem...</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-[#2b9cff] flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </div>
      </div>
    </div>
  )
}

function ChatbotScreen() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#011b54] shrink-0">
        <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-[9px] font-bold text-[#011b54] shrink-0">R</div>
        <div>
          <p className="text-[10px] font-bold text-white leading-none">Reevo</p>
          <p className="text-[8px] text-white/50">● online agora</p>
        </div>
      </div>
      {/* Chat */}
      <div className="flex-1 px-2 py-2 space-y-1.5 overflow-hidden bg-gray-50">
        <div className="flex justify-start">
          <div className="bg-white rounded-xl rounded-tl-none shadow-sm px-2.5 py-1.5 max-w-[82%] border border-gray-100">
            <p className="text-[9px] text-gray-700 leading-relaxed">Olá! 👋 Sou o Reevo. Como posso ajudar?</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-[#011b54] rounded-xl rounded-tr-none px-2.5 py-1.5 max-w-[80%]">
            <p className="text-[9px] text-white leading-relaxed">Qual é o preço do plano Essencial?</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-white rounded-xl rounded-tl-none shadow-sm px-2.5 py-1.5 max-w-[82%] border border-gray-100">
            <p className="text-[9px] text-gray-700 leading-relaxed">O plano Essencial começa em <span className="font-bold text-[#011b54]">€497/mês</span> e inclui site, automações e chatbot 🚀</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-[#011b54] rounded-xl rounded-tr-none px-2.5 py-1.5 max-w-[80%]">
            <p className="text-[9px] text-white">Quero saber mais!</p>
          </div>
        </div>
        {/* Typing indicator */}
        <div className="flex justify-start">
          <div className="bg-white rounded-xl rounded-tl-none shadow-sm px-3 py-2 border border-gray-100">
            <div className="flex gap-0.5 items-center">
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, delay: i * 0.15, repeat: Infinity }}
                  className="w-1 h-1 rounded-full bg-gray-400" />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Input */}
      <div className="px-2 py-1.5 border-t border-gray-100 bg-white flex gap-1.5 items-center shrink-0">
        <div className="flex-1 bg-gray-100 rounded-full px-2.5 py-1">
          <p className="text-[8px] text-gray-400">Escreva aqui...</p>
        </div>
        <div className="w-5 h-5 rounded-full bg-[#ffc700] flex items-center justify-center shrink-0">
          <svg className="w-2.5 h-2.5 text-[#011b54]" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </div>
      </div>
    </div>
  )
}

function WhatsAppScreen() {
  return (
    <div className="flex flex-col h-full bg-[#e5ddd5]">
      {/* WhatsApp header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#075e54] shrink-0">
        <div className="w-7 h-7 rounded-full bg-[#25d366] flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.563 4.14 1.534 5.879L0 24l6.29-1.525A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.044-1.394l-.361-.215-3.735.905.947-3.64-.236-.374A9.818 9.818 0 1112 21.818z"/></svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-white leading-none">Re-Evolution</p>
          <p className="text-[8px] text-white/70 mt-0.5">Conta Business Verificada ✓</p>
        </div>
        <div className="flex gap-2 text-white/80">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-2 py-2 space-y-1.5 overflow-hidden">
        {/* Date stamp */}
        <div className="flex justify-center">
          <span className="bg-white/70 text-gray-500 text-[7px] px-2 py-0.5 rounded-full">HOJE</span>
        </div>
        {/* Incoming — automation message */}
        <div className="flex justify-start">
          <div className="bg-white rounded-lg rounded-tl-none shadow-sm px-2.5 py-1.5 max-w-[88%]">
            <p className="text-[9px] text-gray-800 leading-relaxed">✅ <span className="font-semibold">Marcação confirmada!</span></p>
            <p className="text-[9px] text-gray-700 mt-0.5">📅 Sexta-feira, 14 Mar</p>
            <p className="text-[9px] text-gray-700">🕑 14:30 — 15:00</p>
            <p className="text-[9px] text-gray-700">📍 Rua Augusta, 45 · Lisboa</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <p className="text-[7px] text-gray-400">14:32</p>
            </div>
          </div>
        </div>
        {/* Outgoing reply */}
        <div className="flex justify-end">
          <div className="bg-[#dcf8c6] rounded-lg rounded-tr-none shadow-sm px-2.5 py-1.5 max-w-[80%]">
            <p className="text-[9px] text-gray-800">Obrigado! 👍</p>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <p className="text-[7px] text-gray-500">14:33</p>
              <svg className="w-2.5 h-2.5 text-[#53bdeb]" viewBox="0 0 16 11" fill="currentColor"><path d="M11.071.653a.75.75 0 00-1.036 1.086l1.036-1.086zM5.5 7.25L4.964 7.82a.75.75 0 001.072 0L5.5 7.25zm-4.036-2.68a.75.75 0 00-1.072 1.055l1.072-1.055zM10.035 1.74l-5.07 5.51-1.037-1.086 5.071-5.51 1.036 1.086zM6.036 7.82l-4.572-4.25 1.072-1.055 4.572 4.25-1.072 1.055z"/><path d="M15.036 1.74l-5.07 5.51-1.037-1.086 5.071-5.51 1.036 1.086z"/></svg>
            </div>
          </div>
        </div>
        {/* Follow-up automation */}
        <div className="flex justify-start">
          <div className="bg-white rounded-lg rounded-tl-none shadow-sm px-2.5 py-1.5 max-w-[88%]">
            <p className="text-[9px] text-gray-800 leading-relaxed">Lembrete enviado 24h antes 🔔</p>
            <p className="text-[8px] text-[#25d366] font-semibold mt-0.5">Automação ativa</p>
            <p className="text-[7px] text-gray-400 text-right mt-0.5">14:33</p>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="px-2 py-1.5 bg-[#f0f0f0] flex items-center gap-1.5 shrink-0">
        <div className="flex-1 bg-white rounded-full px-2.5 py-1 flex items-center gap-1">
          <svg className="w-2.5 h-2.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p className="text-[8px] text-gray-400">Mensagem</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-[#25d366] flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </div>
      </div>
    </div>
  )
}

// ── Deck positions ─────────────────────────────────────────────────────────
const POSITIONS = [
  // front
  { x: 0, rotate: 0, scale: 1, zIndex: 20, opacity: 1, y: 0 },
  // back-right
  { x: 22, rotate: 7, scale: 0.88, zIndex: 10, opacity: 0.80, y: 6 },
  // back-left
  { x: -22, rotate: -7, scale: 0.88, zIndex: 10, opacity: 0.80, y: 6 },
]

const SCREENS = [TelegramScreen, ChatbotScreen, WhatsAppScreen]
const LABELS  = ['Telegram Bot', 'Reevo Chat', 'WhatsApp Business']

// ── Phone frame wrapper ────────────────────────────────────────────────────
function PhoneFrame({ Screen, label, posIndex, onClick }: {
  Screen: () => React.ReactElement
  label: string
  posIndex: number
  onClick: () => void
}) {
  const pos = POSITIONS[posIndex]
  return (
    <motion.div
      animate={{ x: pos.x, rotate: pos.rotate, scale: pos.scale, opacity: pos.opacity, y: pos.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      style={{ zIndex: pos.zIndex }}
      onClick={posIndex !== 0 ? onClick : undefined}
      className="absolute inset-0 cursor-pointer origin-bottom"
    >
      {/* Phone chrome */}
      <div className="relative w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] rounded-[1.8rem] p-2 shadow-2xl border border-white/10">
        {/* Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-[#0d0d1a] rounded-full z-10"/>
        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[1.4rem] overflow-hidden">
          <Screen />
        </div>
      </div>
      {/* Label under phone (only on front card) */}
      {posIndex === 0 && (
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-brand-dark/10 rounded-full px-3 py-0.5">
          <p className="text-[11px] text-brand-dark font-semibold">{label}</p>
        </div>
      )}
    </motion.div>
  )
}

// ── Main deck component ────────────────────────────────────────────────────
export function HeroPhoneDeck() {
  const [active, setActive] = useState(0)

  // Auto-advance every 3.5 s
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % 3), 3500)
    return () => clearInterval(id)
  }, [])

  // Which position (0=front, 1=back-right, 2=back-left) each phone slot occupies
  const positionOf = (slot: number) => ((slot - active) % 3 + 3) % 3

  return (
    <div className="relative w-44 xl:w-48 pb-8" style={{ height: 340 }}>
      {SCREENS.map((Screen, slot) => (
        <PhoneFrame
          key={slot}
          Screen={Screen}
          label={LABELS[slot]}
          posIndex={positionOf(slot)}
          onClick={() => setActive(slot)}
        />
      ))}
      {/* Dot indicators */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SCREENS.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? 'bg-brand-dark scale-125' : 'bg-brand-dark/30'}`}
            aria-label={LABELS[i]}
          />
        ))}
      </div>
    </div>
  )
}
