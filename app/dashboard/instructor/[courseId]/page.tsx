import React from 'react'
import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CourseForm } from '@/app/components/courses/CourseForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

async function getCourse(courseId: string, userId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        materials: {
          orderBy: { order: 'asc' }
        }
      }
    })

    // Check if user owns this course
    if (course && course.instructorId !== userId) {
      return null
    }

    return course
  } catch (error) {
    console.error('Error fetching course:', error)
    return null
  }
}

export default async function EditCoursePage({
  params
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const course = await getCourse(courseId, session.user.id)

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">Edit Course</h1>
            <Badge variant={course.status === 'PUBLISHED' ? 'default' : 'secondary'}>
              {course.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Update your course information and materials
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>
              Make changes to your course information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CourseForm initialData={{
              title: course.title,
              description: course.description || undefined,
              category: course.category || undefined,
              price: course.price?.toString() || undefined,
              level: course.level || undefined,
              tags: course.tags?.join(', ') || undefined,
            }} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
