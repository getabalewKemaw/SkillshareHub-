import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function InstructorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id }, include: { courses: true } })
  if (!user || user.role !== 'INSTRUCTOR') return notFound()

  const session = await getServerSession(authOptions)
  const isSelf = session?.user?.id === id

  // Gate: students can view instructor profiles only when enrolled in at least one of their courses
  let canView = isSelf || session?.user?.role === 'ADMIN'
  if (!canView && session?.user?.id) {
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: session.user.id, courseId: { in: user.courses.map(c => c.id) } }
    })
    canView = !!enrollment
  }

  if (!canView) redirect('/courses')

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{user.displayName || user.name || 'Instructor'}</CardTitle>
          </CardHeader>
          <CardContent>
            {user.avatarUrl && (
              <img src={user.avatarUrl} alt={user.displayName || 'Instructor'} className="w-24 h-24 rounded-full mb-4" />
            )}
            {user.bio && <p className="text-muted-foreground mb-4">{user.bio}</p>}
            {Array.isArray(user.skills) && user.skills.length > 0 && (
              <div className="text-sm mb-4">Skills: {user.skills.join(', ')}</div>
            )}
            <div className="space-y-3">
              <h3 className="font-semibold">Courses</h3>
              <ul className="list-disc ml-6">
                {user.courses.map(c => (
                  <li key={c.id}>{c.title}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
