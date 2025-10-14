import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { courseId } = params
    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { price: true } })
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    // Only allow free enrollment
    if ((course.price ?? 0) > 0) return NextResponse.json({ error: 'Paid course requires checkout' }, { status: 400 })

    const existing = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId } } })
    if (existing) return NextResponse.json({ success: true })

    await prisma.enrollment.create({ data: { userId: session.user.id, courseId, status: 'ACTIVE', progress: 0 } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Free enroll error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
