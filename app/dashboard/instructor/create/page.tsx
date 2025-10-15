import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CourseForm } from '@/app/components/courses/CourseForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function CreateCoursePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Course</h1>
          <p className="text-muted-foreground">
            Share your knowledge and create an amazing learning experience
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CourseForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
