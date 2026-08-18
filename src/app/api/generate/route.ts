import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  // Placeholder: call OpenAI or other generator using server-side secret
  return NextResponse.json({ ok: true, received: body })
}
