# Re-Evolution, Serviços Digitais — Site Institucional

Landing page profissional da Re-Evolution, Serviços Digitais. Construída com Next.js 15, Tailwind CSS v4, Framer Motion e preparada para deploy em Cloudflare Pages.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript (strict mode)
- **Estilos:** Tailwind CSS v4
- **Animações:** Framer Motion
- **Internacionalização:** next-intl (PT 🇵🇹 / EN 🇬🇧 / ES 🇪🇸)
- **Formulários:** react-hook-form + zod
- **Deploy:** Cloudflare Pages via `@cloudflare/next-on-pages`

## Instalação

```bash
npm install
```

## Desenvolvimento Local

```bash
npm run dev
```

O site fica disponível em `http://localhost:3000`. O middleware redireciona `/` para `/pt/`.

## Variáveis de Ambiente

Copiar `.dev.vars.example` para `.dev.vars` e preencher:

```
GROQ_API_KEY=          # API key Groq (LLaMA chatbot)
TELEGRAM_BOT_TOKEN=    # Token bot Telegram
TELEGRAM_CHAT_ID=      # ID chat Telegram
MAKE_DIAGNOSTICO_WEBHOOK= # Webhook Make.com
GA_MEASUREMENT_ID=     # ID Google Analytics 4
INTENT_ALERTS_ENABLED= # true/false
```

Ver `/docs/AUTOMATIONS_SETUP.md` para instruções detalhadas.

## Build para Cloudflare Pages

```bash
npm run build:cf
# ou: opennextjs-cloudflare build
```

Output: `.open-next/` (usa @opennextjs/cloudflare — adaptador oficial recomendado)

## Preview Local (Cloudflare)

```bash
npm run preview
# ou: opennextjs-cloudflare preview
```

## Estrutura do Projeto

```
/app/
  /[locale]/          # Rotas com suporte de idioma (pt/en/es)
    layout.tsx
    page.tsx
    /privacy-policy/
    /terms-of-service/
    /cookie-policy/
  /api/
    /chat/route.ts    # Chatbot Groq (Edge Runtime)
    /diagnostico/     # Formulário diagnóstico (Edge Runtime)
    /intent/          # Alerta intenção de compra (Edge Runtime)
/components/
  /sections/          # Uma secção por ficheiro
  /ui/                # Componentes reutilizáveis
  /chat/              # Widget chatbot completo
/data/
  client-info.ts      # Dados do cliente (contactos, preços, redes)
/docs/
  CLOUDFLARE_DEPLOY.md
  AUTOMATIONS_SETUP.md
  IMAGE_SETUP.md
/i18n/
  routing.ts
  request.ts
/lib/
  analytics.ts        # trackEvent GA4
  rate-limit.ts       # Rate limiting Edge-compatible
  pricing-intent.ts   # IntersectionObserver secção preços
/messages/
  pt.json             # Traduções PT (base)
  en.json             # Traduções EN
  es.json             # Traduções ES
/public/
  /images/            # Assets estáticos
  SECURITY.md         # Política de segurança pública
```

## Deploy

Ver `/docs/CLOUDFLARE_DEPLOY.md` para instruções completas incluindo:
- Setup Cloudflare Pages
- Configuração de secrets
- Domínio custom `re-evolution.pt`
- GitHub Actions (deploy automático)

## Automações

Ver `/docs/AUTOMATIONS_SETUP.md` para:
- Bot Telegram
- Make.com (formulário + CRM)
- Testes individuais

## Imagens

Ver `/docs/IMAGE_SETUP.md` para lista de imagens necessárias e como gerar favicons.
