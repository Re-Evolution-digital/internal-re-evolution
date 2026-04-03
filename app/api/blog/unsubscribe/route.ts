import { appendToSheet, isEmailInSheet } from '@/lib/google-sheets'
import { sendTelegram, telegramBlogUnsubscribe } from '@/lib/telegram'
import { verifyUnsubscribeSig } from '@/lib/unsubscribe'
import { formatPTDate } from '@/lib/email'

// Páginas de confirmação multilingue
const PAGES: Record<string, { title: string; heading: string; body: string; note: string; cta: string; ctaUrl: string; alreadyHeading: string; alreadyBody: string }> = {
  pt: {
    title: 'Subscrição cancelada — Re-Evolution',
    heading: 'Subscrição cancelada',
    body: 'O teu endereço foi removido da lista de novidades do Blog Re-Evolution. Não receberás mais emails desta lista.',
    note: 'Se mudares de ideias, podes voltar a subscrever a qualquer momento.',
    cta: 'Visitar o Blog →',
    ctaUrl: 'https://re-evolution.pt/pt/blog',
    alreadyHeading: 'Já cancelado anteriormente',
    alreadyBody: 'O teu endereço já não se encontra na nossa lista de novidades.',
  },
  en: {
    title: 'Unsubscribed — Re-Evolution',
    heading: 'You\'ve been unsubscribed',
    body: 'Your address has been removed from the Re-Evolution Blog newsletter. You won\'t receive any more emails from this list.',
    note: 'If you change your mind, you can subscribe again at any time.',
    cta: 'Visit the Blog →',
    ctaUrl: 'https://re-evolution.pt/en/blog',
    alreadyHeading: 'Already unsubscribed',
    alreadyBody: 'Your address was already removed from our newsletter list.',
  },
  es: {
    title: 'Suscripción cancelada — Re-Evolution',
    heading: 'Suscripción cancelada',
    body: 'Tu dirección ha sido eliminada de la lista de novedades del Blog Re-Evolution. No recibirás más correos de esta lista.',
    note: 'Si cambias de opinión, puedes volver a suscribirte en cualquier momento.',
    cta: 'Visitar el Blog →',
    ctaUrl: 'https://re-evolution.pt/es/blog',
    alreadyHeading: 'Ya cancelado anteriormente',
    alreadyBody: 'Tu dirección ya no está en nuestra lista de novedades.',
  },
}

function buildPage(copy: typeof PAGES['pt'], alreadyCancelled: boolean): string {
  const { heading, body, note, cta, ctaUrl, alreadyHeading, alreadyBody, title } = copy
  const h = alreadyCancelled ? alreadyHeading : heading
  const b = alreadyCancelled ? alreadyBody : body
  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:60px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(1,27,84,0.10);">
        <tr>
          <td style="background:#011b54;padding:28px 40px;text-align:center;">
            <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Re-Evolution</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 36px;text-align:center;">
            <div style="width:56px;height:56px;background:#f0f4ff;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:26px;">✓</div>
            <p style="margin:0 0 14px;font-size:22px;font-weight:700;color:#011b54;">${h}</p>
            <p style="margin:0 0 20px;font-size:15px;color:#4a5568;line-height:1.7;max-width:400px;margin-left:auto;margin-right:auto;">${b}</p>
            ${!alreadyCancelled ? `<p style="margin:0 0 32px;font-size:13px;color:#6b7280;font-style:italic;">${note}</p>` : '<p style="margin:0 0 32px;"></p>'}
            <a href="${ctaUrl}" style="display:inline-block;background:#ffc700;color:#011b54;font-size:14px;font-weight:700;text-decoration:none;padding:13px 32px;border-radius:12px;">${cta}</a>
          </td>
        </tr>
        <tr>
          <td style="background:#011b54;padding:16px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#ffffff44;">© ${new Date().getFullYear()} Re-Evolution, Serviços Digitais · Carnaxide, Lisboa</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email') ?? ''
  const sig = searchParams.get('sig') ?? ''
  const lang = (searchParams.get('lang') ?? 'pt').slice(0, 2).toLowerCase()
  const copy = PAGES[lang] ?? PAGES.pt

  // Verificar assinatura HMAC
  const valid = email && await verifyUnsubscribeSig(email, sig)
  if (!valid) {
    return new Response('Link inválido ou expirado.', { status: 400, headers: { 'Content-Type': 'text/plain' } })
  }

  const timestamp = formatPTDate(new Date())

  // Verificar se já está em Cancelados
  const alreadyCancelled = await isEmailInSheet('Cancelados', email)

  if (!alreadyCancelled) {
    // Registar na aba Cancelados: Email | Data/Hora
    await appendToSheet('Cancelados', [email, timestamp])

    // Notificar via Telegram
    await sendTelegram(telegramBlogUnsubscribe({ email, timestamp }))
  }

  return new Response(buildPage(copy, alreadyCancelled), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
