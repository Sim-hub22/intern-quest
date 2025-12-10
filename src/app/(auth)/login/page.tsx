import { Button } from "@/components/ui/button";
import { LoginForm } from "@/modules/auth/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IQ</span>
              </div>
              <span className="text-[#1E293B] text-xl">InternQuest</span>
            </Link>
            <h1 className="text-[#1E293B] mb-2">Sign In to Your Account</h1>
            <p className="text-gray-600">
              Welcome back! Please enter your details
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="text-[#2563EB] hover:text-[#1d4ed8] p-0"
              asChild
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
