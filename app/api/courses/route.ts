import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all courses (with filters)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const instructorId = searchParams.get('instructorId')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}

    if (category) where.category = category
    if (instructorId) where.instructorId = instructorId
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
            materials: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new course (instructors only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Only instructors can create courses" }, { status: 403 })
    }

    const data = await req.json()
    const { title, description, category, tags, price, level, duration, thumbnailUrl, status } = data

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description required" }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category: category || null,
        tags: tags || [],
        price: price || 0,
        level: level || 'Beginner',
        duration: duration || null,
        thumbnailUrl: thumbnailUrl || null,
        instructorId: session.user.id,
        status: status || 'PUBLISHED', // Default to PUBLISHED so courses are visible
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
