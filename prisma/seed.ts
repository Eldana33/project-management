import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ 
  connectionString: "postgresql://postgres.vtgnyxnijfvxlwqkrnnu:Audacity!7272r@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?connect_timeout=30",
  ssl: { rejectUnauthorized: false } 
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database with usernames...')

  await prisma.task.deleteMany()
  await prisma.member.deleteMany()
  await prisma.milestone.deleteMany()

  await prisma.member.create({
    data: { username: 'kidus', password: 'admin123', name: 'Kidus', role: 'Project Manager', avatarColor: 'bg-[#2a2f7a]' }
  })
  await prisma.member.create({
    data: { username: 'sara', password: 'password123', name: 'Sara Bekele', role: 'Frontend', avatarColor: 'bg-blue-500' }
  })
  await prisma.member.create({
    data: { username: 'dawit', password: 'password123', name: 'Dawit Tesfaye', role: 'Backend', avatarColor: 'bg-green-500' }
  })

  await prisma.milestone.createMany({
    data: [
      { id: 'ms1', title: 'Auth & Login', dueDate: '2026-11-20' },
      { id: 'ms2', title: 'Dashboard v1', dueDate: '2026-12-05' },
    ]
  })

  await prisma.task.createMany({
    data: [
      { id: 't1', title: 'Design login screen', description: 'Figma mockups', assigneeId: null, milestoneId: 'ms1', status: 'done', priority: 'high', dueDate: '2026-11-12' },
      { id: 't2', title: 'Build auth API', description: 'JWT tokens', assigneeId: null, milestoneId: 'ms1', status: 'in_progress', priority: 'high', dueDate: '2026-11-15' },
    ]
  })

  console.log('Seeding finished! 🎉')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })