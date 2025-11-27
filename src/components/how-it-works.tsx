import { Search, FileText, Award, UserCheck } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search Opportunities',
    description: 'Browse thousands of verified internships from top companies across industries.',
    color: 'from-[#2563EB] to-[#1d4ed8]',
  },
  {
    icon: FileText,
    title: 'Apply with Resume',
    description: 'Submit your application with a single click using your profile and resume.',
    color: 'from-[#1E293B] to-[#334155]',
  },
  {
    icon: Award,
    title: 'Take Skill Quizzes',
    description: 'Complete skill assessments to showcase your abilities and stand out.',
    color: 'from-[#10B981] to-[#059669]',
  },
  {
    icon: UserCheck,
    title: 'Get Shortlisted & Interview',
    description: 'Track your application status and get matched with the right opportunities.',
    color: 'from-[#2563EB] to-[#10B981]',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#1E293B] mb-3">How It Works</h2>
          <p className="text-gray-600">Get started in four simple steps</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 -z-10"></div>
                )}

                <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="relative inline-block mb-4">
                    <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#2563EB] rounded-full text-white flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-[#1E293B] text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}