## CONTEXTO DO PROJETO

Estou a integrar uma secção de Blog completa no site existente da Re-Evolution (re-evolution.pt).

Olha para o Stack tecnológico e estrutura deste projeto e implementa esta nova secção/página.



**NÃO recries ficheiros que já existem** (next.config.js, layout raiz, etc.) — apenas extende-os onde necessário. **NÃO substituas** os componentes `<Header />` e `<Footer />` existentes — reutiliza-os em todas as páginas do blog.

\---

## 1\. ESTRUTURA DE FICHEIROS A CRIAR

```
/content/
  /blog/
    /como-aparecer-no-google-maps-2026-pmes/
      index.mdx

/public/
  /images/
    /blog/
      /covers/
        como-aparecer-no-google-maps-2026-pmes.jpg  ← placeholder Unsplash
      blog-hero.jpg                                 ← placeholder Unsplash

/src/
  /app/
    /\[locale]/
      /blog/
        page.tsx
        /\[slug]/
          page.tsx

  /components/
    /blog/
      BlogCard.tsx
      BlogGrid.tsx
      BlogHero.tsx
      BlogHeader.tsx
      BlogBody.tsx
      BlogNavigation.tsx
      ReadingProgress.tsx

  /lib/
    /blog/
      mdx.ts
      types.ts

/docs/
  BLOG\_IMAGES.md
  BLOG\_NOTES.md        ← criar só se houver algo pendente
```

\---

## 2\. TIPOS TYPESCRIPT — lib/blog/types.ts

```typescript
export interface BlogMeta {
  title: string
  slug: string
  date: string              // ISO 8601: "2026-03-30"
  updatedAt?: string
  description: string       // 150-160 chars para meta description
  coverImage: string        // ex: /images/blog/covers/\[slug].jpg
  coverAlt: string
  category: string          // ex: "Google Business Profile"
  tags: string\[]
  author: string            // default: "Re-Evolution"
  readingTime: number       // minutos — calcular automaticamente do conteúdo
  featured: boolean         // true = destaque na homepage
  published: boolean        // false = draft, não aparece na listagem
}

export interface BlogPost extends BlogMeta {
  content: string
  relatedPosts?: BlogMeta\[]
}
```

\---

## 3\. SISTEMA MDX — lib/blog/mdx.ts

Usar **next-mdx-remote** ou **@next/mdx** — escolhe o mais adequado ao projeto existente.

Funções obrigatórias:

```typescript
// Retorna todos os posts publicados, ordenados por data DESC
getAllPosts(locale?: string): BlogMeta\[]

// Retorna um post completo com conteúdo MDX
getPostBySlug(slug: string): BlogPost

// Retorna posts relacionados por tags comuns (excluindo o atual)
getRelatedPosts(currentSlug: string, tags: string\[], limit?: number): BlogMeta\[]
// limit default: 2
```

O `readingTime` deve ser calculado automaticamente a partir do conteúdo (média: 200 palavras por minuto).

\---

## 4\. PÁGINA DE LISTAGEM — /app/\[locale]/blog/page.tsx

### SEO

```typescript
export const metadata: Metadata = {
  title: 'Blog | Re-Evolution — Dicas de Presença Digital para PMEs',
  description: 'Artigos práticos sobre SEO local, Google Business Profile, automações e presença digital para pequenas e médias empresas em Portugal.',
  openGraph: {
    title: 'Blog da Re-Evolution',
    description: 'Artigos práticos sobre SEO local, Google Business Profile, automações e presença digital para pequenas e médias empresas em Portugal.',
    url: 'https://re-evolution.pt/blog',
    images: \[{
      url: '/images/blog/blog-hero.jpg',
      width: 1200,
      height: 630,
      alt: 'Blog Re-Evolution — Presença Digital para PMEs'
    }],
  },
  alternates: {
    canonical: 'https://re-evolution.pt/blog',
  }
}
```

### Schema Markup JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Blog Re-Evolution",
  "url": "https://re-evolution.pt/blog",
  "publisher": {
    "@type": "Organization",
    "name": "Re-Evolution",
    "url": "https://re-evolution.pt"
  }
}
```

### Layout

1. `<Header />` — componente existente
2. `<BlogHero>` — título "Blog", subtítulo, imagem hero (`/images/blog/blog-hero.jpg`, `priority={true}`, 1920×600px). Design consistente com o restante site.
3. Skip link para `#blog-content` (acessibilidade)
4. `<main id="blog-content">` com `<BlogGrid>` — grelha responsiva de `<BlogCard>`:

   * 1 coluna em mobile
   * 2 colunas em tablet
   * 3 colunas em desktop
5. Paginação estática: 9 artigos por página, links `?page=2`
6. `<Footer />` — componente existente

### BlogCard.tsx

O card inteiro é clicável via `<Link>` com `aria-label` contendo o título do artigo. Conteúdo:

* Imagem de capa (`next/image`, aspect ratio 16:9, `loading="lazy"`)
* Badge de categoria (colorido)
* Título em H2 com `line-clamp-2`
* Excerto com `line-clamp-3`
* Data formatada em pt-PT (ex: "30 de março de 2026")
* Tempo de leitura ("5 min de leitura")
* Texto "Ler mais →" no final

**Animações:** entrada com `stagger` via Framer Motion — fade + slide up, delay de 0.1s entre cards.

\---

## 5\. PÁGINA INDIVIDUAL — /app/\[locale]/blog/\[slug]/page.tsx

### SEO Dinâmico

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  return {
    title: `${post.title} | Blog Re-Evolution`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://re-evolution.pt/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: \[post.author],
      images: \[{
        url: post.coverImage,
        width: 1200,
        height: 630,
        alt: post.coverAlt
      }],
    },
    alternates: {
      canonical: `https://re-evolution.pt/blog/${post.slug}`,
    }
  }
}
```

`generateStaticParams` obrigatório para gerar todas as rotas estáticas em build time.

### Schema Markup JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "\[post.title]",
  "datePublished": "\[post.date]",
  "dateModified": "\[post.updatedAt ?? post.date]",
  "author": {
    "@type": "Organization",
    "name": "Re-Evolution",
    "url": "https://re-evolution.pt"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Re-Evolution"
  },
  "image": "\[URL absoluta de post.coverImage]",
  "url": "https://re-evolution.pt/blog/\[post.slug]",
  "description": "\[post.description]"
}
```

Schema de Breadcrumb separado:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": \[
    { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://re-evolution.pt" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://re-evolution.pt/blog" },
    { "@type": "ListItem", "position": 3, "name": "\[post.title]" }
  ]
}
```

### Layout da Página Individual

1. `<Header />` — componente existente
2. `<ReadingProgress>` — Client Component, barra fina no topo (fixed, z-50), preenche com o scroll. Acessibilidade: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label` da chave i18n `blog.readingProgress.ariaLabel`
3. Breadcrumb com `aria-label="Breadcrumb"` e `aria-current="page"` no último item: `Início > Blog > \[Título]`
4. `<BlogHeader>` — imagem de capa full-width (max-height 480px, `object-cover`), título H1, badge de categoria, data formatada, tempo de leitura
5. `<BlogBody>` — conteúdo MDX renderizado, `max-w-\[720px]`, centrado. Estilos tipográficos:

   * `h2`: 1.5rem, font-semibold, mt-8 mb-4
   * `h3`: 1.25rem, font-semibold, mt-6 mb-3
   * `p`: leading-relaxed, mb-4
   * `table`: responsiva com scroll horizontal em mobile, bordered, header com fundo escuro
   * `blockquote`: borda esquerda colorida (accent do site), fundo suave, italic
   * `code` inline: fundo com padding, font-mono
   * `pre`: syntax highlight com **rehype-highlight** ou **rehype-pretty-code**
   * Imagens MDX: sempre via `next/image`, com `<figure>` + `<figcaption>` se houver caption
   * Links externos: `rel="noopener noreferrer"` automático via plugin remark
6. CTA no final do artigo — caixa com fundo accent, texto "Precisas de ajuda com a presença digital do teu negócio?", botão "Fala Connosco" com link para `/#contacto`
7. `<BlogNavigation>` — botão "← Voltar ao Blog" (Link para `/blog`) + secção "Artigos relacionados" com 2 cards compactos baseados em tags comuns
8. `<Footer />` — componente existente

\---

## 6\. SEGURANÇA MDX

* Usar `rehype-sanitize` ou configuração restrita do MDX para impedir execução de JavaScript arbitrário vindo dos ficheiros de conteúdo
* Links externos no conteúdo MDX têm `rel="noopener noreferrer"` automático via plugin remark
* Imagens MDX passam sempre por `next/image`, nunca por `<img>` direto

\---

## 7\. SECURITY HEADERS

**NÃO alterar** o `next.config.js` existente se já tiver security headers configurados.

Se não tiver, adicionar ao bloco `headers()` apenas para as rotas `/blog` e `/blog/:path\*`:

```javascript
{
  key: 'X-Robots-Tag',
  value: 'index, follow'
},
{
  key: 'Cache-Control',
  value: 'public, max-age=3600, stale-while-revalidate=86400'
}
```

\---

## 8\. PERFORMANCE

* Todas as páginas de blog geradas estaticamente com `generateStaticParams` + `export const dynamic = 'force-static'`
* `next/image` em **todas** as imagens sem exceção
* Herdar fontes do site existente — não carregar fontes adicionais
* `<ReadingProgress>` como Client Component isolado para não bloquear RSC do resto da página
* Cards na listagem: `loading="lazy"` nas imagens (exceto os 3 primeiros above-the-fold)

\---

## 9\. ACESSIBILIDADE (WCAG 2.1 AA)

* Skip link `#blog-content` na página de listagem
* `<ReadingProgress>`: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
* Cards: o `<Link>` que envolve o card tem `aria-label` com o título completo do artigo
* Breadcrumb: `aria-label="Breadcrumb"`, `aria-current="page"` no último item
* `coverAlt` do frontmatter usado em todas as imagens de capa — nunca `alt=""`
* Tabelas MDX: `scope="col"` nos headers
* Contraste mínimo 4.5:1 em todo o texto

\---

## 10\. I18N — CHAVES A ADICIONAR

Adicionar ao ficheiro `/messages/pt.json` **existente** (não substituir, apenas acrescentar a chave `"blog"`):

```json
"blog": {
  "hero": {
    "title": "Blog",
    "subtitle": "Dicas práticas de presença digital para o teu negócio"
  },
  "card": {
    "readMore": "Ler mais →",
    "readingTime": "{{count}} min de leitura"
  },
  "post": {
    "backToBlog": "← Voltar ao Blog",
    "relatedPosts": "Artigos relacionados",
    "publishedOn": "Publicado a",
    "updatedOn": "Atualizado a",
    "by": "por"
  },
  "cta": {
    "title": "Precisas de ajuda com a presença digital do teu negócio?",
    "button": "Fala Connosco"
  },
  "pagination": {
    "previous": "← Anterior",
    "next": "Seguinte →",
    "page": "Página {{current}} de {{total}}"
  },
  "readingProgress": {
    "ariaLabel": "Progresso de leitura do artigo"
  }
}
```

Traduzir para `en.json` (e para `fr.json` / `de.json` se existirem).

\---

## 11\. IMAGENS PLACEHOLDER

* `/public/images/blog/blog-hero.jpg` — cena aérea de uma rua comercial portuguesa, luz natural. Usar uma imagem Unsplash de alta qualidade. Dimensões alvo: 1920×600px.
* `/public/images/blog/covers/como-aparecer-no-google-maps-2026-pmes.jpg` — smartphone moderno com interface de mapa, fundo suave. Dimensões alvo: 1200×630px.

Criar `/docs/BLOG\_IMAGES.md` com:

* Listagem de todas as imagens necessárias e as suas dimensões ideais
* Formato preferido: WebP com JPEG como fallback
* Onde colocar: `/public/images/blog/covers/\[slug-do-artigo].jpg`
* Convenção de nomes: slug do artigo, hífens, minúsculas (ex: `seo-local-2026.jpg`)
* Como substituir os placeholders sem tocar no código

\---

## 12\. CONTEÚDO DO PRIMEIRO ARTIGO

Criar o ficheiro `/content/blog/como-aparecer-no-google-maps-2026-pmes/index.mdx` com o seguinte conteúdo **exactamente**:

```mdx
---
title: "Como aparecer no Google Maps em 2026 (guia para PMEs)"
slug: "como-aparecer-no-google-maps-2026-pmes"
date: "2026-03-30"
description: "Aprende a otimizar o teu Perfil de Empresa no Google e a aparecer nas pesquisas locais em 2026. Guia passo a passo para pequenas e médias empresas em Portugal."
coverImage: "/images/blog/covers/como-aparecer-no-google-maps-2026-pmes.jpg"
coverAlt: "Ilustração de um smartphone com Google Maps mostrando um perfil de negócio local"
category: "Google Business Profile"
tags: \["SEO local", "Google Maps", "Google Business Profile", "PME", "presença digital"]
author: "Re-Evolution"
readingTime: 8
featured: true
published: true
---

## Introdução

Quando um potencial cliente pesquisa "restaurante perto de mim" ou "advogado em Lisboa", o Google não mostra o site mais bonito — mostra os negócios que considerou mais relevantes, próximos e confiáveis. Esse conjunto de resultados chama-se \*\*Local Pack\*\*, e aparecer nele pode ser a diferença entre o telefone tocar ou ficar em silêncio.

Em 2026, o Google Maps tornou-se ainda mais competitivo. A integração com IA generativa (o AI Overviews) mudou a forma como os resultados locais são apresentados. Mas a boa notícia para as PMEs é que os fundamentos continuam os mesmos — e a maioria dos teus concorrentes ainda os ignora.

Este guia mostra-te exatamente o que fazer.

---

## O que é o Google Business Profile (e porque é o teu ativo mais importante)

O \*\*Google Business Profile (GBP)\*\* — anteriormente chamado Google My Business — é o painel que controla como o teu negócio aparece no Google Maps e nas pesquisas locais. É gratuito. É poderoso. E é surpreendentemente mal utilizado.

Quando está bem configurado, o GBP permite que o teu negócio apareça:
- No \*\*Local Pack\*\* (os 3 resultados com mapa no topo da pesquisa)
- No painel de informação lateral (\*Knowledge Panel\*) quando pesquisam diretamente pelo nome do negócio
- No Google Maps quando alguém explora uma zona geográfica

Sem um perfil otimizado, és invisível para quem pesquisa localmente — mesmo que tenhas um site excelente.

---

## Passo 1 — Reclama e verifica o teu perfil

Se ainda não tens um perfil criado ou verificado, este é o primeiro passo obrigatório.

1. Acede a \[business.google.com](https://business.google.com)
2. Pesquisa pelo nome do teu negócio
3. Se já existir um perfil (criado automaticamente pelo Google), \*\*reclama-o\*\*
4. Se não existir, cria um do zero
5. Conclui o processo de \*\*verificação\*\* — normalmente por código enviado por correio, vídeo, ou chamada telefónica

> ⚠️ \*\*Atenção:\*\* Nunca ignores a verificação. Um perfil não verificado tem visibilidade limitada e não podes responder a avaliações.

---

## Passo 2 — Preenche o perfil a 100%

O Google usa um conceito chamado \*\*"completude do perfil"\*\* como fator de ranking. Quanto mais informação válida forneças, maior a probabilidade de seres mostrado.

| Campo | Porque importa |
|---|---|
| Nome do negócio | Deve ser o nome real — sem palavras-chave artificiais |
| Categoria principal | É o sinal mais forte para o Google sobre o que fazes |
| Categorias secundárias | Permitem aparecer em pesquisas adjacentes |
| Morada completa | Essencial para geolocalização |
| Horário de funcionamento | Atualiza em feriados — o Google penaliza inconsistências |
| Número de telefone | Formato local (+351...) |
| Website | Aponta para a página mais relevante, não necessariamente a homepage |
| Descrição do negócio | 750 caracteres — usa a palavra-chave principal de forma natural |
| Atributos | "Acessível a cadeiras de rodas", "Wi-Fi gratuito" — negligenciados pela maioria |

---

## Passo 3 — Fotografias: mais do que pensas

O Google mede o engagement no teu perfil. Perfis com fotografias de qualidade recebem significativamente mais cliques para o website e mais pedidos de direções.

O que deves publicar:
- \*\*Foto de capa:\*\* exterior do espaço, reconhecível e atual
- \*\*Foto de perfil/logo:\*\* fundo limpo, legível em miniatura
- \*\*Interior:\*\* ambiente real, não stock photos
- \*\*Equipa:\*\* humaniza o negócio
- \*\*Produtos/serviços:\*\* especialmente para restaurantes, clínicas, lojas

Frequência recomendada: pelo menos \*\*1 foto nova por mês\*\*.

> 💡 \*\*Dica:\*\* Nomeia os ficheiros antes de fazer upload. `restaurante-lisboa-interior-2026.jpg` é melhor que `IMG\_4823.jpg` — o Google lê os metadados.

---

## Passo 4 — Avaliações: o fator com mais impacto

As avaliações são provavelmente o sinal de ranking local mais poderoso que existe. Mas há nuances que a maioria das PMEs não conhece.

\*\*Quantidade vs. qualidade:\*\* Um negócio com 50 avaliações de 4,6 estrelas tende a superar um com 10 avaliações de 5,0 estrelas. O Google desconfia de perfis com poucas avaliações perfeitas.

\*\*Velocidade de acumulação:\*\* Conseguir 30 avaliações em 2 dias parece suspeito. O crescimento orgânico e gradual é preferível.

\*\*Respostas do proprietário:\*\* Responder a avaliações — positivas e negativas — é um sinal de atividade e credibilidade. Nunca ignores uma avaliação negativa. Uma resposta profissional e empática faz mais pela tua reputação do que a avaliação em si.

\*\*Como pedir avaliações (sem violar as regras do Google):\*\*
- No final de um serviço/compra, envia uma mensagem com o link direto para avaliação
- Coloca um QR code visível no espaço físico
- Adiciona o link à assinatura de email

> ⛔ \*\*O que nunca deves fazer:\*\* comprar avaliações, pedir a funcionários que avaliem, ou oferecer incentivos em troca de avaliações. O Google deteta padrões suspeitos e pode suspender o perfil.

---

## Passo 5 — Google Posts: a funcionalidade que ninguém usa

Os \*\*Google Posts\*\* são publicações que aparecem diretamente no teu perfil do Google Maps. São gratuitos, têm visibilidade imediata, e a esmagadora maioria dos negócios nunca os usa.

Tipos disponíveis:
- \*\*Atualização:\*\* notícias gerais, novidades
- \*\*Oferta:\*\* promoções com data de início e fim
- \*\*Evento:\*\* com data, hora e descrição
- \*\*Produto:\*\* com foto, preço e descrição

Frequência recomendada: 1 post por semana. Cada post dura 7 dias (exceto eventos e ofertas).

---

## Passo 6 — NAP Consistency

Este conceito técnico tem impacto direto no ranking. O Google cruza a informação do teu GBP com outras fontes online (diretórios, site, redes sociais) para verificar a consistência de NAP — \*\*N\*\*ome, \*\*A\*\*morada, \*\*T\*\*elefone.

Se o teu negócio aparece com nomes diferentes em cada plataforma, estás a criar sinais contraditórios para o Google.

\*\*Auditoria rápida:\*\*
1. Pesquisa o nome do teu negócio no Google
2. Verifica todos os locais onde aparece (diretórios, redes sociais, site)
3. Garante que Nome, Morada e Telefone são \*\*exatamente iguais\*\* em todos

---

## Passo 7 — Monitoriza os resultados

O GBP tem um painel de analytics nativo que mostra:
- Quantas vezes o perfil foi visto
- Quantas pesquisas resultaram em cliques para o site
- Quantos pedidos de direções foram feitos
- Quantas chamadas foram geradas

Olha para estes números mensalmente. Se as visualizações estão estáveis mas os cliques para o site são baixos, o problema pode ser as fotografias ou a descrição.

---

## O que mudou em 2026: IA e pesquisa local

Com a expansão do \*\*AI Overviews\*\* do Google, algumas pesquisas locais passam a ter respostas geradas por IA antes dos resultados tradicionais. Para aparecer nessas respostas:

- O teu site precisa de ter conteúdo estruturado e relevante sobre a tua área de atuação
- O GBP precisa de estar completo e atualizado
- As avaliações precisam de mencionar termos relevantes — o Google usa o texto das avaliações como sinal semântico

---

## Conclusão

Aparecer no Google Maps não é magia — é consistência. Um perfil bem construído, fotografias atualizadas, avaliações reais e posts regulares fazem a diferença entre estar na primeira página ou ser ignorado.

Se precisas de ajuda para otimizar o perfil do teu negócio ou automatizar a gestão de avaliações, a Re-Evolution trata disso por ti.
```

\---

## 13\. VALIDAÇÃO FINAL

Antes de declarar o trabalho concluído, confirmar:

* \[ ] `npm run build` passa sem erros
* \[ ] Zero erros TypeScript
* \[ ] A rota `/blog` mostra a listagem com o artigo publicado
* \[ ] A rota `/blog/como-aparecer-no-google-maps-2026-pmes` mostra o artigo completo
* \[ ] O breadcrumb funciona e navega para `/blog`
* \[ ] O botão "← Voltar ao Blog" leva para `/blog`
* \[ ] O CTA final aponta para `/#contacto`
* \[ ] O `<ReadingProgress>` preenche ao fazer scroll
* \[ ] A paginação existe (mesmo que com 1 página por agora)
* \[ ] `<Header />` e `<Footer />` existentes estão presentes em todas as páginas do blog
* \[ ] Nenhuma rota existente do site foi quebrada
* \[ ] Imagens placeholder carregam sem erros de `next/image`
* \[ ] Links externos no MDX têm `rel="noopener noreferrer"`

Se algo não for possível implementar, documentar em `/docs/BLOG\_NOTES.md` com descrição exacta do que ficou pendente e porquê.

