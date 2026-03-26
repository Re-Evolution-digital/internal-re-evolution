'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { trackEvent, GA_EVENTS } from '@/lib/analytics'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const t = useTranslations('chat')
  const tA11y = useTranslations('accessibility')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [closed, setClosed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const leadNotifiedRef = useRef(false)

  // Keyboard visibility
  useEffect(() => {
    if (!window.visualViewport) return
    const vp = window.visualViewport
    const handleResize = () => {
      setHidden(vp.height < window.innerHeight * 0.75)
    }
    vp.addEventListener('resize', handleResize)
    return () => vp.removeEventListener('resize', handleResize)
  }, [])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input on open e após cada resposta (quando loading passa a false)
  useEffect(() => {
    if (open && !loading) inputRef.current?.focus()
  }, [open, loading])

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [input])

  function toggleOpen() {
    if (!open) {
      trackEvent(GA_EVENTS.CHATBOT_OPEN)
      const welcome: Message = { role: 'assistant', content: t('welcome') }
      setMessages([welcome])
    }
    setOpen((v) => !v)
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, leadNotified: leadNotifiedRef.current }),
      })
      const data = await res.json() as { message?: string; leadReady?: boolean; goodbye?: boolean }

      if (data.message) {
        const updated: Message[] = [...newMessages, { role: 'assistant', content: data.message }]
        setMessages(updated)

        if (data.leadReady && !leadNotifiedRef.current) {
          leadNotifiedRef.current = true
          trackEvent(GA_EVENTS.CHATBOT_LEAD_READY)
        }

        // goodbye: não fechar o widget — o cliente pode querer continuar
      }
    } catch {
      const errMsg: Message = { role: 'assistant', content: t('error') }
      setMessages((m) => [...m, errMsg])
    } finally {
      setLoading(false)
    }
  }

  if (hidden || closed) return null

  return (
    <>
      {/* Floating button — direita, acima do WhatsApp */}
      <div className="fixed bottom-28 right-6 z-50">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex flex-col items-end"
            >
              {/* Greeting bubble — acima do icon, aresta reta a meio do icon */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-2 mr-8 bg-white text-brand-dark text-sm font-semibold px-4 py-2.5 rounded-2xl rounded-br-none shadow-lg max-w-[140px] sm:max-w-[180px] leading-snug border border-gray-100"
              >
                {t('greeting')}<br />
                <span className="font-normal text-gray-600 text-xs">{t('greetingSub')}</span>
              </motion.div>

              {/* GIF button */}
              <button
                onClick={toggleOpen}
                aria-label={tA11y('openChat')}
                className="relative w-16 h-16 md:w-18 md:h-18 rounded-full shadow-xl hover:scale-110 transition-transform shrink-0 overflow-hidden border-2 border-brand-yellow bg-white"
              >
                <span className="absolute inset-0 rounded-full bg-brand-yellow/30 animate-ping" aria-hidden="true" />
                <Image
                  src="/images/icons/chatbot-robot-gif.gif"
                  alt="Evo — Assistente Re-Evolution"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute bottom-0 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              style={{ height: '480px' }}
              role="dialog"
              aria-label={t('title')}
            >
              {/* Header */}
              <div className="bg-brand-dark px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center border border-white/20 shrink-0 overflow-hidden">
                    <Image src="/images/logo/logo.svg" alt="Reevo" width={22} height={22} className="object-contain" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t('title')}</p>
                    <p className="text-white/50 text-xs">{t('status')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={tA11y('closeChat')}
                  className="text-white/60 hover:text-white transition-colors p-1 rounded"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-brand-dark text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage() }}
                className="p-3 border-t border-gray-100 flex gap-2 items-end shrink-0"
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder={t('placeholder')}
                  disabled={loading}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent resize-none overflow-y-auto leading-relaxed"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label={t('send')}
                  className="w-10 h-10 bg-brand-yellow text-brand-dark rounded-xl flex items-center justify-center disabled:opacity-40 hover:brightness-105 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
