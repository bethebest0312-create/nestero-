import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import { NextAuthOptions, getServerSession } from 'next-auth'

// Build providers array conditionally so missing env doesn't break dev scaffolding
const providers = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'text' }
    },
    async authorize(credentials) {
      if (!credentials?.email) return null
      const email = credentials.email
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email }
      })
      return { id: user.id, email: user.email, name: user.name, role: user.role }
    }
  })
]

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GithubProvider({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }) as any
  )
}
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }) as any
  )
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
