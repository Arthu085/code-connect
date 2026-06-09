import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { join, dirname, basename, extname } from 'path'
import { readdirSync, statSync } from 'fs'

const require = createRequire(import.meta.url)
const sharp = require(join(dirname(fileURLToPath(import.meta.url)), '../node_modules/sharp'))

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), '../public')
const MAX_WIDTH = 760
const WEBP_QUALITY = 80

const pngs = readdirSync(PUBLIC_DIR).filter((f) => f.endsWith('.png') && f.startsWith('banner'))

for (const file of pngs) {
  const input = join(PUBLIC_DIR, file)
  const output = join(PUBLIC_DIR, basename(file, extname(file)) + '.webp')

  const meta = await sharp(input).metadata()
  const width = Math.min(meta.width, MAX_WIDTH)

  await sharp(input).resize({ width }).webp({ quality: WEBP_QUALITY }).toFile(output)

  const before = statSync(input).size
  const after = statSync(output).size
  console.log(
    `${file} → ${basename(output)}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (-${Math.round((1 - after / before) * 100)}%)`,
  )
}
