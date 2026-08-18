import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  if (!token) return NextResponse.json({ ok: false, error: 'missing_token' }, { status: 400 })
  const v = await prisma.subscriberVerification.findUnique({ where: { token }, include: { subscriber: true } })
  if (!v) return NextResponse.json({ ok: false, error: 'invalid_token' }, { status: 400 })
  if (v.used) return NextResponse.json({ ok: false, error: 'token_used' }, { status: 400 })
  await prisma.subscriber.update({ where: { id: v.subscriberId }, data: { verified: true } })
  await prisma.subscriberVerification.update({ where: { id: v.id }, data: { used: true } })
  // Optionally redirect to a thank-you page
  const site = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return NextResponse.redirect(`${site}/?verified=1`)
}
