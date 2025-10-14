import { DefaultSession } from 'next-auth'

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'USER' | 'INSTRUCTOR' | 'ADMIN'
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: 'USER' | 'INSTRUCTOR' | 'ADMIN'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'USER' | 'INSTRUCTOR' | 'ADMIN'
  }
}

// Course types
export interface Review {
  id: string
  rating: number
  comment?: string
  createdAt: Date
  user: {
    name: string | null
    avatarUrl: string | null
  }
}

export interface CourseWithRelations {
  id: string
  title: string
  description: string
  category: string | null
  price: number | null
  thumbnailUrl: string | null
  status: string
  createdAt: Date
  updatedAt: Date
  instructorId: string
  instructor: {
    id: string
    name: string | null
    email: string
    bio: string | null
    avatarUrl: string | null
  }
  materials: Array<{
    id: string
    title: string
    type: string
    url: string
    order: number
    createdAt: Date
  }>
  reviews: Review[]
  enrollments: Array<{
    userId: string
    progress: number
    status: string
  }>
  _count: {
    enrollments: number
    reviews: number
    materials: number
  }
}
