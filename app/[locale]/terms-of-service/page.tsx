import type { Metadata } from 'next'
import LegalLayout from '@/components/ui/LegalLayout'

export const metadata: Metadata = {
  title: 'Termos de Serviço — Re-Evolution, Serviços Digitais',
  robots: { index: true, follow: true },
}

type Props = { params: Promise<{ locale: string }> }

export default async function TermsOfService({ params }: Props) {
  const { locale } = await params

  return (
    <LegalLayout locale={locale}>
      <div className="prose prose-slate max-w-none">
        <div className="mb-8 pb-6 border-b border-gray-100">
          <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Termos de Serviço</h1>
          <p className="text-gray-400 text-sm">Última atualização: Março de 2026 · Aplica-se ao website re-evolution.pt e a todos os serviços da Re-Evolution, Serviços Digitais</p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">1. Aceitação dos Termos</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Ao aceder ao website <strong>re-evolution.pt</strong> ou ao contratar qualquer serviço da <strong>Re-Evolution, Serviços Digitais</strong>, declara ter lido, compreendido e aceite integralmente os presentes Termos de Serviço, bem como a nossa <a href={`/${locale}/privacy-policy`} target="_blank" className="text-[#011b54] hover:underline font-medium">Política de Privacidade</a> e <a href={`/${locale}/cookie-policy`} target="_blank" className="text-[#011b54] hover:underline font-medium">Política de Cookies</a>. Se não concordar com qualquer parte destes termos, não deverá utilizar os nossos serviços.
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
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            A relação comercial inicia-se habitualmente com um diagnóstico gratuito, seguido da emissão de uma proposta detalhada. O contrato considera-se celebrado após confirmação escrita (email) pelo cliente da aceitação da proposta e, quando aplicável, recebimento do pagamento inicial acordado.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Qualquer alteração ao âmbito acordado deve ser solicitada por escrito e poderá implicar ajuste de prazo e preço.
          </p>
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
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            O prazo indicativo de entrega (1 a 3 semanas para o Website Essencial) conta a partir da aprovação da proposta e da receção dos conteúdos e materiais necessários pelo cliente. Atrasos na entrega de conteúdos pelo cliente podem implicar adiamento proporcional do prazo.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            A Re-Evolution compromete-se a comunicar proativamente qualquer imprevisto que possa afetar o prazo acordado.
          </p>
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
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            O website e os serviços são fornecidos com a diligência profissional esperada. Contudo, a Re-Evolution não pode garantir resultados específicos de SEO, publicidade ou vendas, uma vez que estes dependem de fatores externos (algoritmos de motores de busca, comportamento do mercado, ações da concorrência).
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            A responsabilidade total da Re-Evolution perante o cliente, por qualquer causa, fica limitada ao valor total pago pelo serviço em causa nos últimos 12 meses.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            A Re-Evolution não é responsável por danos indiretos, perda de lucros, perda de dados ou danos consequentes, exceto em casos de dolo ou negligência grave.
          </p>
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
          <p className="text-gray-600 text-sm leading-relaxed">
            Ambas as partes comprometem-se a manter confidenciais todas as informações sensíveis partilhadas no âmbito da relação comercial. Esta obrigação mantém-se durante 3 anos após o término da relação contratual.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">12. Rescisão</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            Qualquer das partes pode rescindir a relação contratual com aviso prévio de 30 dias. Em caso de incumprimento grave, a parte lesada pode rescindir imediatamente e reclamar os danos.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Em caso de rescisão pelo cliente durante um projeto em curso, serão devidos os trabalhos já realizados à data proporcional ao total acordado.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">13. Proteção de Dados</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            O tratamento de dados pessoais no âmbito da relação contratual rege-se pela nossa <a href={`/${locale}/privacy-policy`} target="_blank" className="text-[#011b54] hover:underline font-medium">Política de Privacidade</a>, em conformidade com o RGPD (Regulamento UE 2016/679). Em projetos que impliquem o tratamento de dados pessoais de clientes do cliente, será celebrado um Acordo de Tratamento de Dados (DPA) específico.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">14. Lei Aplicável e Foro Competente</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Os presentes Termos regem-se exclusivamente pela <strong>lei portuguesa</strong>. Em caso de litígio, as partes acordam em recorrer, em primeira instância, a mediação através de um centro de arbitragem reconhecido. Não havendo acordo, será competente o <strong>Tribunal da Comarca de Oeiras</strong>, com expressa renúncia a qualquer outro foro.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">15. Alterações aos Termos</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            A Re-Evolution reserva-se o direito de atualizar estes Termos, notificando os clientes com contratos em vigor por email com antecedência mínima de 30 dias. A continuação da utilização dos serviços após a data de entrada em vigor das alterações implica a sua aceitação. A versão mais recente está sempre disponível nesta página.
          </p>
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
    </LegalLayout>
  )
}
