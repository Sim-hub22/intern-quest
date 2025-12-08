import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { LoginForm } from "@/modules/auth/components/login-form";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Left Side - Image/Illustration */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-[#2563EB] to-[#10B981] p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-lg text-white">
          <h2 className="text-white mb-6">Welcome Back to InternQuest</h2>
          <p className="text-blue-100 text-lg mb-8">
            Continue your journey to find the perfect internship or connect with
            talented candidates.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-white text-3xl mb-1">10K+</div>
              <div className="text-blue-100 text-sm">Active Internships</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-white text-3xl mb-1">500+</div>
              <div className="text-blue-100 text-sm">Top Companies</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-white text-3xl mb-1">50K+</div>
              <div className="text-blue-100 text-sm">Students Placed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-white text-3xl mb-1">95%</div>
              <div className="text-blue-100 text-sm">Success Rate</div>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CheckCircle2 className="text-white" size={18} />
              </div>
              <span className="text-blue-50">Verified companies only</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CheckCircle2 className="text-white" size={18} />
              </div>
              <span className="text-blue-50">
                Real-time application tracking
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CheckCircle2 className="text-white" size={18} />
              </div>
              <span className="text-blue-50">100% free to use</span>
            </div>
          </div>

          {/* Image */}
          <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
              alt="Professional workspace"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

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
            <Link
              href="/signup"
              className="text-[#2563EB] hover:text-[#1d4ed8]"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
