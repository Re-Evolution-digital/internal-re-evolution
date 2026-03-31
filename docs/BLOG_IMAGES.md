# Blog Images — Guia de Assets

## Imagens necessárias

| Imagem | Caminho | Dimensões ideais | Uso |
|--------|---------|-----------------|-----|
| Hero do Blog | `/public/images/blog/blog-hero.jpg` | 1920×600 px | Página de listagem `/blog` |
| Cover — Google Maps 2026 | `/public/images/blog/como-aparecer-no-google-maps-2026-pmes.jpg` | 1200×630 px | Artigo e Open Graph |

## Formato preferido

- **Primeiro:** WebP (melhor compressão, suportado pelos browsers modernos)
- **Fallback:** JPEG (compatibilidade máxima)
- O `next/image` converte automaticamente para WebP/AVIF conforme configurado em `next.config.ts`

## Convenção de nomes

```
/public/images/blog/[slug-do-artigo].jpg
```

Exemplos:
- `seo-local-2026.jpg`
- `automacoes-sem-codigo.jpg`
- `site-rapido-mobile.jpg`

Regras:
- Apenas letras minúsculas
- Separação por hífens
- Sem espaços, acentos ou caracteres especiais
- O slug do ficheiro deve coincidir com o `slug` no frontmatter do MDX

## Como substituir os placeholders

1. Obtém a imagem na dimensão indicada (Unsplash, Pexels, etc.)
2. Otimiza com [Squoosh](https://squoosh.app) ou similar (alvo: < 200 KB)
3. Coloca o ficheiro no caminho correto (`/public/images/blog/covers/[slug].jpg`)
4. **Não é necessário alterar nenhum ficheiro de código** — o frontmatter do MDX aponta para o caminho correto

## Sugestões Unsplash para os placeholders actuais

### blog-hero.jpg (1920×600)
Pesquisa: "portuguese street commercial aerial" ou "lisbon street morning light"
- Tema: cena aérea de uma rua comercial portuguesa, luz natural

### como-aparecer-no-google-maps-2026-pmes.jpg (1200×630)
Pesquisa: "smartphone google maps" ou "mobile map navigation"
- Tema: smartphone moderno com interface de mapa, fundo suave

## Dimensões mínimas recomendadas

| Contexto | Largura | Altura |
|----------|---------|--------|
| Hero do blog (hero) | 1920 px | 600 px |
| Open Graph / Cover | 1200 px | 630 px |
| Card thumbnail (gerado pelo next/image) | 800 px | 450 px |
