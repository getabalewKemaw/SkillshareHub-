import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { displayName, bio, skills, avatarUrl, introVideoUrl, paymentEnabled } = await req.json()

    if (!displayName || !bio || !skills) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update user with onboarding data
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        displayName,
        bio,
        skills: Array.isArray(skills) ? skills : [],
        avatarUrl: avatarUrl || undefined,
        introVideoUrl: introVideoUrl || undefined,
        paymentEnabled: paymentEnabled || false,
        onboardingCompleted: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error completing instructor onboarding:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
