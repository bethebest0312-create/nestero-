import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAdmin(req: Request) {
  const token = req.headers.get('x-admin-token') || ''
  return token && token === (process.env.ADMIN_TOKEN || '')
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
  const csv = ['email,name,verified,createdAt']
  subs.forEach(s => csv.push(`${s.email},"${(s.name||'')}",${s.verified},${s.createdAt.toISOString()}`))
  const body = csv.join('\n')
  return new NextResponse(body, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="subscribers.csv"' } })
}
