import type { Metadata } from 'next'
import LegalLayout from '@/components/ui/LegalLayout'
import CookiePolicyContent from '@/components/legal/CookiePolicyContent'

type Props = { params: Promise<{ locale: string }> }

const titles: Record<string, string> = {
  pt: 'Política de Cookies — Re-Evolution, Serviços Digitais',
  en: 'Cookie Policy — Re-Evolution, Digital Services',
  es: 'Política de Cookies — Re-Evolution, Servicios Digitales',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: titles[locale] ?? titles.pt,
    alternates: {
      canonical: locale === 'pt'
        ? 'https://re-evolution.pt/cookie-policy'
        : `https://re-evolution.pt/${locale}/cookie-policy`,
      languages: {
        'x-default': '/cookie-policy',
        pt: '/cookie-policy',
        en: '/en/cookie-policy',
        es: '/es/cookie-policy',
      },
    },
    robots: { index: true, follow: true },
  }
}

export default async function CookiePolicy({ params }: Props) {
  const { locale } = await params
  return (
    <LegalLayout locale={locale}>
      <CookiePolicyContent locale={locale} />
    </LegalLayout>
  )
}
