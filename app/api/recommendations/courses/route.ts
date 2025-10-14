import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getRecommendedCoursesForStudent } from "@/lib/matching"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const recommendations = await getRecommendedCoursesForStudent(session.user.id, limit)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error fetching course recommendations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
