import { NextResponse } from 'next/server'
import { getApiKeyByKey, recordUsage, isWithinQuota } from '@/lib/apikeys'
import { generateViaOpenAI } from '@/lib/openaiClient'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const prompt = (body.prompt || '').toString()
  if (!prompt || prompt.length < 1) return NextResponse.json({ ok: false, error: 'missing_prompt' }, { status: 400 })

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

  const useOpenAI = Boolean(process.env.OPENAI_API_KEY)
  let resultText = `✨ Generated content for: ${prompt}\n\nSummary: fallback local result.`
  if (useOpenAI) {
    const res = await generateViaOpenAI(prompt)
    resultText = res?.text || resultText
  }

  return NextResponse.json({ ok: true, result: { text: resultText } })
}
