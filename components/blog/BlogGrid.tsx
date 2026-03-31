'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import BlogCard from './BlogCard'
import type { BlogMeta } from '@/lib/blog/types'

const POSTS_PER_PAGE = 9

interface BlogGridProps {
  posts: BlogMeta[]
  locale: string
}

export default function BlogGrid({ posts, locale }: BlogGridProps) {
  const searchParams = useSearchParams()
  const currentPage = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)

  const start = (safePage - 1) * POSTS_PER_PAGE
  const pagePosts = posts.slice(start, start + POSTS_PER_PAGE)

  return (
    <div className="space-y-10">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagePosts.map((post, i) => (
          <BlogCard
            key={post.slug}
            post={post}
            index={i}
            locale={locale}
            priority={safePage === 1 && i < 3}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Paginação do blog"
          className="flex items-center justify-center gap-2"
        >
          {safePage > 1 && (
            <Link
              href={`?page=${safePage - 1}`}
              className="px-4 py-2 text-sm font-medium text-brand-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Anterior
            </Link>
          )}

          <span className="px-4 py-2 text-sm text-gray-600">
            Página {safePage} de {totalPages}
          </span>

          {safePage < totalPages && (
            <Link
              href={`?page=${safePage + 1}`}
              className="px-4 py-2 text-sm font-medium text-brand-dark border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Seguinte →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
