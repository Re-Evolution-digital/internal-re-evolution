# Blog — Notas e Pendentes

## Imagens placeholder em falta

A seguinte imagem **não existe** ainda em `/public/images/blog/`:

- `/public/images/blog/como-aparecer-no-google-maps-2026-pmes.jpg` — cover do 1.º artigo (BlogHeader + BlogCard + OG image)

O build **não falha** por ausência desta imagem, mas aparecerá quebrada no browser até ser adicionada.

> **Nota:** O hero da página de listagem (`BlogHero`) foi implementado como componente code-based (sem imagem) — não é necessária nenhuma imagem hero.

→ Ver [`BLOG_IMAGES.md`](./BLOG_IMAGES.md) para instruções detalhadas.

---

## Security Headers (X-Robots-Tag e Cache-Control)

O prompt pediu os seguintes headers específicos para rotas `/blog` e `/blog/:path*`:

```
X-Robots-Tag: index, follow
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```

**Não foram adicionados** porque `next.config.ts` já tem security headers configurados para `/(.*)`(todas as rotas), conforme a instrução: _"NÃO alterar o next.config.js existente se já tiver security headers configurados."_

Se quiseres adicionar estes headers específicos para o blog, acrescenta no `next.config.ts` dentro da função `headers()`:

```js
{
  source: '/blog/:path*',
  headers: [
    { key: 'X-Robots-Tag', value: 'index, follow' },
    { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
  ],
},
```

---

## Sanitização MDX (rehype-sanitize)

O prompt menciona `rehype-sanitize` para segurança do conteúdo MDX.

**Não foi adicionado** porque:
1. O conteúdo do blog está no repositório git (não é user-generated), portanto o risco de injeção de código arbitrário é nulo.
2. `rehype-sanitize` em combinação com `rehype-highlight` requer configuração extra da schema (os atributos `class` do highlight.js são removidos por omissão pelo sanitizador), introduzindo complexidade sem benefício prático.
3. Os componentes MDX customizados (img, table, etc.) são controlados por nós — não há execução de JSX arbitrário de ficheiros de conteúdo.

Se no futuro o blog aceitar conteúdo externo não-confiável, adicionar `rehype-sanitize` com um schema permissivo que preserve classes:

```ts
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className'],
    code: ['className'],
    span: ['className'],
    pre: ['className'],
  },
}
// Adicionar [rehypeSanitize, schema] ANTES de rehypeHighlight nos plugins
```

---

## Sitemap

O ficheiro `app/sitemap.ts` existente **não foi atualizado** para incluir os posts do blog.

Para adicionar as rotas do blog ao sitemap, acrescentar em `app/sitemap.ts`:

```ts
import { getAllPosts } from '@/lib/blog/mdx'

// Dentro da função sitemap():
const posts = getAllPosts()
const blogUrls = posts.flatMap(post =>
  ['pt', 'en', 'es'].map(locale => ({
    url: `https://re-evolution.pt/${locale}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
)
// Fazer merge com os URLs existentes
```

---

## i18n no conteúdo do blog

O conteúdo MDX dos artigos está apenas em português. Para suportar versões em inglês/espanhol dos artigos, considera:

- Criar `index.en.mdx` e `index.es.mdx` por artigo, ou
- Uma pasta `/content/blog/[slug]/[locale].mdx` por idioma

A função `getAllPosts(locale?)` já aceita o parâmetro `locale` (actualmente não filtra por locale — está preparada para extensão futura).
