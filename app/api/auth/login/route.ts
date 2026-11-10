import { NextResponse } from 'next/server'
import { prisma } from '@/app/prisma'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const member = await prisma.member.findUnique({
      where: { username }
    })

    // Check if member exists and password matches
    if (!member || member.password !== password) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    // Don't send the password back to the browser!
    const { password: _, ...safeMember } = member
    
    return NextResponse.json(safeMember)
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}