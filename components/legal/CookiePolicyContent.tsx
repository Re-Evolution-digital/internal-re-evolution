export default function CookiePolicyContent({ locale }: { locale: string }) {
  if (locale === 'en') return <CookiesEN />
  if (locale === 'es') return <CookiesES />
  return <CookiesPT />
}

const cookieTableHeaders = {
  pt: { name: 'Nome', provider: 'Fornecedor', purpose: 'Finalidade', duration: 'Duração' },
  en: { name: 'Name', provider: 'Provider', purpose: 'Purpose', duration: 'Duration' },
  es: { name: 'Nombre', provider: 'Proveedor', purpose: 'Finalidad', duration: 'Duración' },
}

function CookieTable({ locale, rows }: { locale: string; rows: string[][] }) {
  const h = cookieTableHeaders[locale as keyof typeof cookieTableHeaders] ?? cookieTableHeaders.en
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm m-0">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-2.5 font-semibold text-gray-700 w-48">{h.name}</th>
            <th className="px-4 py-2.5 font-semibold text-gray-700">{h.provider}</th>
            <th className="px-4 py-2.5 font-semibold text-gray-700">{h.purpose}</th>
            <th className="px-4 py-2.5 font-semibold text-gray-700 w-28">{h.duration}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, provider, purpose, duration], i) => (
            <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
              <td className="px-4 py-3 font-mono text-xs text-[#011b54]">{name}</td>
              <td className="px-4 py-3 text-gray-600">{provider}</td>
              <td className="px-4 py-3 text-gray-600">{purpose}</td>
              <td className="px-4 py-3 text-gray-600">{duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CookiesPT() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Política de Cookies</h1>
        <p className="text-gray-400 text-sm">Última atualização: Março de 2026</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">O que são cookies?</h2>
        <p className="text-gray-600 leading-relaxed">Cookies são pequenos ficheiros de texto guardados no seu dispositivo (computador, telemóvel ou tablet) quando visita um website. Permitem que o site reconheça o seu browser nas visitas seguintes e melhore a sua experiência.</p>
        <p className="text-gray-600 leading-relaxed mt-2">A Re-Evolution, Serviços Digitais utiliza cookies para garantir o correto funcionamento do site, analisar o seu desempenho e, com o seu consentimento, melhorar continuamente a experiência de navegação.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">Cookies que utilizamos</h2>

        <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-[#011b54]">
            <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Cookies Necessários</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Sempre ativos</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Essenciais para o funcionamento básico do site. Não podem ser desativados, pois sem eles o site não funciona corretamente. Não recolhem informação pessoal identificável.</p>
          <CookieTable locale="pt" rows={[
            ['reevo_cookie_consent', 'Re-Evolution', 'Guarda as suas preferências de consentimento de cookies para não ser perguntado a cada visita', '12 meses'],
            ['__cf_bm', 'Cloudflare', 'Proteção contra bots e ataques automatizados (segurança da infraestrutura)', '30 minutos'],
          ]} />
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-gray-700">
            <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Cookies Funcionais</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Permitem funcionalidades melhoradas e personalização, como a memória do idioma selecionado. Desativá-los pode limitar algumas funcionalidades do site.</p>
          <CookieTable locale="pt" rows={[
            ['NEXT_LOCALE', 'Re-Evolution', 'Memoriza o idioma preferido (PT/EN/ES) para apresentar o site no idioma correto nas visitas seguintes', '1 ano'],
          ]} />
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-blue-700">
            <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Cookies Analíticos</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Ajudam-nos a compreender como os visitantes utilizam o site, quais as páginas mais visitadas e como chegaram até nós. Toda a informação é agregada e anónima. Apenas ativados após o seu consentimento explícito.</p>
          <CookieTable locale="pt" rows={[
            ['_ga', 'Google Analytics', 'Distingue utilizadores únicos, atribuindo um identificador aleatório gerado pelo Google', '2 anos'],
            ['_ga_XXXXXXXX', 'Google Analytics', 'Mantém o estado da sessão para o Google Analytics 4 (GA4)', '2 anos'],
            ['_gid', 'Google Analytics', 'Distingue utilizadores únicos, expira ao fim de 24 horas', '24 horas'],
          ]} />
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-orange-600">
            <span className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Cookies de Marketing</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Utilizados para apresentar anúncios relevantes em outras plataformas (retargeting). Atualmente <strong>não estão ativos</strong> por defeito e só serão utilizados com consentimento explícito.</p>
          <CookieTable locale="pt" rows={[
            ['_fbp', 'Meta (Facebook/Instagram)', 'Identifica browsers para publicidade e análise de conversões no Meta Ads', '3 meses'],
          ]} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">Como gerir as suas preferências</h2>
        <p className="text-gray-600 leading-relaxed mb-4">Pode alterar as suas preferências de cookies a qualquer momento clicando em <strong>&ldquo;Definições de Cookies&rdquo;</strong> no rodapé do site. O painel permite-lhe ativar ou desativar cada categoria individualmente, exceto os cookies necessários.</p>
        <p className="text-gray-600 leading-relaxed mb-4">Pode também desativar cookies diretamente nas definições do seu browser. Atenção: desativar todos os cookies pode afetar o funcionamento de alguns sites que visita regularmente.</p>
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
        <p className="text-gray-600 leading-relaxed">Respeitamos o sinal &ldquo;Do Not Track&rdquo; configurado no seu browser. Se este sinal estiver ativo, não serão carregados cookies analíticos ou de marketing, independentemente das preferências guardadas.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">Transferências internacionais</h2>
        <p className="text-gray-600 leading-relaxed">Alguns fornecedores de cookies (Google, Meta) estão sediados nos Estados Unidos da América. As transferências são efetuadas ao abrigo das Cláusulas Contratuais Tipo aprovadas pela Comissão Europeia, garantindo um nível de proteção equivalente ao exigido pelo RGPD.</p>
      </section>

      <section className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-6 py-5">
        <h2 className="text-xl font-bold text-[#011b54] mb-2">Dúvidas ou pedidos</h2>
        <p className="text-gray-600 text-sm leading-relaxed">Se tiver questões sobre a nossa utilização de cookies ou quiser exercer os seus direitos ao abrigo do RGPD, contacte-nos:</p>
        <p className="mt-2 text-sm">
          <strong className="text-[#011b54]">Re-Evolution, Serviços Digitais</strong><br />
          <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] hover:underline">geral@re-evolution.pt</a>
          <span className="text-gray-400 mx-2">·</span>
          <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a>
        </p>
      </section>
    </div>
  )
}

function CookiesEN() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Cookie Policy</h1>
        <p className="text-gray-400 text-sm">Last updated: March 2026</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">What are cookies?</h2>
        <p className="text-gray-600 leading-relaxed">Cookies are small text files stored on your device (computer, phone or tablet) when you visit a website. They allow the site to recognise your browser on subsequent visits and improve your experience.</p>
        <p className="text-gray-600 leading-relaxed mt-2">Re-Evolution, Serviços Digitais uses cookies to ensure the correct functioning of the site, analyse its performance and, with your consent, continuously improve your browsing experience.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">Cookies we use</h2>

        <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-[#011b54]">
            <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Necessary Cookies</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Always active</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Essential for the basic functioning of the site. They cannot be disabled, as without them the site will not work correctly. They do not collect personally identifiable information.</p>
          <CookieTable locale="en" rows={[
            ['reevo_cookie_consent', 'Re-Evolution', 'Saves your cookie consent preferences so you are not asked on every visit', '12 months'],
            ['__cf_bm', 'Cloudflare', 'Protection against bots and automated attacks (infrastructure security)', '30 minutes'],
          ]} />
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-gray-700">
            <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Functional Cookies</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Enable enhanced functionality and personalisation, such as remembering the selected language. Disabling them may limit some site features.</p>
          <CookieTable locale="en" rows={[
            ['NEXT_LOCALE', 'Re-Evolution', 'Remembers the preferred language (PT/EN/ES) to display the site in the correct language on subsequent visits', '1 year'],
          ]} />
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-blue-700">
            <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Analytics Cookies</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Help us understand how visitors use the site, which pages are most visited and how they found us. All information is aggregated and anonymous. Only activated after your explicit consent.</p>
          <CookieTable locale="en" rows={[
            ['_ga', 'Google Analytics', 'Distinguishes unique users by assigning a random identifier generated by Google', '2 years'],
            ['_ga_XXXXXXXX', 'Google Analytics', 'Maintains session state for Google Analytics 4 (GA4)', '2 years'],
            ['_gid', 'Google Analytics', 'Distinguishes unique users, expires after 24 hours', '24 hours'],
          ]} />
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-orange-600">
            <span className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Marketing Cookies</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Used to display relevant advertisements on other platforms (retargeting). Currently <strong>not active</strong> by default and will only be used with explicit consent.</p>
          <CookieTable locale="en" rows={[
            ['_fbp', 'Meta (Facebook/Instagram)', 'Identifies browsers for advertising and conversion analysis in Meta Ads', '3 months'],
          ]} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">How to manage your preferences</h2>
        <p className="text-gray-600 leading-relaxed mb-4">You can change your cookie preferences at any time by clicking on <strong>&ldquo;Cookie Settings&rdquo;</strong> in the site footer. The panel allows you to enable or disable each category individually, except for necessary cookies.</p>
        <p className="text-gray-600 leading-relaxed mb-4">You can also disable cookies directly in your browser settings. Please note: disabling all cookies may affect the functioning of some sites you visit regularly.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Google Chrome', path: 'Settings → Privacy and security → Cookies and other site data' },
            { name: 'Mozilla Firefox', path: 'Settings → Privacy & Security → Cookies and Site Data' },
            { name: 'Apple Safari', path: 'Preferences → Privacy → Manage Website Data' },
            { name: 'Microsoft Edge', path: 'Settings → Privacy, search, and services → Cookies' },
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
        <p className="text-gray-600 leading-relaxed">We respect the &ldquo;Do Not Track&rdquo; signal configured in your browser. If this signal is active, no analytical or marketing cookies will be loaded, regardless of saved preferences.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">International transfers</h2>
        <p className="text-gray-600 leading-relaxed">Some cookie providers (Google, Meta) are based in the United States of America. Transfers are carried out under the Standard Contractual Clauses approved by the European Commission, ensuring a level of protection equivalent to that required by the GDPR.</p>
      </section>

      <section className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-6 py-5">
        <h2 className="text-xl font-bold text-[#011b54] mb-2">Questions or requests</h2>
        <p className="text-gray-600 text-sm leading-relaxed">If you have questions about our use of cookies or wish to exercise your rights under the GDPR, please contact us:</p>
        <p className="mt-2 text-sm">
          <strong className="text-[#011b54]">Re-Evolution, Serviços Digitais</strong><br />
          <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] hover:underline">geral@re-evolution.pt</a>
          <span className="text-gray-400 mx-2">·</span>
          <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a>
        </p>
      </section>
    </div>
  )
}

function CookiesES() {
  return (
    <div className="prose prose-slate max-w-none">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#011b54] mb-2">Política de Cookies</h1>
        <p className="text-gray-400 text-sm">Última actualización: Marzo de 2026</p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">¿Qué son las cookies?</h2>
        <p className="text-gray-600 leading-relaxed">Las cookies son pequeños archivos de texto que se guardan en su dispositivo (ordenador, teléfono móvil o tableta) cuando visita un sitio web. Permiten que el sitio reconozca su navegador en visitas posteriores y mejore su experiencia.</p>
        <p className="text-gray-600 leading-relaxed mt-2">Re-Evolution, Serviços Digitais utiliza cookies para garantizar el correcto funcionamiento del sitio, analizar su rendimiento y, con su consentimiento, mejorar continuamente la experiencia de navegación.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-4">Cookies que utilizamos</h2>

        <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-[#011b54]">
            <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Cookies Necesarias</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Siempre activas</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Esenciales para el funcionamiento básico del sitio. No pueden desactivarse, ya que sin ellas el sitio no funciona correctamente. No recopilan información personal identificable.</p>
          <CookieTable locale="es" rows={[
            ['reevo_cookie_consent', 'Re-Evolution', 'Guarda sus preferencias de consentimiento de cookies para no ser consultado en cada visita', '12 meses'],
            ['__cf_bm', 'Cloudflare', 'Protección contra bots y ataques automatizados (seguridad de la infraestructura)', '30 minutos'],
          ]} />
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-gray-700">
            <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Cookies Funcionales</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Permiten funcionalidades mejoradas y personalización, como recordar el idioma seleccionado. Desactivarlas puede limitar algunas funcionalidades del sitio.</p>
          <CookieTable locale="es" rows={[
            ['NEXT_LOCALE', 'Re-Evolution', 'Memoriza el idioma preferido (PT/EN/ES) para mostrar el sitio en el idioma correcto en visitas posteriores', '1 año'],
          ]} />
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-blue-700">
            <span className="w-2 h-2 rounded-full bg-[#ffc700]" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Cookies Analíticas</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Nos ayudan a comprender cómo los visitantes utilizan el sitio, qué páginas son las más visitadas y cómo llegaron hasta nosotros. Toda la información es agregada y anónima. Solo se activan tras su consentimiento explícito.</p>
          <CookieTable locale="es" rows={[
            ['_ga', 'Google Analytics', 'Distingue usuarios únicos asignando un identificador aleatorio generado por Google', '2 años'],
            ['_ga_XXXXXXXX', 'Google Analytics', 'Mantiene el estado de sesión para Google Analytics 4 (GA4)', '2 años'],
            ['_gid', 'Google Analytics', 'Distingue usuarios únicos, caduca a las 24 horas', '24 horas'],
          ]} />
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-orange-600">
            <span className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />
            <h3 className="font-bold text-white text-base m-0">Cookies de Marketing</h3>
            <span className="ml-auto text-xs text-white/60 font-medium">Opt-in</span>
          </div>
          <p className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">Utilizadas para mostrar anuncios relevantes en otras plataformas (retargeting). Actualmente <strong>no están activas</strong> por defecto y solo se utilizarán con consentimiento explícito.</p>
          <CookieTable locale="es" rows={[
            ['_fbp', 'Meta (Facebook/Instagram)', 'Identifica navegadores para publicidad y análisis de conversiones en Meta Ads', '3 meses'],
          ]} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">Cómo gestionar sus preferencias</h2>
        <p className="text-gray-600 leading-relaxed mb-4">Puede modificar sus preferencias de cookies en cualquier momento haciendo clic en <strong>&laquo;Configuración de Cookies&raquo;</strong> en el pie de página del sitio. El panel le permite activar o desactivar cada categoría individualmente, excepto las cookies necesarias.</p>
        <p className="text-gray-600 leading-relaxed mb-4">También puede desactivar las cookies directamente en la configuración de su navegador. Tenga en cuenta que desactivar todas las cookies puede afectar al funcionamiento de algunos sitios que visita habitualmente.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Google Chrome', path: 'Configuración → Privacidad y seguridad → Cookies y otros datos de sitios' },
            { name: 'Mozilla Firefox', path: 'Configuración → Privacidad y seguridad → Cookies y datos de sitios' },
            { name: 'Apple Safari', path: 'Preferencias → Privacidad → Gestionar datos de sitios web' },
            { name: 'Microsoft Edge', path: 'Configuración → Privacidad, búsqueda y servicios → Cookies' },
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
        <p className="text-gray-600 leading-relaxed">Respetamos la señal &laquo;Do Not Track&raquo; configurada en su navegador. Si esta señal está activa, no se cargarán cookies analíticas ni de marketing, independientemente de las preferencias guardadas.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#011b54] mb-3">Transferencias internacionales</h2>
        <p className="text-gray-600 leading-relaxed">Algunos proveedores de cookies (Google, Meta) tienen su sede en los Estados Unidos de América. Las transferencias se realizan al amparo de las Cláusulas Contractuales Tipo aprobadas por la Comisión Europea, garantizando un nivel de protección equivalente al exigido por el RGPD.</p>
      </section>

      <section className="rounded-2xl bg-[#011b54]/5 border border-[#011b54]/10 px-6 py-5">
        <h2 className="text-xl font-bold text-[#011b54] mb-2">Dudas o solicitudes</h2>
        <p className="text-gray-600 text-sm leading-relaxed">Si tiene alguna pregunta sobre nuestro uso de cookies o desea ejercer sus derechos en virtud del RGPD, póngase en contacto con nosotros:</p>
        <p className="mt-2 text-sm">
          <strong className="text-[#011b54]">Re-Evolution, Serviços Digitais</strong><br />
          <a href="mailto:geral@re-evolution.pt" className="text-[#011b54] hover:underline">geral@re-evolution.pt</a>
          <span className="text-gray-400 mx-2">·</span>
          <a href="tel:+351969063633" className="text-[#011b54] hover:underline">+351 969 063 633</a>
        </p>
      </section>
    </div>
  )
}
