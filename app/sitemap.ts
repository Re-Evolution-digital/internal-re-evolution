import { MetadataRoute } from 'next'

const baseUrl = 'https://re-evolution.pt'
const locales = ['pt', 'en', 'es']

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/privacy-policy', '/terms-of-service', '/cookie-policy']

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '' ? 1 : 0.5,
    }))
  )
}
