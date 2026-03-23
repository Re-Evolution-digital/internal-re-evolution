import type { Metadata } from 'next'
import LegalLayout from '@/components/ui/LegalLayout'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Re-Evolution, Serviços Digitais',
  robots: { index: true, follow: true },
}

type Props = { params: Promise<{ locale: string }> }

export default async function PrivacyPolicy({ params }: Props) {
  const { locale } = await params

  return (
    <LegalLayout locale={locale}>
      <div className="prose prose-slate max-w-none">
        <div className="mb-8 pb-6 border-b border-gray-100">
          <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Política de Privacidade</h1>
          <p className="text-gray-400 text-sm">Última atualização: Março de 2026 · Regulamento (UE) 2016/679 (RGPD) · Regulamento (UE) 2024/1689 (AI Act)</p>
        </div>

        {/* 1. Responsável */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">1. Responsável pelo Tratamento</h2>
          <div className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-6 py-4 text-sm text-gray-700 space-y-1">
            <p><strong>Re-Evolution, Serviços Digitais</strong></p>
            <p>Praceta José Régio 5 2.º Dto, 2790-092 Carnaxide, Portugal</p>
            <p>Email: <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] hover:underline">geral@re-evolution.pt</a></p>
            <p>Telefone: <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a></p>
          </div>
        </section>

        {/* 2. Dados recolhidos */}
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

        {/* 3. Finalidades e bases legais */}
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

        {/* 4. Subcontratantes */}
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

        {/* 5. Transferências internacionais */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">5. Transferências Internacionais de Dados</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Alguns subcontratantes estão estabelecidos nos Estados Unidos da América. As transferências são efetuadas ao abrigo de mecanismos legais adequados, nomeadamente as <strong>Cláusulas Contratuais Tipo</strong> (Standard Contractual Clauses) adotadas pela Comissão Europeia (Decisão de Execução UE 2021/914), garantindo um nível de proteção equivalente ao exigido pelo RGPD.
          </p>
        </section>

        {/* 6. IA */}
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

        {/* 7. Conservação */}
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

        {/* 8. Direitos */}
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

        {/* 9. Segurança */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">9. Segurança dos Dados</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Adotamos medidas técnicas e organizativas adequadas para proteger os seus dados: transmissão cifrada (HTTPS/TLS), headers de segurança (CSP, HSTS, X-Frame-Options), rate limiting nas APIs, validação e sanitização de todos os inputs, e acesso restrito aos dados apenas a pessoal autorizado.
          </p>
        </section>

        {/* 10. Alterações */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">10. Alterações a Esta Política</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Esta política pode ser atualizada para refletir alterações legais ou nos nossos serviços. Em caso de alterações materiais, notificaremos os utilizadores com dados registados por email com antecedência mínima de 15 dias. A versão mais recente estará sempre disponível nesta página, com a data de atualização.
          </p>
        </section>
      </div>
    </LegalLayout>
  )
}
