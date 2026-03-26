#!/usr/bin/env node
/**
 * Gera lib/logo-b64.generated.ts com o logo optimizado para email.
 * Usa sharp para redimensionar e comprimir antes de codificar em Base64,
 * garantindo que o email fica bem abaixo do limite de 102KB do Gmail.
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const logoPng = path.join(__dirname, '..', 'public', 'images', 'logo', 'logo.png')
const outFile = path.join(__dirname, '..', 'lib', 'logo-b64.generated.ts')

sharp(logoPng)
  .resize(160) // 160px de largura (2× para retina); altura proporcional
  .png({ compressionLevel: 9, quality: 80 })
  .toBuffer()
  .then((buf) => {
    const dataUri = `data:image/png;base64,${buf.toString('base64')}`
    fs.writeFileSync(
      outFile,
      `// Auto-gerado por scripts/generate-logo-b64.js — não editar manualmente\nexport const LOGO_DATA_URI = \`${dataUri}\`\n`,
    )
    console.log(`[generate-logo-b64] OK — ${buf.length} bytes → Base64 ${dataUri.length} chars`)
  })
  .catch((err) => {
    console.error('[generate-logo-b64] Erro:', err.message)
    process.exit(1)
  })
