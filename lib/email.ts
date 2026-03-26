/**
 * Email — helper Resend + templates HTML para leads.
 *
 * Dois tipos de email por cada fonte:
 *   1. Cliente  — confirmação limpa, essencial, reconfortante
 *   2. Interno  — todos os dados de negócio para a equipa Re-Evolution
 *
 * Fontes suportadas: chatbot | diagnostico
 */

// ─── Logo embutido em Base64 (gerado em build-time, sem acesso ao fs em runtime)
// Cloudflare Workers não têm fs; o Base64 é injetado estaticamente via prebuild.
import { LOGO_DATA_URI } from './logo-b64.generated'

// ─── Envio via Resend ─────────────────────────────────────────────────────────

interface SendEmailParams {
  to: string
  subject: string
  html: string
  bcc?: string
}

export async function sendEmail({ to, subject, html, bcc }: SendEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@re-evolution.pt'
  if (!apiKey || apiKey === 'placeholder') return

  const body: Record<string, unknown> = { from, to, subject, html }
  if (bcc) body.bcc = bcc

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text().catch(() => res.status.toString())
    console.error(`[Resend] Erro ao enviar para ${to}: ${err}`)
  }
}

// ─── Utilitários ─────────────────────────────────────────────────────────────

/** Devolve true se o contacto parecer um email válido */
export function isEmail(contact: string): boolean {
  return contact.includes('@') && contact.includes('.')
}

function formatPTDate(date: Date): string {
  return date.toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })
}

// ─── Estrutura base do email (header + footer partilhados) ───────────────────

function emailWrapper(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(1,27,84,0.10);">

      <!-- Header -->
      <tr>
        <td style="background:#011b54;padding:32px 40px 28px;text-align:center;">
          <img src="${LOGO_DATA_URI}" alt="Re-Evolution" width="160" style="display:block;margin:0 auto;height:auto;"/>
        </td>
      </tr>

      <!-- Conteúdo dinâmico -->
      ${bodyContent}

      <!-- Divider -->
      <tr><td style="padding:0 40px;"><div style="height:1px;background:#e8edf5;"></div></td></tr>

      <!-- Assinatura -->
      <tr>
        <td style="padding:24px 40px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:middle;">
                <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#011b54;">Equipa Re-Evolution</p>
                <p style="margin:0 0 10px;font-size:12px;color:#6b7280;">Serviços Digitais</p>
                <p style="margin:0 0 3px;font-size:13px;color:#4a5568;">📧 <a href="mailto:geral@re-evolution.pt" style="color:#011b54;text-decoration:none;">geral@re-evolution.pt</a></p>
                <p style="margin:0 0 3px;font-size:13px;color:#4a5568;">📱 <a href="tel:+351969063633" style="color:#011b54;text-decoration:none;">+351 969 063 633</a></p>
                <p style="margin:0;font-size:13px;color:#4a5568;">📍 Carnaxide, Lisboa · Portugal</p>
              </td>
              <td style="vertical-align:middle;text-align:right;width:110px;">
                <img src="${LOGO_DATA_URI}" alt="Re-Evolution" width="90" style="display:block;margin-left:auto;opacity:0.65;"/>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#011b54;padding:18px 40px;text-align:center;">
          <p style="margin:0 0 10px;">
            <a href="https://linkedin.com/company/re-evolution-pt" style="color:#ffc700;text-decoration:none;font-size:12px;font-weight:600;margin:0 6px;">LinkedIn</a>
            <span style="color:#ffffff30;font-size:12px;">·</span>
            <a href="https://instagram.com/reevolution.pt" style="color:#ffc700;text-decoration:none;font-size:12px;font-weight:600;margin:0 6px;">Instagram</a>
            <span style="color:#ffffff30;font-size:12px;">·</span>
            <a href="https://facebook.com/reevolution.pt" style="color:#ffc700;text-decoration:none;font-size:12px;font-weight:600;margin:0 6px;">Facebook</a>
          </p>
          <p style="margin:0;font-size:11px;color:#ffffff55;line-height:1.6;">
            © ${new Date().getFullYear()} Re-Evolution, Serviços Digitais · Carnaxide, Lisboa<br/>
            Recebeu este email porque nos contactou através do nosso site.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body></html>`
}

function dataRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:5px 0;font-size:13px;color:#6b7280;width:38%;vertical-align:top;">${label}</td>
    <td style="padding:5px 0;font-size:13px;color:#011b54;font-weight:600;">${value || '—'}</td>
  </tr>`
}

// ─── Template: Email para o CLIENTE (multilingue PT / EN / ES, fallback EN) ───

type Lang = 'pt' | 'en' | 'es'

function clientLang(raw: string): Lang {
  const code = raw.toLowerCase().slice(0, 2)
  if (code === 'pt') return 'pt'
  if (code === 'es') return 'es'
  return 'en' // fallback para qualquer outro idioma
}

const CLIENT_COPY: Record<Lang, {
  greeting: (name: string) => string
  introChatbot: string
  introDiagnostico: string
  nextStepsTitle: string
  steps: [string, string, string]
  cta: string
}> = {
  pt: {
    greeting: (n) => `Olá, ${n}! 👋`,
    introChatbot: 'Obrigado pela sua conversa com o <strong>Reevo</strong>. A nossa equipa recebeu os seus dados e irá entrar em contacto consigo <strong>em breve</strong>.',
    introDiagnostico: 'Obrigado pelo seu pedido de <strong>diagnóstico gratuito</strong>. A nossa equipa analisou o seu pedido e irá contactá-lo/a <strong>em breve</strong>.',
    nextStepsTitle: 'O que acontece a seguir',
    steps: [
      'A nossa equipa analisa o seu pedido e prepara uma abordagem personalizada.',
      'Entramos em contacto por email ou telefone para agendar uma conversa sem compromisso.',
      'Em 1 a 3 semanas, o seu projeto está online e a trabalhar para o seu negócio.',
    ],
    cta: 'Visitar o nosso site →',
  },
  en: {
    greeting: (n) => `Hi, ${n}! 👋`,
    introChatbot: 'Thank you for your conversation with <strong>Reevo</strong>. Our team has received your details and will be in touch <strong>shortly</strong>.',
    introDiagnostico: 'Thank you for requesting your <strong>free diagnosis</strong>. Our team has reviewed your request and will contact you <strong>shortly</strong>.',
    nextStepsTitle: 'What happens next',
    steps: [
      'Our team reviews your request and prepares a personalised approach.',
      'We will contact you by email or phone to schedule a no-commitment conversation.',
      'In 1 to 3 weeks, your project is live and working for your business.',
    ],
    cta: 'Visit our website →',
  },
  es: {
    greeting: (n) => `¡Hola, ${n}! 👋`,
    introChatbot: 'Gracias por su conversación con <strong>Reevo</strong>. Nuestro equipo ha recibido sus datos y se pondrá en contacto <strong>en breve</strong>.',
    introDiagnostico: 'Gracias por solicitar su <strong>diagnóstico gratuito</strong>. Nuestro equipo ha revisado su solicitud y le contactará <strong>en breve</strong>.',
    nextStepsTitle: 'Qué ocurre a continuación',
    steps: [
      'Nuestro equipo analiza su solicitud y prepara un enfoque personalizado.',
      'Nos ponemos en contacto por email o teléfono para concertar una conversación sin compromiso.',
      'En 1 a 3 semanas, su proyecto está en línea y trabajando para su negocio.',
    ],
    cta: 'Visitar nuestro sitio →',
  },
}

export function buildClientEmailHtml(params: {
  name: string
  source: 'chatbot' | 'diagnostico'
  language?: string
}): string {
  const { name, source, language = 'en' } = params
  const lang = clientLang(language)
  const copy = CLIENT_COPY[lang]

  const intro = source === 'chatbot' ? copy.introChatbot : copy.introDiagnostico

  const body = `
      <tr><td style="padding:36px 40px 28px;">
        <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#011b54;">${copy.greeting(name)}</p>
        <p style="margin:0 0 28px;font-size:15px;color:#4a5568;line-height:1.7;">${intro}</p>

        <p style="margin:0 0 14px;font-size:14px;font-weight:700;color:#011b54;text-transform:uppercase;letter-spacing:0.8px;">${copy.nextStepsTitle}</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          ${copy.steps.map((step, i) => `
          <tr>
            <td style="vertical-align:top;padding:0 14px 14px 0;width:32px;">
              <div style="width:28px;height:28px;background:#ffc700;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:700;color:#011b54;">${i + 1}</div>
            </td>
            <td style="padding-bottom:14px;font-size:14px;color:#4a5568;line-height:1.6;vertical-align:top;padding-top:4px;">${step}</td>
          </tr>`).join('')}
        </table>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center">
            <a href="https://re-evolution.pt" style="display:inline-block;background:#ffc700;color:#011b54;font-size:14px;font-weight:700;text-decoration:none;padding:13px 32px;border-radius:12px;">
              ${copy.cta}
            </a>
          </td></tr>
        </table>
      </td></tr>`

  return emailWrapper(body)
}

// ─── Template: Email INTERNO para a equipa Re-Evolution ──────────────────────

export function buildInternalChatbotEmail(data: {
  name: string
  contact: string
  business_type: string
  current_situation: string
  main_need: string
  urgency: string
  budget: string
  decision_maker: string
  interest: string
  conversation: { role: string; content: string }[]
  timestamp: string
}): string {
  const conversationHtml = data.conversation
    .filter(m => m.role !== 'system')
    .map(m => {
      const isUser = m.role === 'user'
      return `<tr><td style="padding:6px 0;">
        <div style="display:inline-block;max-width:85%;background:${isUser ? '#011b54' : '#f0f4ff'};color:${isUser ? '#ffffff' : '#1a2744'};border-radius:12px;padding:10px 14px;font-size:13px;line-height:1.5;float:${isUser ? 'right' : 'left'};">
          <span style="display:block;font-size:10px;font-weight:700;margin-bottom:4px;opacity:0.6;">${isUser ? 'CLIENTE' : 'REEVO'}</span>
          ${m.content.replace(/\n/g, '<br/>')}
        </div>
        <div style="clear:both;"></div>
      </td></tr>`
    }).join('')

  const body = `
      <tr>
        <td style="background:#fff8e1;border-left:4px solid #ffc700;padding:14px 20px 14px 24px;margin:0 40px;">
          <p style="margin:0;font-size:13px;font-weight:700;color:#7a5800;">🤖 Lead Chatbot — uso interno</p>
          <p style="margin:4px 0 0;font-size:12px;color:#9a7a20;">${data.timestamp}</p>
        </td>
      </tr>
      <tr><td style="padding:32px 40px 0;">
        <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#011b54;letter-spacing:0.8px;text-transform:uppercase;">Dados do Lead</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border-radius:10px;border:1px solid #dde4f5;margin-bottom:28px;">
          <tr><td style="padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${dataRow('Nome', data.name)}
              ${dataRow('Contacto', data.contact)}
              ${dataRow('Tipo de Negócio', data.business_type)}
              ${dataRow('Situação Atual', data.current_situation)}
              ${dataRow('Necessidade Principal', data.main_need)}
              ${dataRow('Urgência', data.urgency)}
              ${dataRow('Orçamento', data.budget)}
              ${dataRow('Decisor', data.decision_maker)}
            </table>
          </td></tr>
        </table>

        <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#011b54;letter-spacing:0.8px;text-transform:uppercase;">Resumo da Conversa</p>
        <div style="background:#f0f4ff;border-radius:10px;padding:16px 20px;margin-bottom:28px;font-size:14px;color:#2d3748;line-height:1.6;">
          ${data.interest || '—'}
        </div>

        <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#011b54;letter-spacing:0.8px;text-transform:uppercase;">Transcrição Completa</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:10px;border:1px solid #e8edf5;margin-bottom:32px;">
          <tr><td style="padding:16px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${conversationHtml}
            </table>
          </td></tr>
        </table>
      </td></tr>`

  return emailWrapper(body)
}

export function buildInternalDiagnosticoEmail(data: {
  name: string
  email: string
  phone: string
  business_type: string
  main_problem: string
  timestamp: string
}): string {
  const body = `
      <tr>
        <td style="background:#fff8e1;border-left:4px solid #ffc700;padding:14px 20px 14px 24px;">
          <p style="margin:0;font-size:13px;font-weight:700;color:#7a5800;">📋 Pedido de Diagnóstico — uso interno</p>
          <p style="margin:4px 0 0;font-size:12px;color:#9a7a20;">${data.timestamp}</p>
        </td>
      </tr>
      <tr><td style="padding:32px 40px 32px;">
        <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#011b54;letter-spacing:0.8px;text-transform:uppercase;">Dados do Pedido</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border-radius:10px;border:1px solid #dde4f5;">
          <tr><td style="padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${dataRow('Nome', data.name)}
              ${dataRow('Email', data.email)}
              ${dataRow('Telefone', data.phone)}
              ${dataRow('Tipo de Negócio', data.business_type)}
              ${dataRow('Problema / Necessidade', data.main_problem)}
            </table>
          </td></tr>
        </table>
      </td></tr>`

  return emailWrapper(body)
}

export { formatPTDate }
