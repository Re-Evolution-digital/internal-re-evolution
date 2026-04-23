import type { Metadata } from 'next'
import LegalLayout from '@/components/ui/LegalLayout'
import TermsOfServiceContent from '@/components/legal/TermsOfServiceContent'

type Props = { params: Promise<{ locale: string }> }

const titles: Record<string, string> = {
  pt: 'Termos de Serviço — Re-Evolution, Serviços Digitais',
  en: 'Terms of Service — Re-Evolution, Digital Services',
  es: 'Términos de Servicio — Re-Evolution, Servicios Digitales',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: titles[locale] ?? titles.pt,
    alternates: {
      canonical: `https://re-evolution.pt/${locale}/terms-of-service`,
      languages: {
        'x-default': '/pt/terms-of-service',
        pt: '/pt/terms-of-service',
        en: '/en/terms-of-service',
        es: '/es/terms-of-service',
      },
    },
    robots: { index: true, follow: true },
  }
}

export default async function TermsOfService({ params }: Props) {
  const { locale } = await params
  return (
    <LegalLayout locale={locale}>
      <TermsOfServiceContent locale={locale} />
    </LegalLayout>
  )
}
