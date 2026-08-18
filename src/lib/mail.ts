import nodemailer from 'nodemailer'
import crypto from 'crypto'

export async function sendMail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string }) {
  const sendgridKey = process.env.SENDGRID_API_KEY
  if (sendgridKey) {
    // lazy import to avoid requiring the package when not used
    // @ts-ignore
    const sg = await import('@sendgrid/mail')
    sg.default.setApiKey(sendgridKey)
    return sg.default.send({ to, from: process.env.MAIL_FROM || 'no-reply@localhost', subject, text, html })
  }
  const host = process.env.SMTP_HOST
  if (!host) {
    console.warn('No mail transport configured (SENDGRID_API_KEY or SMTP_HOST)')
    return
  }
  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: (process.env.SMTP_SECURE === 'true'),
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  })
  return transporter.sendMail({ from: process.env.MAIL_FROM || 'no-reply@localhost', to, subject, text, html })
}

export function generateToken() {
  return crypto.randomBytes(24).toString('hex')
}
