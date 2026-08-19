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

  try {
    // create a sample site if model exists
    await prisma.site.create({ data: {
      slug: 'demo',
      title: 'Demo site',
      html: '<h1>Demo site</h1><p>This site was created by seed script.</p>',
      ownerId: user.id
    }})
    console.log('Created demo site')
  } catch (e) {
    // ignore if Site model/migration not applied
  }

  try {
    await prisma.teamInvite.create({ data: { email: 'invitee@example.com', role: 'member', token: 'seed-invite-token', invitedById: user.id } })
    console.log('Created sample team invite')
  } catch (e) {
    // ignore if TeamInvite not available
  }
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
