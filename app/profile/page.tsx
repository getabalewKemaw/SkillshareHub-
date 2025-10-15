import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, BookOpen, Award, Edit } from 'lucide-react'

async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            courses: true,
            enrollments: true,
            reviews: true
          }
        }
      }
    })

    return user
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await getUserProfile(session.user.id)

  if (!user) {
    return <div>Error loading profile</div>
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your public profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl || undefined} />
                  <AvatarFallback className="text-3xl">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold">{user.name || 'Anonymous'}</h2>
                    <Badge variant={
                      user.role === 'ADMIN' ? 'destructive' :
                      user.role === 'INSTRUCTOR' ? 'default' :
                      'secondary'
                    }>
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Courses Created
                </CardDescription>
                <CardTitle className="text-3xl">{user._count.courses}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Enrollments
                </CardDescription>
                <CardTitle className="text-3xl">{user._count.enrollments}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Reviews Written
                </CardDescription>
                <CardTitle className="text-3xl">{user._count.reviews}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Edit Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Profile
              </CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={user.name || ''}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if you need to update it.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={user.bio || ''}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description for your profile. Maximum 500 characters.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    type="url"
                    defaultValue={user.avatarUrl || ''}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a URL to your profile picture
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h4 className="font-semibold">Change Password</h4>
                  <p className="text-sm text-muted-foreground">Update your password</p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h4 className="font-semibold">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Manage your email preferences</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h4 className="font-semibold">Privacy Settings</h4>
                  <p className="text-sm text-muted-foreground">Control your privacy options</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="font-semibold text-destructive">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
