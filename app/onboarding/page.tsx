"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle, GraduationCap } from "lucide-react"

export default function OnboardingRoleSelection() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const selectRole = async (role: 'USER' | 'INSTRUCTOR') => {
    setLoading(true)
    try {
      const response = await fetch('/api/onboarding/select-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (response.ok) {
        // Update session
        await update()
        // Redirect to role-specific onboarding
        router.push(`/onboarding/${role.toLowerCase()}`)
      } else {
        alert('Failed to update role')
      }
    } catch (error) {
      console.error('Error selecting role:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Redirect if already completed onboarding
  if (session?.user?.onboardingCompleted) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to SkillShare Hub! 🎓</h1>
          <p className="text-lg text-gray-600">Let's get you started. Choose your path:</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Card */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-500">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">I'm a Student</CardTitle>
              <CardDescription className="text-base">
                Learn new skills from expert instructors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Access thousands of courses</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Track your learning progress</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Get personalized recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Earn certificates</span>
                </li>
              </ul>
              <Button 
                onClick={() => selectRole('USER')} 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Continue as Student
              </Button>
            </CardContent>
          </Card>

          {/* Instructor Card */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-purple-500">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">I'm an Instructor</CardTitle>
              <CardDescription className="text-base">
                Share your knowledge and earn money
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Create and sell courses</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Reach thousands of students</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Track your earnings</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Build your brand</span>
                </li>
              </ul>
              <Button 
                onClick={() => selectRole('INSTRUCTOR')} 
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Continue as Instructor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
