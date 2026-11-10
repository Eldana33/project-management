import { NextResponse } from 'next/server'
import { prisma } from '../../prisma' // Import the helper we just made

export async function GET() {
  try {
    const members = await prisma.member.findMany()
    const milestones = await prisma.milestone.findMany()
    const tasks = await prisma.task.findMany()

    return NextResponse.json({ members, milestones, tasks })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}