import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Simple cosine-like score using tag overlap and text signals
function scoreMatch(studentInterests: string[], instructorSkills: string[], learningGoals?: string, bio?: string) {
  const setA = new Set(studentInterests.map(s => s.toLowerCase()))
  const setB = new Set(instructorSkills.map(s => s.toLowerCase()))
  let overlap = 0
  for (const s of setA) if (setB.has(s)) overlap++
  let score = overlap
  const goals = (learningGoals || '').toLowerCase()
  const bioText = (bio || '').toLowerCase()
  for (const s of setA) {
    if (goals.includes(s)) score += 0.5
    if (bioText.includes(s)) score += 0.25
  }
  return score
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ matches: [] })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ matches: [] })

  // If student, find instructors; if instructor, find students
  if (user.role === 'USER') {
    const instructors = await prisma.user.findMany({ where: { role: 'INSTRUCTOR', isPaymentEnabled: true } })
    const interests = user.interests || []
    const matches = instructors
      .map(i => ({
        user: { id: i.id, displayName: i.displayName ?? i.name, avatarUrl: i.avatarUrl, bio: i.bio, skills: i.skills },
        score: scoreMatch(interests, i.skills || [], user.learningGoals || '', i.bio || '')
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    return NextResponse.json({ matches })
  } else {
    // Instructor: suggest students whose interests match your skills
    const students = await prisma.user.findMany({ where: { role: 'USER' } })
    const matches = students
      .map(s => ({
        user: { id: s.id, displayName: s.displayName ?? s.name, avatarUrl: s.avatarUrl, learningGoals: s.learningGoals, interests: s.interests },
        score: scoreMatch(s.interests || [], user.skills || [], s.learningGoals || '', user.bio || '')
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    return NextResponse.json({ matches })
  }
}
