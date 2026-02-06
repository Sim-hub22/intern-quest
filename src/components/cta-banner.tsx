"use client";

import { ArrowRight, Sparkles } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#2563EB] via-[#1d4ed8] to-[#10B981] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
          <Sparkles className="text-white" size={32} />
        </div>

        {/* Content */}
        <h2 className="text-white mb-4">Start Your Internship Journey Today</h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of students who have found their perfect internship
          through InternQuest. Your dream career starts here.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-white text-[#2563EB] px-8 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 group">
            <span>Create Account</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button className="bg-transparent text-white px-8 py-4 rounded-xl hover:bg-white/10 transition border-2 border-white/50 backdrop-blur-sm">
            Browse Internships
          </button>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 flex items-center justify-center gap-8 flex-wrap text-blue-100 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
            <span>100% Free to Use</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
            <span>Verified Companies Only</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
            <span>No Hidden Fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}
