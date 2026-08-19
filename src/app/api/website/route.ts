import { NextResponse } from 'next/server'
import { writeJson, readJson } from '@/lib/fsStore'

export async function POST(req: Request) {
  // Accept { path, html, metadata }
  const body = await req.json().catch(() => ({}))
  const pathKey = (body.path || `site-${Date.now()}`).toString()
  const html = body.html || ''
  const metadata = body.metadata || {}

  if (!html) return NextResponse.json({ ok: false, error: 'missing_html' }, { status: 400 })

  // persist under data/sites/<pathKey>.json
  const store = readJson('sites/index.json', {}) as Record<string, any>
  store[pathKey] = { html, metadata, updatedAt: new Date().toISOString() }
  writeJson('sites/index.json', store)

  return NextResponse.json({ ok: true, path: pathKey })
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const pathKey = url.searchParams.get('path')
  const store = readJson('sites/index.json', {}) as Record<string, any>
  if (!pathKey) return NextResponse.json({ ok: true, sites: Object.keys(store) })
  const rec = store[pathKey]
  if (!rec) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  return new NextResponse(rec.html, { headers: { 'Content-Type': 'text/html' } })
}
