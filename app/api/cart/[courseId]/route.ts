import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { courseId } = params
  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } })
  if (!cart) return NextResponse.json({ success: true })

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, courseId } })
  return NextResponse.json({ success: true })
}
