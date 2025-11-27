import { ShieldCheck, BarChart3, BookOpen, Users } from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Verified Companies',
    description: 'All companies are verified and trusted. No fake postings or scams.',
    color: 'from-[#2563EB] to-[#1d4ed8]',
  },
  {
    icon: BarChart3,
    title: 'Track Applications Easily',
    description: 'Monitor your application status in real-time with our intuitive dashboard.',
    color: 'from-[#10B981] to-[#059669]',
  },
  {
    icon: BookOpen,
    title: 'Skill-Building Resources',
    description: 'Access free courses, quizzes, and resources to boost your skills.',
    color: 'from-[#1E293B] to-[#334155]',
  },
  {
    icon: Users,
    title: 'Fair Shortlisting Process',
    description: 'Merit-based selection with transparent evaluation criteria.',
    color: 'from-[#2563EB] to-[#10B981]',
  },
];

export function WhyInternQuest() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#1E293B] mb-3">Why Choose InternQuest?</h2>
          <p className="text-gray-600">A platform built with students&apos; success in mind</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-[#1E293B] text-lg mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}