import { MetadataRoute } from 'next'

const baseUrl = 'https://re-evolution.pt'
const locales = ['pt', 'en', 'es']
const legalRoutes = ['/privacy-policy', '/terms-of-service', '/cookie-policy']

function localeUrl(locale: string, path: string = '') {
  const prefix = locale === 'pt' ? '' : `/${locale}`
  return `${baseUrl}${prefix}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const homepages = locales.map((locale) => ({
    url: localeUrl(locale, '/'),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }))

  const blogs = locales.map((locale) => ({
    url: localeUrl(locale, '/blog'),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const legal = locales.flatMap((locale) =>
    legalRoutes.map((route) => ({
      url: localeUrl(locale, route),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    }))
  )

  return [...homepages, ...blogs, ...legal]
}
