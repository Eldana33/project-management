import { NextResponse } from 'next/server'
import { prisma } from '@/app/prisma'

// UPDATE a member (Edit from Team Directory)
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const member = await prisma.member.update({
      where: { id },
      data: { name: body.name, role: body.role },
    })
    return NextResponse.json(member)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE a member
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'Member ID required' }, { status: 400 })
    
    await prisma.task.updateMany({
      where: { assigneeId: id },
      data: { assigneeId: null }
    })

    await prisma.member.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete member:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}