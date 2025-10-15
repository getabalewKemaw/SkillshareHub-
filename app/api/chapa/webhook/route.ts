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
      const { tx_ref, email, amount } = data

      // Parse transaction reference to get userId and courseId
      // Format: tx-{timestamp}-{userId}-{courseId}
      const parts = tx_ref.split('-')
      if (parts.length < 4) {
        console.error('Invalid tx_ref format:', tx_ref)
        return NextResponse.json({ error: 'Invalid transaction reference' }, { status: 400 })
      }

      const userId = parts[2]
      const courseId = parts.slice(3).join('-') // Handle UUIDs with dashes

      // Verify user and course exist
      const [user, course] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.course.findUnique({ where: { id: courseId } })
      ])

      if (!user || !course) {
        console.error('User or course not found:', { userId, courseId })
        return NextResponse.json({ error: 'User or course not found' }, { status: 404 })
      }

      // Verify email matches
      if (user.email !== email) {
        console.error('Email mismatch:', { userEmail: user.email, paymentEmail: email })
        return NextResponse.json({ error: 'Email mismatch' }, { status: 400 })
      }

      // Check if enrollment already exists
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: courseId
          }
        }
      })

      if (existingEnrollment) {
        console.log('Enrollment already exists:', existingEnrollment.id)
        return NextResponse.json({ 
          success: true, 
          message: 'Enrollment already exists' 
        })
      }

      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          userId: userId,
          courseId: courseId,
          status: 'ACTIVE',
          progress: 0
        }
      })

      console.log('Enrollment created successfully:', enrollment.id)

      return NextResponse.json({
        success: true,
        enrollmentId: enrollment.id
      })
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
