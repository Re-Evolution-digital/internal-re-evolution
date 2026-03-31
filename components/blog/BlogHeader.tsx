import Image from 'next/image'
import type { BlogMeta } from '@/lib/blog/types'

interface BlogHeaderProps {
  post: BlogMeta
  locale: string
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

export default function BlogHeader({ post, locale }: BlogHeaderProps) {
  return (
    <header>
      {/* Cover image — 16:9 até 853 px de viewport, panorâmica acima (max 480 px) */}
      <div className="relative w-full overflow-hidden" style={{ height: 'min(56.25vw, 480px)', minHeight: 220 }}>
        <Image
          src={post.coverImage}
          alt={post.coverAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Post meta */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-8">
        <span
          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${getCategoryColor(post.category)}`}
        >
          {post.category}
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span>
            Publicado a{' '}
            <time dateTime={post.date} className="font-medium text-gray-700">
              {formatDate(post.date, locale)}
            </time>
          </span>
          {post.updatedAt && post.updatedAt !== post.date && (
            <span>
              · Atualizado a{' '}
              <time dateTime={post.updatedAt} className="font-medium text-gray-700">
                {formatDate(post.updatedAt, locale)}
              </time>
            </span>
          )}
          <span>· {post.readingTime} min de leitura</span>
          <span>· por {post.author}</span>
        </div>
      </div>
    </header>
  )
}
