"use client";

import { ChevronDown, Search } from "lucide-react";
import { ImageWithFallback } from "./ui/image-with-fallback";

export function HeroSection() {
  return (
    <section className="relative bg-[#F8FAFC] py-20 lg:py-28 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#2563EB]/20 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#10B981]/20 rounded-full opacity-30 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <h1 className="text-[#1E293B]">
                Find the Right Internship. Build Your Future.
              </h1>
              <p className="text-gray-600 text-lg">
                A trusted platform connecting students with verified internship
                and training opportunities.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by title, skill, or company..."
                  className="flex-1 outline-none text-[#1E293B]"
                />
              </div>
              <div className="flex items-center gap-2 px-4 sm:border-l border-gray-200">
                <select className="outline-none text-[#1E293B] bg-transparent cursor-pointer pr-8 appearance-none">
                  <option>All Categories</option>
                  <option>IT & Software</option>
                  <option>Business</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                </select>
                <ChevronDown className="text-gray-400" size={18} />
              </div>
              <button className="bg-[#2563EB] text-white px-8 py-3 rounded-lg hover:bg-[#1d4ed8] transition">
                Search
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <div className="text-[#2563EB]">10,000+</div>
                <div className="text-gray-600 text-sm">Active Internships</div>
              </div>
              <div>
                <div className="text-[#2563EB]">500+</div>
                <div className="text-gray-600 text-sm">Verified Companies</div>
              </div>
              <div>
                <div className="text-[#2563EB]">50,000+</div>
                <div className="text-gray-600 text-sm">Students Placed</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:block hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB] to-[#10B981] rounded-3xl transform rotate-3"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1701576766277-c6160505581d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwbGFwdG9wfGVufDF8fHx8MTc2Mzk3ODAyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Students collaborating"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 w-64">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#10B981]">✓</span>
                </div>
                <div>
                  <div className="text-[#1E293B]">Application Sent!</div>
                  <div className="text-gray-500 text-sm">
                    Google - SWE Intern
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
