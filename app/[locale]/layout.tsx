import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { routing } from '@/i18n/routing'
import '../globals.css'
import CookieBanner from '@/components/ui/CookieBanner'
import ChatWidget from '@/components/chat/ChatWidget'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://re-evolution.pt'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'x-default': '/pt',
        'pt': '/pt',
        'en': '/en',
        'es': '/es',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://re-evolution.pt/${locale}`,
      siteName: 'Re-Evolution, Serviços Digitais',
      images: [
        {
          url: '/images/og/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Re-Evolution — Agência Digital',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og/og-image.jpg'],
    },
    icons: {
      icon: [
        { url: '/images/logo/logo_bandeira.jpg', type: 'image/jpeg' },
        { url: '/images/logo/logo.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/images/logo/logo.png' }],
      shortcut: '/images/logo/logo.png',
    },
    other: {
      'p:domain_verify': 'd652ef4ea41129f434b26b8f37d83489',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'pt' | 'en' | 'es')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-yellow focus:text-brand-dark focus:font-bold focus:rounded-lg"
        >
          {locale === 'pt' ? 'Saltar para conteúdo principal' : locale === 'es' ? 'Saltar al contenido principal' : 'Skip to main content'}
        </a>
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookieBanner />
          <ChatWidget />
          <WhatsAppButton />
        </NextIntlClientProvider>
        <Script
          id="metricool-tracker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"8be7ce991b52e5d3acf8c852ad077543"})});`,
          }}
        />
      </body>
    </html>
  )
}
