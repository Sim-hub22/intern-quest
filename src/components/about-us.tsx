import { Target, Users, Award, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './ui/image-with-fallback';

export function AboutUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Content */}
          <div>
            <h2 className="text-[#1E293B] mb-6">About InternQuest</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                InternQuest is a dedicated platform built to bridge the gap between talented students and verified internship opportunities. We believe that every student deserves access to quality internships that can shape their career trajectory.
              </p>
              <p>
                Founded in 2023, our mission is to democratize access to professional opportunities by creating a transparent, merit-based system where students can discover, apply, and secure internships with confidence.
              </p>
              <p>
                We work closely with leading companies across industries to ensure that every opportunity listed on our platform is verified, legitimate, and offers real value to aspiring professionals.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-[#F8FAFC] rounded-xl p-6">
                <div className="text-[#2563EB] text-3xl mb-2">500+</div>
                <div className="text-gray-600">Partner Companies</div>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-6">
                <div className="text-[#10B981] text-3xl mb-2">50K+</div>
                <div className="text-gray-600">Students Placed</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 to-[#10B981]/20 rounded-3xl transform -rotate-3"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1701576766277-c6160505581d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwbGFwdG9wfGVufDF8fHx8MTc2Mzk3ODAyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team collaboration"
                className="relative rounded-3xl shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div>
          <h3 className="text-[#1E293B] text-center mb-12">Our Core Values</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="text-white" size={32} />
              </div>
              <h4 className="text-[#1E293B] text-lg mb-2">Mission-Driven</h4>
              <p className="text-gray-600 text-sm">
                Focused on empowering students to achieve their career goals
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h4 className="text-[#1E293B] text-lg mb-2">Student-Centric</h4>
              <p className="text-gray-600 text-sm">
                Every feature is designed with student success in mind
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="text-white" size={32} />
              </div>
              <h4 className="text-[#1E293B] text-lg mb-2">Quality First</h4>
              <p className="text-gray-600 text-sm">
                Only verified companies and legitimate opportunities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#10B981] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h4 className="text-[#1E293B] text-lg mb-2">Growth-Oriented</h4>
              <p className="text-gray-600 text-sm">
                Continuous innovation to serve you better
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
