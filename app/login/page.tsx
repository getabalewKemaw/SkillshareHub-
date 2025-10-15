"use client";
import { LoginForm } from "../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
