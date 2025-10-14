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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Loader2, Video } from "lucide-react"

const instructorOnboardingSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  skills: z.string().min(1, "Please add at least one skill"),
  paymentEnabled: z.boolean().default(false),
})

type InstructorOnboardingForm = z.infer<typeof instructorOnboardingSchema>

export default function InstructorOnboarding() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [paymentEnabled, setPaymentEnabled] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<InstructorOnboardingForm>({
    resolver: zodResolver(instructorOnboardingSchema),
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    }
  }

  const onSubmit = async (data: InstructorOnboardingForm) => {
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

      // Upload intro video if provided
      let introVideoUrl = null
      if (videoFile) {
        const formData = new FormData()
        formData.append('file', videoFile)
        formData.append('type', 'video')

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          introVideoUrl = url
        }
      }

      // Submit onboarding data
      const response = await fetch('/api/onboarding/instructor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
          avatarUrl,
          introVideoUrl,
          paymentEnabled,
        }),
      })

      if (response.ok) {
        await update()
        router.push('/dashboard/instructor')
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Complete Your Instructor Profile</CardTitle>
          <CardDescription>
            Let students know who you are and what you teach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarPreview || session?.user?.image || undefined} />
                <AvatarFallback className="text-2xl">
                  {session?.user?.name?.[0] || 'I'}
                </AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar" className="cursor-pointer">
                <div className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700">
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
                placeholder="Your professional name"
                {...register("displayName")}
              />
              {errors.displayName && (
                <p className="text-sm text-red-600">{errors.displayName.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio *</Label>
              <textarea
                id="bio"
                placeholder="Tell students about your expertise, experience, and teaching style..."
                className="w-full min-h-[120px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Your Skills/Expertise (comma-separated) *</Label>
              <Input
                id="skills"
                placeholder="E.g., JavaScript, React, Node.js, Web Development"
                {...register("skills")}
              />
              {errors.skills && (
                <p className="text-sm text-red-600">{errors.skills.message}</p>
              )}
              <p className="text-xs text-gray-500">
                These skills help match you with interested students
              </p>
            </div>

            {/* Intro Video (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="introVideo">Introduction Video (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {videoPreview ? (
                  <div className="space-y-2">
                    <video src={videoPreview} controls className="w-full max-h-48 rounded" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setVideoFile(null)
                        setVideoPreview(null)
                      }}
                    >
                      Remove Video
                    </Button>
                  </div>
                ) : (
                  <Label htmlFor="introVideo" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <Video className="w-12 h-12 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Upload a short video introducing yourself (recommended)
                      </span>
                      <span className="text-xs text-gray-500">Max 2 minutes, MP4 format</span>
                    </div>
                    <Input
                      id="introVideo"
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoChange}
                    />
                  </Label>
                )}
              </div>
            </div>

            {/* Payment Enabled */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Checkbox
                id="paymentEnabled"
                checked={paymentEnabled}
                onCheckedChange={(checked) => setPaymentEnabled(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="paymentEnabled" className="cursor-pointer font-medium">
                  Enable Payments
                </Label>
                <p className="text-sm text-gray-600">
                  Allow students to purchase your paid courses. You can set this up later in settings.
                </p>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Setup...
                </>
              ) : (
                'Complete Setup & Start Teaching'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
