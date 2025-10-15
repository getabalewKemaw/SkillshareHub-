import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/courses', '/login', '/signup', '/api/auth']
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )

  // Allow public routes and API routes (except protected ones)
  if (isPublicRoute || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Onboarding flow - redirect to onboarding if not completed
  const onboardingCompleted = token.onboardingCompleted as boolean
  const isOnboardingRoute = pathname.startsWith('/onboarding')

  if (!onboardingCompleted && !isOnboardingRoute) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // If onboarding is completed but user is on onboarding page, redirect to dashboard
  if (onboardingCompleted && isOnboardingRoute) {
    const userRole = token.role as string
    if (userRole === 'INSTRUCTOR') {
      return NextResponse.redirect(new URL('/dashboard/instructor', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Role-based access control
  const userRole = token.role as string

  // Admin-only routes
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Instructor routes (accessible by instructors and admins)
  if (pathname.startsWith('/dashboard/instructor')) {
    if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect to appropriate dashboard
  if (pathname === '/dashboard') {
    if (userRole === 'INSTRUCTOR') {
      return NextResponse.redirect(new URL('/dashboard/instructor', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
