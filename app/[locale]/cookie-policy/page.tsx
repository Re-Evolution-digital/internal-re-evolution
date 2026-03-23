import type { Metadata } from 'next'
import LegalLayout from '@/components/ui/LegalLayout'

export const metadata: Metadata = {
  title: 'Política de Cookies — Re-Evolution, Serviços Digitais',
  robots: { index: true, follow: true },
}

type Props = { params: Promise<{ locale: string }> }

export default async function CookiePolicy({ params }: Props) {
  const { locale } = await params

  return (
    <LegalLayout locale={locale}>
      <div className="prose prose-slate max-w-none">
        <div className="mb-8 pb-6 border-b border-gray-100">
          <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Política de Cookies</h1>
          <p className="text-gray-400 text-sm">Última atualização: Março de 2026</p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">O que são cookies?</h2>
          <p className="text-gray-600 leading-relaxed">
            Cookies são pequenos ficheiros de texto guardados no seu dispositivo (computador, telemóvel ou tablet) quando visita um website. Permitem que o site reconheça o seu browser nas visitas seguintes e melhore a sua experiência.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            A Re-Evolution, Serviços Digitais utiliza cookies para garantir o correto funcionamento do site, analisar o seu desempenho e, com o seu consentimento, melhorar continuamente a experiência de navegação.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-4">Cookies que utilizamos</h2>

          {/* Necessários */}
          <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 bg-[#011b54]">
              <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
              <h3 className="font-bold text-white text-base m-0">Cookies Necessários</h3>
              <span className="ml-auto text-xs text-white/60 font-medium">Sempre ativos</span>
            </div>
            <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">
              Essenciais para o funcionamento básico do site. Não podem ser desativados, pois sem eles o site não funciona corretamente. Não recolhem informação pessoal identificável.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm m-0">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-gray-700 w-48">Nome</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700">Fornecedor</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700">Finalidade</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700 w-28">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 font-mono text-xs text-[#011b54]">reevo_cookie_consent</td>
                    <td className="px-4 py-3 text-gray-600">Re-Evolution</td>
                    <td className="px-4 py-3 text-gray-600">Guarda as suas preferências de consentimento de cookies para não ser perguntado a cada visita</td>
                    <td className="px-4 py-3 text-gray-600">12 meses</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-[#011b54]">__cf_bm</td>
                    <td className="px-4 py-3 text-gray-600">Cloudflare</td>
                    <td className="px-4 py-3 text-gray-600">Proteção contra bots e ataques automatizados (segurança da infraestrutura)</td>
                    <td className="px-4 py-3 text-gray-600">30 minutos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Funcionais */}
          <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 bg-gray-700">
              <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
              <h3 className="font-bold text-white text-base m-0">Cookies Funcionais</h3>
              <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
            </div>
            <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">
              Permitem funcionalidades melhoradas e personalização, como a memória do idioma selecionado. Desativá-los pode limitar algumas funcionalidades do site.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm m-0">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-gray-700 w-48">Nome</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700">Fornecedor</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700">Finalidade</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700 w-28">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 font-mono text-xs text-[#011b54]">NEXT_LOCALE</td>
                    <td className="px-4 py-3 text-gray-600">Re-Evolution</td>
                    <td className="px-4 py-3 text-gray-600">Memoriza o idioma preferido (PT/EN/ES) para apresentar o site no idioma correto nas visitas seguintes</td>
                    <td className="px-4 py-3 text-gray-600">1 ano</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Analíticos */}
          <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 bg-blue-700">
              <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
              <h3 className="font-bold text-white text-base m-0">Cookies Analíticos</h3>
              <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
            </div>
            <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">
              Ajudam-nos a compreender como os visitantes utilizam o site, quais as páginas mais visitadas e como chegaram até nós. Toda a informação é agregada e anónima — não permite identificar utilizadores individualmente. Apenas ativados após o seu consentimento explícito.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm m-0">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-gray-700 w-48">Nome</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700">Fornecedor</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700">Finalidade</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700 w-28">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 font-mono text-xs text-[#011b54]">_ga</td>
                    <td className="px-4 py-3 text-gray-600">Google Analytics</td>
                    <td className="px-4 py-3 text-gray-600">Distingue utilizadores únicos, atribuindo um identificador aleatório gerado pelo Google</td>
                    <td className="px-4 py-3 text-gray-600">2 anos</td>
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-[#011b54]">_ga_XXXXXXXX</td>
                    <td className="px-4 py-3 text-gray-600">Google Analytics</td>
                    <td className="px-4 py-3 text-gray-600">Mantém o estado da sessão para o Google Analytics 4 (GA4)</td>
                    <td className="px-4 py-3 text-gray-600">2 anos</td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 font-mono text-xs text-[#011b54]">_gid</td>
                    <td className="px-4 py-3 text-gray-600">Google Analytics</td>
                    <td className="px-4 py-3 text-gray-600">Distingue utilizadores únicos, expira ao fim de 24 horas</td>
                    <td className="px-4 py-3 text-gray-600">24 horas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Marketing */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 bg-orange-600">
              <span className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />
              <h3 className="font-bold text-white text-base m-0">Cookies de Marketing</h3>
              <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
            </div>
            <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">
              Utilizados para apresentar anúncios relevantes em outras plataformas (retargeting). Atualmente <strong>não estão ativos</strong> por defeito e só serão utilizados com consentimento explícito. Indicados para referência futura caso a Re-Evolution venha a fazer campanhas pagas.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm m-0">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-gray-700 w-48">Nome</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700">Fornecedor</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700">Finalidade</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-700 w-28">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-3 font-mono text-xs text-[#011b54]">_fbp</td>
                    <td className="px-4 py-3 text-gray-600">Meta (Facebook/Instagram)</td>
                    <td className="px-4 py-3 text-gray-600">Identifica browsers para publicidade e análise de conversões no Meta Ads</td>
                    <td className="px-4 py-3 text-gray-600">3 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">Como gerir as suas preferências</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Pode alterar as suas preferências de cookies a qualquer momento clicando em <strong>&ldquo;Definições de Cookies&rdquo;</strong> no rodapé do site. O painel permite-lhe ativar ou desativar cada categoria individualmente, exceto os cookies necessários.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Pode também desativar cookies diretamente nas definições do seu browser. Atenção: desativar todos os cookies pode afetar o funcionamento de alguns sites que visita regularmente.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Google Chrome', path: 'Definições → Privacidade e segurança → Cookies e outros dados de sites' },
              { name: 'Mozilla Firefox', path: 'Definições → Privacidade e Segurança → Cookies e dados de sites' },
              { name: 'Apple Safari', path: 'Preferências → Privacidade → Gerir dados de sites' },
              { name: 'Microsoft Edge', path: 'Definições → Privacidade, pesquisa e serviços → Cookies' },
            ].map((b) => (
              <div key={b.name} className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="font-semibold text-[#011b54] text-sm mb-0.5">{b.name}</p>
                <p className="text-gray-500 text-xs">{b.path}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">Do Not Track (DNT)</h2>
          <p className="text-gray-600 leading-relaxed">
            Respeitamos o sinal &ldquo;Do Not Track&rdquo; configurado no seu browser. Se este sinal estiver ativo, não serão carregados cookies analíticos ou de marketing, independentemente das preferências guardadas.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#011b54] mb-3">Transferências internacionais</h2>
          <p className="text-gray-600 leading-relaxed">
            Alguns fornecedores de cookies (Google, Meta) estão sediados nos Estados Unidos da América. As transferências são efetuadas ao abrigo das Cláusulas Contratuais Tipo aprovadas pela Comissão Europeia, garantindo um nível de proteção equivalente ao exigido pelo RGPD.
          </p>
        </section>

        <section className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-6 py-5">
          <h2 className="text-xl font-bold text-[#011b54] mb-2">Dúvidas ou pedidos</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Se tiver questões sobre a nossa utilização de cookies ou quiser exercer os seus direitos ao abrigo do RGPD, contacte-nos:
          </p>
          <p className="mt-2 text-sm">
            <strong className="text-[#011b54]">Re-Evolution, Serviços Digitais</strong><br />
            <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] hover:underline">geral@re-evolution.pt</a>
            <span className="text-gray-400 mx-2">·</span>
            <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a>
          </p>
        </section>
      </div>
    </LegalLayout>
  )
}
