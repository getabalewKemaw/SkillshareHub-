"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().min(1, "Add at least one tag"),
  price: z.number().min(0, "Price must be 0 or greater"),
  level: z.string(),
  duration: z.number().optional(),
})

type CourseForm = z.infer<typeof courseSchema>

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Design",
  "Business",
  "Marketing",
  "Photography",
  "Music",
  "Other"
]

export default function CreateCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState("Beginner")
  const [selectedCategory, setSelectedCategory] = useState("")

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      level: "Beginner",
      price: 0,
    },
  })

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: CourseForm) => {
    setLoading(true)
    try {
      // Upload thumbnail if provided
      let thumbnailUrl = null
      if (thumbnailFile) {
        const formData = new FormData()
        formData.append('file', thumbnailFile)
        formData.append('type', 'course-thumbnail')

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          thumbnailUrl = url
        }
      }

      // Create course
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
          thumbnailUrl,
        }),
      })

      if (response.ok) {
        const { course } = await response.json()
        router.push(`/dashboard/instructor/courses/${course.id}/lessons`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create course')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/instructor/courses">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create New Course</CardTitle>
            <CardDescription>
              Fill in the details to create your course. You can add lessons later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete Web Development Bootcamp"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  placeholder="Describe what students will learn in this course..."
                  className="w-full min-h-[120px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value)
                    setValue("category", value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated) *</Label>
                <Input
                  id="tags"
                  placeholder="e.g., JavaScript, React, Node.js, MongoDB"
                  {...register("tags")}
                />
                {errors.tags && (
                  <p className="text-sm text-red-600">{errors.tags.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Tags help students find your course and improve recommendations
                </p>
              </div>

              {/* Level and Price */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={selectedLevel}
                    onValueChange={(value) => {
                      setSelectedLevel(value)
                      setValue("level", value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (ETB) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0 for free"
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  placeholder="e.g., 120"
                  {...register("duration", { valueAsNumber: true })}
                />
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Course Thumbnail</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {thumbnailPreview ? (
                    <div className="space-y-2">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full max-h-48 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setThumbnailFile(null)
                          setThumbnailPreview(null)
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <Label htmlFor="thumbnail" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-12 h-12 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Upload course thumbnail (recommended: 1280x720)
                        </span>
                      </div>
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                    </Label>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </Button>
                <Link href="/dashboard/instructor/courses" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
