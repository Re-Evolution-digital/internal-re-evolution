import { clientData } from '@/data/client-info'
import ptMessages from '@/messages/pt.json'
import enMessages from '@/messages/en.json'
import esMessages from '@/messages/es.json'

type LocaleMessages = {
  faq: { items: Array<{ question: string; answer: string }> }
  services: { pillars: Array<{ title: string; description: string }> }
}

const messagesMap: Record<string, LocaleMessages> = {
  pt: ptMessages as unknown as LocaleMessages,
  en: enMessages as unknown as LocaleMessages,
  es: esMessages as unknown as LocaleMessages,
}

type Props = { locale: string }

export default function SchemaMarkup({ locale }: Props) {
  const messages = messagesMap[locale] ?? (ptMessages as unknown as LocaleMessages)
  const faqItems = messages.faq.items
  const services = messages.services.pillars

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': 'https://re-evolution.pt/#organization',
        name: clientData.business.name,
        url: 'https://re-evolution.pt',
        logo: {
          '@type': 'ImageObject',
          url: 'https://re-evolution.pt/images/logo/logo.svg',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: clientData.contact.mobile,
          contactType: 'customer service',
          availableLanguage: ['Portuguese', 'English', 'Spanish'],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Praceta José Régio 5 2º Dto',
          postalCode: '2790-092',
          addressLocality: 'Carnaxide',
          addressCountry: 'PT',
        },
        email: clientData.contact.email,
        telephone: clientData.contact.mobile,
        sameAs: [
          clientData.social.linkedin,
          clientData.social.instagram,
          clientData.social.facebook,
          clientData.social.youtube,
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://re-evolution.pt/#website',
        url: 'https://re-evolution.pt',
        name: clientData.business.name,
        publisher: { '@id': 'https://re-evolution.pt/#organization' },
        inLanguage: [locale],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `https://re-evolution.pt/${locale}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `https://re-evolution.pt/${locale}#faq`,
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      ...services.map((service, i) => ({
        '@type': 'Service',
        '@id': `https://re-evolution.pt/${locale}#service-${i}`,
        name: service.title,
        description: service.description,
        provider: { '@id': 'https://re-evolution.pt/#organization' },
        areaServed: {
          '@type': 'Country',
          name: 'Portugal',
        },
      })),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
