import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Star, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
async function getAllCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: { name: true, email: true }
        },
        _count: {
          select: { enrollments: true, reviews: true, materials: true }
        },
        reviews: {
          select: { rating: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return courses
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const courses = await getAllCourses()

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Course Management</h1>
          <p className="text-muted-foreground">
            Moderate and manage all courses on the platform ({courses.length} total)
          </p>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {courses.map((course) => {
            const avgRating = course.reviews.length > 0
              ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length
              : 0

            return (
              <Card key={course.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Thumbnail */}
                    <div className="w-full lg:w-48 aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {course.thumbnailUrl ? (
                        <Image
                          src={course.thumbnailUrl} 
                          alt={course.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <BookOpen className="h-12 w-12 text-primary" />
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant={
                              course.status === 'PUBLISHED' ? 'default' :
                              course.status === 'DRAFT' ? 'secondary' :
                              'outline'
                            }>
                              {course.status}
                            </Badge>
                            {course.category && (
                              <Badge variant="outline">{course.category}</Badge>
                            )}
                            {course.price === 0 ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Free
                              </Badge>
                            ) : (
                              <Badge variant="outline">${course.price}</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mb-2">
                            {course.description}
                          </CardDescription>
                          <div className="text-sm text-muted-foreground">
                            By {course.instructor.name || 'Anonymous'} ({course.instructor.email})
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t">
                        <div>
                          <div className="text-sm text-muted-foreground">Students</div>
                          <div className="text-lg font-semibold">{course._count.enrollments}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Rating</div>
                          <div className="text-lg font-semibold flex items-center gap-1">
                            {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}
                            {avgRating > 0 && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Reviews</div>
                          <div className="text-lg font-semibold">{course._count.reviews}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Materials</div>
                          <div className="text-lg font-semibold">{course._count.materials}</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-3">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/courses/${course.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/instructor/${course.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        {course.status === 'DRAFT' && (
                          <Button variant="default" size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve & Publish
                          </Button>
                        )}
                        {course.status === 'PUBLISHED' && (
                          <Button variant="outline" size="sm">
                            <XCircle className="h-4 w-4 mr-2" />
                            Unpublish
                          </Button>
                        )}
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {courses.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground">
                Courses will appear here once instructors start creating them.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
