"use client";
import { LoginForm } from "../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
      <div className="w-full max-w-md p-8 bg-white dark:bg-card rounded-2xl shadow-2xl border border-purple-100 dark:border-purple-900">
        <h1 className="text-3xl font-extrabold mb-2 text-center">
          <span className="text-brand-gradient">Welcome</span> Back
        </h1>
        <p className="text-center text-muted-foreground mb-6">Sign in to continue learning</p>
        <LoginForm />
      </div>
    </div>
  );
}
