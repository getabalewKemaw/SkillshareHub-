import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      role,
      displayName,
      bio,
      skills,
      interests,
      learningGoals,
      avatarUrl,
      introVideoUrl,
      isPaymentEnabled,
    } = body ?? {}

    if (!displayName) {
      return NextResponse.json({ error: "displayName is required" }, { status: 400 })
    }

    // Determine role update
    const newRole = role === "INSTRUCTOR" ? "INSTRUCTOR" : "USER"

    const update = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role: newRole as any,
        displayName,
        bio: bio ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
        skills: Array.isArray(skills) ? skills : undefined,
        interests: Array.isArray(interests) ? interests : undefined,
        learningGoals: learningGoals ?? undefined,
        introVideoUrl: introVideoUrl ?? undefined,
        isPaymentEnabled: typeof isPaymentEnabled === 'boolean' ? isPaymentEnabled : undefined,
        onboardingCompleted: true,
      },
      select: { id: true, role: true, displayName: true, onboardingCompleted: true },
    })

    const res = NextResponse.json({ success: true, user: update })
    // Set short-lived cookie to allow redirect without re-login
    res.cookies.set("sshub_onboarded", "1", { path: "/", httpOnly: false })
    return res
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
