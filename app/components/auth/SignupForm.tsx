import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock } from "lucide-react";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import Link from "next/link";


const signupSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((val) => val === true, "Must agree to terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;
export function SignupForm() {
  const router = useRouter();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", agreeTerms: false },
  });

const handleSubmit = async (data: SignupFormValues) => {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    // If status 201 created
    if (res.status === 201) {
      // success — redirect to login or home
      window.location.href = "/login";
      return;
    }

    // Try to parse JSON error if present
    let errBody: unknown = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      // safe to call json()
      errBody = await res.json();
    } else {
      // no JSON body
      errBody = { error: `Signup failed (status ${res.status})` };
    }
    console.log(errBody);

  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message,"error when sign up")
    console.error("Signup fetch error:", e);
    alert("Network error. Try again.");
  }
};

}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Your name" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="your@email.com" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" className="pl-10" placeholder="••••••••" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" className="pl-10" placeholder="••••••••" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agreeTerms"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="text-sm">I agree to the terms and conditions</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
                <p>Have an account  already?   <Link href="/login">Sign in now</Link>.</p>

       <Button onClick={() => router.push("/signup")} variant="outline">
  Sign up
</Button>
        <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full">
          Continue with  Google
        </Button>
      </form>
    </Form>
  );
}