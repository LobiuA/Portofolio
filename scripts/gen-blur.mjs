// Generates lib/blur.json: a map of { [imageKey]: blurDataURL } for every JPG in
// public/work/. The key matches the string keys used with img() in lib/content.ts
// (i.e. the filename without the .jpg extension). Run after adding/replacing images:
//   node scripts/gen-blur.mjs
import { readdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const workDir = join(root, 'public', 'work')
const outFile = join(root, 'lib', 'blur.json')

const files = (await readdir(workDir)).filter((f) => f.toLowerCase().endsWith('.jpg'))

const entries = await Promise.all(
  files.map(async (file) => {
    const key = file.replace(/\.jpg$/i, '')
    const buf = await sharp(join(workDir, file))
      .resize(16, 16, { fit: 'inside' })
      .jpeg({ quality: 40 })
      .toBuffer()
    return [key, `data:image/jpeg;base64,${buf.toString('base64')}`]
  }),
)

entries.sort((a, b) => a[0].localeCompare(b[0]))
const map = Object.fromEntries(entries)
await writeFile(outFile, JSON.stringify(map, null, 2) + '\n')
console.log(`Wrote ${entries.length} blur placeholders → lib/blur.json`)
