# Deploy — Cloudflare Pages

## Visão Geral

Este projeto usa `@opennextjs/cloudflare` (OpenNext) para compilar Next.js 15 (App Router) para Cloudflare Pages com Edge Runtime.

**Nota:** O adaptador anterior `@cloudflare/next-on-pages` está deprecated. Este projeto usa o adaptador oficial recomendado: OpenNext para Cloudflare.

---

## Pré-requisitos

- Node.js 20+
- Conta Cloudflare (gratuita ou paga)
- Wrangler CLI: `npm install -g wrangler`
- Autenticação: `wrangler login`

---

## 1. Build Local

```bash
npm install
npm run build:cf
# ou: opennextjs-cloudflare build
```

O output fica em `.open-next/`.

---

## 2. Preview Local

```bash
npm run preview
# ou: opennextjs-cloudflare preview
```

---

## 3. Setup Cloudflare Pages (primeira vez)

1. Aceda a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Pages** → **Create a project** → **Connect to Git**
3. Selecione o repositório GitHub
4. Configurações de build:
   - **Framework preset:** Next.js
   - **Build command:** `npm run build:cf`
   - **Build output directory:** `.open-next/assets`
   - **Root directory:** `/` (raiz)
5. **Save and Deploy**

---

## 4. Variáveis de Ambiente / Secrets

No Dashboard Cloudflare: **Pages → Projeto → Settings → Environment Variables**

| Variável | Descrição | Onde obter |
|---|---|---|
| `GROQ_API_KEY` | Chave API Groq (LLaMA) | [console.groq.com](https://console.groq.com) → API Keys |
| `TELEGRAM_BOT_TOKEN` | Token do bot Telegram | [@BotFather](https://t.me/BotFather) no Telegram |
| `TELEGRAM_CHAT_ID` | ID do chat/grupo para notificações | [@userinfobot](https://t.me/userinfobot) ou API getUpdates |
| `MAKE_DIAGNOSTICO_WEBHOOK` | Webhook Make.com para diagnóstico | Make.com → Cenários → Webhook → URL |
| `GA_MEASUREMENT_ID` | ID Google Analytics 4 | GA4 Dashboard → Admin → Streams de dados |
| `INTENT_ALERTS_ENABLED` | Ativar alertas de intenção de compra | `true` ou `false` |

Para adicionar via CLI:
```bash
wrangler secret put GROQ_API_KEY
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
wrangler secret put MAKE_DIAGNOSTICO_WEBHOOK
```

---

## 5. Domínio Custom `re-evolution.pt`

1. **Pages → Projeto → Custom Domains** → Add domain
2. Introduza `re-evolution.pt` e `www.re-evolution.pt`
3. Cloudflare gera automaticamente certificado SSL
4. Se o domínio não estiver na Cloudflare: adicione os registos DNS indicados

---

## 6. GitHub Actions (Deploy Automático)

Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx @cloudflare/next-on-pages
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .vercel/output/static --project-name=re-evolution-site
```

**Secrets necessários no GitHub:**
- `CLOUDFLARE_API_TOKEN`: Dashboard Cloudflare → My Profile → API Tokens → Create Token (template: Edit Cloudflare Pages)
- `CLOUDFLARE_ACCOUNT_ID`: Dashboard Cloudflare → barra lateral direita

---

## 7. Troubleshooting Edge Runtime

**Erro: "Module not found: fs"**
→ Está a usar módulos Node.js nativos. Use a Web API equivalente (ex: `fetch` em vez de `http`, `crypto.subtle` em vez de `crypto`).

**Erro: "Dynamic server usage"**
→ Algum componente usa APIs disponíveis apenas em Node.js. Adicione `export const runtime = 'edge'` à route ou use `'use client'`.

**Verificar compatibilidade:**
```bash
npx @cloudflare/next-on-pages --info
```

---

## 8. wrangler.toml

```toml
name = "re-evolution-site"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

---

## 9. Checklist pré-deploy

- [ ] `.dev.vars` configurado com valores reais (não fazer commit)
- [ ] Todos os secrets adicionados no Dashboard Cloudflare
- [ ] `npx @cloudflare/next-on-pages` sem erros
- [ ] Preview local funcional: `npx wrangler pages dev`
- [ ] Domínio custom configurado
- [ ] DNS propagado (pode demorar até 48h)
