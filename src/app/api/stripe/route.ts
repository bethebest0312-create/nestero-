import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Placeholder: create Stripe checkout/session using secret key
  return NextResponse.json({ ok: true })
}
