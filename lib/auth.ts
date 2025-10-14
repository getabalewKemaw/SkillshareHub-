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
          onboardingCompleted: user.onboardingCompleted,
        };
      },
    }),

    // Google OAuth login
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
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
          const userImage = user.image as string | undefined;

          await prisma.user.create({
            data: {
              email,
              role: "USER", // default role
              name: profile?.name ?? user.name ?? undefined,
              avatarUrl: profileWithPicture?.picture ?? userImage ?? undefined,
            },
          });
        }
      }
      return true; // allow sign-in
    },

    // Store role and avatar in JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role ?? "USER";
        token.avatarUrl = user.avatarUrl ?? null;
        token.onboardingCompleted = user.onboardingCompleted ?? false;
      } else if (token.email) {
        // Fetch user data if not in token
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, avatarUrl: true, onboardingCompleted: true }
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.avatarUrl = dbUser.avatarUrl
          token.onboardingCompleted = dbUser.onboardingCompleted
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
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
      }
      return session;
    },

    // Redirect users after login
    async redirect({ url, baseUrl }) {
      // If url is relative, make it absolute
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If url is on the same origin, return it
      else if (new URL(url).origin === baseUrl) return url;
      // Otherwise return base URL
      return baseUrl;
    },
  },
};
