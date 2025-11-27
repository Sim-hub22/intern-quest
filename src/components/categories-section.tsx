import { Code, Briefcase, Palette, Megaphone, DollarSign, BarChart, Camera, Wrench } from 'lucide-react';

const categories = [
  { name: 'IT & Software', icon: Code, color: 'from-[#2563EB] to-[#1d4ed8]' },
  { name: 'Business', icon: Briefcase, color: 'from-[#1E293B] to-[#334155]' },
  { name: 'Design', icon: Palette, color: 'from-[#10B981] to-[#059669]' },
  { name: 'Marketing', icon: Megaphone, color: 'from-[#2563EB] to-[#10B981]' },
  { name: 'Finance', icon: DollarSign, color: 'from-[#10B981] to-[#059669]' },
  { name: 'Data Analytics', icon: BarChart, color: 'from-[#2563EB] to-[#1d4ed8]' },
  { name: 'Media', icon: Camera, color: 'from-[#1E293B] to-[#334155]' },
  { name: 'Engineering', icon: Wrench, color: 'from-[#10B981] to-[#2563EB]' },
];

export function CategoriesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[#1E293B] mb-3">Explore by Category</h2>
          <p className="text-gray-600">Find internships tailored to your field of interest</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#2563EB] transition-all duration-300 cursor-pointer"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-[#1E293B] text-lg">{category.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}