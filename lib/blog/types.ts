export interface BlogMeta {
  title: string
  slug: string
  date: string              // ISO 8601: "2026-03-30"
  updatedAt?: string
  description: string       // 150-160 chars para meta description
  coverImage: string        // BlogHeader — 1920×675 px
  cardImage?: string        // Cards e OG — 1200×628 px (fallback: coverImage)
  coverAlt: string
  category: string          // ex: "Google Business Profile"
  tags: string[]
  author: string            // default: "Re-Evolution"
  readingTime: number       // minutos — calculado automaticamente do conteúdo
  featured: boolean         // true = destaque na homepage
  published: boolean        // false = draft, não aparece na listagem
}

export interface BlogPost extends BlogMeta {
  content: string
  relatedPosts?: BlogMeta[]
}
