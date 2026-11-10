import { NextResponse } from 'next/server'
import { prisma } from '@/app/prisma'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    
    const task = await prisma.task.update({
      where: { id: resolvedParams.id },
      data: body,
    })
    return NextResponse.json(task)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    await prisma.task.delete({
      where: { id: resolvedParams.id },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}