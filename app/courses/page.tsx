import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Users, Star, Filter, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma'

const CATEGORIES = [
  'All Categories',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Design',
  'Business',
  'Marketing',
  'Photography',
  'Music',
  'Language Learning'
]

interface SearchParams {
  search?: string
  category?: string
  price?: string
  sort?: string
}

async function getCourses(searchParams: SearchParams) {
  try {
    const { search, category, price, sort } = searchParams

    const where: any = {
      status: 'PUBLISHED'
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category && category !== 'All Categories') {
      where.category = category
    }

    if (price === 'free') {
      where.price = 0
    } else if (price === 'paid') {
      where.price = { gt: 0 }
    }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price-asc') {
      orderBy = { price: 'asc' }
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' }
    } else if (sort === 'popular') {
      // For now, sort by enrollment count (we'll need to add this later)
      orderBy = { createdAt: 'desc' }
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: { select: { name: true, avatarUrl: true } },
        _count: { select: { enrollments: true, reviews: true } },
        reviews: { select: { rating: true } }
      },
      orderBy
    })

    return courses
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export default async function CoursesPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const courses = await getCourses(params)

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Courses</h1>
          <p className="text-xl text-muted-foreground">
            Discover {courses.length} courses to help you achieve your goals
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="search"
                    placeholder="Search courses..."
                    defaultValue={params.search}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <Select name="category" defaultValue={params.category || 'All Categories'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Price Filter */}
                <Select name="price" defaultValue={params.price || 'all'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select name="sort" defaultValue={params.sort || 'newest'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" className="md:col-span-4">
                  Apply Filters
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => {
              const avgRating = course.reviews.length > 0
                ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length
                : 0

              return (
                <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                      {course.thumbnailUrl ? (
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        />
                      ) : (
                        <BookOpen className="h-12 w-12 text-primary" />
                      )}
                      {course.price === 0 && (
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">Free</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {course.category && (
                        <Badge variant="secondary" className="text-xs">
                          {course.category}
                        </Badge>
                      )}
                      {course.price > 0 && (
                        <Badge variant="outline" className="text-xs font-semibold">
                          ${course.price}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex flex-col gap-3 mt-auto pt-0">
                    <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {avgRating > 0 ? avgRating.toFixed(1) : 'New'}
                        </span>
                        {course._count.reviews > 0 && (
                          <span className="text-xs">({course._count.reviews})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course._count.enrollments}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      By {course.instructor.name || 'Anonymous'}
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/courses/${course.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button asChild>
                <Link href="/courses">Clear Filters</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
