"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const baseSchema = {
  displayName: z.string().min(2, "Display name is required"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
}

const instructorSchema = z.object({
  role: z.literal("INSTRUCTOR"),
  displayName: baseSchema.displayName,
  bio: z.string().min(10, "Bio is required"),
  skillsCsv: z.string().min(1, "Enter at least one skill"),
  avatarUrl: baseSchema.avatarUrl,
  introVideoUrl: z.string().url().optional().or(z.literal("")),
  isPaymentEnabled: z.boolean().default(false),
})

const studentSchema = z.object({
  role: z.literal("USER"),
  displayName: baseSchema.displayName,
  learningGoals: z.string().min(10, "Learning goals are required"),
  interestsCsv: z.string().min(1, "Enter at least one interest"),
  avatarUrl: baseSchema.avatarUrl,
})

type InstructorForm = z.infer<typeof instructorSchema>
type StudentForm = z.infer<typeof studentSchema>

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<"INSTRUCTOR" | "USER" | null>(null)

  useEffect(() => {
    if (session?.user && (session.user as any).onboardingCompleted) {
      if (session.user.role === "INSTRUCTOR" || session.user.role === "ADMIN") {
        router.replace("/dashboard/instructor")
      } else {
        router.replace("/dashboard")
      }
    }
  }, [session, router])

  const instructorForm = useForm<InstructorForm>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      role: "INSTRUCTOR",
      displayName: session?.user?.name || "",
      bio: "",
      skillsCsv: "",
      avatarUrl: (session?.user as any)?.avatarUrl || "",
      introVideoUrl: "",
      isPaymentEnabled: false,
    },
  })

  const studentForm = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      role: "USER",
      displayName: session?.user?.name || "",
      learningGoals: "",
      interestsCsv: "",
      avatarUrl: (session?.user as any)?.avatarUrl || "",
    },
  })

  const submitInstructor = async (values: InstructorForm) => {
    const payload = {
      role: values.role,
      displayName: values.displayName,
      bio: values.bio,
      skills: values.skillsCsv.split(",").map((s) => s.trim()).filter(Boolean),
      avatarUrl: values.avatarUrl || undefined,
      introVideoUrl: values.introVideoUrl || undefined,
      isPaymentEnabled: values.isPaymentEnabled,
    }
    const res = await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.replace("/dashboard/instructor")
    }
  }

  const submitStudent = async (values: StudentForm) => {
    const payload = {
      role: values.role,
      displayName: values.displayName,
      learningGoals: values.learningGoals,
      interests: values.interestsCsv.split(",").map((s) => s.trim()).filter(Boolean),
      avatarUrl: values.avatarUrl || undefined,
    }
    const res = await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.replace("/dashboard")
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Welcome! Let&apos;s set up your account</CardTitle>
            <CardDescription>Choose your role and fill in required details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-6">
              <Button variant={selectedRole === "USER" ? "default" : "outline"} onClick={() => setSelectedRole("USER")}>I&apos;m a Student</Button>
              <Button variant={selectedRole === "INSTRUCTOR" ? "default" : "outline"} onClick={() => setSelectedRole("INSTRUCTOR")}>I&apos;m an Instructor</Button>
            </div>

            {selectedRole === null && (
              <p className="text-sm text-muted-foreground">Select a role to continue.</p>
            )}

            {selectedRole === "INSTRUCTOR" && (
              <Form {...instructorForm}>
                <form onSubmit={instructorForm.handleSubmit(submitInstructor)} className="space-y-4">
                  <FormField control={instructorForm.control} name="displayName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your public name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={instructorForm.control} name="bio" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Tell students about your experience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={instructorForm.control} name="skillsCsv" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="React, Node.js, Design" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={instructorForm.control} name="avatarUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Photo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={instructorForm.control} name="introVideoUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intro Video URL (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={instructorForm.control} name="isPaymentEnabled" render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Enable payments to accept enrollments</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full">Complete Onboarding</Button>
                </form>
              </Form>
            )}

            {selectedRole === "USER" && (
              <Form {...studentForm}>
                <form onSubmit={studentForm.handleSubmit(submitStudent)} className="space-y-4">
                  <FormField control={studentForm.control} name="displayName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your public name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={studentForm.control} name="learningGoals" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Goals</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="What do you want to learn?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={studentForm.control} name="interestsCsv" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="React, UI/UX, Python" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={studentForm.control} name="avatarUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Photo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full">Complete Onboarding</Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
