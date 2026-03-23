export const runtime = 'edge'

import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(2000),
})

const requestSchema = z.object({
  messages: z.array(messageSchema).max(50),
})

function getIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown'
}

const SYSTEM_PROMPT = `És o Evo, assistente virtual da Re-Evolution, Serviços Digitais —
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
7. Recolher nome e contacto (email ou telefone)
8. Confirmar que a equipa entrará em contacto brevemente

REGRAS DE COMPORTAMENTO:
- Deteta o idioma do utilizador e responde SEMPRE nesse idioma (PT, EN, ES)
- Se não conseguires detetar, usa português europeu por defeito
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
- "leadReady": true com nome E contacto confirmados
- "goodbye": true APENAS quando o utilizador se despede
- Sem nome/contacto: omite campo "lead" completamente`

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

  let parsed2: Record<string, unknown>
  try {
    parsed2 = JSON.parse(groqData.choices[0].message.content) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Resposta inválida.' }, { status: 502 })
  }

  // If lead is ready, send to Make webhook
  if (parsed2.leadReady === true && parsed2.lead) {
    const makeWebhook = process.env.MAKE_DIAGNOSTICO_WEBHOOK
    if (makeWebhook && makeWebhook !== 'placeholder') {
      const lead = parsed2.lead as Record<string, unknown>
      await fetch(makeWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lead,
          timestamp: new Date().toISOString(),
          source: 'chatbot',
        }),
      }).catch(() => { /* non-critical */ })
    }
  }

  return Response.json(parsed2)
}
