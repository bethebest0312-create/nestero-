import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { NextAuthOptions, getServerSession } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
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
  ],
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
