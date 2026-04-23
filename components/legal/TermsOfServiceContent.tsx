export default function TermsOfServiceContent({ locale }: { locale: string }) {
  if (locale === 'en') return <TermsEN />
  if (locale === 'es') return <TermsES />
  return <TermsPT />
}

function TermsPT() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Termos de Serviço</h1>
        <p className="text-gray-400 text-sm">Última atualização: Março de 2026 · Aplica-se ao website re-evolution.pt e a todos os serviços da Re-Evolution, Serviços Digitais</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">1. Aceitação dos Termos</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Ao aceder ao website <strong>re-evolution.pt</strong> ou ao contratar qualquer serviço da <strong>Re-Evolution, Serviços Digitais</strong>, declara ter lido, compreendido e aceite integralmente os presentes Termos de Serviço, bem como a nossa <a href="/pt/privacy-policy" className="text-[#011b54] hover:underline font-medium">Política de Privacidade</a> e <a href="/pt/cookie-policy" className="text-[#011b54] hover:underline font-medium">Política de Cookies</a>. Se não concordar com qualquer parte destes termos, não deverá utilizar os nossos serviços.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">2. Quem Somos</h2>
        <div className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-5 py-4 text-sm text-gray-700 space-y-1">
          <p><strong>Re-Evolution, Serviços Digitais</strong> — prestador de serviços de transformação digital para micro, pequenas e médias empresas.</p>
          <p>Sede: Praceta José Régio 5 2.º Dto, 2790-092 Carnaxide, Portugal</p>
          <p>Email: <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] hover:underline">geral@re-evolution.pt</a> · Telefone: <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a></p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">3. Descrição dos Serviços</h2>
        <p className="text-gray-600 text-sm mb-3">A Re-Evolution presta serviços que incluem, entre outros:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Presença Digital', desc: 'Criação de websites e landing pages profissionais, otimizados para mobile e para motores de busca.' },
            { title: 'SEO Local', desc: 'Otimização para motores de busca (SEO) e configuração do Google Business Profile.' },
            { title: 'Automações', desc: 'Desenvolvimento de fluxos automáticos (formulários, notificações, reservas, follow-ups) sem necessidade de código pelo cliente.' },
            { title: 'Chatbot IA', desc: 'Implementação de assistentes virtuais baseados em inteligência artificial para qualificação de leads e apoio ao cliente.' },
            { title: 'Diagnóstico Gratuito', desc: 'Análise gratuita e sem compromisso das necessidades digitais do negócio do cliente.' },
            { title: 'Consultoria Digital', desc: 'Aconselhamento estratégico em transformação digital para PMEs.' },
          ].map((s) => (
            <div key={s.title} className="rounded-xl border border-gray-100 px-4 py-3">
              <p className="font-semibold text-[#011b54] text-sm">{s.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-3">Os serviços específicos contratados, os respetivos preços, prazos e condições são definidos na proposta comercial aceite por ambas as partes.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">4. Processo de Contratação</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">A relação comercial inicia-se habitualmente com um diagnóstico gratuito, seguido da emissão de uma proposta detalhada. O contrato considera-se celebrado após confirmação escrita (email) pelo cliente da aceitação da proposta e, quando aplicável, recebimento do pagamento inicial acordado.</p>
        <p className="text-gray-600 text-sm leading-relaxed">Qualquer alteração ao âmbito acordado deve ser solicitada por escrito e poderá implicar ajuste de prazo e preço.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">5. Preços e Condições de Pagamento</h2>
        <ul className="text-gray-600 text-sm space-y-2">
          <li>Todos os preços apresentados no website são <strong>em euros, sem IVA</strong> (acresce IVA à taxa legal em vigor, atualmente 23%).</li>
          <li>Os preços específicos são definidos na proposta comercial. As condições standard são: <strong>50% na aceitação da proposta e 50% na entrega</strong>, salvo acordo em contrário.</li>
          <li>O pagamento é efetuado por transferência bancária para o IBAN indicado na fatura.</li>
          <li>Em caso de atraso no pagamento, a Re-Evolution reserva-se o direito de suspender o trabalho em curso e aplicar juros de mora à taxa legal.</li>
          <li>O pacote <em>Automação Managed</em> é faturado mensalmente, sem prazo mínimo de contrato — pode cancelar com aviso prévio de 30 dias.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">6. Prazos e Entrega</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">O prazo indicativo de entrega (1 a 3 semanas para o Website Essencial) conta a partir da aprovação da proposta e da receção dos conteúdos e materiais necessários pelo cliente. Atrasos na entrega de conteúdos pelo cliente podem implicar adiamento proporcional do prazo.</p>
        <p className="text-gray-600 text-sm leading-relaxed">A Re-Evolution compromete-se a comunicar proativamente qualquer imprevisto que possa afetar o prazo acordado.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">7. Propriedade Intelectual</h2>
        <ul className="text-gray-600 text-sm space-y-2">
          <li><strong>Conteúdos do cliente:</strong> o cliente mantém todos os direitos sobre os seus textos, imagens, logótipos e restantes conteúdos fornecidos. A Re-Evolution só os utiliza no âmbito do projeto contratado.</li>
          <li><strong>Código e produtos entregues:</strong> após liquidação integral, o cliente recebe licença irrevogável, não exclusiva e perpétua para utilizar o website e demais produtos entregues. A Re-Evolution retém os direitos sobre o código-base, componentes reutilizáveis, metodologias e templates proprietários.</li>
          <li><strong>Referência comercial:</strong> salvo instrução em contrário, a Re-Evolution pode mencionar o cliente como caso de sucesso e incluir o seu projeto no portefólio, respeitando sempre a confidencialidade dos dados do negócio.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">8. Obrigações do Cliente</h2>
        <p className="text-gray-600 text-sm mb-2">Para o bom desenvolvimento dos projetos, o cliente compromete-se a:</p>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Fornecer conteúdos, acessos e informações necessários em tempo útil.</li>
          <li>Designar um ponto de contacto com capacidade de decisão.</li>
          <li>Fornecer feedback em prazo razoável (máximo 5 dias úteis, salvo acordo).</li>
          <li>Não utilizar os serviços para fins ilegais, fraudulentos ou contrários à ética.</li>
          <li>Garantir que todos os conteúdos fornecidos estão livres de direitos de terceiros.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">9. Isenção e Limitação de Responsabilidade</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">O website e os serviços são fornecidos com a diligência profissional esperada. Contudo, a Re-Evolution não pode garantir resultados específicos de SEO, publicidade ou vendas, uma vez que estes dependem de fatores externos (algoritmos de motores de busca, comportamento do mercado, ações da concorrência).</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">A responsabilidade total da Re-Evolution perante o cliente, por qualquer causa, fica limitada ao valor total pago pelo serviço em causa nos últimos 12 meses.</p>
        <p className="text-gray-600 text-sm leading-relaxed">A Re-Evolution não é responsável por danos indiretos, perda de lucros, perda de dados ou danos consequentes, exceto em casos de dolo ou negligência grave.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">10. Uso Aceitável do Website</h2>
        <p className="text-gray-600 text-sm mb-2">Ao utilizar re-evolution.pt, compromete-se a não:</p>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Tentar aceder a sistemas, dados ou áreas não autorizadas.</li>
          <li>Realizar scraping automatizado sem autorização prévia por escrito.</li>
          <li>Introduzir vírus, malware ou qualquer código malicioso.</li>
          <li>Enviar comunicações não solicitadas (spam) através dos nossos formulários.</li>
          <li>Utilizar o site de forma a sobrecarregar ou prejudicar a sua disponibilidade.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">11. Confidencialidade</h2>
        <p className="text-gray-600 text-sm leading-relaxed">Ambas as partes comprometem-se a manter confidenciais todas as informações sensíveis partilhadas no âmbito da relação comercial. Esta obrigação mantém-se durante 3 anos após o término da relação contratual.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">12. Rescisão</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">Qualquer das partes pode rescindir a relação contratual com aviso prévio de 30 dias. Em caso de incumprimento grave, a parte lesada pode rescindir imediatamente e reclamar os danos.</p>
        <p className="text-gray-600 text-sm leading-relaxed">Em caso de rescisão pelo cliente durante um projeto em curso, serão devidos os trabalhos já realizados à data proporcional ao total acordado.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">13. Proteção de Dados</h2>
        <p className="text-gray-600 text-sm leading-relaxed">O tratamento de dados pessoais no âmbito da relação contratual rege-se pela nossa <a href="/pt/privacy-policy" className="text-[#011b54] hover:underline font-medium">Política de Privacidade</a>, em conformidade com o RGPD (Regulamento UE 2016/679). Em projetos que impliquem o tratamento de dados pessoais de clientes do cliente, será celebrado um Acordo de Tratamento de Dados (DPA) específico.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">14. Lei Aplicável e Foro Competente</h2>
        <p className="text-gray-600 text-sm leading-relaxed">Os presentes Termos regem-se exclusivamente pela <strong>lei portuguesa</strong>. Em caso de litígio, as partes acordam em recorrer, em primeira instância, a mediação através de um centro de arbitragem reconhecido. Não havendo acordo, será competente o <strong>Tribunal da Comarca de Oeiras</strong>, com expressa renúncia a qualquer outro foro.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">15. Alterações aos Termos</h2>
        <p className="text-gray-600 text-sm leading-relaxed">A Re-Evolution reserva-se o direito de atualizar estes Termos, notificando os clientes com contratos em vigor por email com antecedência mínima de 30 dias. A continuação da utilização dos serviços após a data de entrada em vigor das alterações implica a sua aceitação. A versão mais recente está sempre disponível nesta página.</p>
      </section>

      <section className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-6 py-5">
        <h2 className="text-xl font-bold text-[#011b54] mb-2">16. Contacto</h2>
        <p className="text-gray-600 text-sm">Para questões sobre estes Termos ou sobre os nossos serviços:</p>
        <p className="mt-2 text-sm">
          <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] font-semibold hover:underline">geral@re-evolution.pt</a>
          <span className="text-gray-400 mx-2">·</span>
          <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a>
        </p>
      </section>
    </div>
  )
}

function TermsEN() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm">Last updated: March 2026 · Applies to the website re-evolution.pt and all services of Re-Evolution, Serviços Digitais</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          By accessing the website <strong>re-evolution.pt</strong> or contracting any service from <strong>Re-Evolution, Serviços Digitais</strong>, you declare that you have read, understood and fully accepted these Terms of Service, as well as our <a href="/en/privacy-policy" className="text-[#011b54] hover:underline font-medium">Privacy Policy</a> and <a href="/en/cookie-policy" className="text-[#011b54] hover:underline font-medium">Cookie Policy</a>. If you do not agree with any part of these terms, you must not use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">2. Who We Are</h2>
        <div className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-5 py-4 text-sm text-gray-700 space-y-1">
          <p><strong>Re-Evolution, Serviços Digitais</strong> — provider of digital transformation services for micro, small and medium-sized enterprises.</p>
          <p>Registered address: Praceta José Régio 5 2.º Dto, 2790-092 Carnaxide, Portugal</p>
          <p>Email: <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] hover:underline">geral@re-evolution.pt</a> · Phone: <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a></p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">3. Description of Services</h2>
        <p className="text-gray-600 text-sm mb-3">Re-Evolution provides services including, but not limited to:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Digital Presence', desc: 'Creation of professional websites and landing pages, optimised for mobile and search engines.' },
            { title: 'Local SEO', desc: 'Search engine optimisation (SEO) and Google Business Profile setup.' },
            { title: 'Automations', desc: 'Development of automated workflows (forms, notifications, bookings, follow-ups) without any coding required by the client.' },
            { title: 'AI Chatbot', desc: 'Implementation of AI-based virtual assistants for lead qualification and customer support.' },
            { title: 'Free Diagnostic', desc: 'Free, no-obligation analysis of the digital needs of the client\'s business.' },
            { title: 'Digital Consultancy', desc: 'Strategic advice on digital transformation for SMEs.' },
          ].map((s) => (
            <div key={s.title} className="rounded-xl border border-gray-100 px-4 py-3">
              <p className="font-semibold text-[#011b54] text-sm">{s.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-3">The specific services contracted, their prices, deadlines and conditions are defined in the commercial proposal accepted by both parties.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">4. Contracting Process</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">The commercial relationship usually begins with a free diagnostic, followed by the issuance of a detailed proposal. The contract is considered concluded after written confirmation (email) by the client of the acceptance of the proposal and, where applicable, receipt of the agreed initial payment.</p>
        <p className="text-gray-600 text-sm leading-relaxed">Any change to the agreed scope must be requested in writing and may result in an adjustment of the deadline and price.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">5. Prices and Payment Terms</h2>
        <ul className="text-gray-600 text-sm space-y-2">
          <li>All prices shown on the website are <strong>in euros, excluding VAT</strong> (VAT at the current legal rate of 23% applies).</li>
          <li>Specific prices are defined in the commercial proposal. Standard conditions are: <strong>50% upon acceptance of the proposal and 50% upon delivery</strong>, unless otherwise agreed.</li>
          <li>Payment is made by bank transfer to the IBAN indicated on the invoice.</li>
          <li>In the event of late payment, Re-Evolution reserves the right to suspend work in progress and apply late payment interest at the legal rate.</li>
          <li>The <em>Managed Automation</em> package is billed monthly, with no minimum contract term — you may cancel with 30 days&apos; notice.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">6. Deadlines and Delivery</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">The indicative delivery period (1 to 3 weeks for the Essential Website) runs from the approval of the proposal and receipt of the necessary content and materials from the client. Delays in the delivery of content by the client may result in a proportional extension of the deadline.</p>
        <p className="text-gray-600 text-sm leading-relaxed">Re-Evolution undertakes to proactively communicate any unforeseen event that may affect the agreed deadline.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">7. Intellectual Property</h2>
        <ul className="text-gray-600 text-sm space-y-2">
          <li><strong>Client content:</strong> the client retains all rights over their texts, images, logos and other provided content. Re-Evolution only uses them within the scope of the contracted project.</li>
          <li><strong>Code and delivered products:</strong> upon full payment, the client receives an irrevocable, non-exclusive and perpetual licence to use the website and other delivered products. Re-Evolution retains rights over the codebase, reusable components, methodologies and proprietary templates.</li>
          <li><strong>Commercial reference:</strong> unless instructed otherwise, Re-Evolution may mention the client as a success story and include their project in the portfolio, always respecting the confidentiality of business data.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">8. Client Obligations</h2>
        <p className="text-gray-600 text-sm mb-2">To ensure the proper development of projects, the client undertakes to:</p>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Provide content, access and necessary information in a timely manner.</li>
          <li>Designate a point of contact with decision-making capacity.</li>
          <li>Provide feedback within a reasonable period (maximum 5 business days, unless agreed otherwise).</li>
          <li>Not use the services for illegal, fraudulent or unethical purposes.</li>
          <li>Ensure that all provided content is free from third-party rights.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">9. Disclaimer and Limitation of Liability</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">The website and services are provided with the expected professional diligence. However, Re-Evolution cannot guarantee specific SEO, advertising or sales results, as these depend on external factors (search engine algorithms, market behaviour, competitor actions).</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">Re-Evolution&apos;s total liability to the client, for any cause, is limited to the total amount paid for the service in question over the last 12 months.</p>
        <p className="text-gray-600 text-sm leading-relaxed">Re-Evolution is not liable for indirect damages, loss of profits, loss of data or consequential damages, except in cases of wilful misconduct or gross negligence.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">10. Acceptable Use of the Website</h2>
        <p className="text-gray-600 text-sm mb-2">By using re-evolution.pt, you agree not to:</p>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Attempt to access unauthorised systems, data or areas.</li>
          <li>Conduct automated scraping without prior written authorisation.</li>
          <li>Introduce viruses, malware or any malicious code.</li>
          <li>Send unsolicited communications (spam) through our forms.</li>
          <li>Use the site in a way that overloads or impairs its availability.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">11. Confidentiality</h2>
        <p className="text-gray-600 text-sm leading-relaxed">Both parties undertake to keep confidential all sensitive information shared in the context of the commercial relationship. This obligation shall remain in force for 3 years after the end of the contractual relationship.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">12. Termination</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">Either party may terminate the contractual relationship with 30 days&apos; notice. In the event of a material breach, the injured party may terminate immediately and claim damages.</p>
        <p className="text-gray-600 text-sm leading-relaxed">In the event of termination by the client during an ongoing project, the work already completed shall be due on a pro-rata basis of the total agreed amount.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">13. Data Protection</h2>
        <p className="text-gray-600 text-sm leading-relaxed">The processing of personal data within the contractual relationship is governed by our <a href="/en/privacy-policy" className="text-[#011b54] hover:underline font-medium">Privacy Policy</a>, in accordance with the GDPR (EU Regulation 2016/679). For projects involving the processing of the client&apos;s customers&apos; personal data, a specific Data Processing Agreement (DPA) will be concluded.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">14. Governing Law and Jurisdiction</h2>
        <p className="text-gray-600 text-sm leading-relaxed">These Terms are governed exclusively by <strong>Portuguese law</strong>. In the event of a dispute, the parties agree to first resort to mediation through a recognised arbitration centre. Failing agreement, the <strong>Court of the District of Oeiras (Portugal)</strong> shall have jurisdiction, with express waiver of any other forum.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">15. Changes to the Terms</h2>
        <p className="text-gray-600 text-sm leading-relaxed">Re-Evolution reserves the right to update these Terms, notifying clients with contracts in force by email at least 30 days in advance. Continued use of the services after the effective date of the changes implies their acceptance. The most recent version is always available on this page.</p>
      </section>

      <section className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-6 py-5">
        <h2 className="text-xl font-bold text-[#011b54] mb-2">16. Contact</h2>
        <p className="text-gray-600 text-sm">For questions about these Terms or our services:</p>
        <p className="mt-2 text-sm">
          <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] font-semibold hover:underline">geral@re-evolution.pt</a>
          <span className="text-gray-400 mx-2">·</span>
          <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a>
        </p>
      </section>
    </div>
  )
}

function TermsES() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Términos de Servicio</h1>
        <p className="text-gray-400 text-sm">Última actualización: Marzo de 2026 · Aplicable al sitio web re-evolution.pt y a todos los servicios de Re-Evolution, Serviços Digitais</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">1. Aceptación de los Términos</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Al acceder al sitio web <strong>re-evolution.pt</strong> o contratar cualquier servicio de <strong>Re-Evolution, Serviços Digitais</strong>, declara haber leído, comprendido y aceptado íntegramente los presentes Términos de Servicio, así como nuestra <a href="/es/privacy-policy" className="text-[#011b54] hover:underline font-medium">Política de Privacidad</a> y <a href="/es/cookie-policy" className="text-[#011b54] hover:underline font-medium">Política de Cookies</a>. Si no está de acuerdo con alguna parte de estos términos, no deberá utilizar nuestros servicios.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">2. Quiénes Somos</h2>
        <div className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-5 py-4 text-sm text-gray-700 space-y-1">
          <p><strong>Re-Evolution, Serviços Digitais</strong> — proveedor de servicios de transformación digital para microempresas y pequeñas y medianas empresas.</p>
          <p>Sede: Praceta José Régio 5 2.º Dto, 2790-092 Carnaxide, Portugal</p>
          <p>Correo: <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] hover:underline">geral@re-evolution.pt</a> · Teléfono: <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a></p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">3. Descripción de los Servicios</h2>
        <p className="text-gray-600 text-sm mb-3">Re-Evolution presta servicios que incluyen, entre otros:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Presencia Digital', desc: 'Creación de sitios web y páginas de aterrizaje profesionales, optimizados para dispositivos móviles y motores de búsqueda.' },
            { title: 'SEO Local', desc: 'Optimización para motores de búsqueda (SEO) y configuración de Google Business Profile.' },
            { title: 'Automatizaciones', desc: 'Desarrollo de flujos automatizados (formularios, notificaciones, reservas, seguimientos) sin necesidad de programación por parte del cliente.' },
            { title: 'Chatbot IA', desc: 'Implementación de asistentes virtuales basados en inteligencia artificial para la cualificación de leads y la atención al cliente.' },
            { title: 'Diagnóstico Gratuito', desc: 'Análisis gratuito y sin compromiso de las necesidades digitales del negocio del cliente.' },
            { title: 'Consultoría Digital', desc: 'Asesoramiento estratégico en transformación digital para pymes.' },
          ].map((s) => (
            <div key={s.title} className="rounded-xl border border-gray-100 px-4 py-3">
              <p className="font-semibold text-[#011b54] text-sm">{s.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-3">Los servicios específicos contratados, sus precios, plazos y condiciones se definen en la propuesta comercial aceptada por ambas partes.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">4. Proceso de Contratación</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">La relación comercial comienza habitualmente con un diagnóstico gratuito, seguido de la emisión de una propuesta detallada. El contrato se considera celebrado tras la confirmación por escrito (correo electrónico) del cliente de la aceptación de la propuesta y, cuando proceda, la recepción del pago inicial acordado.</p>
        <p className="text-gray-600 text-sm leading-relaxed">Cualquier modificación del alcance acordado deberá solicitarse por escrito y podrá implicar un ajuste del plazo y del precio.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">5. Precios y Condiciones de Pago</h2>
        <ul className="text-gray-600 text-sm space-y-2">
          <li>Todos los precios que aparecen en el sitio web están <strong>en euros, sin IVA</strong> (se aplica el IVA al tipo legal vigente, actualmente el 23%).</li>
          <li>Los precios específicos se definen en la propuesta comercial. Las condiciones estándar son: <strong>50% a la aceptación de la propuesta y 50% a la entrega</strong>, salvo acuerdo contrario.</li>
          <li>El pago se realiza mediante transferencia bancaria al IBAN indicado en la factura.</li>
          <li>En caso de retraso en el pago, Re-Evolution se reserva el derecho de suspender el trabajo en curso y aplicar intereses de demora al tipo legal.</li>
          <li>El paquete <em>Automatización Managed</em> se factura mensualmente, sin plazo mínimo de contrato — puede cancelar con un preaviso de 30 días.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">6. Plazos y Entrega</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">El plazo indicativo de entrega (1 a 3 semanas para el Sitio Web Esencial) se cuenta a partir de la aprobación de la propuesta y la recepción de los contenidos y materiales necesarios por parte del cliente. Los retrasos en la entrega de contenidos por parte del cliente pueden implicar un aplazamiento proporcional del plazo.</p>
        <p className="text-gray-600 text-sm leading-relaxed">Re-Evolution se compromete a comunicar de forma proactiva cualquier imprevisto que pueda afectar al plazo acordado.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">7. Propiedad Intelectual</h2>
        <ul className="text-gray-600 text-sm space-y-2">
          <li><strong>Contenidos del cliente:</strong> el cliente mantiene todos los derechos sobre sus textos, imágenes, logotipos y demás contenidos aportados. Re-Evolution solo los utiliza en el marco del proyecto contratado.</li>
          <li><strong>Código y productos entregados:</strong> tras el pago íntegro, el cliente recibe una licencia irrevocable, no exclusiva y perpetua para utilizar el sitio web y demás productos entregados. Re-Evolution conserva los derechos sobre el código base, los componentes reutilizables, las metodologías y las plantillas propietarias.</li>
          <li><strong>Referencia comercial:</strong> salvo instrucción en contrario, Re-Evolution puede mencionar al cliente como caso de éxito e incluir su proyecto en el porfolio, respetando siempre la confidencialidad de los datos del negocio.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">8. Obligaciones del Cliente</h2>
        <p className="text-gray-600 text-sm mb-2">Para el buen desarrollo de los proyectos, el cliente se compromete a:</p>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Proporcionar contenidos, accesos e información necesaria en tiempo y forma.</li>
          <li>Designar un punto de contacto con capacidad de decisión.</li>
          <li>Proporcionar retroalimentación en un plazo razonable (máximo 5 días hábiles, salvo acuerdo).</li>
          <li>No utilizar los servicios para fines ilegales, fraudulentos o contrarios a la ética.</li>
          <li>Garantizar que todos los contenidos aportados están libres de derechos de terceros.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">9. Exención y Limitación de Responsabilidad</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">El sitio web y los servicios se prestan con la diligencia profesional esperada. Sin embargo, Re-Evolution no puede garantizar resultados específicos de SEO, publicidad o ventas, ya que estos dependen de factores externos (algoritmos de los motores de búsqueda, comportamiento del mercado, acciones de la competencia).</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">La responsabilidad total de Re-Evolution frente al cliente, por cualquier causa, se limita al importe total pagado por el servicio en cuestión en los últimos 12 meses.</p>
        <p className="text-gray-600 text-sm leading-relaxed">Re-Evolution no es responsable de daños indirectos, lucro cesante, pérdida de datos ni daños consecuentes, excepto en casos de dolo o negligencia grave.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">10. Uso Aceptable del Sitio Web</h2>
        <p className="text-gray-600 text-sm mb-2">Al utilizar re-evolution.pt, se compromete a no:</p>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>Intentar acceder a sistemas, datos o áreas no autorizados.</li>
          <li>Realizar scraping automatizado sin autorización previa por escrito.</li>
          <li>Introducir virus, malware o cualquier código malicioso.</li>
          <li>Enviar comunicaciones no solicitadas (spam) a través de nuestros formularios.</li>
          <li>Utilizar el sitio de forma que sobrecargue o perjudique su disponibilidad.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">11. Confidencialidad</h2>
        <p className="text-gray-600 text-sm leading-relaxed">Ambas partes se comprometen a mantener la confidencialidad de toda la información sensible compartida en el marco de la relación comercial. Esta obligación se mantendrá vigente durante 3 años tras la finalización de la relación contractual.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">12. Resolución</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">Cualquiera de las partes podrá resolver la relación contractual con un preaviso de 30 días. En caso de incumplimiento grave, la parte perjudicada podrá resolver el contrato de inmediato y reclamar los daños.</p>
        <p className="text-gray-600 text-sm leading-relaxed">En caso de resolución por parte del cliente durante un proyecto en curso, serán debidos los trabajos ya realizados, en proporción al total acordado.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">13. Protección de Datos</h2>
        <p className="text-gray-600 text-sm leading-relaxed">El tratamiento de datos personales en el marco de la relación contractual se rige por nuestra <a href="/es/privacy-policy" className="text-[#011b54] hover:underline font-medium">Política de Privacidad</a>, de conformidad con el RGPD (Reglamento UE 2016/679). En proyectos que impliquen el tratamiento de datos personales de los clientes del cliente, se celebrará un Acuerdo de Tratamiento de Datos (DPA) específico.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">14. Ley Aplicable y Jurisdicción Competente</h2>
        <p className="text-gray-600 text-sm leading-relaxed">Los presentes Términos se rigen exclusivamente por la <strong>ley portuguesa</strong>. En caso de litigio, las partes acuerdan recurrir, en primera instancia, a la mediación a través de un centro de arbitraje reconocido. De no llegarse a un acuerdo, será competente el <strong>Juzgado del Distrito de Oeiras (Portugal)</strong>, con renuncia expresa a cualquier otro fuero.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">15. Cambios en los Términos</h2>
        <p className="text-gray-600 text-sm leading-relaxed">Re-Evolution se reserva el derecho de actualizar estos Términos, notificando a los clientes con contratos vigentes por correo electrónico con un mínimo de 30 días de antelación. La continuación del uso de los servicios tras la fecha de entrada en vigor de los cambios implica su aceptación. La versión más reciente estará siempre disponible en esta página.</p>
      </section>

      <section className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-6 py-5">
        <h2 className="text-xl font-bold text-[#011b54] mb-2">16. Contacto</h2>
        <p className="text-gray-600 text-sm">Para consultas sobre estos Términos o nuestros servicios:</p>
        <p className="mt-2 text-sm">
          <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] font-semibold hover:underline">geral@re-evolution.pt</a>
          <span className="text-gray-400 mx-2">·</span>
          <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a>
        </p>
      </section>
    </div>
  )
}
