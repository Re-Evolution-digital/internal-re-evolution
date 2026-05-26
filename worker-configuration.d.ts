// Tipos dos bindings do Cloudflare Worker — gerado manualmente, sincronizado com wrangler.toml
interface CloudflareEnv {
  ASSETS: Fetcher
  PDF_BUCKET: R2Bucket
  [key: string]: unknown
}
