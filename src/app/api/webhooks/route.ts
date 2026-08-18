import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Placeholder: verify webhook signatures (Stripe, etc.)
  const body = await req.text()
  console.log('webhook received', body?.slice(0,200))
  return NextResponse.json({ ok: true })
}
