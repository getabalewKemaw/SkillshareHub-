"use client";

    import { SignupForm } from "../components/auth/SignupForm";
export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <SignupForm />
      </div>
    </div>
  );
}
