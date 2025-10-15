
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body ?? {};

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine the role - default to USER if not provided
    const userRole = role === "INSTRUCTOR" ? "INSTRUCTOR" : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
      },
    });

    // Return created user id and email (do NOT return password)
    return NextResponse.json({ 
      id: user.id, 
      email: user.email,
      role: user.role 
    }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error){
      console.error("sign up route errors ",err.message)
    }
    console.error("Signup route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
