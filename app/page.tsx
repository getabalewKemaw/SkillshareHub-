import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50/50 via-background to-pink-50/50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-300/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full border border-purple-200 dark:border-purple-800 shadow-sm">
                <Sparkles className="h-4 w-4 text-brand-gradient" />
                <span className="text-sm font-semibold text-brand-gradient">Welcome to SkillShare Hub</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                Learn Skills,
                <span className="block text-brand-gradient mt-2">Share Knowledge</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Discover thousands of courses from expert instructors. Master new skills, advance your career, and achieve your goals with our comprehensive learning platform.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Button size="lg" asChild className="btn-brand-gradient text-white text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 font-semibold shadow-lg">
                  <Link href="/courses">
                    Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 font-semibold border-2 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all">
                  <Link href="/signup">Start Teaching</Link>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium">Free & Paid Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium">Expert Instructors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium">Lifetime Access</span>
                </div>
              </div>
            </div>
            <div className="relative hidden  lg:block">
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-purple-200/50 dark:border-purple-800/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 to-pink-100/40 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8">
                    <Card className="animate-float hover:shadow-xl transition-shadow border-purple-100 dark:border-purple-900">
                      <CardHeader className="pb-3">
                        <div className="w-12 h-12 rounded-lg bg-brand-gradient flex items-center justify-center mb-3">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-brand-gradient">1000+</CardTitle>
                        <CardDescription className="font-medium">Courses</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="animate-float-delayed hover:shadow-xl transition-shadow border-purple-100 dark:border-purple-900">
                      <CardHeader className="pb-3 px-30">
                        <div className="w-12 h-12 rounded-lg bg-brand-gradient flex items-center justify-center mb-3">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-brand-gradient">50K+</CardTitle>
                        <CardDescription className="font-medium">Students</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="animate-float-delayed hover:shadow-xl transition-shadow border-purple-100 dark:border-purple-900">
                      <CardHeader className="pb-3">
                        <div className="w-12 h-12 rounded-lg bg-brand-gradient flex items-center justify-center mb-3">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-brand-gradient">500+</CardTitle>
                        <CardDescription className="font-medium">Instructors</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="animate-float hover:shadow-xl transition-shadow border-purple-100 dark:border-purple-900">
                      <CardHeader className="pb-3">
                        <div className="w-12 h-12 rounded-lg bg-brand-gradient flex items-center justify-center mb-3">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-brand-gradient">95%</CardTitle>
                        <CardDescription className="font-medium">Success Rate</CardDescription>
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
      <section className="lg:hidden py-12 px-4 bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-950/10 dark:to-pink-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card className="border-purple-100 dark:border-purple-900 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 text-center">
                <div className="w-10 h-10 rounded-lg bg-brand-gradient flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-brand-gradient">1000+</CardTitle>
                <CardDescription className="text-xs sm:text-sm font-medium">Courses</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-purple-100 dark:border-purple-900 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 text-center">
                <div className="w-10 h-10 rounded-lg bg-brand-gradient flex items-center justify-center mx-auto mb-2">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-brand-gradient">50K+</CardTitle>
                <CardDescription className="text-xs sm:text-sm font-medium">Students</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-purple-100 dark:border-purple-900 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 text-center">
                <div className="w-10 h-10 rounded-lg bg-brand-gradient flex items-center justify-center mx-auto mb-2">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-brand-gradient">500+</CardTitle>
                <CardDescription className="text-xs sm:text-sm font-medium">Instructors</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-purple-100 dark:border-purple-900 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 text-center">
                <div className="w-10 h-10 rounded-lg bg-brand-gradient flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-brand-gradient">95%</CardTitle>
                <CardDescription className="text-xs sm:text-sm font-medium">Success Rate</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="text-brand-gradient">Featured</span> Courses
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">Start learning with our most popular courses</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredCourses.length > 0 ? (
              featuredCourses.map((course) => {
                const avgRating = course.reviews.length > 0
                  ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length
                  : 0
                return (
                  <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-purple-100/50 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700">
                    <CardHeader>
                      <div className="aspect-video bg-gradient-to-br from-purple-100/50 to-pink-100/50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {course.category && <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">{course.category}</Badge>}
                        {course.price === 0 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">Free</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">${course.price}</Badge>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-brand-gradient transition-colors">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-3">
                      <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{avgRating > 0 ? avgRating.toFixed(1) : 'New'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{course._count.enrollments} students</span>
                        </div>
                      </div>
                      <Button asChild className="w-full btn-brand-gradient text-white font-semibold">
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
            <Button size="lg" variant="outline" asChild className="border-2 border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-semibold px-8">
              <Link href="/courses">View All Courses <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50/30 via-background to-pink-50/30 dark:from-purple-950/10 dark:via-background dark:to-pink-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              Why Choose <span className="text-brand-gradient">SkillShare Hub</span>?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">Everything you need to succeed in your learning journey</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-purple-100/50 dark:border-purple-900/50">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Diverse Course Library</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Access thousands of courses across various categories, from web development to design and business.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-purple-100/50 dark:border-purple-900/50">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Expert Instructors</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Learn from industry professionals and experienced educators who are passionate about teaching.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-purple-100/50 dark:border-purple-900/50 sm:col-span-2 md:col-span-1">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Certificates & Progress</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Track your progress, earn certificates, and showcase your achievements to employers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50/30 via-background to-pink-50/30 dark:from-purple-950/10 dark:via-background dark:to-pink-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              What Our <span className="text-brand-gradient">Students Say</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied learners who have transformed their careers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-purple-100/50 dark:border-purple-900/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div>
                    <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                    <CardDescription>Web Developer</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base leading-relaxed">
                  &ldquo;The courses here are incredible! I went from beginner to landing my dream job as a web developer in just 6 months. The instructors are top-notch!&rdquo;
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-purple-100/50 dark:border-purple-900/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div>
                    <CardTitle className="text-lg">Michael Chen</CardTitle>
                    <CardDescription>Data Scientist</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base leading-relaxed">
                  &ldquo;Best investment I&apos;ve made in my career. The quality of content and the support from instructors is unmatched. Highly recommend!&rdquo;
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-purple-100/50 dark:border-purple-900/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-lg">
                    E
                  </div>
                  <div>
                    <CardTitle className="text-lg">Emily Rodriguez</CardTitle>
                    <CardDescription>UX Designer</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base leading-relaxed">
                  &ldquo;Amazing platform! The courses are well-structured, and I love the flexibility to learn at my own pace. Already completed 5 courses!&rdquo;
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-brand-gradient text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <CardHeader className="space-y-6 py-12 sm:py-16 px-6 sm:px-12 relative z-10">
              <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">Ready to Start Learning?</CardTitle>
              <CardDescription className="text-base sm:text-lg text-white/95 max-w-2xl mx-auto">
                Join thousands of students already learning on SkillShare Hub. Start your journey today and unlock your potential!
              </CardDescription>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" asChild className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 font-semibold bg-white text-purple-600 hover:bg-gray-100 shadow-lg">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all">
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