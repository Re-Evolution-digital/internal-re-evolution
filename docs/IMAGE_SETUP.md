# Setup de Imagens e Assets

## Lista de Imagens Necessárias

| Ficheiro | Dimensões | Descrição |
|---|---|---|
| `/public/images/logo/logo.svg` | Vectorial | Logo principal (já existe) |
| `/public/images/logo/logo.png` | 400×120px | Logo PNG fallback (já existe) |
| `/public/images/logo/logo-white.svg` | Vectorial | Logo branca para footer (criar variante) |
| `/public/images/logo/favicon.ico` | 32×32px | Favicon padrão |
| `/public/images/logo/favicon-16x16.png` | 16×16px | Favicon pequeno |
| `/public/images/logo/favicon-32x32.png` | 32×32px | Favicon standard |
| `/public/images/logo/apple-touch-icon.png` | 180×180px | Ícone iOS |
| `/public/images/logo/android-chrome-192x192.png` | 192×192px | Ícone Android |
| `/public/images/logo/android-chrome-512x512.png` | 512×512px | Ícone Android grande |
| `/public/images/og/og-image.jpg` | 1200×630px | Open Graph (partilha redes sociais) |
| `/public/images/hero/hero-bg.jpg` | 1920×1080px | Background hero (tons escuros, tecnologia) |
| `/public/images/cases/arcadas-do-fado.jpg` | 800×600px | Foto do restaurante / logo cliente |
| `/public/images/blog/blog-placeholder-1.jpg` | 800×400px | Imagem artigo SEO |
| `/public/images/blog/blog-placeholder-2.jpg` | 800×400px | Imagem artigo automações |
| `/public/images/blog/blog-placeholder-3.jpg` | 800×400px | Imagem artigo performance |

---

## Como Gerar Favicons

1. Aceder a [realfavicongenerator.net](https://realfavicongenerator.net)
2. Fazer upload do `logo.svg`
3. Configurar:
   - iOS: fundo branco ou transparente
   - Android: fundo `#011b54`, ícone `#ffc700`
   - Windows: fundo `#011b54`
4. Gerar e fazer download do pacote
5. Extrair os ficheiros para `/public/images/logo/`

---

## Como Criar a OG Image (1200×630px)

### Opção 1: Canva
1. Novo design → tamanho personalizado 1200×630
2. Fundo: `#011b54`
3. Adicionar logo (versão branca/amarela)
4. Texto: "Re-Evolution — Agência Digital"
5. Subtexto: "Websites | Automações | IA para PMEs"
6. Exportar como JPG, qualidade 90%

### Opção 2: Figma
- Template disponível mediante pedido à equipa de design

---

## Imagens de Placeholder (Unsplash)

Para desenvolvimento, usar URLs do Unsplash ou deixar os gradientes CSS que já estão implementados nos componentes Blog e Cases.

Para produção, substituir por fotografias reais dos clientes (com autorização).

---

## Logo Branca para Footer

Para criar `logo-white.svg` a partir do `logo.svg`:
1. Abrir `logo.svg` num editor SVG (Inkscape, Figma, ou VS Code)
2. Substituir todas as cores escuras por `#ffffff`
3. Guardar como `logo-white.svg`

Ou adicionar filtro CSS no componente:
```css
filter: brightness(0) invert(1);
```
(já implementado no Footer com `className="brightness-0 invert"`)
