import Stripe from 'stripe'

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY || ''
  if (!key) return null
  try {
    return new Stripe(key, { apiVersion: '2022-11-15' })
  } catch (e) {
    console.warn('Stripe init failed', e)
    return null
  }
}

export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
  const stripe = getStripe()
  if (!stripe) {
    // stubbed session for local/dev
    return { id: `stub_${Date.now()}`, url: `https://example.com/checkout?session=${Date.now()}&price=${encodeURIComponent(priceId)}` }
  }
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl
  })
}
