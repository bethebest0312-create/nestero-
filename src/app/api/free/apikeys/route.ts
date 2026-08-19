import { NextResponse } from 'next/server'
import { createApiKey } from '@/lib/apikeys'

export async function POST(req: Request) {
  // Create a free API key. In production, restrict who can create keys (signup, email verification, etc.)
  const body = await req.json().catch(() => ({}))
  const userId = body?.userId
  const monthlyQuota = body?.monthlyQuota ?? 1000
  const rec = await createApiKey({ userId, monthlyQuota })
  return NextResponse.json({ ok: true, key: rec.key, id: rec.id })
}
