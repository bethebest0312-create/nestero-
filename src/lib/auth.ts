import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import { NextAuthOptions, getServerSession } from 'next-auth'

import EmailProvider from 'next-auth/providers/email'
import { sendMail } from './mail'

// Build providers array conditionally so missing env doesn't break dev scaffolding
const providers: any[] = []

// Credentials provider only enabled in non-production for dev convenience
if (process.env.NODE_ENV !== 'production') {
  providers.push(
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: { label: 'Email', type: 'text' } },
      async authorize(credentials) {
        if (!credentials?.email) return null
        const email = credentials.email
        const user = await prisma.user.upsert({ where: { email }, update: {}, create: { email } })
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  )
}

// Email (magic link) provider — uses sendMail helper so it works with SendGrid or SMTP
providers.push(
  EmailProvider({
    server: process.env.SMTP_HOST ? {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
    } : undefined,
    from: process.env.MAIL_FROM || 'no-reply@localhost',
    // override sendVerificationRequest to use our mail helper (works with SendGrid or SMTP)
    // @ts-ignore
    sendVerificationRequest: async ({ identifier: email, url }) => {
      const host = new URL(url).host
      const subject = `Sign in to ${host}`
      const text = `Sign in to ${host} using this link: ${url}`
      const html = `<p>Sign in to <strong>${host}</strong></p><p><a href="${url}">Click here to sign in</a></p>`
      try { await sendMail({ to: email, subject, text, html }) } catch (e) { console.error('sendVerificationRequest failed', e) }
    }
  }) as any
)

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(GithubProvider({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }) as any)
}
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }) as any)
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers,
  session: { strategy: 'database' },
  pages: { signIn: '/auth/signin' },
  callbacks: {
    async session({ session, user }) {
      // attach role to session.user
      // @ts-ignore
      session.user = session.user || {}
      // @ts-ignore
      session.user.role = (user as any)?.role || 'user'
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

export async function getAuthSession() {
  return await getServerSession(authOptions)
}
