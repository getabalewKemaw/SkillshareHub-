import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook signature (Chapa sends this in headers)
    const signature = request.headers.get('chapa-signature')
    
    // In production, verify the signature matches
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.CHAPA_WEBHOOK_SECRET!)
    //   .update(JSON.stringify(body))
    //   .digest('hex')
    
    // if (signature !== expectedSignature) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    const { event, data } = body

    // Handle successful payment
    if (event === 'charge.success' || data.status === 'success') {
      const { tx_ref, email } = data

      // Use Payment record for course list
      const payment = await prisma.payment.findUnique({ where: { txRef: tx_ref } })
      if (!payment) {
        console.error('Payment not found for tx_ref', tx_ref)
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
      }
      const userId = payment.userId
      const courseIds = payment.courseIds

      // Verify user and course exist
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        console.error('User not found:', { userId })
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Verify email matches
      if (user.email !== email) {
        console.error('Email mismatch:', { userEmail: user.email, paymentEmail: email })
        return NextResponse.json({ error: 'Email mismatch' }, { status: 400 })
      }

      // Create enrollments for all courses
      for (const courseId of courseIds) {
        const existing = await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId, courseId } }
        })
        if (!existing) {
          await prisma.enrollment.create({
            data: { userId, courseId, status: 'ACTIVE', progress: 0 }
          })
        }
      }

      await prisma.payment.update({ where: { txRef: tx_ref }, data: { status: 'SUCCESS' } })

      return NextResponse.json({ success: true })
    }

    // Handle failed payment
    if (event === 'charge.failed' || data.status === 'failed') {
      console.log('Payment failed:', data)
      return NextResponse.json({
        success: true,
        message: 'Payment failed notification received'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook received'
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
