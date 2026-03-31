'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

// TODO: ligar a CMS (Contentful/Sanity) em fase 2

function getLocale(path: string) { return path.split('/')[1] ?? 'pt' }

const categoryColors: Record<string, string> = {
  SEO: 'bg-green-100 text-green-700',
  'Automações': 'bg-blue-100 text-blue-700',
  Automations: 'bg-blue-100 text-blue-700',
  Automatizaciones: 'bg-blue-100 text-blue-700',
  Performance: 'bg-purple-100 text-purple-700',
  Rendimiento: 'bg-purple-100 text-purple-700',
}

export default function Blog() {
  const t = useTranslations('blog')
  const pathname = usePathname()
  const locale = getLocale(pathname)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const articles = t.raw('articles') as Array<{ slug?: string; category: string; title: string; date: string; cardImage?: string }>

  return (
    <section id="blog" className="py-20 bg-white" data-section="blog" aria-labelledby="blog-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex items-end justify-between mb-10 gap-4 flex-wrap"
        >
          <div>
            <h2 id="blog-title" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-dark mb-2">
              {t('title')}
            </h2>
            <div className="h-1 w-16 bg-brand-yellow rounded-full" aria-hidden="true" />
          </div>
          <a
            href={`/${locale}/blog`}
            className="text-brand-dark font-semibold text-sm border-b-2 border-brand-yellow hover:text-brand-yellow transition-colors"
          >
            {t('viewAll')} →
          </a>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => {
            const href = article.slug ? `/${locale}/blog/${article.slug}` : null
            const cardContent = (
              <>
                {/* Cover image */}
                {article.slug ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.cardImage ?? `/images/blog/${article.slug}-card.jpg`}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-brand-dark to-[#1a3a8f] flex items-center justify-center">
                    <div className="text-5xl opacity-20">📝</div>
                  </div>
                )}
                <div className="p-6">
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${categoryColors[article.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {article.category}
                  </span>
                  <h3 className="font-bold text-brand-dark leading-snug mb-3 group-hover:text-brand-dark/80 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <time className="text-gray-400 text-xs">{article.date}</time>
                    <span className="text-brand-dark font-semibold text-sm group-hover:text-brand-yellow transition-colors">
                      {t('readMore')} →
                    </span>
                  </div>
                </div>
              </>
            )

            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                {href ? (
                  <a href={href} className="block" aria-label={article.title}>
                    {cardContent}
                  </a>
                ) : (
                  cardContent
                )}
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
