/**
 * Telegram — helper para envio de notificações de leads.
 * Usa parse_mode Markdown (legado, compatível com todos os bots).
 * Chamadas são non-blocking: erros são silenciados (notificação é não-crítica).
 */

export async function sendTelegram(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId || token === 'placeholder') return

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
  }).catch(() => { /* non-critical */ })
}

// ─── Formatadores por fonte ──────────────────────────────────────────────────

export function telegramChatbotLead(data: {
  name: string
  contact: string
  language: string
  business_type: string
  main_need: string
  urgency: string
  budget: string
  decision_maker: string
  interest: string
  timestamp: string
}): string {
  return [
    '🤖 *Novo Lead — Chatbot Reevo*',
    '─────────────────────',
    `👤 *Nome:* ${data.name}`,
    `📞 *Contacto:* ${data.contact}`,
    `🌐 *Idioma do cliente:* ${data.language.toUpperCase()}`,
    `🏢 *Negócio:* ${data.business_type}`,
    `⚡ *Necessidade:* ${data.main_need}`,
    `⏱ *Urgência:* ${data.urgency}`,
    `💰 *Orçamento:* ${data.budget}`,
    `✅ *Decisor:* ${data.decision_maker}`,
    '',
    `📋 *Resumo:* ${data.interest}`,
    '─────────────────────',
    `📅 ${data.timestamp}`,
  ].join('\n')
}

export function telegramDiagnosticoLead(data: {
  name: string
  email: string
  phone: string
  language: string
  business_type: string
  main_problem: string
  timestamp: string
}): string {
  return [
    '📋 *Novo Diagnóstico — Formulário*',
    '─────────────────────',
    `👤 *Nome:* ${data.name}`,
    `📧 *Email:* ${data.email}`,
    `📞 *Telefone:* ${data.phone}`,
    `🌐 *Idioma do cliente:* ${data.language.toUpperCase()}`,
    `🏢 *Negócio:* ${data.business_type}`,
    `💬 *Problema:* ${data.main_problem}`,
    '─────────────────────',
    `📅 ${data.timestamp}`,
    `🌐 Fonte: formulário-site`,
  ].join('\n')
}
