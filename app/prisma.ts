import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const adapter = new PrismaPg({ 
  connectionString: "postgresql://postgres.vtgnyxnijfvxlwqkrnnu:Audacity!7272r@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?connect_timeout=30",
  ssl: { rejectUnauthorized: false } 
})

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma