import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { initializePayment, generateTxRef } from "@/lib/chapa"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseIds, courseId, amount, currency } = await req.json()

    // Handle single course enrollment
    if (courseId && amount) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      })

      if (!course) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 })
      }

      // Check if already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: courseId,
          },
        },
      })

      if (existingEnrollment) {
        return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 })
      }

      // Generate transaction reference
      const tx_ref = generateTxRef(session.user.id)

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          userId: session.user.id,
          amount: amount,
          currency: currency || "ETB",
          status: "pending",
          transactionRef: tx_ref,
          metadata: JSON.stringify({
            courseId,
            courseTitle: course.title,
          }),
        },
      })

      // DEMO MODE: Create a demo payment page instead of real Chapa
      const demoCheckoutUrl = `${process.env.NEXTAUTH_URL}/payment/demo?tx_ref=${tx_ref}&amount=${amount}&courseId=${courseId}&courseName=${encodeURIComponent(course.title)}`

      return NextResponse.json({
        success: true,
        checkoutUrl: demoCheckoutUrl,
        tx_ref,
        paymentId: payment.id,
      })
    }

    // Handle cart checkout (multiple courses)
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json({ error: "Course ID or Course IDs required" }, { status: 400 })
    }

    // Fetch courses from cart
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
        courseId: { in: courseIds },
      },
      include: {
        course: true,
      },
    })

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "No courses found in cart" }, { status: 404 })
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.course.price || 0)
    }, 0)

    if (totalAmount === 0) {
      // Free courses - enroll directly
      for (const item of cartItems) {
        await prisma.enrollment.create({
          data: {
            userId: session.user.id,
            courseId: item.courseId,
            status: 'ACTIVE',
          },
        })
        
        // Remove from cart
        await prisma.cartItem.delete({
          where: { id: item.id },
        })
      }

      return NextResponse.json({ 
        success: true, 
        message: "Enrolled in free courses",
        redirect: "/dashboard" 
      })
    }

    // Generate transaction reference
    const tx_ref = generateTxRef(session.user.id)

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: totalAmount,
        currency: "ETB",
        status: "pending",
        transactionRef: tx_ref,
        metadata: JSON.stringify({
          courseIds,
          courseTitles: cartItems.map(item => item.course.title),
        }),
      },
    })

    // Initialize Chapa payment
    const chapaResponse = await initializePayment({
      amount: totalAmount,
      currency: "ETB",
      email: session.user.email!,
      first_name: session.user.name?.split(' ')[0] || 'Student',
      last_name: session.user.name?.split(' ').slice(1).join(' ') || '',
      tx_ref,
      callback_url: `${process.env.NEXTAUTH_URL}/api/payment/webhook`,
      return_url: `${process.env.NEXTAUTH_URL}/payment/success?tx_ref=${tx_ref}`,
      customization: {
        title: "SkillShare Hub - Course Purchase",
        description: `Purchase of ${cartItems.length} course(s)`,
      },
    })

    return NextResponse.json({
      success: true,
      checkout_url: chapaResponse.data.checkout_url,
      tx_ref,
      paymentId: payment.id,
    })
  } catch (error) {
    console.error("Error initializing payment:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Payment initialization failed" 
    }, { status: 500 })
  }
}
