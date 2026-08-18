import { NextResponse } from 'next/server'
import { getApiKeyByKey, isWithinQuota, recordUsage } from '@/lib/apikeys'

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || ''
  const m = auth.match(/^Bearer (.+)$/)
  if (!m) return NextResponse.json({ ok: false, error: 'missing_api_key' }, { status: 401 })
  const key = m[1]
  const rec = await getApiKeyByKey(key)
  if (!rec) return NextResponse.json({ ok: false, error: 'invalid_key' }, { status: 401 })
  const okQuota = await isWithinQuota(rec)
  if (!okQuota) return NextResponse.json({ ok: false, error: 'quota_exceeded' }, { status: 429 })
  // placeholder: perform generation via OpenAI or local model — do not call paid APIs here
  const body = await req.json().catch(() => ({}))
  const prompt = body?.prompt || 'hello world'
  // fake generation response for scaffold
  const result = { text: `Generated (free) for: ${prompt}` }
  // record usage
  await recordUsage(rec.id, '/api/free/generate')
  return NextResponse.json({ ok: true, result })
}
