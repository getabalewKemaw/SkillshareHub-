import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId, amount } = body

    if (!courseId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify course exists and get details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Verify amount matches course price
    if (course.price !== amount) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    // Initialize Chapa payment
    const chapaSecretKey = process.env.CHAPA_SECRET_KEY

    if (!chapaSecretKey) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    const txRef = `tx-${Date.now()}-${session.user.id}-${courseId}`
    const returnUrl = `${process.env.NEXTAUTH_URL}/courses/${courseId}?payment=success`
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/chapa/webhook`

    const chapaPayload = {
      amount: amount.toString(),
      currency: 'ETB',
      email: session.user.email,
      first_name: session.user.name?.split(' ')[0] || 'Student',
      last_name: session.user.name?.split(' ').slice(1).join(' ') || '',
      tx_ref: txRef,
      callback_url: callbackUrl,
      return_url: returnUrl,
      customization: {
        title: 'SkillShare Hub',
        description: `Payment for: ${course.title}`
      }
    }

    const chapaResponse = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${chapaSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chapaPayload)
    })

    const chapaData = await chapaResponse.json()

    if (!chapaResponse.ok || chapaData.status !== 'success') {
      console.error('Chapa initialization failed:', chapaData)
      return NextResponse.json(
        { error: 'Payment initialization failed' },
        { status: 500 }
      )
    }

    // Store transaction reference for verification
    // You might want to create a Payment model in your schema for this
    
    return NextResponse.json({
      success: true,
      checkoutUrl: chapaData.data.checkout_url,
      txRef: txRef
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
