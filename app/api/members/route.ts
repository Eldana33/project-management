import { NextResponse } from 'next/server'
import { prisma } from '@/app/prisma'

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.id) return NextResponse.json({ error: 'User ID required' }, { status: 400 })

    if (body.password && body.password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const updateData: any = {
      name: body.name,
      role: body.role,
    }

    if (body.password) {
      updateData.password = body.password
    }

    const member = await prisma.member.update({
      where: { id: body.id },
      data: updateData,
    })

    const { password, ...safeMember } = member
    return NextResponse.json(safeMember)
  } catch (error: any) {
    console.error("Profile update error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}