import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Award, TrendingUp, Star, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'

async function getFeaturedCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        instructor: { select: { name: true, avatarUrl: true } },
        _count: { select: { enrollments: true, reviews: true } },
        reviews: { select: { rating: true } }
      },
      take: 6,
      orderBy: { createdAt: 'desc' }
    })
    return courses
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export default async function HomePage() {
  const featuredCourses = await getFeaturedCourses()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Welcome to SkillShare Hub</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Learn Skills,
                <span className="block text-primary">Share Knowledge</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Discover thousands of courses from expert instructors. Master new skills, advance your career, and achieve your goals with our comprehensive learning platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="text-lg px-8">
                  <Link href="/courses">
                    Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8">
                  <Link href="/signup">Start Teaching</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm">Free & Paid Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm">Expert Instructors</span>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8">
                    <Card className="animate-float">
                      <CardHeader className="pb-3">
                        <BookOpen className="h-8 w-8 text-primary mb-2" />
                        <CardTitle className="text-2xl">1000+</CardTitle>
                        <CardDescription>Courses</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="animate-float-delayed">
                      <CardHeader className="pb-3">
                        <Users className="h-8 w-8 text-primary mb-2" />
                        <CardTitle className="text-2xl">50K+</CardTitle>
                        <CardDescription>Students</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="animate-float-delayed">
                      <CardHeader className="pb-3">
                        <Award className="h-8 w-8 text-primary mb-2" />
                        <CardTitle className="text-2xl">500+</CardTitle>
                        <CardDescription>Instructors</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="animate-float">
                      <CardHeader className="pb-3">
                        <TrendingUp className="h-8 w-8 text-primary mb-2" />
                        <CardTitle className="text-2xl">95%</CardTitle>
                        <CardDescription>Success Rate</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Mobile */}
      <section className="lg:hidden py-12 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3 text-center">
                <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                <CardTitle className="text-xl">1000+</CardTitle>
                <CardDescription>Courses</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3 text-center">
                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                <CardTitle className="text-xl">50K+</CardTitle>
                <CardDescription>Students</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3 text-center">
                <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                <CardTitle className="text-xl">500+</CardTitle>
                <CardDescription>Instructors</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3 text-center">
                <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                <CardTitle className="text-xl">95%</CardTitle>
                <CardDescription>Success Rate</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-xl text-muted-foreground">Start learning with our most popular courses</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredCourses.length > 0 ? (
              featuredCourses.map((course) => {
                const avgRating = course.reviews.length > 0
                  ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length
                  : 0
                return (
                  <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="h-12 w-12 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {course.category && <Badge variant="secondary">{course.category}</Badge>}
                        {course.price === 0 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Free</Badge>
                        ) : (
                          <Badge variant="outline">${course.price}</Badge>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-3">
                      <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{avgRating > 0 ? avgRating.toFixed(1) : 'New'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course._count.enrollments} students</span>
                        </div>
                      </div>
                      <Button asChild className="w-full">
                        <Link href={`/courses/${course.id}`}>View Course</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">No courses available yet. Check back soon!</p>
              </div>
            )}
          </div>
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/courses">View All Courses <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose SkillShare Hub?</h2>
            <p className="text-xl text-muted-foreground">Everything you need to succeed in your learning journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Diverse Course Library</CardTitle>
                <CardDescription className="mt-2">
                  Access thousands of courses across various categories, from web development to design and business.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Expert Instructors</CardTitle>
                <CardDescription className="mt-2">
                  Learn from industry professionals and experienced educators who are passionate about teaching.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Certificates & Progress</CardTitle>
                <CardDescription className="mt-2">
                  Track your progress, earn certificates, and showcase your achievements to employers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
            <CardHeader className="space-y-6 py-12">
              <CardTitle className="text-4xl font-bold">Ready to Start Learning?</CardTitle>
              <CardDescription className="text-lg text-primary-foreground/90">
                Join thousands of students already learning on SkillShare Hub. Start your journey today!
              </CardDescription>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}