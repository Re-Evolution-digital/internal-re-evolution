/**
 * Email — helper Resend + templates HTML para leads.
 *
 * Dois tipos de email por cada fonte:
 *   1. Cliente  — confirmação limpa, essencial, reconfortante
 *   2. Interno  — todos os dados de negócio para a equipa Re-Evolution
 *
 * Fontes suportadas: chatbot | diagnostico
 */

// ─── Logo Base64 inline (gerado em build-time via scripts/generate-logo-b64.js)
// Sharp comprime o PNG de 116KB para ~3.5KB antes de codificar — fica bem abaixo
// do limite de 102KB do Gmail e funciona em todos os clientes sem pedidos externos.
import { LOGO_DATA_URI as LOGO_URL } from './logo-b64.generated'

// ─── Envio via Resend ─────────────────────────────────────────────────────────

interface SendEmailAttachment {
  filename: string
  path: string  // URL público — o Resend descarrega diretamente, zero CPU no Worker
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  bcc?: string
  attachments?: SendEmailAttachment[]
}

export async function sendEmail({ to, subject, html, bcc, attachments }: SendEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@re-evolution.pt'
  if (!apiKey || apiKey === 'placeholder') {
    console.warn('[Resend] RESEND_API_KEY não configurada — email não enviado para:', to)
    return
  }

  const body: Record<string, unknown> = { from, to, subject, html }
  if (bcc) body.bcc = bcc
  if (attachments?.length) body.attachments = attachments

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

function emailWrapper(bodyContent: string, unsubscribeUrl?: string): string {
  const unsubscribeFooter = unsubscribeUrl
    ? `<p style="margin:8px 0 0;font-size:10px;color:#ffffff22;">
          <a href="${unsubscribeUrl}" style="color:#ffffff33;text-decoration:underline;">Cancelar subscrição</a>
        </p>`
    : ''
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
          <img src="${LOGO_URL}" alt="Re-Evolution" width="80" style="display:block;margin:0 auto;height:auto;"/>
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
                <img src="${LOGO_URL}" alt="Re-Evolution" width="90" style="display:block;margin-left:auto;opacity:0.65;"/>
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
          <p style="margin:0 0 10px;font-size:11px;color:#ffffff55;line-height:1.6;">
            © ${new Date().getFullYear()} Re-Evolution, Serviços Digitais · Carnaxide, Lisboa<br/>
            Recebeu este email porque nos contactou através do nosso site.
          </p>
          <p style="margin:0;font-size:10px;color:#ffffff33;line-height:1.6;">
            Este é um endereço de envio automático — não monitorizado e sem caixa de entrada.<br/>
            Não responda a este email. Para nos contactar: <a href="mailto:geral@re-evolution.pt" style="color:#ffffff44;text-decoration:underline;">geral@re-evolution.pt</a> · <a href="tel:+351969063633" style="color:#ffffff44;text-decoration:underline;">+351 969 063 633</a>
          </p>
          ${unsubscribeFooter}
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
      'Entraremos em contacto por email ou telefone para agendar uma conversa sem compromisso.',
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

// ─── Template: Email para SUBSCRITORES do Blog ───────────────────────────────

const SUBSCRIBE_COPY: Record<Lang, {
  greeting: string
  intro: string
  whatToExpect: string
  items: [string, string, string]
  cta: string
  ctaUrl: string
}> = {
  pt: {
    greeting: 'Obrigado pela subscrição! 🎉',
    intro: 'Estás agora na lista de novidades da <strong>Re-Evolution</strong>. Sempre que publicarmos conteúdo novo, recebes primeiro.',
    whatToExpect: 'O que podes esperar',
    items: [
      'Artigos práticos sobre SEO local, Google Business Profile e automações.',
      'Exemplos reais de empresas portuguesas que melhoraram a sua presença digital.',
      'Dicas rápidas que podes aplicar no teu negócio hoje mesmo.',
    ],
    cta: 'Ver os artigos do Blog →',
    ctaUrl: 'https://re-evolution.pt/pt/blog',
  },
  en: {
    greeting: 'Thanks for subscribing! 🎉',
    intro: 'You\'re now on the <strong>Re-Evolution</strong> newsletter list. Whenever we publish new content, you\'ll be the first to know.',
    whatToExpect: 'What to expect',
    items: [
      'Practical articles on local SEO, Google Business Profile, and automations.',
      'Real examples from Portuguese businesses that improved their digital presence.',
      'Quick tips you can apply to your business today.',
    ],
    cta: 'Read the Blog →',
    ctaUrl: 'https://re-evolution.pt/en/blog',
  },
  es: {
    greeting: '¡Gracias por suscribirte! 🎉',
    intro: 'Ya estás en la lista de novedades de <strong>Re-Evolution</strong>. Cada vez que publiquemos contenido nuevo, serás el primero en saberlo.',
    whatToExpect: 'Qué puedes esperar',
    items: [
      'Artículos prácticos sobre SEO local, Google Business Profile y automatizaciones.',
      'Ejemplos reales de empresas portuguesas que mejoraron su presencia digital.',
      'Consejos rápidos que puedes aplicar en tu negocio hoy mismo.',
    ],
    cta: 'Leer el Blog →',
    ctaUrl: 'https://re-evolution.pt/es/blog',
  },
}

export function buildBlogSubscribeEmail(params: {
  email: string
  language?: string
  unsubscribeUrl?: string
}): string {
  const { language = 'en', unsubscribeUrl } = params
  const lang = clientLang(language)
  const copy = SUBSCRIBE_COPY[lang]

  const body = `
      <tr><td style="padding:36px 40px 28px;">
        <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#011b54;">${copy.greeting}</p>
        <p style="margin:0 0 28px;font-size:15px;color:#4a5568;line-height:1.7;">${copy.intro}</p>

        <p style="margin:0 0 14px;font-size:14px;font-weight:700;color:#011b54;text-transform:uppercase;letter-spacing:0.8px;">${copy.whatToExpect}</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          ${copy.items.map((item) => `
          <tr>
            <td style="vertical-align:top;padding:0 14px 14px 0;width:32px;">
              <div style="width:28px;height:28px;background:#ffc700;border-radius:50%;text-align:center;line-height:28px;font-size:16px;">📝</div>
            </td>
            <td style="padding-bottom:14px;font-size:14px;color:#4a5568;line-height:1.6;vertical-align:top;padding-top:4px;">${item}</td>
          </tr>`).join('')}
        </table>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center">
            <a href="${copy.ctaUrl}" style="display:inline-block;background:#ffc700;color:#011b54;font-size:14px;font-weight:700;text-decoration:none;padding:13px 32px;border-radius:12px;">
              ${copy.cta}
            </a>
          </td></tr>
        </table>
      </td></tr>`

  return emailWrapper(body, unsubscribeUrl)
}

// ─── Template: Email para SUBSCRITOR JÁ EXISTENTE ────────────────────────────

const ALREADY_SUBSCRIBED_COPY: Record<Lang, {
  greeting: string
  message: string
  note: string
  cta: string
  ctaUrl: string
}> = {
  pt: {
    greeting: 'Já estás connosco! 🙌',
    message: 'O endereço <strong>{{email}}</strong> já se encontra subscrito nas novidades da <strong>Re-Evolution</strong>. Não fizemos qualquer alteração.',
    note: 'Continuarás a receber os nossos artigos, dicas e novidades assim que os publicarmos.',
    cta: 'Ver os artigos do Blog →',
    ctaUrl: 'https://re-evolution.pt/pt/blog',
  },
  en: {
    greeting: 'You\'re already with us! 🙌',
    message: 'The address <strong>{{email}}</strong> is already subscribed to <strong>Re-Evolution</strong> updates. No changes were made.',
    note: 'You\'ll keep receiving our articles, tips, and news as soon as we publish them.',
    cta: 'Read the Blog →',
    ctaUrl: 'https://re-evolution.pt/en/blog',
  },
  es: {
    greeting: '¡Ya estás con nosotros! 🙌',
    message: 'La dirección <strong>{{email}}</strong> ya está suscrita a las novedades de <strong>Re-Evolution</strong>. No se realizó ningún cambio.',
    note: 'Seguirás recibiendo nuestros artículos, consejos y novedades en cuanto los publiquemos.',
    cta: 'Leer el Blog →',
    ctaUrl: 'https://re-evolution.pt/es/blog',
  },
}

export function buildBlogAlreadySubscribedEmail(params: {
  email: string
  language?: string
  unsubscribeUrl?: string
}): string {
  const { email, language = 'en', unsubscribeUrl } = params
  const lang = clientLang(language)
  const copy = ALREADY_SUBSCRIBED_COPY[lang]

  const body = `
      <tr><td style="padding:36px 40px 28px;">
        <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#011b54;">${copy.greeting}</p>
        <p style="margin:0 0 20px;font-size:15px;color:#4a5568;line-height:1.7;">${copy.message.replace('{{email}}', email)}</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr>
            <td style="background:#f0f4ff;border-left:4px solid #011b54;border-radius:0 8px 8px 0;padding:14px 20px;font-size:14px;color:#4a5568;line-height:1.6;">
              ${copy.note}
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center">
            <a href="${copy.ctaUrl}" style="display:inline-block;background:#ffc700;color:#011b54;font-size:14px;font-weight:700;text-decoration:none;padding:13px 32px;border-radius:12px;">
              ${copy.cta}
            </a>
          </td></tr>
        </table>
      </td></tr>`

  return emailWrapper(body, unsubscribeUrl)
}

// ─── Template: Email para PEDIDOS de PDF do Blog ──────────────────────────────

const PDF_REQUEST_COPY: Record<Lang, {
  greeting: string
  intro: (title: string) => string
  articleLabel: string
  whatNext: string
  steps: [string, string]
  cta: string
  ctaUrl: string
}> = {
  pt: {
    greeting: 'Pedido recebido! 📄',
    intro: (title) => `Recebemos o teu pedido do artigo <strong>"${title}"</strong> em PDF. Enviaremos para este endereço de email <strong>em breve</strong>.`,
    articleLabel: 'Artigo pedido',
    whatNext: 'O que acontece a seguir',
    steps: [
      'A nossa equipa prepara e envia o PDF para o teu email (normalmente dentro de 24 horas).',
      'Enquanto isso, podes ler outros artigos do nosso Blog.',
    ],
    cta: 'Ver mais artigos →',
    ctaUrl: 'https://re-evolution.pt/pt/blog',
  },
  en: {
    greeting: 'Request received! 📄',
    intro: (title) => `We received your request for the article <strong>"${title}"</strong> in PDF format. We\'ll send it to this email address <strong>shortly</strong>.`,
    articleLabel: 'Requested article',
    whatNext: 'What happens next',
    steps: [
      'Our team prepares and sends the PDF to your email (usually within 24 hours).',
      'In the meantime, you can read more articles on our Blog.',
    ],
    cta: 'Read more articles →',
    ctaUrl: 'https://re-evolution.pt/en/blog',
  },
  es: {
    greeting: '¡Solicitud recibida! 📄',
    intro: (title) => `Hemos recibido tu solicitud del artículo <strong>"${title}"</strong> en PDF. Te lo enviaremos a este correo electrónico <strong>en breve</strong>.`,
    articleLabel: 'Artículo solicitado',
    whatNext: 'Qué ocurre a continuación',
    steps: [
      'Nuestro equipo prepara y envía el PDF a tu correo (normalmente en 24 horas).',
      'Mientras tanto, puedes leer más artículos en nuestro Blog.',
    ],
    cta: 'Leer más artículos →',
    ctaUrl: 'https://re-evolution.pt/es/blog',
  },
}

export function buildBlogPdfRequestEmail(params: {
  email: string
  language?: string
  articleTitle: string
  unsubscribeUrl?: string
}): string {
  const { language = 'en', articleTitle, unsubscribeUrl } = params
  const lang = clientLang(language)
  const copy = PDF_REQUEST_COPY[lang]

  const body = `
      <tr><td style="padding:36px 40px 28px;">
        <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#011b54;">${copy.greeting}</p>
        <p style="margin:0 0 24px;font-size:15px;color:#4a5568;line-height:1.7;">${copy.intro(articleTitle)}</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border-radius:10px;border:1px solid #dde4f5;margin-bottom:28px;">
          <tr><td style="padding:16px 24px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">${copy.articleLabel}</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#011b54;">${articleTitle}</p>
          </td></tr>
        </table>

        <p style="margin:0 0 14px;font-size:14px;font-weight:700;color:#011b54;text-transform:uppercase;letter-spacing:0.8px;">${copy.whatNext}</p>
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
            <a href="${copy.ctaUrl}" style="display:inline-block;background:#ffc700;color:#011b54;font-size:14px;font-weight:700;text-decoration:none;padding:13px 32px;border-radius:12px;">
              ${copy.cta}
            </a>
          </td></tr>
        </table>
      </td></tr>`

  return emailWrapper(body, unsubscribeUrl)
}

// ─── Template: Email de ENTREGA do PDF do Blog ───────────────────────────────

const PDF_DELIVERY_COPY: Record<Lang, {
  greeting: string
  intro: (title: string) => string
  articleLabel: string
  attachmentNote: string
  cta: string
  ctaUrl: string
}> = {
  pt: {
    greeting: 'O teu PDF chegou! 📎',
    intro: (title) => `Aqui está o artigo <strong>"${title}"</strong> em PDF, pronto a guardar ou partilhar.`,
    articleLabel: 'Artigo',
    attachmentNote: 'O ficheiro PDF está em anexo a este email.',
    cta: 'Ver mais artigos →',
    ctaUrl: 'https://re-evolution.pt/pt/blog',
  },
  en: {
    greeting: 'Your PDF is here! 📎',
    intro: (title) => `Here is the article <strong>"${title}"</strong> in PDF format, ready to save or share.`,
    articleLabel: 'Article',
    attachmentNote: 'The PDF file is attached to this email.',
    cta: 'Read more articles →',
    ctaUrl: 'https://re-evolution.pt/en/blog',
  },
  es: {
    greeting: '¡Tu PDF ha llegado! 📎',
    intro: (title) => `Aquí tienes el artículo <strong>"${title}"</strong> en PDF, listo para guardar o compartir.`,
    articleLabel: 'Artículo',
    attachmentNote: 'El archivo PDF está adjunto a este correo.',
    cta: 'Leer más artículos →',
    ctaUrl: 'https://re-evolution.pt/es/blog',
  },
}

export function buildBlogPdfDeliveryEmail(params: {
  language?: string
  articleTitle: string
  pdfUrl: string
  unsubscribeUrl?: string
}): string {
  const { language = 'pt', articleTitle, pdfUrl, unsubscribeUrl } = params
  const lang = clientLang(language)
  const copy = PDF_DELIVERY_COPY[lang]

  const body = `
      <tr><td style="padding:36px 40px 28px;">
        <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#011b54;">${copy.greeting}</p>
        <p style="margin:0 0 24px;font-size:15px;color:#4a5568;line-height:1.7;">${copy.intro(articleTitle)}</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border-radius:10px;border:1px solid #dde4f5;margin-bottom:24px;">
          <tr><td style="padding:16px 24px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">${copy.articleLabel}</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#011b54;">${articleTitle}</p>
          </td></tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td style="background:#fff8e1;border-left:4px solid #ffc700;border-radius:0 8px 8px 0;padding:14px 20px;font-size:14px;color:#4a5568;line-height:1.6;">
              📎 ${copy.attachmentNote}
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr><td align="center">
            <a href="${pdfUrl}" style="display:inline-block;background:#011b54;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:13px 32px;border-radius:12px;">
              ⬇ Descarregar PDF
            </a>
          </td></tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center">
            <a href="${copy.ctaUrl}" style="display:inline-block;background:#ffc700;color:#011b54;font-size:14px;font-weight:700;text-decoration:none;padding:13px 32px;border-radius:12px;">
              ${copy.cta}
            </a>
          </td></tr>
        </table>
      </td></tr>`

  return emailWrapper(body, unsubscribeUrl)
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

// ─── Template: Confirmação de AGENDAMENTO para o cliente ─────────────────────

// ── Helpers de calendário ─────────────────────────────────────────────────────

/** Formata ISO UTC para "YYYYMMDDTHHmmssZ" (formato iCal/Google Calendar) */
function toCalDate(iso: string): string {
  return iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** Constrói URL para adicionar evento ao Google Calendar */
function googleCalendarUrl(title: string, start: string, end: string, description: string): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toCalDate(start)}/${toCalDate(end)}`,
    details: description,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** URL para o endpoint ICS (iCal / Outlook / Apple Calendar) */
function icsUrl(title: string, start: string, end: string, description: string): string {
  const base = 'https://re-evolution.pt/api/agenda/ics'
  const params = new URLSearchParams({ title, start, end, desc: description })
  return `${base}?${params.toString()}`
}

// ── Copy de agendamento ───────────────────────────────────────────────────────

const BOOKING_CLIENT_COPY: Record<Lang, {
  greeting: (name: string) => string
  intro: (label: string) => string
  reminder: string
  addToCalLabel: string
  addToOutlookLabel: string
  cta: string
  meetingLabel: string
  eventDesc: (label: string) => string
  subject: (firstName: string, label: string) => string
}> = {
  pt: {
    greeting: (n) => `Olá, ${n}! 📅`,
    intro: (label) => `A sua reunião com a <strong>Re-Evolution</strong> está confirmada para <strong>${label}</strong>. Iremos ligar-lhe à hora marcada.`,
    reminder: 'Caso precise de reagendar, contacte-nos pelo email abaixo.',
    addToCalLabel: 'Adicionar ao Google Calendar',
    addToOutlookLabel: 'iCal / Outlook / Apple Calendar',
    cta: 'Visitar o nosso site →',
    meetingLabel: 'Reunião marcada',
    eventDesc: (label) => `Reunião confirmada para ${label}. A equipa Re-Evolution irá ligar-lhe à hora marcada.`,
    subject: (firstName, label) => `${firstName}, a sua reunião está confirmada — ${label}`,
  },
  en: {
    greeting: (n) => `Hi, ${n}! 📅`,
    intro: (label) => `Your meeting with <strong>Re-Evolution</strong> is confirmed for <strong>${label}</strong>. We will call you at the scheduled time.`,
    reminder: 'If you need to reschedule, please contact us at the email below.',
    addToCalLabel: 'Add to Google Calendar',
    addToOutlookLabel: 'iCal / Outlook / Apple Calendar',
    cta: 'Visit our website →',
    meetingLabel: 'Meeting confirmed',
    eventDesc: (label) => `Meeting confirmed for ${label}. The Re-Evolution team will call you at the scheduled time.`,
    subject: (firstName, label) => `${firstName}, your meeting is confirmed — ${label}`,
  },
  es: {
    greeting: (n) => `¡Hola, ${n}! 📅`,
    intro: (label) => `Su reunión con <strong>Re-Evolution</strong> está confirmada para <strong>${label}</strong>. Le llamaremos a la hora acordada.`,
    reminder: 'Si necesita reagendar, contáctenos en el email de abajo.',
    addToCalLabel: 'Añadir a Google Calendar',
    addToOutlookLabel: 'iCal / Outlook / Apple Calendar',
    cta: 'Visitar nuestro sitio →',
    meetingLabel: 'Reunión confirmada',
    eventDesc: (label) => `Reunión confirmada para ${label}. El equipo Re-Evolution le llamará a la hora acordada.`,
    subject: (firstName, label) => `${firstName}, su reunión está confirmada — ${label}`,
  },
}

export function buildBookingConfirmationEmail(params: {
  name: string
  slotLabel: string  // "Sex, 4 Abr às 09:00"
  slotStart: string  // ISO UTC — para os links de calendário
  slotEnd: string    // ISO UTC
  language?: string
}): string {
  const { name, slotLabel, slotStart, slotEnd, language = 'pt' } = params
  const lang = clientLang(language)
  const copy = BOOKING_CLIENT_COPY[lang]
  const firstName = name.split(' ')[0] ?? name

  const eventTitle = 'Diagnóstico Re-Evolution'
  const eventDesc = copy.eventDesc(slotLabel)
  const gCalLink = googleCalendarUrl(eventTitle, slotStart, slotEnd, eventDesc)
  const icsLink = icsUrl(eventTitle, slotStart, slotEnd, eventDesc)

  const body = `
      <tr><td style="padding:36px 40px 28px;">
        <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#011b54;">${copy.greeting(firstName)}</p>
        <p style="margin:0 0 28px;font-size:15px;color:#4a5568;line-height:1.7;">${copy.intro(slotLabel)}</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border-radius:10px;border:1px solid #dde4f5;margin-bottom:24px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">${copy.meetingLabel}</p>
            <p style="margin:0;font-size:17px;font-weight:700;color:#011b54;">🗓 ${slotLabel}</p>
          </td></tr>
        </table>

        <!-- Botões de calendário -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="padding-right:8px;" width="50%">
              <a href="${gCalLink}" target="_blank"
                style="display:block;background:#ffffff;border:2px solid #4285f4;border-radius:10px;padding:11px 12px;text-align:center;font-size:13px;font-weight:700;color:#4285f4;text-decoration:none;">
                📅 ${copy.addToCalLabel}
              </a>
            </td>
            <td style="padding-left:8px;" width="50%">
              <a href="${icsLink}" target="_blank"
                style="display:block;background:#ffffff;border:2px solid #6b7280;border-radius:10px;padding:11px 12px;text-align:center;font-size:13px;font-weight:700;color:#374151;text-decoration:none;">
                📅 ${copy.addToOutlookLabel}
              </a>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr>
            <td style="background:#f0f4ff;border-left:4px solid #011b54;border-radius:0 8px 8px 0;padding:14px 20px;font-size:14px;color:#4a5568;line-height:1.6;">
              ${copy.reminder}
            </td>
          </tr>
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

export function buildBookingEmailSubject(params: { name: string; slotLabel: string; language?: string }): string {
  const { name, slotLabel, language = 'pt' } = params
  const lang = clientLang(language)
  const firstName = name.split(' ')[0] ?? name
  return BOOKING_CLIENT_COPY[lang].subject(firstName, slotLabel)
}

// ─── Template: Email INTERNO para agendamento ─────────────────────────────────

export function buildInternalBookingEmail(data: {
  name: string
  email: string
  phone: string
  business_type: string
  slot_label: string
  slot_start: string
  timestamp: string
}): string {
  const body = `
      <tr>
        <td style="background:#e8f5e9;border-left:4px solid #4caf50;padding:14px 20px 14px 24px;">
          <p style="margin:0;font-size:13px;font-weight:700;color:#2e7d32;">📅 Novo Agendamento — via site</p>
          <p style="margin:4px 0 0;font-size:12px;color:#388e3c;">${data.timestamp}</p>
        </td>
      </tr>
      <tr><td style="padding:32px 40px 32px;">
        <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#011b54;letter-spacing:0.8px;text-transform:uppercase;">Dados do Agendamento</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border-radius:10px;border:1px solid #dde4f5;">
          <tr><td style="padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${dataRow('Reunião', `🗓 ${data.slot_label}`)}
              ${dataRow('Nome', data.name)}
              ${dataRow('Email', data.email)}
              ${dataRow('Telefone', data.phone)}
              ${dataRow('Tipo de Negócio', data.business_type)}
            </table>
          </td></tr>
        </table>
      </td></tr>`

  return emailWrapper(body)
}

export { formatPTDate }
