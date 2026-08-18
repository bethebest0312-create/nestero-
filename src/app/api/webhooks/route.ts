import { NextResponse } from 'next/server'
import { buffer } from 'node:stream/consumers'
import Stripe from 'stripe'

export async function POST(req: Request) {
  // Stripe webhook example: verify signature using STRIPE_WEBHOOK_SECRET
  const sig = req.headers.get('stripe-signature') || ''
  const raw = await req.text()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (secret) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' })
    try {
      const event = stripe.webhooks.constructEvent(raw, sig, secret)
      console.log('stripe event', event.type)
      // handle event types as needed
    } catch (err) {
      console.error('webhook signature verification failed', err)
      return NextResponse.json({ ok: false }, { status: 400 })
    }
  } else {
    console.log('Stripe webhook secret not set — received:', raw?.slice(0,200))
  }
  return NextResponse.json({ ok: true })
}
