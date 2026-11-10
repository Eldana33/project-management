import { NextResponse } from 'next/server'
import { prisma } from '@/app/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 1. Check password length
    if (!body.password || body.password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    // 2. Check if username exists
    const existing = await prisma.member.findUnique({ where: { username: body.username } })
    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const member = await prisma.member.create({
      data: {
        username: body.username,
        password: body.password, // Note: In a real app, hash this password!
        name: body.name,
        role: body.role,
        avatarColor: randomColor,
      }
    })

    const { password: _, ...safeMember } = member
    return NextResponse.json(safeMember)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}