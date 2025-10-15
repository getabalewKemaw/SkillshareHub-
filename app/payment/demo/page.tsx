"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, CreditCard, Loader2, XCircle } from "lucide-react"

function DemoPaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const tx_ref = searchParams.get("tx_ref")
  const amount = searchParams.get("amount")
  const courseId = searchParams.get("courseId")
  const courseName = searchParams.get("courseName")

  const handlePayment = async (paymentSuccess: boolean) => {
    setProcessing(true)
    setError("")

    try {
      if (paymentSuccess) {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Process enrollment
        const res = await fetch("/api/payment/demo-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tx_ref,
            courseId,
            status: "success",
          }),
        })

        if (!res.ok) {
          throw new Error("Failed to process enrollment")
        }

        setSuccess(true)
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(`/courses/${courseId}?enrolled=true`)
        }, 2000)
      } else {
        // Cancel payment
        router.push(`/courses/${courseId}`)
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {success ? "Payment Successful!" : "Demo Payment Gateway"}
            </CardTitle>
            <CardDescription>
              {success 
                ? "Your enrollment is being processed..." 
                : "This is a demo payment page - No real money will be charged"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Enrollment Complete!</p>
                <p className="text-muted-foreground">Redirecting to your course...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Payment Failed</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : (
              <>
                <div className="bg-secondary/50 p-6 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Course:</span>
                    <span className="font-semibold">{courseName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="text-2xl font-bold text-primary">{amount} ETB</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono text-xs">{tx_ref}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Mode:</strong> This is a simulated payment gateway. 
                    Click &ldquo;Pay Now&rdquo; to simulate a successful payment and enroll in the course.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Payment Method</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border-2 border-primary bg-primary/5 rounded-lg p-4 text-center">
                      <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <span className="text-sm font-medium">Card</span>
                    </div>
                    <div className="border rounded-lg p-4 text-center opacity-50">
                      <div className="h-6 w-6 mx-auto mb-2 bg-gray-300 rounded" />
                      <span className="text-sm">Bank</span>
                    </div>
                    <div className="border rounded-lg p-4 text-center opacity-50">
                      <div className="h-6 w-6 mx-auto mb-2 bg-gray-300 rounded" />
                      <span className="text-sm">Mobile</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>

          {!success && !error && (
            <CardFooter className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handlePayment(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => handlePayment(true)}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay Now"
                )}
              </Button>
            </CardFooter>
          )}
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>🔒 Secure Demo Payment Gateway</p>
          <p className="mt-1">In production, this would connect to Chapa Payment Gateway</p>
        </div>
      </div>
    </div>
  )
}

export default function DemoPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DemoPaymentContent />
    </Suspense>
  )
}
