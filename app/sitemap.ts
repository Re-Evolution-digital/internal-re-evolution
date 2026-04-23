import { MetadataRoute } from 'next'

const baseUrl = 'https://re-evolution.pt'
const locales = ['pt', 'en', 'es']
const legalRoutes = ['/privacy-policy', '/terms-of-service', '/cookie-policy']

export default function sitemap(): MetadataRoute.Sitemap {
  const homepages = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }))

  const blogs = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const legal = locales.flatMap((locale) =>
    legalRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    }))
  )

  return [...homepages, ...blogs, ...legal]
}
