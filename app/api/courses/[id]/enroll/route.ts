import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: courseId } = await params;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 });
    }

    // Only allow free enrollment through this endpoint
    if (course.price && course.price > 0) {
      return NextResponse.json({ 
        error: "This is a paid course. Please use the payment flow." 
      }, { status: 400 });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        status: "ACTIVE",
        progress: 0,
      },
    });

    return NextResponse.json({ 
      success: true, 
      enrollment,
      message: "Successfully enrolled in course" 
    }, { status: 201 });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json({ 
      error: "Failed to enroll in course" 
    }, { status: 500 });
  }
}
