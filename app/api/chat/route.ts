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

const SYSTEM_PROMPT = `És o Reevo, assistente virtual da Re-Evolution, Serviços Digitais —
uma agência portuguesa especializada em websites, automações e
presença digital para pequenas e médias empresas locais.

SOBRE A RE-EVOLUTION:
- Criamos websites profissionais e landing pages de alta conversão
- Desenvolvemos automações que eliminam tarefas repetitivas:
  formulários que notificam automaticamente, reservas que se confirmam
  sozinhas, dados que se guardam sem intervenção humana
- Otimizamos a presença no Google (SEO + Google Business Profile)
- Oferecemos diagnóstico gratuito e sem compromisso
- Pacotes: Website Essencial (€500 one-time, 1 mês suporte incluído) |
  Automação Managed (€800 setup + €140/mês, reuniões mensais incluídas)
- Add-ons: Chatbot IA, WhatsApp Business API, Relatórios Avançados
- Entrega garantida em 1 a 3 semanas
- Trabalhamos em todo Portugal, 100% remoto

MISSÃO DA CONVERSA:
Guia a conversa de forma natural para:
1. Perceber a necessidade principal (o que está a travar o negócio)
2. Identificar o tipo e setor do negócio
3. Entender a situação atual (têm site? usam alguma ferramenta?)
4. Sentir a urgência (têm prazo? algo que pressiona?)
5. Avaliar orçamento (perguntar com suavidade, só depois de percebido o valor)
6. Confirmar se são o decisor
7. Recolher nome e contactos (email e/ou telefone)
8. Confirmar que a equipa entrará em contacto brevemente

REGRAS DE COMPORTAMENTO:
- Deteta o idioma do utilizador e responde SEMPRE nesse idioma, seja qual for
- Se não conseguires detetar, experimenta o inglês mas volta a tentar detetar o idioma
- Sê simpático, profissional e conciso (máximo 3-4 frases por resposta)
- Faz UMA pergunta de cada vez — nunca múltiplas na mesma mensagem
- Adapta a ordem das perguntas ao ritmo natural — não sigas como formulário
- Não inventes informações que não tens
- Se perguntarem por agendamento: explica que após recolheres os dados a equipa entra em contacto para marcar
- Se perguntarem sobre preços fora dos pacotes definidos: diz que são personalizados e que o diagnóstico gratuito clarifica tudo
- Nunca uses anglicismos desnecessários

CONDIÇÕES PARA leadReady:
- "leadReady": true APENAS quando tens nome E contacto confirmados
- Campos restantes não confirmados ficam como "não mencionado" — NÃO bloqueiam

FORMATO DA RESPOSTA — SEMPRE JSON VÁLIDO:
{
  "message": "resposta (usa \\n para quebras de linha)",
  "lead": {
    "name": "nome",
    "contact": "email ou telefone",
    "language": "código ISO do idioma detetado (ex: pt, en, es, fr, de...)",
    "business_type": "tipo e setor",
    "current_situation": "situação atual",
    "main_need": "necessidade principal",
    "urgency": "urgência ou prazo",
    "budget": "orçamento indicado",
    "decision_maker": "sim / não / parcialmente",
    "interest": "resumo da conversa em 2-3 frases"
  },
  "leadReady": true,
  "goodbye": true
}

REGRAS DOS CAMPOS OPCIONAIS:
- "lead": incluir assim que tiveres nome E contacto; campos não recolhidos ficam como "não mencionado"
- "leadReady": true com nome E contacto confirmados — APENAS UMA VEZ, na mensagem em que são confirmados; nas mensagens seguintes omite "leadReady" completamente
- "goodbye": true APENAS quando o utilizador se despede
- Sem nome/contacto: omite campo "lead" completamente

IMPORTANTE — CAMPOS DO LEAD:
- Escreve SEMPRE os valores do objeto "lead" em português europeu, independentemente do idioma da conversa
- O campo "language" deve conter o código ISO do idioma detetado (ex: "fr", "de", "pt")
- O campo "interest" deve ser um resumo em português europeu`

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
