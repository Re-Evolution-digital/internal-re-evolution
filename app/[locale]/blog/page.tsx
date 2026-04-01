import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'
import BlogHero from '@/components/blog/BlogHero'
import BlogGrid from '@/components/blog/BlogGrid'
import BlogSubscribe from '@/components/blog/BlogSubscribe'
import { getAllPosts } from '@/lib/blog/mdx'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-static'

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = `https://re-evolution.pt/${locale}/blog`

  return {
    title: 'Blog | Re-Evolution — Dicas de Presença Digital para PMEs',
    description:
      'Artigos práticos sobre SEO local, Google Business Profile, automações e presença digital para pequenas e médias empresas em Portugal.',
    openGraph: {
      title: 'Blog da Re-Evolution',
      description:
        'Artigos práticos sobre SEO local, Google Business Profile, automações e presença digital para pequenas e médias empresas em Portugal.',
      url: baseUrl,
      images: [
        {
          url: '/images/blog/blog-hero.jpg',
          width: 1200,
          height: 630,
          alt: 'Blog Re-Evolution — Presença Digital para PMEs',
        },
      ],
    },
    alternates: {
      canonical: baseUrl,
    },
  }
}

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Blog Re-Evolution',
  url: 'https://re-evolution.pt/pt/blog',
  publisher: {
    '@type': 'Organization',
    name: 'Re-Evolution',
    url: 'https://re-evolution.pt',
  },
}

export default async function BlogListPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog.hero' })
  const posts = getAllPosts(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* Skip link */}
      <a
        href="#blog-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-yellow focus:text-brand-dark focus:font-bold focus:rounded-lg"
      >
        Saltar para conteúdo
      </a>

      <Header />

      <BlogHero
        locale={locale}
        headline1={t('headline1')}
        headline2={t('headline2')}
        subtitle={t('subtitle')}
        tags={t.raw('tags') as string[]}
      />

      <main id="blog-content" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-16">
              Nenhum artigo publicado ainda. Volte em breve!
            </p>
          ) : (
            <Suspense fallback={<div className="py-16 text-center text-gray-400">A carregar...</div>}>
              <BlogGrid posts={posts} locale={locale} />
            </Suspense>
          )}
        </div>
      </main>

      {/* Newsletter subscribe — rodapé do blog, antes do Footer */}
      <BlogSubscribe locale={locale} />

      <Footer />
    </>
  )
}
