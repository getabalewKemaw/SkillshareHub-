import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ items: [] })

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { course: true } } },
  })
  return NextResponse.json({ items: cart?.items ?? [] })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { courseId } = body ?? {}
  if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 })

  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true, price: true } })
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

  const cart = await prisma.cart.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
  })

  await prisma.cartItem.upsert({
    where: { cartId_courseId: { cartId: cart.id, courseId: course.id } },
    create: {
      cartId: cart.id,
      courseId: course.id,
      quantity: 1,
      priceAtAdd: course.price ?? 0,
    },
    update: { quantity: 1 },
  })

  const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { course: true } } } })
  return NextResponse.json({ items: updated?.items ?? [] })
}
