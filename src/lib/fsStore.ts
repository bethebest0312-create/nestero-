import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

export function readJson<T = any>(relPath: string, defaultValue: T): T {
  ensureDir(DATA_DIR)
  const p = path.join(DATA_DIR, relPath)
  if (!fs.existsSync(p)) return defaultValue
  try {
    const raw = fs.readFileSync(p, 'utf-8')
    return JSON.parse(raw) as T
  } catch (e) {
    return defaultValue
  }
}

export function writeJson(relPath: string, data: any) {
  ensureDir(DATA_DIR)
  const p = path.join(DATA_DIR, relPath)
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
}
