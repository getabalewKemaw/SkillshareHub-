import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // stateless JWT sessions for Next.js App Router
  },
  providers: [
    // Credentials login (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        };
      },
    }),

    // Google OAuth login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login", // custom login page
  },

  callbacks: {
    // Runs when a user signs in
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Check if user already exists
        const email = user.email ?? profile?.email;
        if (!email) {
          return false;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        // If not, create a new user
        if (!existingUser) {
          const profileWithPicture = profile as { picture?: string } | null | undefined;

          await prisma.user.create({
            data: {
              email,
              role: "USER", // default role
              name: profile?.name ?? user.name ?? undefined,
              avatarUrl: profileWithPicture?.picture ?? (user as any).image ?? undefined,
            },
          });
        }
      }
      return true; // allow sign-in
    },

    // Store role and avatar in JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role ?? "USER";
        token.avatarUrl = (user as any).avatarUrl ?? null;
      }
      if (!token.id && token.email) {
        // Fetch user data if not in token
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, avatarUrl: true, onboardingCompleted: true }
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.avatarUrl = dbUser.avatarUrl
          ;(token as any).onboardingCompleted = dbUser.onboardingCompleted
        }
      }
      return token;
    },

    // Attach role and avatar to session for frontend use
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'USER' | 'INSTRUCTOR' | 'ADMIN'
        session.user.avatarUrl = token.avatarUrl as string | null;
        ;(session.user as any).onboardingCompleted = (token as any).onboardingCompleted ?? false
      }
      return session;
    },

    // Redirect users after login
    async redirect({ url, baseUrl }) {
      // Let middleware handle finer routing. Default to dashboard.
      return "/dashboard";
    },
  },
};
