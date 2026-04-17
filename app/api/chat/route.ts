import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { sendEmail, buildClientEmailHtml, buildInternalChatbotEmail, formatPTDate } from '@/lib/email'
import { sendTelegram, telegramChatbotLead } from '@/lib/telegram'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(2000),
})

const requestSchema = z.object({
  messages: z.array(messageSchema).max(50),
  leadNotified: z.boolean().optional(),
})

function getIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown'
}

const SYSTEM_PROMPT = `És o Reevo, assistente da Re-Evolution — agência portuguesa de websites, automações e presença digital para PMEs.

SERVIÇOS:
- Website Essencial: €500 one-time (entrega 1–3 semanas, 1 mês suporte)
- Automação Managed: €800 setup + €140/mês (notificações, reservas, processos)
- SEO + Google Business Profile | Add-ons: Chatbot IA, WhatsApp Business API
- Diagnóstico gratuito e sem compromisso | Todo Portugal, 100% remoto

MISSÃO: qualificar o lead em conversa natural e humana — UMA pergunta de cada vez. Foca sempre nos RESULTADOS concretos que o cliente vai ganhar: mais visibilidade, mais clientes, menos tempo perdido, mais receita. Nunca sejas genérico — personaliza para o negócio dele.

FLUXO (adapta a ordem conforme a conversa; nunca sigas como formulário):
1. Perceber a necessidade principal e o tipo de negócio
2. Situação atual (tem site? usa alguma ferramenta?)
3. Mostrar valor concreto: "um cliente nosso no mesmo setor passou a receber X leads/mês" — usa exemplos plausíveis e relevantes
4. Urgência e orçamento (só quando fizer sentido natural)
5. Confirmar que é o decisor
6. PEDIR NOME E CONTACTO (email ou telefone) — faz isto assim que o interesse estiver claro, não esperes pelo fim
7. Confirmar que Carlos (Re-Evolution) vai contactar pessoalmente para uma conversa rápida e gratuita

REGRAS CRÍTICAS:
- Nunca repitas a mesma frase ou ideia duas vezes na mesma conversa
- Se o cliente disse "Ok" ou algo breve, avança — não repitas o que disseste antes
- Máximo 2–3 frases por resposta; direto e com energia
- Responde SEMPRE no idioma do utilizador (fallback: inglês)
- Não inventes factos; exemplos de resultados devem ser plausíveis e marcados como típicos
- Ao pedir contacto: torna-o fácil e natural ("Para a nossa equipa lhe apresentar uma proposta à medida, qual o melhor contacto — email ou telefone?")

RESPOSTA — sempre JSON válido. Valores do objeto "lead" sempre em português europeu:
{
  "message": "texto (\\n para quebras)",
  "lead": {
    "name": "nome",
    "contact": "email ou telefone",
    "language": "ISO (pt/en/es/fr…)",
    "business_type": "tipo e setor",
    "current_situation": "situação atual",
    "main_need": "necessidade principal",
    "urgency": "urgência ou prazo",
    "budget": "orçamento",
    "decision_maker": "sim / não / parcialmente",
    "interest": "resumo em PT-EU, 2–3 frases"
  },
  "leadReady": true,
  "goodbye": true
}

CAMPOS OPCIONAIS:
- "lead": incluir só quando tens nome E contacto; resto não confirmado → "não mencionado"
- "leadReady": true apenas UMA VEZ (quando nome+contacto confirmados); omitir depois
- "goodbye": true só quando o utilizador se despede
- Sem nome/contacto: omite "lead" completamente`

export async function POST(req: Request) {
  const ip = getIP(req)
  if (!rateLimit(ip, 20, 60_000)) {
    return Response.json({ error: 'Demasiados pedidos.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Pedido inválido.' }, { status: 400 })
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Dados inválidos.' }, { status: 422 })
  }

  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey || groqKey === 'placeholder') {
    return Response.json({
      message: 'Olá! Sou o Evo. O chatbot está em configuração. Por favor use o formulário de diagnóstico abaixo.',
      leadReady: false,
    })
  }

  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...parsed.data.messages,
      ],
    }),
  })

  if (!groqResponse.ok) {
    return Response.json({ error: 'Erro ao processar.' }, { status: 502 })
  }

  const groqData = await groqResponse.json() as {
    choices: Array<{ message: { content: string } }>
  }

  let result: Record<string, unknown>
  try {
    result = JSON.parse(groqData.choices[0].message.content) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Resposta inválida.' }, { status: 502 })
  }

  // Notificações apenas na primeira vez que o lead fica pronto
  if (result.leadReady === true && result.lead && !parsed.data.leadNotified) {
    const lead = result.lead as Record<string, string>
    const timestamp = formatPTDate(new Date())
    const reevoEmail = process.env.REEVO_EMAIL ?? 'geral@re-evolution.pt'

    // Telegram — notificação imediata (sempre em PT)
    await sendTelegram(telegramChatbotLead({
      name: lead.name ?? '—',
      contact: lead.contact ?? '—',
      language: lead.language ?? '?',
      business_type: lead.business_type ?? '—',
      main_need: lead.main_need ?? '—',
      urgency: lead.urgency ?? '—',
      budget: lead.budget ?? '—',
      decision_maker: lead.decision_maker ?? '—',
      interest: lead.interest ?? '—',
      timestamp,
    }))

    // Email interno — equipa Re-Evolution (sempre enviado)
    await sendEmail({
      to: reevoEmail,
      subject: `🤖 Novo Lead Chatbot — ${lead.name ?? 'Lead'} | ${lead.business_type ?? ''}`,
      html: buildInternalChatbotEmail({
        name: lead.name ?? '—',
        contact: lead.contact ?? '—',
        business_type: lead.business_type ?? '—',
        current_situation: lead.current_situation ?? '—',
        main_need: lead.main_need ?? '—',
        urgency: lead.urgency ?? '—',
        budget: lead.budget ?? '—',
        decision_maker: lead.decision_maker ?? '—',
        interest: lead.interest ?? '—',
        conversation: parsed.data.messages,
        timestamp,
      }),
    })

    // Email para o cliente — apenas se o contacto for um email, no idioma dele
    // Extrai só o email caso o LLM adicione texto extra (ex: "email@x.com (confirmado)")
    const rawContact = lead.contact ?? ''
    const emailMatch = rawContact.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)
    const clientEmail = emailMatch?.[0] ?? ''
    console.log(`[Chat] contact="${rawContact}" → email="${clientEmail}"`)
    if (clientEmail) {
      const clientLang = lead.language ?? 'en'
      const firstName = (lead.name ?? 'Cliente').split(' ')[0]
      const subjects: Record<string, string> = {
        pt: `Olá ${firstName}, recebemos a sua mensagem 👋`,
        en: `Hi ${firstName}, we received your message 👋`,
        es: `Hola ${firstName}, recibimos tu mensaje 👋`,
      }
      const subject = subjects[clientLang.slice(0, 2)] ?? subjects.en
      await sendEmail({
        to: clientEmail,
        bcc: reevoEmail,
        subject,
        html: buildClientEmailHtml({ name: firstName, source: 'chatbot', language: clientLang }),
      })
    }
  }

  return Response.json(result)
}
