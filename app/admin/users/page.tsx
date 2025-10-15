import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Users, Mail, Calendar, BookOpen, Award } from 'lucide-react'

async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            courses: true,
            enrollments: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const users = await getAllUsers()

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users on the platform ({users.length} total)
          </p>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar */}
                  <Avatar className="h-20 w-20 flex-shrink-0">
                    <AvatarImage src={user.avatarUrl || undefined} />
                    <AvatarFallback className="text-2xl">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <CardTitle className="text-xl">{user.name || 'Anonymous'}</CardTitle>
                          <Badge variant={
                            user.role === 'ADMIN' ? 'destructive' :
                            user.role === 'INSTRUCTOR' ? 'default' :
                            'secondary'
                          }>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        {user.bio && (
                          <CardDescription className="line-clamp-2">
                            {user.bio}
                          </CardDescription>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t">
                      <div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          Courses Created
                        </div>
                        <div className="text-lg font-semibold">{user._count.courses}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Enrollments
                        </div>
                        <div className="text-lg font-semibold">{user._count.enrollments}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Reviews
                        </div>
                        <div className="text-lg font-semibold">{user._count.reviews}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined
                        </div>
                        <div className="text-sm font-semibold">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-3">
                      <Button variant="outline" size="sm">
                        Edit Role
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Send Email
                      </Button>
                      {user.id !== session.user.id && (
                        <Button variant="destructive" size="sm">
                          Suspend Account
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
