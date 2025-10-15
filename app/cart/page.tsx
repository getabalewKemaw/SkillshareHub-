"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, ShoppingCart, Loader2 } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  course: {
    id: string
    title: string
    description: string
    price: number
    thumbnailUrl: string | null
    instructor: {
      displayName: string | null
      name: string | null
    }
  }
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.cartItems)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (courseId: string) => {
    try {
      const response = await fetch(`/api/cart?courseId=${courseId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCartItems(cartItems.filter(item => item.course.id !== courseId))
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    setProcessingPayment(true)
    try {
      const courseIds = cartItems.map(item => item.course.id)
      
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseIds }),
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.redirect) {
          // Free courses - redirect to dashboard
          router.push(data.redirect)
        } else if (data.checkout_url) {
          // Redirect to Chapa payment page
          window.location.href = data.checkout_url
        }
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to initialize payment')
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      alert('An error occurred during checkout')
    } finally {
      setProcessingPayment(false)
    }
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.course.price || 0), 0)
  const hasFreeCoursesOnly = totalAmount === 0

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Browse courses and add them to your cart to get started
              </p>
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-32 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {item.course.instructor.displayName || item.course.instructor.name}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.course.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.course.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <span className="text-xl font-bold">
                          {item.course.price === 0 ? (
                            <Badge variant="secondary">Free</Badge>
                          ) : (
                            `${item.course.price} ETB`
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{totalAmount} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium">{cartItems.length}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold">
                        {hasFreeCoursesOnly ? 'Free' : `${totalAmount} ETB`}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : hasFreeCoursesOnly ? (
                      'Enroll Now'
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
