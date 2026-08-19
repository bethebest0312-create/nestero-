import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { readJson, writeJson } from '@/lib/fsStore'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') || ''
  const raw = await req.text()
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (secret && process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' })
    try {
      const event = stripe.webhooks.constructEvent(raw, sig, secret)
      console.log('stripe event', event.type)

      // Persist important events to file-store for local visibility
      const store = readJson('payments/index.json', []) as any[]
      store.unshift({ id: event.id, type: event.type, data: event.data, receivedAt: new Date().toISOString() })
      writeJson('payments/index.json', store)

      // handle checkout.session.completed: mark as paid
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        console.log('Checkout session completed for', session.id)
        // Add a paid record
        const paid = readJson('payments/paid.json', []) as any[]
        paid.unshift({ sessionId: session.id, amount_total: session.amount_total || null, customer_email: session.customer_details?.email || null, createdAt: new Date().toISOString() })
        writeJson('payments/paid.json', paid)
      }

    } catch (err) {
      console.error('webhook signature verification failed', err)
      return NextResponse.json({ ok: false }, { status: 400 })
    }
  } else {
    // If no webhook secret, still log raw payload for local debugging
    const store = readJson('payments/index.json', []) as any[]
    store.unshift({ id: `local_${Date.now()}`, type: 'raw', raw: raw?.slice(0,200), receivedAt: new Date().toISOString() })
    writeJson('payments/index.json', store)
    console.log('Stripe webhook secret not set — logged raw payload')
  }
  return NextResponse.json({ ok: true })
}
