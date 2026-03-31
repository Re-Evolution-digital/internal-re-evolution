import Link from 'next/link'
import Image from 'next/image'
import type { BlogMeta } from '@/lib/blog/types'

interface BlogNavigationProps {
  relatedPosts: BlogMeta[]
  locale: string
}

export default function BlogNavigation({ relatedPosts, locale }: BlogNavigationProps) {
  return (
    <nav aria-label="Navegação do artigo" className="max-w-[720px] mx-auto px-4 sm:px-6 pb-16">
      {/* Back to blog */}
      <div className="mb-10">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark hover:text-brand-yellow transition-colors"
        >
          ← Voltar ao Blog
        </Link>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Artigos relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="group flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-yellow hover:shadow-sm transition-all"
              >
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={post.cardImage ?? post.coverImage}
                    alt={post.coverAlt}
                    fill
                    className="object-cover"
                    sizes="80px"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-xs font-medium text-brand-yellow mb-1 truncate">
                    {post.category}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-dark transition-colors">
                    {post.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </nav>
  )
}
