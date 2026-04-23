export default function PrivacyPolicyContent({ locale }: { locale: string }) {
  if (locale === 'en') return <PrivacyEN />
  if (locale === 'es') return <PrivacyES />
  return <PrivacyPT />
}

function PrivacyPT() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Política de Privacidade</h1>
        <p className="text-gray-400 text-sm">Última atualização: Março de 2026 · Regulamento (UE) 2016/679 (RGPD) · Regulamento (UE) 2024/1689 (AI Act)</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">1. Responsável pelo Tratamento</h2>
        <div className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-6 py-4 text-sm text-gray-700 space-y-1">
          <p><strong>Re-Evolution, Serviços Digitais</strong></p>
          <p>Praceta José Régio 5 2.º Dto, 2790-092 Carnaxide, Portugal</p>
          <p>Email: <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] hover:underline">geral@re-evolution.pt</a></p>
          <p>Telefone: <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a></p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">2. Dados Pessoais Recolhidos</h2>
        <h3 className="font-semibold text-[#011b54] mt-4 mb-2">2.1 Dados fornecidos pelo utilizador</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li><strong>Formulário de diagnóstico:</strong> nome completo, endereço de email ou número de telefone, tipo de negócio, descrição do problema, consentimento RGPD e registo da data e hora do pedido.</li>
          <li><strong>Chatbot Evo:</strong> transcrição da conversa durante a sessão de chat. Os dados são processados em tempo real pela Groq Inc. (EUA) e não são persistidos além da sessão de browser — são eliminados quando fecha ou atualiza a página.</li>
          <li><strong>Contacto direto:</strong> dados que nos enviar voluntariamente por email ou telefone.</li>
        </ul>
        <h3 className="font-semibold text-[#011b54] mt-4 mb-2">2.2 Dados recolhidos automaticamente (com consentimento)</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Endereço IP (anonimizado), tipo e versão de browser, sistema operativo, país de origem.</li>
          <li>Páginas visitadas, origem do tráfego (ex: pesquisa orgânica, redes sociais), duração da sessão, interações com elementos do site.</li>
          <li>Recolhidos exclusivamente via Google Analytics 4, após consentimento explícito para cookies analíticos.</li>
        </ul>
        <h3 className="font-semibold text-[#011b54] mt-4 mb-2">2.3 Dados de segurança (interesse legítimo)</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Logs técnicos de acesso para prevenção de ataques, fraude e uso abusivo das APIs — conservados por 30 dias e sem utilização para fins comerciais.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">3. Finalidades e Bases Legais</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm m-0">
            <thead>
              <tr className="bg-[#011b54] text-white text-left">
                <th className="px-4 py-3 font-semibold">Finalidade</th>
                <th className="px-4 py-3 font-semibold">Base Legal (RGPD)</th>
                <th className="px-4 py-3 font-semibold">Artigo</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Processar e responder ao pedido de diagnóstico gratuito', 'Consentimento', 'Art. 6.º, n.º 1, al. a)'],
                ['Qualificação de leads via chatbot', 'Consentimento + Interesse legítimo', 'Art. 6.º, n.º 1, al. a) e f)'],
                ['Envio de email de confirmação após pedido de diagnóstico', 'Execução de pré-contrato', 'Art. 6.º, n.º 1, al. b)'],
                ['Analytics: compreender o comportamento dos visitantes e melhorar o site', 'Consentimento', 'Art. 6.º, n.º 1, al. a)'],
                ['Segurança: prevenção de ataques e uso abusivo', 'Interesse legítimo', 'Art. 6.º, n.º 1, al. f)'],
              ].map(([fin, base, art], i) => (
                <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3 text-gray-700">{fin}</td>
                  <td className="px-4 py-3 text-gray-600">{base}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{art}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">4. Subcontratantes e Destinatários</h2>
        <p className="text-gray-600 text-sm mb-4">Os seus dados podem ser partilhados com os seguintes prestadores de serviços, que os tratam exclusivamente por nossa conta e segundo as nossas instruções:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Cloudflare, Inc.', role: 'Hosting, CDN e segurança do site', country: 'EUA / UE' },
            { name: 'Google LLC', role: 'Analytics (GA4) — apenas com consentimento', country: 'EUA' },
            { name: 'Groq, Inc.', role: 'Processamento IA do chatbot (sessão apenas)', country: 'EUA' },
            { name: 'Make.com (Celonis)', role: 'Automação de fluxos e CRM', country: 'EUA / UE' },
            { name: 'Telegram Messenger', role: 'Notificações internas à equipa', country: 'EUA' },
          ].map((s) => (
            <div key={s.name} className="rounded-xl border border-gray-100 px-4 py-3">
              <p className="font-semibold text-[#011b54] text-sm">{s.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.role}</p>
              <p className="text-gray-400 text-xs mt-0.5">Localização: {s.country}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-3">Não vendemos nem cedemos os seus dados pessoais a terceiros para fins de marketing.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">5. Transferências Internacionais de Dados</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Alguns subcontratantes estão estabelecidos nos Estados Unidos da América. As transferências são efetuadas ao abrigo de mecanismos legais adequados, nomeadamente as <strong>Cláusulas Contratuais Tipo</strong> (Standard Contractual Clauses) adotadas pela Comissão Europeia (Decisão de Execução UE 2021/914), garantindo um nível de proteção equivalente ao exigido pelo RGPD.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">6. Sistema de Inteligência Artificial — AI Act (Reg. UE 2024/1689)</h2>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-gray-700 space-y-2">
          <p>O site disponibiliza o chatbot <strong>Evo</strong>, um assistente virtual baseado em IA (modelo LLaMA 3.3, processado pela Groq, Inc.). Este sistema enquadra-se na categoria de <strong>risco mínimo/limitado</strong> ao abrigo do AI Act.</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>O utilizador é informado que interage com um assistente virtual (IA) e não com uma pessoa real.</li>
            <li>Não são tomadas decisões com efeitos jurídicos ou significativos baseadas exclusivamente no sistema de IA (Art. 22.º RGPD).</li>
            <li>Os dados da conversa são processados em tempo real e eliminados no final da sessão — não há persistência.</li>
            <li>A base legal é o consentimento (ao iniciar a conversa) e o interesse legítimo (qualificação comercial).</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">7. Conservação dos Dados</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm m-0">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Tipo de dado</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Período de conservação</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Dados do formulário de diagnóstico', '24 meses ou até pedido de apagamento'],
                ['Conversa do chatbot', 'Sessão de browser (eliminado ao fechar/atualizar)'],
                ['Dados analíticos (GA4)', '14 meses (configuração GA4)'],
                ['Logs de segurança', '30 dias'],
                ['Emails recebidos', '3 anos (prazo razoável para relações comerciais)'],
              ].map(([tipo, prazo], i) => (
                <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3 text-gray-700">{tipo}</td>
                  <td className="px-4 py-3 text-gray-600">{prazo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">8. Os Seus Direitos</h2>
        <p className="text-gray-600 text-sm mb-4">Ao abrigo do RGPD, tem os seguintes direitos, exercíveis gratuitamente com resposta no prazo de 30 dias:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { right: 'Acesso', desc: 'Saber quais dados pessoais tratamos sobre si e obter cópia.' },
            { right: 'Retificação', desc: 'Corrigir dados incorretos ou incompletos.' },
            { right: 'Apagamento', desc: 'Solicitar a eliminação dos seus dados ("direito ao esquecimento").' },
            { right: 'Portabilidade', desc: 'Receber os seus dados em formato estruturado e legível por máquina.' },
            { right: 'Oposição', desc: 'Opor-se ao tratamento baseado em interesse legítimo.' },
            { right: 'Limitação', desc: 'Suspender temporariamente o tratamento dos seus dados.' },
            { right: 'Retirar consentimento', desc: 'A qualquer momento, sem prejuízo da licitude do tratamento anterior.' },
            { right: 'Reclamação à CNPD', desc: 'Apresentar queixa à autoridade supervisora portuguesa.' },
          ].map((r) => (
            <div key={r.right} className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="font-semibold text-[#011b54] text-sm">{r.right}</p>
              <p className="text-gray-500 text-xs mt-0.5">{r.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-[#011b54]/10 bg-[#011b54]/5 px-5 py-4 text-sm">
          <p className="text-gray-700">Para exercer qualquer direito: <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] font-semibold hover:underline">geral@re-evolution.pt</a></p>
          <p className="text-gray-500 text-xs mt-1">CNPD — Comissão Nacional de Proteção de Dados: <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className="underline">www.cnpd.pt</a> · Rua de São Bento, 148-3.º, 1200-821 Lisboa</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">9. Segurança dos Dados</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Adotamos medidas técnicas e organizativas adequadas para proteger os seus dados: transmissão cifrada (HTTPS/TLS), headers de segurança (CSP, HSTS, X-Frame-Options), rate limiting nas APIs, validação e sanitização de todos os inputs, e acesso restrito aos dados apenas a pessoal autorizado.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">10. Alterações a Esta Política</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Esta política pode ser atualizada para refletir alterações legais ou nos nossos serviços. Em caso de alterações materiais, notificaremos os utilizadores com dados registados por email com antecedência mínima de 15 dias. A versão mais recente estará sempre disponível nesta página, com a data de atualização.
        </p>
      </section>
    </div>
  )
}

function PrivacyEN() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm">Last updated: March 2026 · Regulation (EU) 2016/679 (GDPR) · Regulation (EU) 2024/1689 (AI Act)</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">1. Data Controller</h2>
        <div className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-6 py-4 text-sm text-gray-700 space-y-1">
          <p><strong>Re-Evolution, Serviços Digitais</strong></p>
          <p>Praceta José Régio 5 2.º Dto, 2790-092 Carnaxide, Portugal</p>
          <p>Email: <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] hover:underline">geral@re-evolution.pt</a></p>
          <p>Phone: <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a></p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">2. Personal Data Collected</h2>
        <h3 className="font-semibold text-[#011b54] mt-4 mb-2">2.1 Data provided by the user</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li><strong>Diagnostic form:</strong> full name, email address or phone number, business type, problem description, GDPR consent, and a record of the date and time of the request.</li>
          <li><strong>Chatbot Evo:</strong> transcript of the conversation during the chat session. Data is processed in real time by Groq Inc. (USA) and is not retained beyond the browser session — it is deleted when you close or refresh the page.</li>
          <li><strong>Direct contact:</strong> data you voluntarily send us by email or phone.</li>
        </ul>
        <h3 className="font-semibold text-[#011b54] mt-4 mb-2">2.2 Automatically collected data (with consent)</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Anonymised IP address, browser type and version, operating system, country of origin.</li>
          <li>Pages visited, traffic source (e.g. organic search, social media), session duration, interactions with site elements.</li>
          <li>Collected exclusively via Google Analytics 4, after explicit consent for analytical cookies.</li>
        </ul>
        <h3 className="font-semibold text-[#011b54] mt-4 mb-2">2.3 Security data (legitimate interest)</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Technical access logs for attack prevention, fraud detection and API abuse — retained for 30 days and not used for commercial purposes.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">3. Purposes and Legal Bases</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm m-0">
            <thead>
              <tr className="bg-[#011b54] text-white text-left">
                <th className="px-4 py-3 font-semibold">Purpose</th>
                <th className="px-4 py-3 font-semibold">Legal Basis (GDPR)</th>
                <th className="px-4 py-3 font-semibold">Article</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Process and respond to the free diagnostic request', 'Consent', 'Art. 6(1)(a)'],
                ['Lead qualification via chatbot', 'Consent + Legitimate interest', 'Art. 6(1)(a) and (f)'],
                ['Sending confirmation email after diagnostic request', 'Pre-contractual performance', 'Art. 6(1)(b)'],
                ['Analytics: understand visitor behaviour and improve the site', 'Consent', 'Art. 6(1)(a)'],
                ['Security: attack prevention and abuse detection', 'Legitimate interest', 'Art. 6(1)(f)'],
              ].map(([purpose, basis, art], i) => (
                <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3 text-gray-700">{purpose}</td>
                  <td className="px-4 py-3 text-gray-600">{basis}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{art}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">4. Subprocessors and Recipients</h2>
        <p className="text-gray-600 text-sm mb-4">Your data may be shared with the following service providers, who process it exclusively on our behalf and according to our instructions:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Cloudflare, Inc.', role: 'Hosting, CDN and site security', country: 'USA / EU' },
            { name: 'Google LLC', role: 'Analytics (GA4) — only with consent', country: 'USA' },
            { name: 'Groq, Inc.', role: 'AI chatbot processing (session only)', country: 'USA' },
            { name: 'Make.com (Celonis)', role: 'Workflow automation and CRM', country: 'USA / EU' },
            { name: 'Telegram Messenger', role: 'Internal team notifications', country: 'USA' },
          ].map((s) => (
            <div key={s.name} className="rounded-xl border border-gray-100 px-4 py-3">
              <p className="font-semibold text-[#011b54] text-sm">{s.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.role}</p>
              <p className="text-gray-400 text-xs mt-0.5">Location: {s.country}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-3">We do not sell or transfer your personal data to third parties for marketing purposes.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">5. International Data Transfers</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Some subprocessors are established in the United States of America. Transfers are carried out under appropriate legal mechanisms, namely the <strong>Standard Contractual Clauses</strong> adopted by the European Commission (Implementing Decision EU 2021/914), ensuring a level of protection equivalent to that required by the GDPR.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">6. Artificial Intelligence System — AI Act (Reg. EU 2024/1689)</h2>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-gray-700 space-y-2">
          <p>The site provides the <strong>Evo</strong> chatbot, a virtual assistant based on AI (LLaMA 3.3 model, processed by Groq, Inc.). This system falls within the <strong>minimal/limited risk</strong> category under the AI Act.</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>The user is informed that they are interacting with a virtual assistant (AI) and not a real person.</li>
            <li>No decisions with legal or significant effects are made based solely on the AI system (Art. 22 GDPR).</li>
            <li>Conversation data is processed in real time and deleted at the end of the session — there is no persistence.</li>
            <li>The legal basis is consent (when starting the conversation) and legitimate interest (commercial qualification).</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">7. Data Retention</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm m-0">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Data type</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Retention period</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Diagnostic form data', '24 months or until erasure request'],
                ['Chatbot conversation', 'Browser session (deleted when closed/refreshed)'],
                ['Analytical data (GA4)', '14 months (GA4 configuration)'],
                ['Security logs', '30 days'],
                ['Received emails', '3 years (reasonable timeframe for commercial relationships)'],
              ].map(([type, period], i) => (
                <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3 text-gray-700">{type}</td>
                  <td className="px-4 py-3 text-gray-600">{period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">8. Your Rights</h2>
        <p className="text-gray-600 text-sm mb-4">Under the GDPR, you have the following rights, exercisable free of charge with a response within 30 days:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { right: 'Access', desc: 'Know what personal data we process about you and obtain a copy.' },
            { right: 'Rectification', desc: 'Correct inaccurate or incomplete data.' },
            { right: 'Erasure', desc: 'Request the deletion of your data ("right to be forgotten").' },
            { right: 'Portability', desc: 'Receive your data in a structured, machine-readable format.' },
            { right: 'Objection', desc: 'Object to processing based on legitimate interest.' },
            { right: 'Restriction', desc: 'Temporarily suspend the processing of your data.' },
            { right: 'Withdraw consent', desc: 'At any time, without affecting the lawfulness of prior processing.' },
            { right: 'Lodge a complaint', desc: 'File a complaint with the Portuguese supervisory authority (CNPD).' },
          ].map((r) => (
            <div key={r.right} className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="font-semibold text-[#011b54] text-sm">{r.right}</p>
              <p className="text-gray-500 text-xs mt-0.5">{r.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-[#011b54]/10 bg-[#011b54]/5 px-5 py-4 text-sm">
          <p className="text-gray-700">To exercise any right: <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] font-semibold hover:underline">geral@re-evolution.pt</a></p>
          <p className="text-gray-500 text-xs mt-1">CNPD — Comissão Nacional de Proteção de Dados (Portuguese Data Protection Authority): <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className="underline">www.cnpd.pt</a> · Rua de São Bento, 148-3.º, 1200-821 Lisboa</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">9. Data Security</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          We implement appropriate technical and organisational measures to protect your data: encrypted transmission (HTTPS/TLS), security headers (CSP, HSTS, X-Frame-Options), API rate limiting, validation and sanitisation of all inputs, and access to data restricted to authorised personnel only.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">10. Changes to This Policy</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          This policy may be updated to reflect legal changes or changes to our services. In the event of material changes, we will notify users with registered data by email at least 15 days in advance. The most recent version will always be available on this page, with the update date.
        </p>
      </section>
    </div>
  )
}

function PrivacyES() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Política de Privacidad</h1>
        <p className="text-gray-400 text-sm">Última actualización: Marzo de 2026 · Reglamento (UE) 2016/679 (RGPD) · Reglamento (UE) 2024/1689 (Reglamento IA)</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">1. Responsable del Tratamiento</h2>
        <div className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-6 py-4 text-sm text-gray-700 space-y-1">
          <p><strong>Re-Evolution, Serviços Digitais</strong></p>
          <p>Praceta José Régio 5 2.º Dto, 2790-092 Carnaxide, Portugal</p>
          <p>Correo: <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] hover:underline">geral@re-evolution.pt</a></p>
          <p>Teléfono: <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a></p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">2. Datos Personales Recopilados</h2>
        <h3 className="font-semibold text-[#011b54] mt-4 mb-2">2.1 Datos facilitados por el usuario</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li><strong>Formulario de diagnóstico:</strong> nombre completo, dirección de correo electrónico o número de teléfono, tipo de negocio, descripción del problema, consentimiento RGPD y registro de la fecha y hora de la solicitud.</li>
          <li><strong>Chatbot Evo:</strong> transcripción de la conversación durante la sesión de chat. Los datos son procesados en tiempo real por Groq Inc. (EE. UU.) y no se conservan más allá de la sesión del navegador — se eliminan al cerrar o actualizar la página.</li>
          <li><strong>Contacto directo:</strong> datos que nos envíe voluntariamente por correo electrónico o teléfono.</li>
        </ul>
        <h3 className="font-semibold text-[#011b54] mt-4 mb-2">2.2 Datos recogidos automáticamente (con consentimiento)</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Dirección IP anonimizada, tipo y versión del navegador, sistema operativo, país de origen.</li>
          <li>Páginas visitadas, origen del tráfico (p. ej. búsqueda orgánica, redes sociales), duración de la sesión, interacciones con elementos del sitio.</li>
          <li>Recogidos exclusivamente a través de Google Analytics 4, tras consentimiento explícito para cookies analíticas.</li>
        </ul>
        <h3 className="font-semibold text-[#011b54] mt-4 mb-2">2.3 Datos de seguridad (interés legítimo)</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Registros técnicos de acceso para la prevención de ataques, fraudes y uso abusivo de las APIs — conservados durante 30 días y sin uso para fines comerciales.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">3. Finalidades y Bases Legales</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm m-0">
            <thead>
              <tr className="bg-[#011b54] text-white text-left">
                <th className="px-4 py-3 font-semibold">Finalidad</th>
                <th className="px-4 py-3 font-semibold">Base Legal (RGPD)</th>
                <th className="px-4 py-3 font-semibold">Artículo</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Procesar y responder a la solicitud de diagnóstico gratuito', 'Consentimiento', 'Art. 6.1 a)'],
                ['Cualificación de leads mediante chatbot', 'Consentimiento + Interés legítimo', 'Art. 6.1 a) y f)'],
                ['Envío de correo de confirmación tras la solicitud de diagnóstico', 'Ejecución precontractual', 'Art. 6.1 b)'],
                ['Analítica: comprender el comportamiento de los visitantes y mejorar el sitio', 'Consentimiento', 'Art. 6.1 a)'],
                ['Seguridad: prevención de ataques y uso abusivo', 'Interés legítimo', 'Art. 6.1 f)'],
              ].map(([fin, base, art], i) => (
                <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3 text-gray-700">{fin}</td>
                  <td className="px-4 py-3 text-gray-600">{base}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{art}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">4. Subencargados y Destinatarios</h2>
        <p className="text-gray-600 text-sm mb-4">Sus datos pueden ser compartidos con los siguientes proveedores de servicios, que los tratan exclusivamente por nuestra cuenta y según nuestras instrucciones:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Cloudflare, Inc.', role: 'Alojamiento, CDN y seguridad del sitio', country: 'EE. UU. / UE' },
            { name: 'Google LLC', role: 'Analítica (GA4) — solo con consentimiento', country: 'EE. UU.' },
            { name: 'Groq, Inc.', role: 'Procesamiento IA del chatbot (solo sesión)', country: 'EE. UU.' },
            { name: 'Make.com (Celonis)', role: 'Automatización de flujos y CRM', country: 'EE. UU. / UE' },
            { name: 'Telegram Messenger', role: 'Notificaciones internas al equipo', country: 'EE. UU.' },
          ].map((s) => (
            <div key={s.name} className="rounded-xl border border-gray-100 px-4 py-3">
              <p className="font-semibold text-[#011b54] text-sm">{s.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.role}</p>
              <p className="text-gray-400 text-xs mt-0.5">Ubicación: {s.country}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-3">No vendemos ni cedemos sus datos personales a terceros con fines de marketing.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">5. Transferencias Internacionales de Datos</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Algunos subencargados están establecidos en los Estados Unidos de América. Las transferencias se realizan al amparo de mecanismos legales adecuados, en concreto las <strong>Cláusulas Contractuales Tipo</strong> adoptadas por la Comisión Europea (Decisión de Ejecución UE 2021/914), garantizando un nivel de protección equivalente al exigido por el RGPD.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">6. Sistema de Inteligencia Artificial — Reglamento IA (Reg. UE 2024/1689)</h2>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-gray-700 space-y-2">
          <p>El sitio ofrece el chatbot <strong>Evo</strong>, un asistente virtual basado en IA (modelo LLaMA 3.3, procesado por Groq, Inc.). Este sistema se encuadra en la categoría de <strong>riesgo mínimo/limitado</strong> conforme al Reglamento IA.</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>El usuario es informado de que interactúa con un asistente virtual (IA) y no con una persona real.</li>
            <li>No se toman decisiones con efectos jurídicos o significativos basadas exclusivamente en el sistema de IA (Art. 22 RGPD).</li>
            <li>Los datos de la conversación se procesan en tiempo real y se eliminan al finalizar la sesión — no hay persistencia.</li>
            <li>La base legal es el consentimiento (al iniciar la conversación) y el interés legítimo (cualificación comercial).</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">7. Conservación de los Datos</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm m-0">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Tipo de dato</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Período de conservación</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Datos del formulario de diagnóstico', '24 meses o hasta solicitud de supresión'],
                ['Conversación del chatbot', 'Sesión del navegador (eliminada al cerrar/actualizar)'],
                ['Datos analíticos (GA4)', '14 meses (configuración de GA4)'],
                ['Registros de seguridad', '30 días'],
                ['Correos electrónicos recibidos', '3 años (plazo razonable para relaciones comerciales)'],
              ].map(([tipo, plazo], i) => (
                <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-3 text-gray-700">{tipo}</td>
                  <td className="px-4 py-3 text-gray-600">{plazo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">8. Sus Derechos</h2>
        <p className="text-gray-600 text-sm mb-4">En virtud del RGPD, usted tiene los siguientes derechos, ejercibles gratuitamente con respuesta en un plazo de 30 días:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { right: 'Acceso', desc: 'Conocer qué datos personales tratamos sobre usted y obtener una copia.' },
            { right: 'Rectificación', desc: 'Corregir datos inexactos o incompletos.' },
            { right: 'Supresión', desc: 'Solicitar la eliminación de sus datos («derecho al olvido»).' },
            { right: 'Portabilidad', desc: 'Recibir sus datos en un formato estructurado y legible por máquina.' },
            { right: 'Oposición', desc: 'Oponerse al tratamiento basado en interés legítimo.' },
            { right: 'Limitación', desc: 'Suspender temporalmente el tratamiento de sus datos.' },
            { right: 'Retirar el consentimiento', desc: 'En cualquier momento, sin perjuicio de la licitud del tratamiento anterior.' },
            { right: 'Reclamación ante la CNPD', desc: 'Presentar una queja ante la autoridad supervisora portuguesa.' },
          ].map((r) => (
            <div key={r.right} className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="font-semibold text-[#011b54] text-sm">{r.right}</p>
              <p className="text-gray-500 text-xs mt-0.5">{r.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-[#011b54]/10 bg-[#011b54]/5 px-5 py-4 text-sm">
          <p className="text-gray-700">Para ejercer cualquier derecho: <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] font-semibold hover:underline">geral@re-evolution.pt</a></p>
          <p className="text-gray-500 text-xs mt-1">CNPD — Comissão Nacional de Proteção de Dados (Autoridad de Protección de Datos portuguesa): <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className="underline">www.cnpd.pt</a> · Rua de São Bento, 148-3.º, 1200-821 Lisboa</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">9. Seguridad de los Datos</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Adoptamos medidas técnicas y organizativas adecuadas para proteger sus datos: transmisión cifrada (HTTPS/TLS), cabeceras de seguridad (CSP, HSTS, X-Frame-Options), limitación de velocidad en las APIs, validación y saneamiento de todos los datos de entrada, y acceso a los datos restringido exclusivamente al personal autorizado.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">10. Cambios en esta Política</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Esta política puede actualizarse para reflejar cambios legales o en nuestros servicios. En caso de cambios materiales, notificaremos a los usuarios con datos registrados por correo electrónico con un mínimo de 15 días de antelación. La versión más reciente estará siempre disponible en esta página, con la fecha de actualización.
        </p>
      </section>
    </div>
  )
}
