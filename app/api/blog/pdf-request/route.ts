import { z } from 'zod'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { rateLimit } from '@/lib/rate-limit'
import { appendToSheet } from '@/lib/google-sheets'
import { sendTelegram, telegramBlogPdfRequest } from '@/lib/telegram'
import { formatPTDate, sendEmail, buildBlogPdfRequestEmail, buildBlogPdfDeliveryEmail } from '@/lib/email'
import { generateUnsubscribeUrl } from '@/lib/unsubscribe'

const schema = z.object({
  email: z.string().email().max(200),
  language: z.string().max(10).optional(),
  articleSlug: z.string().max(200),
  articleTitle: z.string().max(500),
  honeypot: z.string().max(0).optional(),
})

function getIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown'
}

/** Verifica via binding R2 se o PDF existe. Devolve o URL público ou null. */
async function resolvePdfUrl(slug: string): Promise<string | null> {
  try {
    const { env } = getCloudflareContext<CloudflareEnv>()
    const obj = await env.PDF_BUCKET.head(`${slug}.pdf`)
    if (!obj) return null
    const base = process.env.R2_PDF_PUBLIC_URL ?? 'https://pdfs.re-evolution.pt'
    return `${base}/${slug}.pdf`
  } catch {
    // Sem contexto Cloudflare (dev local com next dev) — cai no email "em breve"
    return null
  }
}

export async function POST(req: Request) {
  const ip = getIP(req)
  if (!rateLimit(ip, 5, 60_000)) {
    return Response.json({ error: 'Demasiados pedidos. Tente novamente.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Pedido inválido.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Dados inválidos.' }, { status: 422 })
  }

  const raw = body as Record<string, unknown>
  if (raw.honeypot && String(raw.honeypot).length > 0) {
    return Response.json({ ok: true })
  }

  const { email, language = 'pt', articleSlug, articleTitle } = parsed.data
  const timestamp = formatPTDate(new Date())

  // Google Sheets — aba "PDF Requests"
  // Colunas: Mail | Língua | Conteúdo pretendido | Data/Hora
  await appendToSheet('PDF Requests', [email, language.toUpperCase(), articleTitle, timestamp])

  // Telegram
  await sendTelegram(telegramBlogPdfRequest({ email, language, articleTitle, articleSlug, timestamp }))

  // Verifica se o PDF já está disponível em /public/blog/pdfs/[slug].pdf
  const pdfUrl = await resolvePdfUrl(articleSlug)
  const unsubscribeUrl = await generateUnsubscribeUrl(email, language)

  if (pdfUrl) {
    // PDF disponível — entrega imediata com anexo
    const subjectMap: Record<string, string> = {
      pt: `O teu PDF — ${articleTitle}`,
      en: `Your PDF — ${articleTitle}`,
      es: `Tu PDF — ${articleTitle}`,
    }
    await sendEmail({
      to: email,
      subject: subjectMap[language] ?? subjectMap.pt,
      html: buildBlogPdfDeliveryEmail({ language, articleTitle, pdfUrl, unsubscribeUrl }),
      attachments: [{ filename: `${articleSlug}.pdf`, path: pdfUrl }],
    })
  } else {
    // PDF ainda não disponível — confirmação "em breve"
    const subjectMap: Record<string, string> = {
      pt: `PDF solicitado — ${articleTitle}`,
      en: `PDF requested — ${articleTitle}`,
      es: `PDF solicitado — ${articleTitle}`,
    }
    await sendEmail({
      to: email,
      subject: subjectMap[language] ?? subjectMap.en,
      html: buildBlogPdfRequestEmail({ email, language, articleTitle, unsubscribeUrl }),
    })
  }

  return Response.json({ ok: true })
}
