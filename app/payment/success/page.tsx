"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tx_ref = searchParams.get('tx_ref')
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (tx_ref) {
      verifyPayment(tx_ref)
    } else {
      setStatus('failed')
      setMessage('No transaction reference found')
    }
  }, [tx_ref])

  const verifyPayment = async (txRef: string) => {
    try {
      const response = await fetch(`/api/payment/verify?tx_ref=${txRef}`)
      const data = await response.json()

      if (data.success && data.status === 'completed') {
        setStatus('success')
        setMessage('Payment successful! You have been enrolled in your courses.')
      } else {
        setStatus('failed')
        setMessage(data.message || 'Payment verification failed')
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      setStatus('failed')
      setMessage('An error occurred while verifying your payment')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          {status === 'verifying' && (
            <>
              <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-blue-500" />
              <CardTitle className="text-2xl">Verifying Payment...</CardTitle>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            </>
          )}
          {status === 'failed' && (
            <>
              <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <CardTitle className="text-2xl">Payment Failed</CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">{message}</p>
          
          {status === 'success' && (
            <div className="space-y-2">
              <Link href="/dashboard" className="block">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
              <Link href="/courses" className="block">
                <Button variant="outline" className="w-full">Browse More Courses</Button>
              </Link>
            </div>
          )}

          {status === 'failed' && (
            <div className="space-y-2">
              <Link href="/cart" className="block">
                <Button className="w-full">Back to Cart</Button>
              </Link>
              <Link href="/courses" className="block">
                <Button variant="outline" className="w-full">Browse Courses</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
