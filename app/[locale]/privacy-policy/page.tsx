import type { Metadata } from 'next'
import LegalLayout from '@/components/ui/LegalLayout'
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent'

type Props = { params: Promise<{ locale: string }> }

const titles: Record<string, string> = {
  pt: 'Política de Privacidade — Re-Evolution, Serviços Digitais',
  en: 'Privacy Policy — Re-Evolution, Digital Services',
  es: 'Política de Privacidad — Re-Evolution, Servicios Digitales',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: titles[locale] ?? titles.pt,
    alternates: {
      canonical: `https://re-evolution.pt/${locale}/privacy-policy`,
      languages: {
        'x-default': '/pt/privacy-policy',
        pt: '/pt/privacy-policy',
        en: '/en/privacy-policy',
        es: '/es/privacy-policy',
      },
    },
    robots: { index: true, follow: true },
  }
}

export default async function PrivacyPolicy({ params }: Props) {
  const { locale } = await params
  return (
    <LegalLayout locale={locale}>
      <PrivacyPolicyContent locale={locale} />
    </LegalLayout>
  )
}
