import { NextResponse } from 'next/server'
import { prisma } from '@/app/prisma'

// THIS IS THE POST FUNCTION (For creating a task)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || "",
        status: body.status,
        priority: body.priority,
        dueDate: body.dueDate,
        assigneeId: body.assigneeId || null,
        milestoneId: body.milestoneId || null,
      }
    })
    
    return NextResponse.json(task)
  } catch (error: any) {
    console.error("Error creating task in DB:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}