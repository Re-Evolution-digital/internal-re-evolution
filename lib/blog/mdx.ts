import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogMeta, BlogPost } from './types'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / 200)
}

function getMdxPath(slug: string, locale?: string): string {
  if (locale && locale !== 'pt') {
    const localePath = path.join(BLOG_DIR, slug, `${locale}.mdx`)
    if (fs.existsSync(localePath)) return localePath
  }
  return path.join(BLOG_DIR, slug, 'index.mdx')
}

// Retorna todos os posts publicados, ordenados por data DESC
export function getAllPosts(locale?: string): BlogMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const slugs = fs.readdirSync(BLOG_DIR).filter((name) => {
    const filePath = path.join(BLOG_DIR, name, 'index.mdx')
    return fs.existsSync(filePath)
  })

  const posts = slugs
    .map((slug) => {
      const filePath = getMdxPath(slug, locale)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)

      if (!data.published) return null

      return {
        ...data,
        slug,
        readingTime:
          typeof data.readingTime === 'number'
            ? data.readingTime
            : calculateReadingTime(content),
      } as BlogMeta
    })
    .filter((p): p is BlogMeta => p !== null)

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

// Retorna um post completo com conteúdo MDX
export function getPostBySlug(slug: string, locale?: string): BlogPost {
  const filePath = getMdxPath(slug, locale)
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  return {
    ...data,
    slug,
    content,
    readingTime:
      typeof data.readingTime === 'number'
        ? data.readingTime
        : calculateReadingTime(content),
  } as BlogPost
}

// Retorna posts relacionados por tags comuns (excluindo o atual)
export function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 2
): BlogMeta[] {
  const allPosts = getAllPosts()

  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      commonTags: post.tags.filter((tag) => tags.includes(tag)).length,
    }))
    .filter(({ commonTags }) => commonTags > 0)
    .sort((a, b) => b.commonTags - a.commonTags)
    .slice(0, limit)
    .map(({ post }) => post)
}
