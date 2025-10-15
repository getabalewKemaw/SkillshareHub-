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

                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
                : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"

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

                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
                : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"

            

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


      <Button type="submit" className="w-full btn-brand-gradient text-white font-semibold" disabled={loading}>

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

        <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">

          Sign in now
        </Link>
      </div>



 
    </form>
  );
}