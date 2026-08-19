import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const priceId = body.priceId || body.planId || 'free'

  if (!priceId) return NextResponse.json({ ok: false, error: 'missing_price' }, { status: 400 })

  // Do not call external Stripe APIs here — return a safe stub for local testing.
  const checkout = {
    id: `sess_${Date.now()}`,
    url: `https://example.com/checkout?session=${Date.now()}&price=${encodeURIComponent(priceId)}`,
    priceId
  }

  return NextResponse.json({ ok: true, checkout })
}
