import React from 'react'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { BookOpen, Video, FileText, Download, CheckCircle, Lock, ArrowLeft } from 'lucide-react'

async function getCourseMaterials(courseId: string, userId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { name: true } },
        materials: { orderBy: { order: 'asc' } },
        enrollments: {
          where: { userId: userId },
          select: { progress: true, status: true }
        }
      }
    })

    return course
  } catch (error) {
    console.error('Error fetching course materials:', error)
    return null
  }
}

export default async function CourseMaterialsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const course = await getCourseMaterials(id, session.user.id)

  if (!course) {
    notFound()
  }

  const enrollment = course.enrollments[0]
  const isInstructor = course.instructorId === session.user.id

  // Check if user is enrolled or is the instructor
  if (!enrollment && !isInstructor) {
    redirect(`/courses/${id}`)
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/courses/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground">
                By {course.instructor.name || 'Anonymous'}
              </p>
            </div>
            {enrollment && (
              <Badge variant="outline" className="text-lg px-4 py-2">
                {enrollment.progress}% Complete
              </Badge>
            )}
          </div>
          
          {enrollment && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-semibold">{enrollment.progress}%</span>
              </div>
              <Progress value={enrollment.progress} className="h-3" />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Materials */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Course Materials</CardTitle>
                <CardDescription>
                  {course.materials.length} lessons available
                </CardDescription>
              </CardHeader>
              <CardContent>
                {course.materials.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {course.materials.map((material, index) => (
                      <AccordionItem key={material.id} value={`item-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left w-full">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {material.type === 'video' ? (
                                <Video className="h-4 w-4 text-primary" />
                              ) : (
                                <FileText className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{material.title}</div>
                              <div className="text-xs text-muted-foreground">
                                Lesson {index + 1} • {material.type.toUpperCase()}
                              </div>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11 space-y-4">
                            {material.type === 'video' ? (
                              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                <video 
                                  controls 
                                  className="w-full h-full"
                                  src={material.url}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ) : (
                              <div className="p-4 bg-muted rounded-lg">
                                <FileText className="h-12 w-12 text-primary mx-auto mb-2" />
                                <p className="text-center text-sm text-muted-foreground mb-4">
                                  {material.type.toUpperCase()} Document
                                </p>
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <Button asChild className="flex-1">
                                <a 
                                  href={material.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </a>
                              </Button>
                              <Button variant="outline">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Complete
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No materials yet</h3>
                    <p className="text-muted-foreground">
                      The instructor hasn't added any materials to this course yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Course Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Lessons</span>
                    <span className="font-semibold">{course.materials.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Videos</span>
                    <span className="font-semibold">
                      {course.materials.filter(m => m.type === 'video').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Documents</span>
                    <span className="font-semibold">
                      {course.materials.filter(m => m.type === 'pdf').length}
                    </span>
                  </div>
                  {enrollment && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={enrollment.status === 'COMPLETED' ? 'default' : 'secondary'}>
                        {enrollment.status}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href={`/courses/${id}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Course Details
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/dashboard">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Link>
                  </Button>
                  {enrollment?.status === 'COMPLETED' && (
                    <Button asChild className="w-full justify-start">
                      <Link href={`/certificates/${enrollment.id}`}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        View Certificate
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Help */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Having trouble accessing materials or have questions about the course?
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Instructor
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
