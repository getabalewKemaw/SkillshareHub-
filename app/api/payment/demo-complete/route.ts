import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tx_ref, courseId, status } = await req.json();

    if (!tx_ref || !courseId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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
      return NextResponse.json({ 
        success: true,
        message: "Already enrolled",
        enrollment: existingEnrollment 
      });
    }

    if (status === "success") {
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
        message: "Successfully enrolled in course",
      });
    } else {
      return NextResponse.json({ error: "Payment was not successful" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error completing demo payment:", error);
    return NextResponse.json({ 
      error: "Failed to complete enrollment" 
    }, { status: 500 });
  }
}
