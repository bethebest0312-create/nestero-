import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function isAdmin(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    // @ts-ignore
    if (session?.user?.role === 'admin') return true
  } catch (e) {}
  const token = req.headers.get('x-admin-token') || ''
  return token && token === (process.env.ADMIN_TOKEN || '')
}

export async function GET(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
  const csv = ['email,name,verified,createdAt']
  subs.forEach(s => csv.push(`${s.email},"${(s.name||'')}",${s.verified},${s.createdAt.toISOString()}`))
  const body = csv.join('\n')
  return new NextResponse(body, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="subscribers.csv"' } })
}
