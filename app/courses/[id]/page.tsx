import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Users, Star, Clock, Award, FileText, Video, Download, CheckCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { EnrollmentButton } from '@/app/components/courses/EnrollmentButton'
import { ReviewList } from '@/app/components/courses/ReviewList'

async function getCourseDetails(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatarUrl: true,
            _count: { select: { courses: true } }
          }
        },
        materials: {
          orderBy: { order: 'asc' }
        },
        reviews: {
          include: {
            user: {
              select: { name: true, avatarUrl: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        enrollments: {
          select: { userId: true, progress: true }
        },
        _count: {
          select: { enrollments: true, reviews: true }
        }
      }
    })

    return course
  } catch (error) {
    console.error('Error fetching course:', error)
    return null
  }
}

export default async function CourseDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const course = await getCourseDetails(id)
  const session = await getServerSession(authOptions)

  if (!course) {
    notFound()
  }

  const avgRating = course.reviews.length > 0
    ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length
    : 0

  const isEnrolled = course.enrollments.some(e => e.userId === session?.user?.id)
  const userEnrollment = course.enrollments.find(e => e.userId === session?.user?.id)
  const isInstructor = session?.user?.id === course.instructorId

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 flex-wrap">
                {course.category && (
                  <Badge variant="secondary">{course.category}</Badge>
                )}
                <Badge variant="outline">
                  {course.status}
                </Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                {course.title}
              </h1>

              <p className="text-xl text-muted-foreground">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{avgRating > 0 ? avgRating.toFixed(1) : 'New'}</span>
                  {course._count.reviews > 0 && (
                    <span className="text-muted-foreground">({course._count.reviews} reviews)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course._count.enrollments} students enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Instructor Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={course.instructor.avatarUrl || undefined} />
                      <AvatarFallback>
                        {course.instructor.name?.charAt(0).toUpperCase() || 'I'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{course.instructor.name || 'Anonymous'}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {course.instructor._count.courses} courses
                      </p>
                      {course.instructor.bio && (
                        <p className="text-sm">{course.instructor.bio}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="h-16 w-16 text-primary" />
                    )}
                  </div>
                  <div className="text-center">
                    {course.price === 0 ? (
                      <div className="text-3xl font-bold text-green-600">Free</div>
                    ) : (
                      <div className="text-3xl font-bold">${course.price}</div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEnrolled ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Your Progress</span>
                          <span className="font-semibold">{userEnrollment?.progress || 0}%</span>
                        </div>
                        <Progress value={userEnrollment?.progress || 0} />
                      </div>
                      <Button asChild className="w-full" size="lg">
                        <Link href={`/courses/${course.id}/materials`}>
                          Continue Learning
                        </Link>
                      </Button>
                    </>
                  ) : isInstructor ? (
                    <Button asChild className="w-full" size="lg" variant="outline">
                      <Link href={`/dashboard/instructor/${course.id}`}>
                        Edit Course
                      </Link>
                    </Button>
                  ) : (
                    <EnrollmentButton courseId={course.id} price={course.price || 0} />
                  )}

                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold">This course includes:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" />
                        <span>{course.materials.filter(m => m.type === 'video').length} video lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>{course.materials.filter(m => m.type === 'pdf').length} downloadable resources</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Lifetime access</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Course Materials */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    {course.materials.length} lessons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {course.materials.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {course.materials.map((material, index) => (
                        <AccordionItem key={material.id} value={`item-${index}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 text-left">
                              {material.type === 'video' ? (
                                <Video className="h-5 w-5 text-primary flex-shrink-0" />
                              ) : (
                                <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                              )}
                              <span className="font-medium">{material.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-8 space-y-2">
                              <p className="text-sm text-muted-foreground">
                                Type: {material.type.toUpperCase()}
                              </p>
                              {isEnrolled || isInstructor ? (
                                <Button asChild size="sm" variant="outline">
                                  <a href={material.url} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 mr-2" />
                                    Access Material
                                  </a>
                                </Button>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">
                                  Enroll to access this material
                                </p>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No materials available yet
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                  <CardDescription>
                    {course._count.reviews} reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReviewList 
                    courseId={course.id} 
                    reviews={course.reviews}
                    isEnrolled={isEnrolled}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Additional Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Master the fundamentals and advanced concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Build real-world projects from scratch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Learn industry best practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Get hands-on experience with practical exercises</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
