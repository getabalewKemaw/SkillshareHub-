import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
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
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ cartItems })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Add item to cart
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId } = await req.json()

    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 })
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check if user is already enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    })

    if (enrollment) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 })
    }

    // Check if already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    })

    if (existingCartItem) {
      return NextResponse.json({ error: "Course already in cart" }, { status: 400 })
    }

    // Add to cart
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        courseId,
      },
      include: {
        course: {
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
        },
      },
    })

    return NextResponse.json({ cartItem })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Remove item from cart
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 })
    }

    await prisma.cartItem.delete({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
