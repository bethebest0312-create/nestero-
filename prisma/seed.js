const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@example.com'
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'admin' },
    create: { email: adminEmail, role: 'admin' }
  })
  console.log('Ensured admin user:', user.email)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
