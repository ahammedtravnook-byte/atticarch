/**
 * Batch image optimizer.
 * Drop original JPG/PNG files into src/assets/{hero,projects,rooms,about}
 * (sub-folders allowed), then run:  npm run optimize
 *
 * Resizes + converts every image to WebP in place (originals deleted),
 * keeping bundle size small enough for Vercel/Render static hosting.
 *
 * Requires:  npm i -D sharp
 */
import sharp from 'sharp'
import { readdir, unlink, stat } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets')
const TARGET_DIRS = ['hero', 'projects', 'rooms', 'about']

const MAX_WIDTH = 1920   // any image can serve as hero or card
const QUALITY = 78
const SRC_EXT = ['.jpg', '.jpeg', '.png']

let done = 0, saved = 0, failed = 0

async function walk(dir) {
  let entries
  try { entries = await readdir(dir, { withFileTypes: true }) }
  catch { return }

  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) { await walk(full); continue }
    if (!SRC_EXT.includes(extname(e.name).toLowerCase())) continue

    const out = full.replace(extname(full), '.webp')
    try {
      const before = (await stat(full)).size
      await sharp(full)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(out)
      const after = (await stat(out)).size
      await unlink(full)
      done++; saved += before - after
      const kb = n => Math.round(n / 1024)
      console.log(`  ${e.name} -> ${e.name.replace(extname(e.name), '.webp')}  (${kb(before)}kb -> ${kb(after)}kb)`)
    } catch (err) {
      failed++
      console.warn(`  ! skipped ${full}: ${err.message}`)
    }
  }
}

console.log('Optimizing images ...')
for (const d of TARGET_DIRS) await walk(join(ROOT, d))
console.log(`\nDone. ${done} converted, ${failed} skipped, ${(saved / 1e6).toFixed(1)}MB saved.`)
