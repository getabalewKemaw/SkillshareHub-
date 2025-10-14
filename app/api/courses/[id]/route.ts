import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET single course
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        instructor: {
          select: {
            id: true,
            displayName: true,
            name: true,
            bio: true,
            avatarUrl: true,
            skills: true,
          },
        },
        lessons: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update course
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check ownership
    if (course.instructorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Not authorized to update this course" }, { status: 403 })
    }

    const data = await req.json()
    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags,
        price: data.price,
        level: data.level,
        duration: data.duration,
        thumbnailUrl: data.thumbnailUrl,
        status: data.status,
      },
      include: {
        instructor: {
          select: {
            id: true,
            displayName: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    })

    return NextResponse.json({ course: updatedCourse })
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE course
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check ownership
    if (course.instructorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Not authorized to delete this course" }, { status: 403 })
    }

    await prisma.course.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
