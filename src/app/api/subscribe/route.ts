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

    // Send welcome email if SMTP is configured
    const host = process.env.SMTP_HOST
    if (host) {
      const transporter = nodemailer.createTransport({
        host: host,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: (process.env.SMTP_SECURE === 'true'),
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
      })
      const from = process.env.MAIL_FROM || 'no-reply@localhost'
      try {
        await transporter.sendMail({
          from,
          to: email,
          subject: 'Welcome to Nestero',
          text: `Thanks for joining Nestero${name ? `, ${name}` : ''}!`,
          html: `<p>Thanks for joining Nestero${name ? `, ${name}` : ''}!</p><p>We will send updates and offers to this email.</p>`
        })
      } catch (err) {
        console.error('mail send failed', err)
      }
    }

    return NextResponse.json({ ok: true, id: rec.id })
  } catch (err) {
    console.error('subscribe failed', err)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
