import { NextResponse } from 'next/server'
import { readJson, writeJson } from '@/lib/fsStore'

export async function GET() {
  const invites = readJson('team/invites.json', []) as any[]
  return NextResponse.json({ ok: true, invites })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const email = (body.email || '').toString()
  const role = body.role || 'member'
  if (!email) return NextResponse.json({ ok: false, error: 'missing_email' }, { status: 400 })

  const invites = readJson('team/invites.json', []) as any[]
  const invite = { id: `inv_${Date.now()}`, email, role, createdAt: new Date().toISOString(), accepted: false }
  invites.push(invite)
  writeJson('team/invites.json', invites)

  return NextResponse.json({ ok: true, invite })
}
