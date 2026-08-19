import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const prompt = (body.prompt || '').toString()
  if (!prompt) return NextResponse.json({ ok: false, error: 'missing_prompt' }, { status: 400 })

  // Simple content generator scaffold (no external calls)
  const content = {
    title: `Idea for: ${prompt.slice(0, 40)}`,
    body: `This is a scaffolded content piece generated for the prompt: ${prompt}. Replace with a real AI/content service.`
  }

  return NextResponse.json({ ok: true, content })
}
