import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, DollarSign, TrendingUp, Shield, Settings } from 'lucide-react'

async function getAdminStats() {
  try {
    const [totalUsers, totalCourses, totalEnrollments, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.enrollment.findMany({
        include: {
          course: { select: { price: true } }
        },
        where: {
          OR: [
            { status: 'ACTIVE' },
            { status: 'COMPLETED' }
          ]
        }
      }).then(enrollments => 
        enrollments.reduce((acc, e) => acc + (e.course.price || 0), 0)
      )
    ])

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    })

    const coursesByStatus = await prisma.course.groupBy({
      by: ['status'],
      _count: true
    })

    return {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      usersByRole,
      coursesByStatus
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return null
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const stats = await getAdminStats()

  if (!stats) {
    return <div>Error loading admin dashboard</div>
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage users, courses, and platform settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                {stats.usersByRole.map((role) => (
                  <div key={role.role} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{role.role}:</span>
                    <span className="font-medium">{role._count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Courses</CardDescription>
              <CardTitle className="text-3xl">{stats.totalCourses}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                {stats.coursesByStatus.map((status) => (
                  <div key={status.status} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{status.status}:</span>
                    <span className="font-medium">{status._count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Enrollments</CardDescription>
              <CardTitle className="text-3xl">{stats.totalEnrollments}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Platform engagement</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl">${stats.totalRevenue.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Platform earnings</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and roles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View, edit, and manage all user accounts. Assign roles, suspend accounts, and monitor user activity.
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>Moderate and manage courses</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Review, approve, and moderate courses. Manage course status, categories, and content quality.
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/courses">Manage Courses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Platform Settings
            </CardTitle>
            <CardDescription>
              Configure platform-wide settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold">Payment Settings</div>
                  <div className="text-xs text-muted-foreground">Configure Chapa integration</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold">Email Templates</div>
                  <div className="text-xs text-muted-foreground">Customize email notifications</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold">Categories</div>
                  <div className="text-xs text-muted-foreground">Manage course categories</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold">Analytics</div>
                  <div className="text-xs text-muted-foreground">View detailed reports</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold">Security</div>
                  <div className="text-xs text-muted-foreground">Security settings</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-semibold">Backups</div>
                  <div className="text-xs text-muted-foreground">Database backups</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
