"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Loader2 } from "lucide-react"

const studentOnboardingSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  learningGoals: z.string().min(10, "Please describe your learning goals (at least 10 characters)"),
  interests: z.string().min(1, "Please add at least one interest"),
})

type StudentOnboardingForm = z.infer<typeof studentOnboardingSchema>

export default function StudentOnboarding() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<StudentOnboardingForm>({
    resolver: zodResolver(studentOnboardingSchema),
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: StudentOnboardingForm) => {
    setLoading(true)
    try {
      // Upload avatar if provided
      let avatarUrl = null
      if (avatarFile) {
        const formData = new FormData()
        formData.append('file', avatarFile)
        formData.append('type', 'avatar')

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          avatarUrl = url
        }
      }

      // Submit onboarding data
      const response = await fetch('/api/onboarding/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          interests: data.interests.split(',').map(i => i.trim()).filter(Boolean),
          avatarUrl,
        }),
      })

      if (response.ok) {
        await update()
        router.push('/dashboard')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to complete onboarding')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Complete Your Student Profile</CardTitle>
          <CardDescription>
            Help us personalize your learning experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarPreview || session?.user?.image || undefined} />
                <AvatarFallback className="text-2xl">
                  {session?.user?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar" className="cursor-pointer">
                <div className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                  <Upload className="w-4 h-4" />
                  <span>Upload Profile Photo</span>
                </div>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </Label>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                placeholder="How should we call you?"
                {...register("displayName")}
              />
              {errors.displayName && (
                <p className="text-sm text-red-600">{errors.displayName.message}</p>
              )}
            </div>

            {/* Learning Goals */}
            <div className="space-y-2">
              <Label htmlFor="learningGoals">What do you want to learn? *</Label>
              <textarea
                id="learningGoals"
                placeholder="E.g., I want to become a full-stack developer and build my own web applications..."
                className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("learningGoals")}
              />
              {errors.learningGoals && (
                <p className="text-sm text-red-600">{errors.learningGoals.message}</p>
              )}
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label htmlFor="interests">Your Interests (comma-separated) *</Label>
              <Input
                id="interests"
                placeholder="E.g., Web Development, Data Science, Design, Marketing"
                {...register("interests")}
              />
              {errors.interests && (
                <p className="text-sm text-red-600">{errors.interests.message}</p>
              )}
              <p className="text-xs text-gray-500">
                This helps us recommend courses that match your interests
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Setup...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
