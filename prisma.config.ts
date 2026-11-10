import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: "postgresql://postgres.vtgnyxnijfvxlwqkrnnu:Audacity!7272r@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?connect_timeout=30"
  }
})