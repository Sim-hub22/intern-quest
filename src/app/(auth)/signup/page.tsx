"use client";

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Building2, GraduationCap, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import Link from 'next/link';


export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<'candidate' | 'recruiter'>('candidate');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up with:', { ...formData, userType });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Left Side - Form */}
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
            <h1 className="text-[#1E293B] mb-2">Create Your Account</h1>
            <p className="text-gray-600">Start your journey to the perfect internship</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <p className="text-[#1E293B] mb-3">I want to sign up as:</p>
            <div className="grid grid-cols-2 gap-4">
              {/* Candidate Option */}
              <button
                type="button"
                onClick={() => setUserType('candidate')}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  userType === 'candidate'
                    ? 'border-[#2563EB] bg-[#2563EB]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    userType === 'candidate'
                      ? 'bg-[#2563EB]'
                      : 'bg-gray-100'
                  }`}>
                    <GraduationCap className={userType === 'candidate' ? 'text-white' : 'text-gray-400'} size={24} />
                  </div>
                  <span className={`text-sm ${userType === 'candidate' ? 'text-[#2563EB]' : 'text-gray-600'}`}>
                    Candidate
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Looking for internships</span>
                </div>
                {userType === 'candidate' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="text-[#10B981]" size={20} fill="currentColor" />
                  </div>
                )}
              </button>

              {/* Recruiter Option */}
              <button
                type="button"
                onClick={() => setUserType('recruiter')}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  userType === 'recruiter'
                    ? 'border-[#2563EB] bg-[#2563EB]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    userType === 'recruiter'
                      ? 'bg-[#2563EB]'
                      : 'bg-gray-100'
                  }`}>
                    <Building2 className={userType === 'recruiter' ? 'text-white' : 'text-gray-400'} size={24} />
                  </div>
                  <span className={`text-sm ${userType === 'recruiter' ? 'text-[#2563EB]' : 'text-gray-600'}`}>
                    Recruiter
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Hiring candidates</span>
                </div>
                {userType === 'recruiter' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="text-[#10B981]" size={20} fill="currentColor" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[#1E293B] text-sm mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#1E293B] text-sm mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Organization (Only for Recruiter) */}
            {userType === 'recruiter' && (
              <div>
                <label className="block text-[#1E293B] text-sm mb-2">Company/Organization</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="Enter your company name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-[#1E293B] text-sm mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-400" size={20} />
                  ) : (
                    <Eye className="text-gray-400" size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#1E293B] text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="text-gray-400" size={20} />
                  ) : (
                    <Eye className="text-gray-400" size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-[#2563EB] border-gray-300 rounded focus:ring-[#2563EB]"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-[#2563EB] hover:text-[#1d4ed8]">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#2563EB] hover:text-[#1d4ed8]">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#2563EB] text-white py-3 rounded-lg hover:bg-[#1d4ed8] transition"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#F8FAFC] text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Sign Up */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-white transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-600 text-sm">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-white transition"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-gray-600 text-sm">Facebook</span>
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#2563EB] hover:text-[#1d4ed8]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#2563EB] to-[#10B981] p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-lg text-white">
          <h2 className="text-white mb-6">Join 50,000+ Students and Recruiters</h2>
          <p className="text-blue-100 text-lg mb-8">
            {userType === 'candidate' 
              ? 'Find verified internships from top companies and kickstart your career journey with InternQuest.'
              : 'Connect with talented students and find the perfect candidates for your internship programs.'}
          </p>

          {/* Benefits List */}
          <div className="space-y-4">
            {userType === 'candidate' ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle2 className="text-white" size={18} />
                  </div>
                  <span className="text-blue-50">Access 10,000+ verified internships</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle2 className="text-white" size={18} />
                  </div>
                  <span className="text-blue-50">Track applications in real-time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle2 className="text-white" size={18} />
                  </div>
                  <span className="text-blue-50">Free skill-building resources</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle2 className="text-white" size={18} />
                  </div>
                  <span className="text-blue-50">Access to 50,000+ qualified candidates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle2 className="text-white" size={18} />
                  </div>
                  <span className="text-blue-50">Advanced candidate filtering</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle2 className="text-white" size={18} />
                  </div>
                  <span className="text-blue-50">Streamlined hiring process</span>
                </div>
              </>
            )}
          </div>

          {/* Image */}
          <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
              alt="Team collaboration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
