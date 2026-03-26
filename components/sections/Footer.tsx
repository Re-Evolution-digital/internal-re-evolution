import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { clientData } from '@/data/client-info'
import CookieSettingsLink from '@/components/ui/CookieSettingsLink'

type Props = { locale?: string }

// Social SVG icons
const SocialIcons = {
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
}

export default async function Footer() {
  // Footer is a Server Component for SEO — no interactivity needed
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'footer' })

  const legalLinksLabels = t.raw('columns.legal.links') as string[]
  const legalLinks = [
    { label: legalLinksLabels[0], href: `/${locale}/privacy-policy` },
    { label: legalLinksLabels[1], href: `/${locale}/terms-of-service` },
    { label: legalLinksLabels[2], href: `/${locale}/cookie-policy` },
  ]

  return (
    <footer className="bg-brand-dark text-white" aria-label="Rodapé">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-block mb-4">
              <Image
                src={clientData.brand.logoSvg}
                alt={clientData.business.name}
                width={140}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-5">{t('tagline')}</p>
            {/* Social icons */}
            <div className="flex gap-3">
              {Object.entries(SocialIcons).map(([key, icon]) => {
                const url = clientData.social[key as keyof typeof clientData.social]
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="text-white/40 hover:text-brand-yellow transition-colors"
                  >
                    {icon}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
              {t('columns.services.title')}
            </h3>
            <ul className="space-y-2.5">
              {(t.raw('columns.services.links') as string[]).map((item) => (
                <li key={item}>
                  <a href={`/${locale}/#servicos`} className="text-white/60 text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
              {t('columns.company.title')}
            </h3>
            <ul className="space-y-2.5">
              <li><a href={`/${locale}/#casos`} className="text-white/60 text-sm hover:text-white transition-colors">{(t.raw('columns.company.links') as string[])[1]}</a></li>
              <li><a href={`/${locale}/#blog`} className="text-white/60 text-sm hover:text-white transition-colors">{(t.raw('columns.company.links') as string[])[2]}</a></li>
              <li><a href={`/${locale}/#diagnostico`} className="text-white/60 text-sm hover:text-white transition-colors">{(t.raw('columns.company.links') as string[])[3]}</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
              {t('columns.contact.title')}
            </h3>
            <address className="not-italic space-y-2.5">
              <p className="text-white/60 text-sm leading-relaxed">{clientData.contact.address}</p>
              <a href={`mailto:${clientData.contact.email}`} className="block text-white/60 text-sm hover:text-white transition-colors">
                {clientData.contact.email}
              </a>
              <a href={`tel:${clientData.contact.mobile.replace(/\s/g, '')}`} className="block text-white/60 text-sm hover:text-white transition-colors">
                {clientData.contact.mobile}
              </a>
            </address>
          </div>
        </div>

        {/* Legal links */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 text-xs hover:text-white/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <CookieSettingsLink label={legalLinksLabels[3]} />
          </div>
          <p className="text-white/30 text-xs text-center">{t('copyright')}</p>
        </div>

        <p className="text-center text-white/20 text-xs mt-4">
          <a href="https://re-evolution.pt" className="hover:text-white/40 transition-colors">
            {t('madeBy')}
          </a>
        </p>
      </div>
    </footer>
  )
}
