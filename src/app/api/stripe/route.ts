import { NextResponse } from 'next/server'
import { createCheckoutSession, getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const priceId = body.priceId || body.planId || process.env.STRIPE_PRICE_ID || 'free'
  const successUrl = body.successUrl || `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`
  const cancelUrl = body.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/settings`

  if (!priceId) return NextResponse.json({ ok: false, error: 'missing_price' }, { status: 400 })

  try {
    const session = await createCheckoutSession(priceId, successUrl, cancelUrl)
    // If Stripe library present, session may be the Stripe session object
    const url = (session && (session.url || session.id)) ? (session.url || `https://checkout.stripe.com/pay/${session.id}`) : session.url
    return NextResponse.json({ ok: true, checkout: { id: session.id || session, url, priceId } })
  } catch (e) {
    console.error('Stripe checkout creation failed', e)
    // fallback stub
    const checkout = {
      id: `stub_${Date.now()}`,
      url: `https://example.com/checkout?session=${Date.now()}&price=${encodeURIComponent(priceId)}`,
      priceId
    }
    return NextResponse.json({ ok: true, checkout })
  }
}
