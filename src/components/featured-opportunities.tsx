'use client';

import { Bookmark, MapPin, Clock, Calendar } from 'lucide-react';
import { useRef } from 'react';

const opportunities = [
  {
    id: 1,
    title: 'Software Engineering Intern',
    company: 'Google',
    category: 'IT & Software',
    location: 'Remote',
    duration: '3 months',
    deadline: 'Dec 15, 2025',
    logo: '🔵',
  },
  {
    id: 2,
    title: 'Marketing Intern',
    company: 'Meta',
    category: 'Marketing',
    location: 'New York, NY',
    duration: '6 months',
    deadline: 'Dec 20, 2025',
    logo: '🟦',
  },
  {
    id: 3,
    title: 'UX Design Intern',
    company: 'Adobe',
    category: 'Design',
    location: 'San Francisco, CA',
    duration: '4 months',
    deadline: 'Dec 10, 2025',
    logo: '🔴',
  },
  {
    id: 4,
    title: 'Data Analyst Intern',
    company: 'Amazon',
    category: 'Data Analytics',
    location: 'Seattle, WA',
    duration: '5 months',
    deadline: 'Dec 18, 2025',
    logo: '🟠',
  },
  {
    id: 5,
    title: 'Finance Intern',
    company: 'Goldman Sachs',
    category: 'Finance',
    location: 'London, UK',
    duration: '3 months',
    deadline: 'Dec 12, 2025',
    logo: '🟢',
  },
  {
    id: 6,
    title: 'Business Development Intern',
    company: 'Microsoft',
    category: 'Business',
    location: 'Remote',
    duration: '4 months',
    deadline: 'Dec 25, 2025',
    logo: '🟣',
  },
];

export function FeaturedOpportunities() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-[#1E293B] mb-2">Featured Opportunities</h2>
            <p className="text-gray-600">Handpicked internships from top companies</p>
          </div>
          <button className="text-[#2563EB] hover:text-[#1d4ed8] hidden md:block">
            View All →
          </button>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="min-w-[320px] bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#2563EB] transition-all snap-start"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB]/20 to-[#10B981]/20 rounded-lg flex items-center justify-center text-2xl">
                  {opp.logo}
                </div>
                <button className="text-gray-400 hover:text-[#2563EB] transition">
                  <Bookmark size={20} />
                </button>
              </div>

              {/* Content */}
              <h3 className="text-[#1E293B] text-lg mb-2">{opp.title}</h3>
              <p className="text-gray-700 mb-4">{opp.company}</p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{opp.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock size={16} className="text-gray-400" />
                  <span>{opp.duration}</span>
                </div>
              </div>

              {/* Category Badge */}
              <div className="inline-block bg-[#2563EB]/10 text-[#2563EB] px-3 py-1 rounded-full text-sm mb-4">
                {opp.category}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar size={16} />
                  <span>Deadline: {opp.deadline}</span>
                </div>
              </div>

              {/* Apply Button */}
              <button className="w-full mt-4 bg-[#2563EB] text-white py-2 rounded-lg hover:bg-[#1d4ed8] transition">
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <button className="text-[#2563EB] hover:text-[#1d4ed8]">
            View All Opportunities →
          </button>
        </div>
      </div>
    </section>
  );
}