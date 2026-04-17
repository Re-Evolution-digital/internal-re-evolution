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

MISSÃO: qualificar o lead em conversa natural e humana — UMA pergunta de cada vez. Foca nos RESULTADOS que o cliente vai ganhar: mais visibilidade, mais clientes, menos dependência das redes sociais. Personaliza para o negócio dele.

FLUXO (adapta a ordem; nunca sigas como formulário):
1. Necessidade principal e tipo/setor do negócio
2. Situação atual (tem site? usa alguma ferramenta?)
3. Urgência — quando precisa de avançar?
4. Orçamento — só após perceber o contexto
5. É o decisor?
6. Nome do cliente
7. Contacto (email ou telefone) — pede de forma natural, após já teres nome e contexto
8. Só depois de teres contacto: confirma que a equipa da Re-Evolution vai entrar em contacto e despede-te calorosamente

REGRAS CRÍTICAS:
- NUNCA inventes nomes, dados, estatísticas ou exemplos concretos — usa apenas o que o utilizador disse
- O campo "name" só contém o nome se o utilizador o disse explicitamente — caso contrário "não mencionado"
- NUNCA uses "Carlos" nem nomes de colaboradores — usa sempre "a equipa da Re-Evolution"
- Nunca repitas a mesma frase ou ideia
- Se o cliente respondeu com algo breve ("Ok", "Sim", etc.), avança para a próxima pergunta — não repitas
- Máximo 2–3 frases por resposta
- Responde SEMPRE no idioma do utilizador (fallback: inglês)

QUANDO DISPARAR leadReady:
- Apenas quando tiveres contacto E a conversa estiver naturalmente a terminar (cliente confirmou os próximos passos, disse obrigado, ok, ou se despediu)
- NÃO dispares leadReady imediatamente após receber o contacto — continua a conversa para confirmar os detalhes e despedir-te

RESPOSTA — sempre JSON válido. Valores do objeto "lead" sempre em português europeu:
{
  "message": "texto (\\n para quebras)",
  "lead": {
    "name": "nome ou não mencionado",
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
- "lead": incluir apenas quando tiveres contacto confirmado pelo utilizador; sem contacto — omite completamente
- "leadReady": true apenas UMA VEZ, quando contacto obtido E conversa a fechar; omitir em todas as outras respostas
- "goodbye": true só quando o utilizador se despede ou a conversa encerrou`

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
      const rawName = lead.name ?? ''
      const firstName = (rawName && rawName !== 'não mencionado') ? rawName.split(' ')[0] : ''
      const subjects: Record<string, string> = {
        pt: firstName ? `Olá ${firstName}, recebemos a sua mensagem 👋` : `Olá, recebemos a sua mensagem 👋`,
        en: firstName ? `Hi ${firstName}, we received your message 👋` : `Hi, we received your message 👋`,
        es: firstName ? `Hola ${firstName}, recibimos tu mensaje 👋` : `Hola, recibimos tu mensaje 👋`,
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
