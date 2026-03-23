# PROMPT — Re-Evolution Landing Page
> Ficheiro de instruções para Claude Code. Lê na íntegra antes de escrever qualquer código.

---

## CONTEXTO

Este é o site institucional da **Re-Evolution, Serviços Digitais** — uma agência digital portuguesa. Não é um site de cliente, é o site da própria empresa. O nível de qualidade visual e técnico deve ser o mais alto possível: quem visita quer voltar a ver.

---

## 1. O QUE PRETENDO

Landing page profissional (qualidade €10.000) para a agência digital **Re-Evolution, Serviços Digitais**.

**Audiência:** proprietários e gestores de micro e pequenas empresas locais em Portugal, baixa literacia digital, 35–60 anos, tomam decisões pelo telemóvel.

**Design:** deslumbrante, moderno, memorável. Paleta: `#ffc700` (amarelo âncora), `#011b54` (azul dominante), brancos, pretos e azuis complementares que casem com `#011b54`. Cantos arredondados, animações suaves com Framer Motion, mobile-first absoluto.

---

## 2. DEPLOY — CLOUDFLARE PAGES + FUNCTIONS

- Usar adaptador `@cloudflare/next-on-pages`
- Build command: `npx @cloudflare/next-on-pages`
- O adaptador gera um diretório intermédio `.vercel/output/static` — este nome é uma convenção interna do adaptador, **não tem relação com o Vercel**. O deploy é feito para Cloudflare Pages. Não instalar nem referenciar nada do Vercel.
- Ficheiro `wrangler.toml` configurado para Cloudflare Pages
- Todas as API routes **obrigatoriamente** com Edge Runtime:
  ```typescript
  export const runtime = 'edge';
  ```
- Sem dependências Node.js nativas incompatíveis com Edge (sem `fs`, `path`, `crypto` nativo — usar Web Crypto API)
- `compatibility_date` atual no `wrangler.toml`
- Documentar em `/docs/CLOUDFLARE_DEPLOY.md` todo o processo de deploy

**Criar ficheiro `.dev.vars` na raiz do projeto** com o seguinte conteúdo (equivalente ao `.env` local para Cloudflare Pages):
```
GROQ_API_KEY=placeholder
TELEGRAM_BOT_TOKEN=placeholder
TELEGRAM_CHAT_ID=placeholder
MAKE_DIAGNOSTICO_WEBHOOK=placeholder
GA_MEASUREMENT_ID=placeholder
INTENT_ALERTS_ENABLED=false
```
Adicionar `.dev.vars` ao `.gitignore`. Documentar todas as variáveis em `/docs/CLOUDFLARE_DEPLOY.md` com descrição de onde obter cada valor.

---

## 3. SEO E PERFORMANCE

- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1, INP <200ms, TTFB <800ms
- Metadata completa: title (50–60 chars), description (150–160 chars)
- Open Graph + Twitter Cards (1200×630px e 1200×600px)
- Schema markup: `Organization` + `LocalBusiness` + `WebSite` + `BreadcrumbList`
- `sitemap.xml` automático, `robots.txt` configurado
- URLs semânticas, `hreflang` tags (pt/en/es), canonical URLs
- Alt text descritivo em todas as imagens
- Lazy loading + preload recursos críticos
- Lighthouse score target: **>90 em todas as métricas**

---

## 4. ESTRUTURA E SECÇÕES

### HEADER (fixo, com blur backdrop ao scroll)

- Logo SVG: `/public/images/logo/logo.svg`
- Menu com scroll suave: `Serviços | Como Funciona | Preços | Casos de Sucesso | Blog | Diagnóstico`
- Seletor de língua (canto superior direito): PT 🇵🇹 EN 🇬🇧 ES 🇪🇸 — dropdown elegante com bandeiras, muda URL e todo o conteúdo
- CTA: **"Diagnóstico Gratuito"** — fundo `#ffc700`, texto `#011b54`, bold, border-radius generoso
- Mobile: hamburger menu com drawer animado

---

### HERO (full viewport height)

- Background: gradiente `#011b54` → azul mais escuro, partículas animadas subtis (Framer Motion ou CSS puro) e grid abstrato em overlay
- **Título H1:** "O seu negócio merece estar no digital. Nós tratamos de tudo."
- **Subtítulo:** "Criamos o seu site, automatizamos as suas tarefas repetitivas e colocamos o seu negócio a aparecer no Google — sem que precise de saber tecnologia."
- **Badge animado:** "⚡ Entrega em 1 a 3 semanas"
- **CTAs:**
  - "Quero o meu diagnóstico gratuito" (fundo `#ffc700`, texto `#011b54`)
  - "Ver como funciona" (outline branco, scroll âncora para `#como-funciona`)
- Elemento visual: mockup animado de telemóvel/dashboard à direita (desktop) ou abaixo (mobile)

---

### SECÇÃO: O PROBLEMA `id="problema"`

- **Objetivo:** Espelhar as dores reais da persona sem alarmar
- **Título:** "Enquanto lê isto, os seus concorrentes estão a ganhar clientes online."
- **Layout:** 4 cards em grid (2×2 mobile, 4×1 desktop):
  1. "Não aparece no Google" — ícone lupa com X
  2. "Perde reservas para a concorrência" — ícone calendário
  3. "Tarefas manuais que roubam horas" — ícone relógio
  4. "Site desatualizado ou inexistente" — ícone monitor
- Cada card: ícone + frase problema + frase solução implícita em menor
- Tom: direto, sem jargão, reconhecível pela persona

---

### SECÇÃO: SERVIÇOS `id="servicos"`

- **Título:** "O que fazemos por si"
- **Layout:** 3 pilares em cards grandes com hover elevation

**Pilar 1 — Presença Digital Profissional**
Ícone: monitor/web
"O seu site, feito a pensar nos seus clientes. Rápido, bonito e que aparece no Google."
- Landing page profissional
- SEO local otimizado
- Google Business Profile
- Mobile-first

**Pilar 2 — Automações Inteligentes**
Ícone: engrenagens/raio
"Chega de tarefas repetitivas. Formulários, notificações, reservas e follow-ups — tudo automático."
- Notificações WhatsApp/Telegram
- Integração Google Sheets
- Respostas automáticas
- Sem código

**Pilar 3 — Assistente de IA 24/7**
Ícone: chat/robot
"Um assistente sempre disponível no seu site, que responde, qualifica e encaminha os seus clientes — mesmo quando está a dormir."
- Chatbot personalizado
- Qualificação de leads
- Multilingue
- Integrado no seu site

---

### SECÇÃO: COMO FUNCIONA `id="como-funciona"`

- **Título:** "Simples, rápido e sem surpresas"
- **Subtítulo:** "Da primeira conversa ao site no ar em 1 a 3 semanas."
- **Layout:** Timeline horizontal animada (entrada progressiva ao scroll), 4 passos:
  1. 🔍 **Diagnóstico Gratuito** — "Falamos sobre o seu negócio e o que precisa"
  2. 📋 **Proposta Clara** — "Recebe uma proposta detalhada sem letra pequena"
  3. 🚀 **Entrega Rápida** — "Desenvolvemos e entregamos em 1 a 3 semanas"
  4. 🤝 **Suporte Contínuo** — "Não desaparecemos após a entrega. Estamos sempre aqui."
- Mobile: timeline vertical

---

### SECÇÃO: DEMO DE AUTOMAÇÕES `id="automacoes"`

- **Objetivo:** Tornar o conceito de automação concreto e visual, sem jargão técnico
- **Título:** "Veja como funciona na prática"
- **Subtítulo:** "Escolha o seu tipo de negócio e veja o que seria automatizado."
- **Layout:** Tabs/selector com 4 opções: 🍽️ Restaurante | ⚖️ Advogado | 🏥 Clínica | 🏠 Imobiliário
- Cada tab mostra um fluxo animado (Framer Motion):
  - Nós de origem → setas animadas → nós de destino
  - **Exemplo Restaurante:** "Cliente preenche reserva online" → "Notificação imediata no WhatsApp" → "Dados guardados automaticamente" → "Email de confirmação enviado ao cliente"
  - Adaptar para cada setor com exemplos realistas
- Estilo visual: cards conectados por linhas animadas, cores da marca, ícones de apps reais (WhatsApp, Gmail, Google Sheets, Telegram)
- **CTA final:** "Quero isto para o meu negócio" (fundo `#ffc700`)

---

### SECÇÃO: PREÇOS `id="precos"`

- **Título:** "Preços claros, sem surpresas"
- **Subtítulo:** "Sabemos o que custa antes de começar. Sempre."
- **Layout:** 2 cards principais + nota add-ons

**Card 1 — Website Essencial**
Preço: **€500** (pagamento único)
Badge: "Mais popular"
Inclui: Landing page profissional | SEO básico | Google Business Profile | 1 mês suporte incluído | Mobile-first | Entrega em 1–3 semanas
CTA: "Quero este pacote"

**Card 2 — Automação Managed**
Preço: **€800 setup + €140/mês**
Badge: "Resultados contínuos"
Inclui: Tudo do Essencial | Automações personalizadas | Chatbot IA | Reunião mensal de análise | Suporte prioritário | Relatórios mensais
CTA: "Falar com a equipa"

**Nota add-ons:** "WhatsApp Business API, Relatórios Avançados e integrações específicas disponíveis como add-on. Fale connosco para um orçamento personalizado."

**Rodapé:** "Valores sem IVA. Sem contratos de permanência."

---

### SECÇÃO: CASOS DE SUCESSO `id="casos"`

- **Título:** "Negócios reais. Resultados reais."
- **Layout:** Card principal Arcadas do Fado + 2 slots placeholder

**Card — Arcadas do Fado** (restaurante de fado, Almancil, Algarve)
> "A Re-Evolution transformou a forma como recebemos reservas. O site ficou exatamente como queríamos e em menos de três semanas já estava no ar. Agora temos um processo automático que nos poupa horas todas as semanas."
> — Arcadas do Fado, Almancil

Tags: `#Restauração` `#Automações` `#Website`
Métricas: `[placeholder — a atualizar com dados reais]`

Slots placeholder (design idêntico): "Em breve — [Setor]"

---

### SECÇÃO: BLOG `id="blog"`

- **Título:** "Dicas e novidades para o seu negócio digital"
- **Layout:** Grid 3 cards (2 em mobile):
  - Imagem placeholder + categoria + título + data + "Ler mais"
- 3 artigos placeholder com títulos realistas:
  1. "Como aparecer no Google Maps em 2025 (guia para PMEs)"
  2. "5 tarefas que pode automatizar hoje sem saber tecnologia"
  3. "Porque é que o seu site precisa de ser rápido no telemóvel"
- CTA: "Ver todos os artigos" (link `/blog` — página a criar em fase 2)
- Nota no código: `// TODO: ligar a CMS (Contentful/Sanity) em fase 2`

---

### SECÇÃO: DIAGNÓSTICO GRATUITO `id="diagnostico"`

- **Design:** Full-width, fundo `#011b54`, texto branco — destaque máximo
- **Título:** "Pronto para transformar o seu negócio?"
- **Subtítulo:** "O diagnóstico é gratuito, sem compromisso e demora 2 minutos."
- **Formulário** (react-hook-form + zod):
  - Nome completo (obrigatório)
  - Email ou Telefone (obrigatório, validação)
  - Tipo de negócio (dropdown: Restaurante | Clínica/Saúde | Advogado/Jurídico | Imobiliário | Outro)
  - Principal problema (textarea, max 300 chars, opcional)
  - Honeypot field invisível (anti-spam)
  - Checkbox RGPD: "Concordo com a Política de Privacidade" (obrigatório, link para `/privacy-policy`)
- Submit: "Quero o meu diagnóstico gratuito" (fundo `#ffc700`, texto `#011b54`)
- Após submit: mensagem de sucesso animada

**API Route `/api/diagnostico` (Edge Runtime):**

Recebe:
```json
{
  "name": "string",
  "contact": "string",
  "business_type": "string",
  "main_problem": "string",
  "gdpr_consent": true
}
```

**Ação 1 — Telegram** (POST para bot Re-Evolution):
```
🔔 Novo Diagnóstico Re-Evolution

👤 Nome: {name}
📞 Contacto: {contact}
🏢 Negócio: {business_type}
💬 Problema: {main_problem}
📅 Data: {timestamp PT}
🌐 Fonte: formulário-site
```

**Ação 2 — Email de confirmação ao cliente** (via Make webhook):
- Subject: "Recebemos o seu pedido de diagnóstico — Re-Evolution"
- Body: confirmação amigável, próximos passos, contacto geral@re-evolution.pt

**Ação 3 — Make CRM webhook:**
```json
{
  "name": "string",
  "contact": "string",
  "business_type": "string",
  "main_problem": "string",
  "gdpr_consent": true,
  "timestamp": "ISO8601",
  "source": "diagnostico-form"
}
```
Registo em Google Sheets CRM.

**Variáveis de ambiente** (`.dev.vars` / Cloudflare secrets):
```
TELEGRAM_BOT_TOKEN=placeholder
TELEGRAM_CHAT_ID=placeholder
MAKE_DIAGNOSTICO_WEBHOOK=placeholder
GROQ_API_KEY=placeholder
GA_MEASUREMENT_ID=placeholder
INTENT_ALERTS_ENABLED=false
```

---

### SECÇÃO: FAQ `id="faq"`

- **Título:** "Perguntas frequentes"
- **Layout:** Accordion com animação Framer Motion
- 8 perguntas:
  1. "Preciso de saber tecnologia para trabalhar convosco?" — Não, tratamos de tudo.
  2. "Quanto tempo demora a ter o site no ar?" — Entre 1 e 3 semanas.
  3. "O que acontece depois da entrega?" — 1 mês de suporte incluído; Managed com acompanhamento contínuo.
  4. "Posso atualizar o site depois?" — Sim, com ou sem nós.
  5. "Os preços incluem IVA?" — Não, todos os valores são sem IVA.
  6. "Há contratos de permanência?" — Não no Essencial. O Managed é mensal, cancela quando quiser.
  7. "Trabalham fora de Lisboa?" — Sim, 100% remoto, em todo Portugal.
  8. "O chatbot fala português?" — Sim, e deteta automaticamente o idioma do visitante.

---

### FOOTER

- Logo SVG + tagline: "Transformação digital para o seu negócio local."
- Colunas: Serviços | Empresa | Legal | Contacto
- Redes sociais (ícones SVG): LinkedIn | Instagram | Facebook | YouTube
  - URLs em `/data/client-info.ts` — confirmar handles reais antes de deploy
- Contactos: geral@re-evolution.pt | +351 969 063 633
- Morada: Praceta José Régio 5 2º Dto, 2790-092 Carnaxide
- Links legais: Política de Privacidade | Termos de Serviço | Política de Cookies | Definições de Cookies
- Copyright © 2025 Re-Evolution, Serviços Digitais. Todos os direitos reservados.
- "Desenvolvido com ❤️ por Re-Evolution" (link https://re-evolution.pt)

---

### ELEMENTOS FLUTUANTES (sempre visíveis, z-index elevado)

- **Canto inferior esquerdo:** botão chatbot — ícone animado com pulse, cor `#ffc700`, abre widget de chat
- **Canto inferior direito:** botão WhatsApp — ícone oficial verde, link:
  `https://wa.me/351969063633?text=Ol%C3%A1%21%20Vim%20do%20site%20da%20Re-Evolution%20e%20gostaria%20de%20saber%20mais.`
- Mobile: ambos reduzem para ícone apenas (sem label)
- Quando teclado virtual está aberto (mobile): ambos ocultam via `visualViewport` API

---

## 5. DADOS DO CLIENTE

Criar ficheiro `/data/client-info.ts`:

```typescript
export const clientData = {
  business: {
    name: "Re-Evolution, Serviços Digitais",
    shortName: "Re-Evolution",
    nickname: "Reevo",
    tagline: "Transformação digital para o seu negócio local.",
    type: "agencia-digital",
  },
  contact: {
    address: "Praceta José Régio 5 2º Dto, 2790-092 Carnaxide",
    mobile: "+351 969 063 633",
    whatsapp: "351969063633",
    email: "geral@re-evolution.pt",
    googleMaps: "https://www.google.com/maps/place/Re-Evolution,+Digital+Services/@38.7277866,-9.2444714",
  },
  social: {
    linkedin: "https://linkedin.com/company/re-evolution-pt",   // confirmar URL real
    instagram: "https://instagram.com/reevolution.pt",          // confirmar URL real
    facebook: "https://facebook.com/reevolution.pt",            // confirmar URL real
    youtube: "https://youtube.com/@reevolution",                // confirmar URL real
  },
  brand: {
    colorPrimary: "#ffc700",
    colorDark: "#011b54",
    logoSvg: "/images/logo/logo.svg",
  },
  packages: [
    {
      id: "essencial",
      name: "Website Essencial",
      price: 500,
      type: "one-time",
      currency: "EUR",
    },
    {
      id: "managed",
      name: "Automação Managed",
      setupPrice: 800,
      monthlyPrice: 140,
      type: "setup-plus-monthly",
      currency: "EUR",
    },
  ],
}
```

---

## 6. TRADUÇÕES — NEXT-INTL (3 LÍNGUAS)

- `/messages/pt.json` — base, todas as strings
- `/messages/en.json` — inglês
- `/messages/es.json` — espanhol
- Routing: `/pt/` (default), `/en/`, `/es/`
- Seletor no header: PT 🇵🇹 EN 🇬🇧 ES 🇪🇸
- **NÃO traduzir:** nome do negócio, nomes próprios, moradas, emails, URLs

---

## 7. AUTOMAÇÕES

### Automação A — Chatbot de Qualificação de Leads (Groq/LLaMA)

**API Route `/api/chat` (Edge Runtime)**

System prompt completo:

```
És o Evo, assistente virtual da Re-Evolution, Serviços Digitais —
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
5. Avaliar orçamento (perguntar com suavidade, só depois de percebido
   o valor: "têm ideia do investimento que pensam fazer?")
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
- Se perguntarem por agendamento: explica que após recolheres os dados
  a equipa entra em contacto para marcar
- Se perguntarem sobre preços fora dos pacotes definidos: diz que são
  personalizados e que o diagnóstico gratuito clarifica tudo
- Nunca uses anglicismos desnecessários: "marcação" não "booking",
  "formulário" não "form", "ligação" não "link"

CONDIÇÕES PARA leadReady:
- "leadReady": true APENAS quando tens nome E contacto confirmados
- Campos restantes não confirmados ficam como "não mencionado" — NÃO bloqueiam
- Nunca esperes ter todos os campos para marcar leadReady como true

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
- "lead": incluir assim que tiveres nome E contacto; campos não
  recolhidos ficam como "não mencionado"; "interest" é resumo gerado por ti
- "leadReady": true com nome E contacto confirmados (outros campos
  em falta não bloqueiam)
- "goodbye": true APENAS quando o utilizador se despede
- Sem nome/contacto: omite campo "lead" completamente
```

**Modelo:** `llama-3.3-70b-versatile`
**Parâmetros:** `temperature: 0.7`, `max_tokens: 600`, `response_format: { type: 'json_object' }`

Quando `leadReady: true` → POST para Make webhook (`MAKE_DIAGNOSTICO_WEBHOOK`) com payload + `source: "chatbot"`

Quando `goodbye: true` → fechar widget após 3 segundos com animação de saída.

**Widget chatbot** (`/components/chat/`):
- Botão flutuante com ícone animado (pulse em `#ffc700`), canto inferior esquerdo
- Abre panel de chat com histórico da conversa
- Input de texto + botão enviar
- Indicador "a escrever..." enquanto aguarda resposta Groq
- Histórico guardado em `sessionStorage` (não persiste entre sessões)
- Scroll automático para última mensagem
- Botão fechar (X)

---

### Automação B — Formulário de Diagnóstico

Ver Secção `#diagnostico` acima. API Route: `/api/diagnostico`.

---

### Automação C — WhatsApp Click-to-Chat

Link direto:
```
https://wa.me/351969063633?text=Ol%C3%A1%21%20Vim%20do%20site%20da%20Re-Evolution%20e%20gostaria%20de%20saber%20mais.
```
Comportamento: abre nova aba (`target="_blank"`, `rel="noopener noreferrer"`).

---

### Automação D — Demo Visual de Automações

Ver Secção `#automacoes` acima. Apenas animações Framer Motion, sem backend.

---

### Automação E — Alerta de Intenção de Compra

Ficheiro `/lib/pricing-intent.ts`:
- `IntersectionObserver` na secção `#precos`
- Quando secção visível por >30 segundos: dispara GA4 custom event `pricing_intent` com `{ section: 'pricing', duration: 30 }`
- POST opcional para `/api/intent` (Edge Runtime) → Telegram alert:
  `"👀 Alguém passou 30s+ na secção de preços — {timestamp PT}"`
- Variável de ambiente: `INTENT_ALERTS_ENABLED=false` (desativar facilmente)
- Nota no código: `// TODO: desativar quando tráfego crescer`

---

## 8. ANALYTICS E TRACKING

**Google Analytics 4:**
- ID: `GA_MEASUREMENT_ID` (placeholder)
- Implementação: `@next/third-parties/google`
- GA4 e Clarity só carregam após consentimento analíticos

**Eventos GA4 a trackear:**

| Evento | Parâmetros |
|---|---|
| `cta_click` | `{ cta_name, section, language }` |
| `form_start` | `{ form_name: 'diagnostico' }` |
| `form_submit` | `{ form_name, business_type }` |
| `form_success` | `{ form_name }` |
| `chatbot_open` | `{}` |
| `chatbot_lead_ready` | `{}` |
| `whatsapp_click` | `{ source_section }` |
| `pricing_intent` | `{ duration: 30 }` |
| `language_switch` | `{ from, to }` |
| `demo_tab_click` | `{ business_type }` |
| `scroll_depth` | `{ depth: 25 \| 50 \| 75 \| 100 }` |

Cada secção com atributo `data-section` para tracking contextual.

Ficheiro `/lib/analytics.ts`:
```typescript
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}
```

---

## 9. CONSENTIMENTO DE COOKIES (RGPD)

Banner próprio (sem library externa pesada):
- Primeira visita: banner bottom com 3 opções: "Aceitar todos" | "Apenas necessários" | "Gerir preferências"
- Modal preferências: toggles por categoria:
  - Necessários (sempre ON, não desativável)
  - Funcionais (opt-in)
  - Analíticos (opt-in) — activa GA4 e Clarity
  - Marketing (opt-in)
- Guardar em `localStorage`: `reevo_cookie_consent`
- GA4 e Clarity só carregam após consentimento analíticos
- Respeitar `DNT` (Do Not Track) header
- Link "Definições de Cookies" no footer reabre modal
- Link para `/cookie-policy` no banner

---

## 10. SEGURANÇA

**`next.config.ts` — Security Headers:**

```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.groq.com https://api.telegram.org https://hook.eu1.make.com https://www.google-analytics.com",
      "frame-src 'self' https://www.google.com",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self)',
  },
]
```

**Rate limiting nas API routes (Edge-compatible):**
- `/api/chat` → máximo 20 req/min por IP
- `/api/diagnostico` → máximo 5 req/min por IP
- `/api/intent` → máximo 10 req/min por IP
- Implementar com Cloudflare KV ou headers simples

**Proteção formulários:**
- Honeypot field invisível (bots preenchem, humanos não)
- Validação server-side sempre (zod)
- Sanitizar todos os inputs
- Rate limiting por IP

**Ficheiro `/public/SECURITY.md`:**

```markdown
# Política de Segurança — Re-Evolution, Serviços Digitais

## Âmbito
Este documento aplica-se ao website re-evolution.pt e APIs associadas.

## Reporte de Vulnerabilidades
Email: geral@re-evolution.pt
Assunto: [SECURITY] descrição breve
Resposta: até 72 horas

## Medidas Implementadas
- HTTPS forçado (Cloudflare)
- Security headers completos (CSP, HSTS, X-Frame-Options)
- Rate limiting nas APIs
- Validação e sanitização de inputs (zod)
- Honeypot anti-spam nos formulários
- Sem dados sensíveis em logs
- Backups automáticos Cloudflare

## Boas Práticas (referência NIS2)
Embora não seja entidade essencial nos termos da Diretiva NIS2,
a Re-Evolution adopta boas práticas recomendadas: gestão de incidentes,
continuidade de serviço, segurança da cadeia de fornecimento e
formação de segurança.

## Responsável
Carlos Vale — geral@re-evolution.pt
Última atualização: 2025
```

---

## 11. PÁGINAS LEGAIS (RGPD + AI ACT)

> Pesquisar legislação atual antes de escrever. Texto em português jurídico correto.

### `/privacy-policy` — Política de Privacidade

**Responsável pelo Tratamento:**
Re-Evolution, Serviços Digitais
Praceta José Régio 5 2º Dto, 2790-092 Carnaxide
geral@re-evolution.pt | +351 969 063 633

**Dados recolhidos:**
- Formulário diagnóstico: nome, email/telefone, tipo negócio, descrição problema, consentimento RGPD
- Chatbot: transcrição da conversa (não persistida além da sessão)
- Automáticos: IP, browser, páginas visitadas, origem, interações, duração sessão (via GA4, com consentimento)

**Finalidades e bases legais:**
- Diagnóstico: processar pedido de contacto — Consentimento Art.6.º1a RGPD
- Analytics: melhorar UX — Consentimento Art.6.º1a RGPD
- Segurança: logs técnicos — Interesse legítimo Art.6.º1f RGPD

**Subcontratantes:** Google LLC (Analytics), Groq Inc. (IA chatbot), Make.com (automações), Cloudflare Inc. (hosting/CDN), Telegram Messenger (notificações internas)

**Transferências internacionais:** EUA — cláusulas contratuais tipo CE, Privacy Shield/DPA conforme fornecedor

**Secção IA (AI Act — em vigor desde 2 de fevereiro de 2025):**
Sistema de risco mínimo/limitado — chatbot de qualificação de leads.
Utilizador informado que interage com assistente virtual (IA).
Sem decisões exclusivamente automatizadas com efeitos jurídicos (Art.22.º RGPD).
Dados da conversa: processados por Groq Inc. (EUA), não persistidos além da sessão.
Base legal: consentimento + interesse legítimo.

**Direitos do titular:** acesso, retificação, apagamento, portabilidade, oposição, limitação, retirar consentimento — exercer via geral@re-evolution.pt, prazo 30 dias. Reclamação: CNPD (www.cnpd.pt)

---

### `/terms-of-service` — Termos de Serviço

Incluir obrigatoriamente:
1. Aceitação dos termos
2. Descrição dos serviços
3. Uso permitido e proibido
4. Propriedade intelectual (Re-Evolution retém direitos sobre código base; cliente retém direitos sobre o seu conteúdo)
5. Isenção de responsabilidade
6. Limitação de responsabilidade
7. Lei aplicável: portuguesa
8. Jurisdição: Comarca de Oeiras
9. Alterações com aviso prévio de 30 dias
10. Contacto

---

### `/cookie-policy` — Política de Cookies

Tabela de cookies por categoria (Nome | Fornecedor | Finalidade | Duração):
- **Necessários:** `reevo_cookie_consent` (Re-Evolution, preferências cookies, sessão)
- **Analíticos:** `_ga`, `_gid` (Google Analytics), `_clck`, `_clsk` (Clarity, se usado)
- **Marketing:** `_fbp`, `fr` (Meta, se usado)

Instruções de gestão por browser. Respeito pelo DNT (Do Not Track).
Link "Definições de Cookies" no footer reabre modal de consentimento.

---

## 12. IMAGENS E ASSETS

```
/public/images/
  /logo/
    logo.svg                    ← fonte principal (colocar aqui)
    logo-white.svg              ← versão branca para footer
    favicon.ico
    favicon-16x16.png
    favicon-32x32.png
    apple-touch-icon.png        ← 180×180px
    android-chrome-192x192.png
    android-chrome-512x512.png
  /hero/
    hero-bg.jpg                 ← 1920×1080, tons escuros, tecnologia/digital
  /cases/
    arcadas-do-fado.jpg         ← placeholder Unsplash restaurante português
  /blog/
    blog-placeholder-1.jpg
    blog-placeholder-2.jpg
    blog-placeholder-3.jpg
  /og/
    og-image.jpg                ← 1200×630, branded #011b54 + logo
  /icons/
    (SVGs custom: WhatsApp, Telegram, LinkedIn, Instagram, Facebook, YouTube)
```

**Favicon metadata em `/app/layout.tsx`:**
```typescript
icons: {
  icon: [
    { url: '/favicon.ico' },
    { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
  ],
  apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  other: [
    { url: '/android-chrome-192x192.png', sizes: '192x192' },
    { url: '/android-chrome-512x512.png', sizes: '512x512' },
  ],
}
```

Criar `/docs/IMAGE_SETUP.md` com:
- Lista de todas as imagens necessárias e dimensões
- Instruções para substituir placeholders Unsplash pelas imagens reais
- Como gerar favicons a partir do SVG (usar realfavicongenerator.net)
- Como gerar og-image branded

---

## 13. STACK E ESTRUTURA DE FICHEIROS

**Tecnologias:**
- Next.js 15+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS v4
- Framer Motion
- next-intl (PT/EN/ES)
- react-hook-form + zod
- @cloudflare/next-on-pages

**Estrutura de ficheiros:**
```
/app/
  /[locale]/
    layout.tsx
    page.tsx              ← apenas imports de secções, máx 20 linhas de imports
    /privacy-policy/
    /terms-of-service/
    /cookie-policy/
    /blog/
/components/
  /sections/              ← uma secção por ficheiro
  /ui/                    ← botões, cards, inputs reutilizáveis
  /chat/                  ← widget chatbot completo
  /forms/                 ← formulário diagnóstico
/data/
  client-info.ts
/lib/
  pricing-intent.ts
  analytics.ts
  rate-limit.ts
/messages/
  pt.json
  en.json
  es.json
/public/
  /images/
  SECURITY.md
/docs/
  CLOUDFLARE_DEPLOY.md
  AUTOMATIONS_SETUP.md
  IMAGE_SETUP.md
/wrangler.toml
/.dev.vars
/README.md
```

**Regra crítica:** NUNCA criar um `page.tsx` gigante. Cada secção é um componente modular importado.

**Acessibilidade WCAG 2.1 AA:**
- HTML semântico: `header`, `nav`, `main`, `section`, `footer`
- Alt text descritivo em todas as imagens
- ARIA labels em elementos interativos
- Contraste mínimo 4.5:1 (texto normal), 3:1 (texto grande)
- Navegação por teclado funcional
- Focus states visíveis
- Skip link "Saltar para conteúdo principal"
- Labels explícitos em todos os campos de formulário

**Performance:**
- `next/image` em todas as imagens, sem exceção
- Lazy loading (exceto above-the-fold)
- WebP com fallback JPEG
- Server Components por defeito; Client Components só onde há interatividade
- Preload Google Fonts
- Code splitting automático (App Router)

**Validações PT:**
- Caracteres especiais: `ç, á, é, í, ó, ú, â, ê, ô, à, ã, õ`
- Formato telefone PT: `+351 9XX XXX XXX`

---

## 14. DOCUMENTOS A CRIAR

**`/README.md`:**
- Overview do projeto
- Instalação: `npm install`
- Dev local: `npm run dev`
- Build Cloudflare: `npx @cloudflare/next-on-pages`
- Preview local: `npx wrangler pages dev`
- Estrutura do projeto
- Todas as variáveis de ambiente necessárias

**`/docs/CLOUDFLARE_DEPLOY.md`:**
- Setup Cloudflare Pages passo-a-passo
- Configuração `wrangler.toml`
- Adicionar secrets no dashboard Cloudflare
- Domínio custom `re-evolution.pt`
- GitHub Actions para deploy automático (push `main` → deploy automático)
- Troubleshooting Edge Runtime

**`/docs/AUTOMATIONS_SETUP.md`:**
- Setup Make.com para formulário de diagnóstico (3 ações paralelas)
- Configuração bot Telegram (obter token + chat ID)
- Google Sheets CRM — estrutura de colunas sugerida
- Como testar cada webhook individualmente
- Como substituir todos os placeholders por URLs reais

---

## 15. CHECKLIST DE VALIDAÇÃO FINAL

Antes de considerar o trabalho completo, verificar:

- [ ] `npx @cloudflare/next-on-pages` sem erros
- [ ] Zero warnings TypeScript (strict mode)
- [ ] Traduções completas (PT / EN / ES)
- [ ] Todos os links internos funcionam
- [ ] Formulário de diagnóstico valida, submete e mostra mensagem de sucesso
- [ ] Chatbot responde e recolhe lead corretamente
- [ ] Responsivo: 375px, 768px, 1440px, 1920px
- [ ] Animações suaves sem jank
- [ ] Lighthouse >90 em todas as métricas
- [ ] Metadata SEO completa
- [ ] Schema markup validado (schema.org validator)
- [ ] Favicons em todos os tamanhos
- [ ] Páginas legais RGPD + AI Act compliant
- [ ] Cookie banner funcional com todas as categorias
- [ ] GA4 tracking funcional (só após consentimento)
- [ ] Security headers configurados
- [ ] Rate limiting nas API routes
- [ ] Edge Runtime em todas as API routes
- [ ] `wrangler.toml` correto
- [ ] `.dev.vars` com todas as variáveis documentadas
- [ ] Honeypot anti-spam no formulário
- [ ] Elementos flutuantes (chatbot + WhatsApp) visíveis e funcionais
- [ ] Teclado virtual mobile oculta elementos flutuantes

> Se algo não souberes implementar: documentar em `/docs/USER_NOTES.md` com descrição clara do que falta e sugestões de como resolver.

---

*Fim do prompt — Re-Evolution, Serviços Digitais — re-evolution.pt*
