import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getRecommendedCoursesForStudent, getRecommendedInstructorsForStudent } from '@/lib/matching'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BookOpen, TrendingUp, Award, Clock, Star, ArrowRight, GraduationCap, Heart, ShoppingCart } from 'lucide-react'

async function getStudentDashboardData(userId: string) {
  const [user, enrollments, cartCount, recommendations, instructorRecommendations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        interests: true,
        learningGoals: true,
      },
    }),
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                displayName: true,
                name: true,
                avatarUrl: true,
              },
            },
            _count: {
              select: { lessons: true },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
      take: 6,
    }),
    prisma.cartItem.count({
      where: { userId },
    }),
    getRecommendedCoursesForStudent(userId, 6),
    getRecommendedInstructorsForStudent(userId, 4),
  ])

  return {
    user,
    enrollments,
    cartCount,
    recommendations,
    instructorRecommendations,
  }
}

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const { user, enrollments, cartCount, recommendations, instructorRecommendations } = 
    await getStudentDashboardData(session.user.id)

  if (!user) {
    return <div>Error loading dashboard</div>
  }

  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE')
  const completedEnrollments = enrollments.filter(e => e.status === 'COMPLETED')
  const totalProgress = enrollments.length > 0
    ? enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length
    : 0

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback className="text-2xl">
                  {(user.displayName || user.name)?.charAt(0).toUpperCase() || 'S'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">Welcome back, {user.displayName || user.name}!</h1>
                <p className="text-muted-foreground">Continue your learning journey</p>
              </div>
            </div>
            <Link href="/cart">
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {cartCount > 0 && (
                  <Badge className="ml-2 bg-red-500">{cartCount}</Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Enrolled Courses</CardDescription>
              <CardTitle className="text-3xl">{enrollments.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{activeEnrollments.length} active</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">{completedEnrollments.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>Certificates earned</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Overall Progress</CardDescription>
              <CardTitle className="text-3xl">{Math.round(totalProgress)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={totalProgress} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Learning Streak</CardDescription>
              <CardTitle className="text-3xl">7 🔥</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Keep it up!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        {activeEnrollments.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Continue Learning</h2>
              <Link href="/my-courses">
                <Button variant="ghost">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEnrollments.slice(0, 3).map((enrollment) => (
                <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                      <GraduationCap className="h-12 w-12 text-white" />
                    </div>
                    <CardTitle className="line-clamp-2">{enrollment.course.title}</CardTitle>
                    <CardDescription>
                      by {enrollment.course.instructor.displayName || enrollment.course.instructor.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/courses/${enrollment.course.id}`} className="w-full">
                      <Button className="w-full">Continue Learning</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Courses */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Recommended For You</h2>
              <p className="text-muted-foreground">Based on your interests: {user.interests?.join(', ')}</p>
            </div>
            <Link href="/courses">
              <Button variant="ghost">
                Browse All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 6).map((course: any) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-green-500 to-teal-600 rounded-lg mb-4 flex items-center justify-center relative">
                    <GraduationCap className="h-12 w-12 text-white" />
                    {course.matchScore > 0.5 && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500">
                        {Math.round(course.matchScore * 100)}% Match
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription>
                    by {course.instructor.displayName || course.instructor.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.8</span>
                      <span className="text-sm text-muted-foreground">({course._count.enrollments})</span>
                    </div>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-bold">
                      {course.price === 0 ? 'Free' : `${course.price} ETB`}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Link href={`/courses/${course.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View Course</Button>
                  </Link>
                  <Button size="icon" variant="ghost">
                    <Heart className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommended Instructors */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Instructors For You</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructorRecommendations.map((instructor: any) => (
              <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={instructor.avatarUrl || undefined} />
                    <AvatarFallback className="text-xl">
                      {(instructor.displayName || instructor.name)?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{instructor.displayName || instructor.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{instructor.bio}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {instructor.skills?.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {instructor._count.courses} courses
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/instructors/${instructor.id}`} className="w-full">
                    <Button variant="outline" className="w-full">View Profile</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
