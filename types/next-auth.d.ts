import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: 'USER' | 'INSTRUCTOR' | 'ADMIN'
      avatarUrl: string | null
      onboardingCompleted: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: 'USER' | 'INSTRUCTOR' | 'ADMIN'
    avatarUrl: string | null
    onboardingCompleted: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: 'USER' | 'INSTRUCTOR' | 'ADMIN'
    avatarUrl: string | null
    onboardingCompleted: boolean
  }
}
