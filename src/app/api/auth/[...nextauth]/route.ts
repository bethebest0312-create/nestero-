import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
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
        // Minimal dev flow: upsert user by email. Replace with real verification for production.
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email }
        })
        return { id: user.id, email: user.email }
      }
    })
  ],
  session: { strategy: 'database' },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }
