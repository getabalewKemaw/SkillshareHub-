import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { verifyPayment } from "@/lib/chapa"

// Manual payment verification endpoint (for return_url callback)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const tx_ref = searchParams.get('tx_ref')

    if (!tx_ref) {
      return NextResponse.json({ error: "Transaction reference required" }, { status: 400 })
    }

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { transactionRef: tx_ref },
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Verify with Chapa
    const verification = await verifyPayment(tx_ref)

    if (verification.data.status === 'success' && verification.status === 'success') {
      // Update payment if not already completed
      if (payment.status !== 'completed') {
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
      }

      return NextResponse.json({
        success: true,
        status: 'completed',
        payment,
      })
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      })

      return NextResponse.json({
        success: false,
        status: 'failed',
        message: 'Payment verification failed',
      })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Verification failed" 
    }, { status: 500 })
  }
}
