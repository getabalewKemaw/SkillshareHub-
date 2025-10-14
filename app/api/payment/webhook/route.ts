import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPayment } from "@/lib/chapa"

// Chapa webhook handler
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Chapa sends webhook with tx_ref and status
    const { tx_ref, status } = body

    if (!tx_ref) {
      return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 })
    }

    // Verify payment with Chapa
    const verification = await verifyPayment(tx_ref)

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { transactionRef: tx_ref },
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Update payment status
    if (verification.data.status === 'success' && verification.status === 'success') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'completed' },
      })

      // Get course IDs from metadata
      const metadata = JSON.parse(payment.metadata || '{}')
      const courseIds = metadata.courseIds || []

      // Create enrollments
      for (const courseId of courseIds) {
        await prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: payment.userId,
              courseId,
            },
          },
          create: {
            userId: payment.userId,
            courseId,
            status: 'ACTIVE',
          },
          update: {
            status: 'ACTIVE',
          },
        })

        // Remove from cart
        await prisma.cartItem.deleteMany({
          where: {
            userId: payment.userId,
            courseId,
          },
        })
      }

      return NextResponse.json({ 
        success: true, 
        message: "Payment verified and enrollments created" 
      })
    } else {
      // Payment failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      })

      return NextResponse.json({ 
        success: false, 
        message: "Payment verification failed" 
      })
    }
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Webhook processing failed" 
    }, { status: 500 })
  }
}
