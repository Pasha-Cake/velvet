import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const baseSvg = readFileSync(join(publicDir, 'icon.svg'), 'utf8')

const GOLD = '#d4a72c'
const NAVY = '#1a2744'

// Inject a fill color into all <path> elements
function recolor(svg, color) {
  return svg.replace(/<path /g, `<path fill="${color}" `)
}

async function renderMark(color, size) {
  const svg = recolor(baseSvg, color)
  return sharp(Buffer.from(svg))
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
}

async function main() {
  // Light browser theme -> navy mark on transparent
  writeFileSync(join(publicDir, 'icon-light-32x32.png'), await renderMark(NAVY, 32))
  // Dark browser theme -> gold mark on transparent
  writeFileSync(join(publicDir, 'icon-dark-32x32.png'), await renderMark(GOLD, 32))

  // Apple touch icon: gold mark centered on navy rounded background (180x180)
  const markSize = 120
  const pad = (180 - markSize) / 2
  const goldMark = await renderMark(GOLD, markSize)
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="180" height="180" rx="36" fill="${NAVY}"/></svg>`
  )
  const apple = await sharp(bg)
    .composite([{ input: goldMark, top: Math.round(pad), left: Math.round(pad) }])
    .png()
    .toBuffer()
  writeFileSync(join(publicDir, 'apple-icon.png'), apple)

  console.log('Favicons generated: icon-light-32x32.png, icon-dark-32x32.png, apple-icon.png')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
