import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function CartPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { course: true } } },
  })

  const items = cart?.items ?? []
  const total = items.reduce((sum, i) => sum + (i.priceAtAdd || 0) * (i.quantity || 1), 0)

  async function checkoutAll() {
    'use server'
    const courses = await prisma.cart.findUnique({
      where: { userId: session!.user.id },
      include: { items: true },
    })
    const courseIds = (courses?.items ?? []).map((i) => i.courseId)
    if (courseIds.length === 0) return

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/chapa/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseIds }),
    })
    const data = await res.json()
    if (data.checkoutUrl) {
      return data.checkoutUrl as string
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Your Cart</CardTitle>
            <CardDescription>Review and checkout your courses</CardDescription>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div>
                <p className="text-muted-foreground mb-4">Your cart is empty.</p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <div className="font-semibold">{i.course.title}</div>
                      <div className="text-sm text-muted-foreground">${i.priceAtAdd?.toFixed(2)}</div>
                    </div>
                    <form action={async () => {
                      'use server'
                      await fetch(`${process.env.NEXTAUTH_URL}/api/cart/${i.courseId}`, { method: 'DELETE' })
                    }}>
                      <Button type="submit" variant="outline">Remove</Button>
                    </form>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4">
                  <div className="text-lg font-semibold">Total: ${total.toFixed(2)}</div>
                  <form action={checkoutAll}>
                    <Button type="submit">Checkout All</Button>
                  </form>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
