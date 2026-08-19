import { NextResponse } from 'next/server'

// Simple in-repo hosting preview: accepts a path query and returns a placeholder page.
export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.searchParams.get('path') || 'index'
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Site preview: ${path}</title></head><body><h1>Preview for ${path}</h1><p>This is a hosted preview placeholder. Replace with persisted site content or CDN publishing flow.</p></body></html>`
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
}

export async function POST(req: Request) {
  // Accepts { path, html } to 'publish' — placeholder: logs and returns ok.
  const body = await req.json().catch(() => ({}))
  console.log('publish site', body?.path)
  return NextResponse.json({ ok: true, published: body?.path })
}
