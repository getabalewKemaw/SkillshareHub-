import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET lessons for a course
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lessons = await prisma.lesson.findMany({
      where: { courseId: id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new lesson
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check course ownership
    const course = await prisma.course.findUnique({
      where: { id },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (course.instructorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const data = await req.json()
    const { title, description, type, videoUrl, content, duration, order, isFree } = data

    if (!title || !type) {
      return NextResponse.json({ error: "Title and type required" }, { status: 400 })
    }

    const lesson = await prisma.lesson.create({
      data: {
        courseId: id,
        title,
        description: description || null,
        type,
        videoUrl: videoUrl || null,
        content: content || null,
        duration: duration || null,
        order: order || 0,
        isFree: isFree || false,
      },
    })

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
