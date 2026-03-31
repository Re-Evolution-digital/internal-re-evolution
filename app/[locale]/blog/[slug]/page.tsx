import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'
import ReadingProgress from '@/components/blog/ReadingProgress'
import BlogHeader from '@/components/blog/BlogHeader'
import BlogBody from '@/components/blog/BlogBody'
import BlogNavigation from '@/components/blog/BlogNavigation'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog/mdx'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-static'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  const slugs = getAllPosts().map((post) => post.slug)
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params

  let post
  try {
    post = getPostBySlug(slug)
  } catch {
    return {}
  }

  const url = `https://re-evolution.pt/${locale}/blog/${post.slug}`

  return {
    title: `${post.title} | Blog Re-Evolution`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [
        {
          url: `https://re-evolution.pt${post.coverImage}`,
          width: 1200,
          height: 630,
          alt: post.coverAlt,
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params

  let post
  try {
    post = getPostBySlug(slug)
  } catch {
    notFound()
  }

  if (!post.published) notFound()

  const relatedPosts = getRelatedPosts(post.slug, post.tags)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: {
      '@type': 'Organization',
      name: 'Re-Evolution',
      url: 'https://re-evolution.pt',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Re-Evolution',
    },
    image: `https://re-evolution.pt${post.coverImage}`,
    url: `https://re-evolution.pt/${locale}/blog/${post.slug}`,
    description: post.description,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: 'https://re-evolution.pt',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `https://re-evolution.pt/${locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      {/* Reading progress bar (Client Component) */}
      <ReadingProgress />

      {/*
        pt-20 md:pt-24 empurra o conteúdo abaixo do Header fixo.
        Header: h-16 (64px) + cobro band h-3 (12px) = 76px mobile
                h-20 (80px) + cobro band h-3 (12px) = 92px desktop
      */}
      <div className="pt-20 md:pt-24">

      {/* Breadcrumb — sticky abaixo do header, alinhado à direita */}
      <nav
        aria-label="Breadcrumb"
        className="sticky top-20 md:top-24 z-30 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex justify-start">
          <ol className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
            <li className="shrink-0">
              <Link href={`/${locale}`} className="hover:text-brand-dark transition-colors">
                Início
              </Link>
            </li>
            <li aria-hidden="true" className="shrink-0">/</li>
            <li className="shrink-0">
              <Link href={`/${locale}/blog`} className="hover:text-brand-dark transition-colors">
                Blog
              </Link>
            </li>
            <li aria-hidden="true" className="shrink-0">/</li>
            <li aria-current="page" className="text-gray-700 font-medium truncate max-w-[160px] sm:max-w-xs lg:max-w-sm">
              {post.title}
            </li>
          </ol>
        </div>
      </nav>

      <main>
        {/* Post header: cover + title + meta */}
        <BlogHeader post={post} locale={locale} />

        {/* Post body: MDX content */}
        <BlogBody content={post.content} />

        {/* CTA */}
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 mb-12">
          <div className="rounded-2xl bg-brand-dark px-8 py-8 text-center">
            <p className="text-white font-semibold text-lg mb-4">
              Precisas de ajuda com a presença digital do teu negócio?
            </p>
            <Link
              href="/#contacto"
              className="inline-block bg-brand-yellow text-brand-dark font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Fala Connosco
            </Link>
          </div>
        </div>

        {/* Navigation: back to blog + related posts */}
        <BlogNavigation relatedPosts={relatedPosts} locale={locale} />
      </main>

      </div>{/* end pt-20 md:pt-24 header offset */}

      <Footer />
    </>
  )
}
