import { NextResponse } from 'next/server'
import { getApiKeyByKey, isWithinQuota, recordUsage } from '@/lib/apikeys'
import { isRateLimited } from '@/lib/rateLimit'
import { isRateLimitedRedis } from '@/lib/rateLimitRedis'
import { z } from 'zod'

const BodySchema = z.object({ prompt: z.string().min(1).max(2000) })

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || ''
  const m = auth.match(/^Bearer (.+)$/)
  if (!m) return NextResponse.json({ ok: false, error: 'missing_api_key' }, { status: 401 })
  const key = m[1]
  const rec = await getApiKeyByKey(key)
  if (!rec) return NextResponse.json({ ok: false, error: 'invalid_key' }, { status: 401 })

  // rate limit by key (60 reqs/min default). Prefer Redis if configured.
  const windowLimit = parseInt(process.env.FREE_API_RATE_LIMIT || '60', 10)
  if (process.env.REDIS_URL) {
    if (await isRateLimitedRedis(rec.key, windowLimit, 60)) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  } else {
    if (isRateLimited(rec.key, windowLimit, 60)) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  const okQuota = await isWithinQuota(rec)
  if (!okQuota) return NextResponse.json({ ok: false, error: 'quota_exceeded' }, { status: 429 })

  const bodyJson = await req.json().catch(() => ({}))
  const parse = BodySchema.safeParse(bodyJson)
  if (!parse.success) return NextResponse.json({ ok: false, error: 'invalid_body', details: parse.error.format() }, { status: 400 })

  const prompt = parse.data.prompt

  // placeholder: perform generation via OpenAI or local model — do not call paid APIs here
  const result = { text: `Generated (free) for: ${prompt}` }

  // record usage
  await recordUsage(rec.id, '/api/free/generate')
  return NextResponse.json({ ok: true, result })
}
