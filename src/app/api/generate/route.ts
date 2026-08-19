import { NextResponse } from 'next/server'
import { getApiKeyByKey, recordUsage, isWithinQuota } from '@/lib/apikeys'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const prompt = (body.prompt || '').toString()

  // Basic validation
  if (!prompt || prompt.length < 1) return NextResponse.json({ ok: false, error: 'missing_prompt' }, { status: 400 })

  // If an API key is provided, attempt to record usage (best-effort)
  const auth = req.headers.get('authorization') || ''
  const m = auth.match(/^Bearer (.+)$/i)
  if (m) {
    const key = m[1]
    const rec = await getApiKeyByKey(key)
    if (rec) {
      const okQuota = await isWithinQuota(rec)
      if (!okQuota) return NextResponse.json({ ok: false, error: 'quota_exceeded' }, { status: 429 })
      await recordUsage(rec.id, '/api/generate')
    }
  }

  // Deterministic, offline "generation" — safe for scaffolding/dev
  const generated = `✨ Generated content for: ${prompt}\n\nSummary: This is a local scaffold result — replace with real model integration.`

  return NextResponse.json({ ok: true, result: { text: generated } })
}
