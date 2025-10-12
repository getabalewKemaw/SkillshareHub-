import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const router = useRouter();

const handleSubmit = async (data: LoginFormValues) => {
  try {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    // signIn returns an object (when redirect: false) like { error, ok, status, url }
    if (res?.error) {
      alert(res.error || "Invalid credentials");
    } else {
      // success — redirect to dashboard (or callbackUrl)
      router.push("/");
    }
  } catch (e: unknown) {
    console.error("signIn error:", e);
    alert("Login failed. Try again.");
  }
};



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        <p>Don not  have an account?  <Link href="/signup">Sign up now</Link>.</p>
     <Button onClick={() => router.push("/login")} variant="outline">
  <LogIn className="mr-2 h-4 w-4" /> Log in
</Button>


        <div className="text-center text-sm">
          Or log in with
        </div>
  <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full">
        continue with  Google
        </Button>
      </form>
    </Form>
  );
}