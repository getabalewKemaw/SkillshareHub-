"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock, Loader2, GraduationCap, BookOpen } from "lucide-react";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import Link from "next/link";

const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  role: z.enum(["USER", "INSTRUCTOR"]),
  agreeTerms: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.agreeTerms === true, {
  message: "You must agree to the terms",
  path: ["agreeTerms"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<"USER" | "INSTRUCTOR">("USER");
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "USER",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      if (res.status === 201) {
        // Success - redirect to login
        router.push("/login?registered=true");
        return;
      }

      const errBody = await res.json();
      setError(errBody.error || "Signup failed. Please try again.");
    } catch (e) {
      console.error("Signup error:", e);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Role Selection */}
      <div className="space-y-3">
        <Label>I want to join as:</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedRole("USER");
              setValue("role", "USER");
            }}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
              selectedRole === "USER"
                ? "border-primary bg-primary/5 text-primary"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <GraduationCap className="h-8 w-8 mb-2" />
            <span className="font-medium">Student</span>
            <span className="text-xs text-muted-foreground mt-1">Learn new skills</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setSelectedRole("INSTRUCTOR");
              setValue("role", "INSTRUCTOR");
            }}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
              selectedRole === "INSTRUCTOR"
                ? "border-primary bg-primary/5 text-primary"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <BookOpen className="h-8 w-8 mb-2" />
            <span className="font-medium">Instructor</span>
            <span className="text-xs text-muted-foreground mt-1">Teach others</span>
          </button>
        </div>
        {errors.role && (
          <p className="text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            className="pl-10"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="agreeTerms"
          onCheckedChange={(checked) => setValue("agreeTerms", checked as boolean)}
          {...register("agreeTerms")}
        />
        <Label htmlFor="agreeTerms" className="text-sm cursor-pointer">
          I agree to the terms and conditions
        </Label>
      </div>
      {errors.agreeTerms && (
        <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Sign up"
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in now
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>
    </form>
  );
}