import { NextResponse } from 'next/server'
import { readJson, writeJson } from '@/lib/fsStore'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
      const invites = await prisma.teamInvite.findMany({ orderBy: { createdAt: 'desc' } })
      return NextResponse.json({ ok: true, invites })
    } catch (e) {
      console.error('DB read failed, falling back to file-store', e)
    }
  }
  const invites = readJson('team/invites.json', []) as any[]
  return NextResponse.json({ ok: true, invites })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const email = (body.email || '').toString()
  const role = body.role || 'member'
  if (!email) return NextResponse.json({ ok: false, error: 'missing_email' }, { status: 400 })

  if (process.env.DATABASE_URL) {
    try {
      const token = crypto.randomBytes(16).toString('hex')
      const rec = await prisma.teamInvite.create({ data: { email, role, token } })
      return NextResponse.json({ ok: true, invite: rec })
    } catch (e) {
      console.error('DB invite create failed, falling back to file-store', e)
    }
  }

  const invites = readJson('team/invites.json', []) as any[]
  const invite = { id: `inv_${Date.now()}`, email, role, createdAt: new Date().toISOString(), accepted: false }
  invites.push(invite)
  writeJson('team/invites.json', invites)

  return NextResponse.json({ ok: true, invite })
}
