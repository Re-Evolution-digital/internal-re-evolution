'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { BlogMeta } from '@/lib/blog/types'

interface BlogCardProps {
  post: BlogMeta
  index: number
  locale: string
  priority?: boolean
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr)
  const localeMap: Record<string, string> = {
    pt: 'pt-PT',
    en: 'en-GB',
    es: 'es-ES',
  }
  return date.toLocaleDateString(localeMap[locale] ?? 'pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const categoryColors: Record<string, string> = {
  'Google Business Profile': 'bg-blue-100 text-blue-800',
  'SEO': 'bg-green-100 text-green-800',
  'Automações': 'bg-purple-100 text-purple-800',
  'Performance': 'bg-orange-100 text-orange-800',
}

function getCategoryColor(category: string): string {
  return categoryColors[category] ?? 'bg-gray-100 text-gray-800'
}

export default function BlogCard({ post, index, locale, priority = false }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
    >
      <Link
        href={`/${locale}/blog/${post.slug}`}
        aria-label={post.title}
        className="flex flex-col flex-1"
      >
        {/* Cover image — usa cardImage (1200×628) se disponível, senão coverImage */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.cardImage ?? post.coverImage}
            alt={post.coverAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading={priority ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Category badge */}
          <span
            className={`inline-block self-start text-xs font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(post.category)}`}
          >
            {post.category}
          </span>

          {/* Title */}
          <h2 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-dark transition-colors">
            {post.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            <span>·</span>
            <span>{post.readingTime} min de leitura</span>
          </div>

          {/* Read more */}
          <span className="text-sm font-semibold text-brand-dark group-hover:text-brand-yellow transition-colors">
            Ler mais →
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
