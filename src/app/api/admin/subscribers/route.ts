import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAdmin(req: Request) {
  const token = req.headers.get('x-admin-token') || ''
  return token && token === (process.env.ADMIN_TOKEN || '')
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ ok: true, subscribers: subs })
}
