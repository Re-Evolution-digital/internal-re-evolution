import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeExternalLinks from 'rehype-external-links'
import type { ComponentPropsWithoutRef } from 'react'

interface MdxImgProps {
  src?: string
  alt?: string
}

// Custom MDX components
const components = {
  // Imagens MDX sempre via next/image
  img: ({ src, alt }: MdxImgProps) => (
    <figure className="my-6">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <Image
          src={src ?? ''}
          alt={alt ?? ''}
          fill
          className="object-cover"
          sizes="(max-width: 720px) 100vw, 720px"
        />
      </div>
      {alt && (
        <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  // Tabelas responsivas com scroll horizontal em mobile
  table: ({ children }: ComponentPropsWithoutRef<'table'>) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-gray-200">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: ComponentPropsWithoutRef<'thead'>) => (
    <thead className="bg-brand-dark text-white">{children}</thead>
  ),
  th: ({ children }: ComponentPropsWithoutRef<'th'>) => (
    <th
      scope="col"
      className="px-4 py-3 text-left font-semibold border-b border-gray-200"
    >
      {children}
    </th>
  ),
  td: ({ children }: ComponentPropsWithoutRef<'td'>) => (
    <td className="px-4 py-3 border-b border-gray-100">{children}</td>
  ),
  tr: ({ children }: ComponentPropsWithoutRef<'tr'>) => (
    <tr className="even:bg-gray-50">{children}</tr>
  ),
}

interface BlogBodyProps {
  content: string
}

export default function BlogBody({ content }: BlogBodyProps) {
  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 pb-6 blog-body">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [rehypeExternalLinks, { rel: ['noopener', 'noreferrer'], target: '_blank' }],
              rehypeHighlight,
            ],
          },
        }}
        components={components}
      />
      {/* Copyright notice */}
      <p className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400 select-none">
        © {new Date().getFullYear()} Re-Evolution. Conteúdo protegido por direitos de autor.
        Para receber este artigo em PDF, usa a opção abaixo.
      </p>
    </div>
  )
}
