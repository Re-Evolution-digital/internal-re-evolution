# Setup de Automações

## Visão Geral das Automações

| ID | Nome | Trigger | Ações |
|---|---|---|---|
| A | Chatbot de Qualificação | Mensagem no chat | Groq LLaMA → Make webhook (quando lead pronto) |
| B | Formulário de Diagnóstico | Submit do form | Telegram + Make webhook (email + CRM) |
| C | WhatsApp Click-to-Chat | Clique no botão | Abre WhatsApp (sem backend) |
| D | Demo Visual | Tab click | Animação Framer Motion (sem backend) |
| E | Alerta de Intenção | 30s na secção de preços | GA4 event + Telegram (opcional) |

---

## 1. Bot Telegram

### Criar bot
1. Abrir [@BotFather](https://t.me/BotFather) no Telegram
2. Enviar `/newbot`
3. Dar um nome ao bot (ex: "Re-Evolution Alerts")
4. Dar um username (ex: `reevolution_alerts_bot`)
5. Copiar o **token** gerado → `TELEGRAM_BOT_TOKEN`

### Obter Chat ID
1. Adicionar o bot a um grupo ou iniciar conversa direta
2. Enviar uma mensagem ao bot
3. Aceder a: `https://api.telegram.org/bot{TOKEN}/getUpdates`
4. Copiar o campo `chat.id` → `TELEGRAM_CHAT_ID`

---

## 2. Make.com — Cenário de Diagnóstico

Este cenário recebe os dados do formulário e executa 3 ações em paralelo:

### Setup
1. Criar conta em [make.com](https://www.make.com)
2. **Criar novo cenário**
3. Adicionar módulo: **Webhooks → Custom webhook**
4. Copiar a URL do webhook → `MAKE_DIAGNOSTICO_WEBHOOK`

### Estrutura do cenário (3 ações paralelas)

**Trigger:** Webhook (recebe JSON do `/api/diagnostico`)

**Rota 1 — Email de confirmação ao cliente:**
- Módulo: **Email** (Gmail ou SMTP)
- Para: `{{contact}}` (se for email)
- Assunto: `Recebemos o seu pedido de diagnóstico — Re-Evolution`
- Body: confirmação amigável com próximos passos

**Rota 2 — Registo no Google Sheets CRM:**
- Módulo: **Google Sheets → Add a Row**
- Spreadsheet: criar folha "CRM Diagnósticos"
- Colunas sugeridas:
  | Coluna | Campo |
  |---|---|
  | Data | `{{timestamp}}` |
  | Nome | `{{name}}` |
  | Contacto | `{{contact}}` |
  | Tipo Negócio | `{{business_type}}` |
  | Problema | `{{main_problem}}` |
  | Fonte | `{{source}}` |
  | Estado | (manual) |

**Rota 3 — Notificação interna (Slack/Email equipa):**
- Módulo: **Email** ou **Slack**
- Para: geral@re-evolution.pt
- Assunto: `[Novo Lead] {{name}} — {{business_type}}`

---

## 3. Google Sheets CRM — Estrutura

Criar spreadsheet "Re-Evolution CRM" com a seguinte estrutura:

| A: Data | B: Nome | C: Contacto | D: Tipo Negócio | E: Problema | F: Fonte | G: Estado | H: Notas |
|---|---|---|---|---|---|---|---|
| 2025-01-15 | João Silva | joao@email.pt | Restaurante | ... | diagnostico-form | Novo | |

---

## 4. Testar Webhooks Individualmente

### Testar Telegram
```bash
curl -X POST "https://api.telegram.org/bot{TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "{CHAT_ID}", "text": "Teste de notificação Re-Evolution"}'
```

### Testar Make webhook
```bash
curl -X POST "{MAKE_WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Webhook",
    "contact": "teste@re-evolution.pt",
    "business_type": "Restaurante",
    "main_problem": "Sem presença digital",
    "gdpr_consent": true,
    "timestamp": "2025-01-15T10:00:00Z",
    "source": "teste-manual"
  }'
```

### Testar API local
```bash
curl -X POST "http://localhost:3000/api/diagnostico" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "contact": "teste@exemplo.pt",
    "business_type": "Restaurante",
    "gdpr_consent": true
  }'
```

---

## 5. Substituir Todos os Placeholders

No ficheiro `.dev.vars`, substituir cada `placeholder`:

```bash
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
TELEGRAM_BOT_TOKEN=123456789:AAxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_CHAT_ID=-1001234567890
MAKE_DIAGNOSTICO_WEBHOOK=https://hook.eu1.make.com/xxxxxxxx
GA_MEASUREMENT_ID=G-XXXXXXXXXX
INTENT_ALERTS_ENABLED=false
```

Depois adicionar os mesmos como secrets no Cloudflare Pages Dashboard.
