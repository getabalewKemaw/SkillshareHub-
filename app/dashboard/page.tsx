import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BookOpen, TrendingUp, Award, Clock, Star, ArrowRight, GraduationCap } from 'lucide-react'

async function getUserDashboardData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                instructor: { select: { name: true } },
                _count: { select: { materials: true } }
              }
            }
          },
          orderBy: { enrolledAt: 'desc' }
        },
        reviews: {
          include: {
            course: { select: { title: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    return user
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return null
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await getUserDashboardData(session.user.id)

  if (!user) {
    return <div>Error loading dashboard</div>
  }

  const activeEnrollments = user.enrollments.filter(e => e.status === 'ACTIVE')
  const completedEnrollments = user.enrollments.filter(e => e.status === 'COMPLETED')
  const totalProgress = user.enrollments.length > 0
    ? user.enrollments.reduce((acc, e) => acc + e.progress, 0) / user.enrollments.length
    : 0

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-2xl">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">
                Welcome back, <span className="text-brand-gradient">{user.name || 'Student'}</span>!
              </h1>
              <p className="text-muted-foreground">Continue your learning journey</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="border-purple-100/50 dark:border-purple-900/50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="font-medium">Enrolled Courses</CardDescription>
              <CardTitle className="text-3xl font-bold text-brand-gradient">{user.enrollments.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <span>{activeEnrollments.length} active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100/50 dark:border-purple-900/50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="font-medium">Completed</CardDescription>
              <CardTitle className="text-3xl font-bold text-brand-gradient">{completedEnrollments.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <span>Certificates earned</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100/50 dark:border-purple-900/50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="font-medium">Average Progress</CardDescription>
              <CardTitle className="text-3xl font-bold text-brand-gradient">{Math.round(totalProgress)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span>Keep going!</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100/50 dark:border-purple-900/50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="font-medium">Reviews Written</CardDescription>
              <CardTitle className="text-3xl font-bold text-brand-gradient">{user.reviews.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <span>Your feedback</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              <span className="text-brand-gradient">Continue</span> Learning
            </h2>
            <Button variant="outline" asChild className="border-2 border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-semibold">
              <Link href="/courses">
                Browse More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {activeEnrollments.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEnrollments.map((enrollment) => (
                <Card key={enrollment.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {enrollment.course.thumbnailUrl ? (
                        <img 
                          src={enrollment.course.thumbnailUrl} 
                          alt={enrollment.course.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <BookOpen className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {enrollment.course.category && (
                        <Badge variant="secondary" className="text-xs">
                          {enrollment.course.category}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {enrollment.progress}% Complete
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {enrollment.course.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      By {enrollment.course.instructor.name || 'Anonymous'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full btn-brand-gradient text-white font-semibold">
                      <Link href={`/courses/${enrollment.course.id}/materials`}>
                        Continue Course
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No active courses</h3>
                <p className="text-muted-foreground mb-6">
                  Start learning today! Browse our course catalog to find something you love.
                </p>
                <Button asChild size="lg" className="btn-brand-gradient text-white font-semibold">
                  <Link href="/courses">Explore Courses</Link>
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Completed Courses */}
        {completedEnrollments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">
              <span className="text-brand-gradient">Completed</span> Courses
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedEnrollments.map((enrollment) => (
                <Card key={enrollment.id} className="relative overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-500 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {enrollment.course.thumbnailUrl ? (
                        <img 
                          src={enrollment.course.thumbnailUrl} 
                          alt={enrollment.course.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <BookOpen className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{enrollment.course.title}</CardTitle>
                    <CardDescription>
                      Completed on {new Date(enrollment.completedAt || enrollment.enrolledAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/courses/${enrollment.course.id}`}>
                        View Course
                      </Link>
                    </Button>
                    <Button asChild className="flex-1 btn-brand-gradient text-white font-semibold">
                      <Link href={`/certificates/${enrollment.id}`}>
                        Certificate
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Reviews */}
        {user.reviews.length > 0 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">
              Your <span className="text-brand-gradient">Recent Reviews</span>
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {user.reviews.map((review) => (
                    <div key={review.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <Link 
                          href={`/courses/${review.courseId}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {review.course.title}
                        </Link>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
