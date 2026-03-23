import { clientData } from '@/data/client-info'

type Props = { locale: string }

export default function SchemaMarkup({ locale }: Props) {
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
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
