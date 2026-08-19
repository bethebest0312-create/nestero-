import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const email = (body?.email || '').toString().trim()
  const name = (body?.name || '').toString().trim()
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }
  try {
    const rec = await prisma.subscriber.upsert({
      where: { email },
      create: { email, name: name || null },
      update: { name: name || undefined }
    })

    // Create a verification token (double opt-in)
    const { generateToken } = await import('@/lib/mail')
    const token = generateToken()
    await prisma.subscriberVerification.create({ data: { token, subscriberId: rec.id } })

    // Build verification link
    const site = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const verifyUrl = `${site}/api/subscribe/verify?token=${token}`

    // Send welcome/verification email via mail helper (SendGrid preferred)
    try {
      const { sendMail } = await import('@/lib/mail')
      await sendMail({
        to: email,
        subject: 'Verify your email for Nestero',
        text: `Hi ${name || ''}\n\nThanks for joining Nestero! Please confirm your email: ${verifyUrl}`,
        html: `<p>Hi ${name || ''}</p><p>Thanks for joining Nestero! Please confirm your email by clicking <a href="${verifyUrl}">this link</a>.</p>`
      })
    } catch (err) {
      console.error('mail send failed', err)
    }

    return NextResponse.json({ ok: true, id: rec.id })
  } catch (err) {
    console.error('subscribe failed', err)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
