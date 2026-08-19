import { NextResponse } from 'next/server'
import { writeJson, readJson } from '@/lib/fsStore'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const slug = (body.path || `site-${Date.now()}`).toString()
  const html = body.html || ''
  const metadata = body.metadata || {}

  if (!html) return NextResponse.json({ ok: false, error: 'missing_html' }, { status: 400 })

  // Prefer DB-backed Site when DATABASE_URL is set
  if (process.env.DATABASE_URL) {
    try {
      const rec = await prisma.site.upsert({ where: { slug }, update: { html, metadata, updatedAt: new Date() }, create: { slug, title: body.title || slug, html, metadata, ownerId: undefined } as any })
      return NextResponse.json({ ok: true, path: rec.slug })
    } catch (e) {
      console.error('DB site save failed, falling back to file-store', e)
    }
  }

  // fallback to file-store
  const pathKey = slug
  const store = readJson('sites/index.json', {}) as Record<string, any>
  store[pathKey] = { html, metadata, updatedAt: new Date().toISOString() }
  writeJson('sites/index.json', store)
  return NextResponse.json({ ok: true, path: pathKey })
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const pathKey = url.searchParams.get('path')

  if (process.env.DATABASE_URL) {
    try {
      if (!pathKey) {
        const rows = await prisma.site.findMany({ select: { slug: true, title: true, updatedAt: true } })
        return NextResponse.json({ ok: true, sites: rows })
      }
      const rec = await prisma.site.findUnique({ where: { slug: pathKey } })
      if (!rec) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
      return new NextResponse(rec.html, { headers: { 'Content-Type': 'text/html' } })
    } catch (e) {
      console.error('DB site read failed, falling back to file-store', e)
    }
  }

  const store = readJson('sites/index.json', {}) as Record<string, any>
  if (!pathKey) return NextResponse.json({ ok: true, sites: Object.keys(store) })
  const rec = store[pathKey]
  if (!rec) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  return new NextResponse(rec.html, { headers: { 'Content-Type': 'text/html' } })
}
