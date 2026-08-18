import { NextResponse } from 'next/server'

export async function GET() {
  // Placeholder: list team members
  return NextResponse.json({ ok: true, team: [] })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  // Placeholder: create team invite
  return NextResponse.json({ ok: true, created: body })
}
