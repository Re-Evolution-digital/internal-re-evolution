#!/usr/bin/env node
/**
 * Gera lib/logo-b64.generated.ts com o logo em Base64.
 * Corre automaticamente como prebuild (ver package.json).
 * Necessário porque Cloudflare Workers não têm acesso ao fs em runtime.
 */
const fs = require('fs')
const path = require('path')

const logoPng = path.join(__dirname, '..', 'public', 'images', 'logo', 'logo.png')
const outFile = path.join(__dirname, '..', 'lib', 'logo-b64.generated.ts')

const data = fs.readFileSync(logoPng)
const dataUri = `data:image/png;base64,${data.toString('base64')}`

fs.writeFileSync(
  outFile,
  `// Auto-gerado por scripts/generate-logo-b64.js — não editar manualmente\nexport const LOGO_DATA_URI = \`${dataUri}\`\n`,
)

console.log(`[generate-logo-b64] OK — ${outFile} (${dataUri.length} chars)`)
