import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

async function isAdmin(req: Request) {
  // prefer session-based admin check
  try {
    const session = await getServerSession(authOptions)
    // @ts-ignore
    if (session?.user?.role === 'admin') return true
  } catch (e) {
    // ignore
  }
  // fallback to admin token
  const token = req.headers.get('x-admin-token') || ''
  return token && token === (process.env.ADMIN_TOKEN || '')
}

export async function GET(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ ok: true, subscribers: subs })
}
