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
    const { courseId, amount, courseIds } = body

    // Support single course or multiple courses (cart)
    let selectedCourses: { id: string; title: string; price: number | null }[] = []
    if (Array.isArray(courseIds) && courseIds.length > 0) {
      selectedCourses = await prisma.course.findMany({
        where: { id: { in: courseIds } },
        select: { id: true, title: true, price: true },
      })
      if (selectedCourses.length === 0) {
        return NextResponse.json({ error: 'No valid courses' }, { status: 400 })
      }
    } else if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true, price: true }
      })
      if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      selectedCourses = [course]
    } else {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Filter out courses already enrolled
    const existingEnrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id, courseId: { in: selectedCourses.map(c => c.id) } },
      select: { courseId: true },
    })
    const enrolledSet = new Set(existingEnrollments.map(e => e.courseId))
    selectedCourses = selectedCourses.filter(c => !enrolledSet.has(c.id))
    if (selectedCourses.length === 0) {
      return NextResponse.json({ error: 'Already enrolled in all selected courses' }, { status: 400 })
    }

    // Initialize Chapa payment
    const chapaSecretKey = process.env.CHAPA_SECRET_KEY

    if (!chapaSecretKey) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    const txRef = `tx-${Date.now()}-${session.user.id}-${selectedCourses.map(c=>c.id).join('_')}`
    const returnUrl = `${process.env.NEXTAUTH_URL}/cart?payment=success`
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/chapa/webhook`

    const chapaPayload = {
      amount: (selectedCourses.reduce((sum, c) => sum + (c.price ?? 0), 0)).toString(),
      currency: 'ETB',
      email: session.user.email,
      first_name: session.user.name?.split(' ')[0] || 'Student',
      last_name: session.user.name?.split(' ').slice(1).join(' ') || '',
      tx_ref: txRef,
      callback_url: callbackUrl,
      return_url: returnUrl,
      customization: {
        title: 'SkillShare Hub',
        description: `Payment for: ${selectedCourses.length} course(s)`
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

    // Store transaction
    await prisma.payment.create({
      data: {
        txRef,
        userId: session.user.id,
        amount: selectedCourses.reduce((sum, c) => sum + (c.price ?? 0), 0),
        currency: 'ETB',
        status: 'PENDING',
        courseIds: selectedCourses.map(c => c.id),
      }
    })

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
