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

    const { role } = await req.json()

    if (!role || !['USER', 'INSTRUCTOR'].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Update user role
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error selecting role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
