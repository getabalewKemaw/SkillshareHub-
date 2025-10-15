import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Edit, Eye, Trash2, BarChart } from 'lucide-react'

async function getInstructorData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        courses: {
          include: {
            _count: {
              select: { enrollments: true, reviews: true, materials: true }
            },
            enrollments: {
              select: { status: true }
            },
            reviews: {
              select: { rating: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return user
  } catch (error) {
    console.error('Error fetching instructor data:', error)
    return null
  }
}

export default async function InstructorDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Check if user is instructor or admin
  if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const user = await getInstructorData(session.user.id)

  if (!user) {
    return <div>Error loading dashboard</div>
  }

  const totalStudents = user.courses.reduce((acc, course) => acc + course._count.enrollments, 0)
  const totalRevenue = user.courses.reduce((acc, course) => {
    const activeEnrollments = course.enrollments.filter(e => e.status === 'ACTIVE' || e.status === 'COMPLETED').length
    return acc + (course.price || 0) * activeEnrollments
  }, 0)
  const publishedCourses = user.courses.filter(c => c.status === 'PUBLISHED').length
  const draftCourses = user.courses.filter(c => c.status === 'DRAFT').length

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
              <span className="text-brand-gradient">Instructor</span> Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">Manage your courses and track performance</p>
          </div>
          <Button asChild size="lg" className="btn-brand-gradient text-white font-semibold">
            <Link href="/dashboard/instructor/create">
              <Plus className="mr-2 h-5 w-5" />
              Create New Course
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="border-purple-100/50 dark:border-purple-900/50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="font-medium">Total Courses</CardDescription>
              <CardTitle className="text-3xl font-bold text-brand-gradient">{user.courses.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <span>{publishedCourses} published, {draftCourses} drafts</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100/50 dark:border-purple-900/50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="font-medium">Total Students</CardDescription>
              <CardTitle className="text-3xl font-bold text-brand-gradient">{totalStudents}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span>Across all courses</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100/50 dark:border-purple-900/50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="font-medium">Total Revenue</CardDescription>
              <CardTitle className="text-3xl font-bold text-brand-gradient">${totalRevenue.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <span>Lifetime earnings</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100/50 dark:border-purple-900/50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="font-medium">Avg. Rating</CardDescription>
              <CardTitle className="text-3xl font-bold text-brand-gradient">
                {user.courses.length > 0
                  ? (
                      user.courses.reduce((acc, course) => {
                        const avgRating = course.reviews.length > 0
                          ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
                          : 0
                        return acc + avgRating
                      }, 0) / user.courses.length
                    ).toFixed(1)
                  : '0.0'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span>Overall performance</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">
            Your <span className="text-brand-gradient">Courses</span>
          </h2>
          {user.courses.length > 0 ? (
            <div className="space-y-4">
              {user.courses.map((course) => {
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
                            <img 
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
                                <Badge variant={course.status === 'PUBLISHED' ? 'default' : 'secondary'}>
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
                              <CardDescription className="line-clamp-2">
                                {course.description}
                              </CardDescription>
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
                              <div className="text-lg font-semibold">
                                {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}
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
                            <Button asChild size="sm" className="btn-brand-gradient text-white font-semibold">
                              <Link href={`/dashboard/instructor/${course.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/courses/${course.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/dashboard/instructor/${course.id}/analytics`}>
                                <BarChart className="h-4 w-4 mr-2" />
                                Analytics
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first course and start sharing your knowledge with students worldwide.
                </p>
                <Button asChild size="lg" className="btn-brand-gradient text-white font-semibold">
                  <Link href="/dashboard/instructor/create">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Course
                  </Link>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
