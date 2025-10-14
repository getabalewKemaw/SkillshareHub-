import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, Users, DollarSign, BookOpen } from 'lucide-react'

async function getInstructorCourses(userId: string) {
  return prisma.course.findMany({
    where: { instructorId: userId },
    include: {
      _count: {
        select: {
          enrollments: true,
          lessons: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function InstructorCoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const courses = await getInstructorCourses(session.user.id)

  const totalRevenue = courses.reduce((sum, course) => {
    return sum + ((course.price || 0) * course._count.enrollments)
  }, 0)

  const totalStudents = courses.reduce((sum, course) => {
    return sum + course._count.enrollments
  }, 0)

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">Manage your course content</p>
          </div>
          <Link href="/dashboard/instructor/courses/create">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Course
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Courses</CardDescription>
              <CardTitle className="text-3xl">{courses.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{courses.filter(c => c.status === 'PUBLISHED').length} published</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Students</CardDescription>
              <CardTitle className="text-3xl">{totalStudents}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Across all courses</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl">{totalRevenue.toLocaleString()} ETB</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Lifetime earnings</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        {courses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first course and start teaching!
              </p>
              <Link href="/dashboard/instructor/courses/create">
                <Button>
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={course.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Link href={`/dashboard/instructor/courses/${course.id}/edit`}>
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/courses/${course.id}`}>
                        <Button size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Students</span>
                      <span className="font-medium">{course._count.enrollments}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lessons</span>
                      <span className="font-medium">{course._count.lessons}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Reviews</span>
                      <span className="font-medium">{course._count.reviews}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-bold text-lg">
                        {course.price === 0 ? 'Free' : `${course.price} ETB`}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Link href={`/dashboard/instructor/courses/${course.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/dashboard/instructor/courses/${course.id}/lessons`} className="flex-1">
                    <Button className="w-full">
                      Manage Lessons
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
