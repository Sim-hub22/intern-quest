"use client";

import { ApplicationModal } from "@/components/application-model";
import { Internship } from "@/components/internship-card";
import { InternshipDetail } from "@/components/internship-detail";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Building2,
  Calendar,
  ChevronDown,
  DollarSign,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useState } from "react";

export default function InternshipsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<
    string[]
  >([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState<
    string | null
  >(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applyingInternship, setApplyingInternship] =
    useState<Internship | null>(null);

  const categories = [
    "IT & Software",
    "Business",
    "Design",
    "Marketing",
    "Finance",
    "Data Analytics",
    "Engineering",
    "Media",
  ];
  const types = ["Remote", "On-site", "Hybrid"];
  const employmentTypes = ["Full-time", "Part-time"];

  const internships: Internship[] = [
    {
      id: "1",
      title: "Software Engineering Intern",
      company: "Google",
      logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop",
      location: "Mountain View, CA",
      type: "Remote",
      employmentType: "Full-time",
      salary: "$8,000/month",
      duration: "3 months",
      category: "IT & Software",
      postedDate: "2 days ago",
      deadline: "Dec 15, 2025",
      description:
        "Work on cutting-edge projects with world-class engineers. Join our team to build products that billions of people use every day.",
      requirements: [
        "Currently pursuing a Bachelor's or Master's degree in Computer Science or related field",
        "Strong programming skills in Java, Python, or C++",
        "Understanding of data structures and algorithms",
        "Excellent problem-solving abilities",
        "Strong communication skills",
      ],
      responsibilities: [
        "Develop and maintain scalable software solutions",
        "Collaborate with cross-functional teams to design new features",
        "Write clean, efficient, and well-documented code",
        "Participate in code reviews and team discussions",
        "Contribute to technical documentation",
      ],
    },
    {
      id: "2",
      title: "Product Marketing Intern",
      company: "Meta",
      logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop",
      location: "Menlo Park, CA",
      type: "Hybrid",
      employmentType: "Full-time",
      salary: "$7,500/month",
      duration: "6 months",
      category: "Marketing",
      postedDate: "3 days ago",
      deadline: "Jan 20, 2026",
      description:
        "Drive product launches and marketing campaigns for Meta's suite of products reaching billions of users worldwide.",
      requirements: [
        "Currently pursuing a Bachelor's degree in Marketing, Business, or related field",
        "Strong analytical and strategic thinking skills",
        "Excellent written and verbal communication",
        "Experience with social media platforms",
        "Creative mindset with attention to detail",
      ],
      responsibilities: [
        "Support go-to-market strategies for new product launches",
        "Conduct market research and competitive analysis",
        "Create marketing materials and presentations",
        "Collaborate with product and design teams",
        "Analyze campaign performance metrics",
      ],
    },
    {
      id: "3",
      title: "UX Design Intern",
      company: "Apple",
      logo: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=100&h=100&fit=crop",
      location: "Cupertino, CA",
      type: "On-site",
      employmentType: "Part-time",
      salary: "$7,000/month",
      duration: "4 months",
      category: "Design",
      postedDate: "1 week ago",
      deadline: "Feb 1, 2026",
      description:
        "Create beautiful user experiences for millions of users. Work alongside talented designers to shape the future of Apple products.",
      requirements: [
        "Currently pursuing a degree in Design, HCI, or related field",
        "Strong portfolio demonstrating UX/UI design skills",
        "Proficiency in Figma, Sketch, or Adobe XD",
        "Understanding of user-centered design principles",
        "Excellent visual design skills",
      ],
      responsibilities: [
        "Design intuitive user interfaces for Apple products",
        "Create wireframes, prototypes, and high-fidelity mockups",
        "Conduct user research and usability testing",
        "Collaborate with engineers and product managers",
        "Iterate designs based on feedback and data",
      ],
    },
    {
      id: "4",
      title: "Data Science Intern",
      company: "Amazon",
      logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop",
      location: "Seattle, WA",
      type: "Remote",
      employmentType: "Full-time",
      salary: "$8,500/month",
      duration: "3 months",
      category: "Data Analytics",
      postedDate: "5 days ago",
      deadline: "Jan 30, 2026",
      description:
        "Analyze data to drive business decisions at scale. Work with petabytes of data to solve complex problems.",
      requirements: [
        "Currently pursuing a degree in Statistics, Mathematics, Computer Science, or related field",
        "Strong programming skills in Python or R",
        "Experience with SQL and data manipulation",
        "Knowledge of machine learning algorithms",
        "Strong analytical and problem-solving skills",
      ],
      responsibilities: [
        "Build predictive models to improve business outcomes",
        "Analyze large datasets to extract actionable insights",
        "Create data visualizations and dashboards",
        "Collaborate with product and engineering teams",
        "Present findings to stakeholders",
      ],
    },
    {
      id: "5",
      title: "Business Analyst Intern",
      company: "Microsoft",
      logo: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=100&h=100&fit=crop",
      location: "Redmond, WA",
      type: "Hybrid",
      employmentType: "Part-time",
      salary: "$7,200/month",
      duration: "6 months",
      category: "Business",
      postedDate: "4 days ago",
      deadline: "Feb 10, 2026",
      description:
        "Work with cross-functional teams to solve business problems and drive strategic initiatives at Microsoft.",
      requirements: [
        "Currently pursuing a Bachelor's degree in Business, Economics, or related field",
        "Strong analytical and quantitative skills",
        "Proficiency in Excel and PowerPoint",
        "Excellent communication and presentation skills",
        "Ability to work with cross-functional teams",
      ],
      responsibilities: [
        "Conduct business analysis and market research",
        "Support strategic planning initiatives",
        "Create business cases and financial models",
        "Present insights to senior leadership",
        "Collaborate with product and engineering teams",
      ],
    },
    {
      id: "6",
      title: "Financial Analyst Intern",
      company: "Goldman Sachs",
      logo: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&h=100&fit=crop",
      location: "New York, NY",
      type: "On-site",
      employmentType: "Full-time",
      salary: "$9,000/month",
      duration: "10 weeks",
      category: "Finance",
      postedDate: "1 week ago",
      deadline: "Feb 15, 2026",
      description:
        "Gain experience in financial modeling and analysis at one of the world's leading investment banks.",
      requirements: [
        "Currently pursuing a Bachelor's or Master's degree in Finance, Economics, or related field",
        "Strong financial modeling and Excel skills",
        "Understanding of accounting principles",
        "Excellent analytical and quantitative abilities",
        "Strong attention to detail",
      ],
      responsibilities: [
        "Build financial models and perform valuation analysis",
        "Conduct industry and company research",
        "Prepare client presentations and pitch materials",
        "Support transaction execution",
        "Analyze market trends and financial data",
      ],
    },
    {
      id: "7",
      title: "Frontend Developer Intern",
      company: "Netflix",
      logo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop",
      location: "Los Gatos, CA",
      type: "Remote",
      employmentType: "Full-time",
      salary: "$8,200/month",
      duration: "4 months",
      category: "IT & Software",
      postedDate: "3 days ago",
      deadline: "Jan 25, 2026",
      description:
        "Build user interfaces for the world's leading streaming platform. Create experiences used by millions daily.",
      requirements: [
        "Currently pursuing a degree in Computer Science or related field",
        "Proficiency in JavaScript, React, and modern web technologies",
        "Strong understanding of HTML and CSS",
        "Experience with responsive design",
        "Passion for creating great user experiences",
      ],
      responsibilities: [
        "Develop new user-facing features using React",
        "Build reusable components and libraries",
        "Optimize applications for performance and scalability",
        "Collaborate with designers and backend engineers",
        "Participate in code reviews and best practices",
      ],
    },
    {
      id: "8",
      title: "Social Media Marketing Intern",
      company: "Nike",
      logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
      location: "Portland, OR",
      type: "Hybrid",
      employmentType: "Part-time",
      salary: "$6,500/month",
      duration: "5 months",
      category: "Marketing",
      postedDate: "2 weeks ago",
      deadline: "Mar 1, 2026",
      description:
        "Create engaging content for global brand campaigns. Help tell Nike's story to millions of athletes worldwide.",
      requirements: [
        "Currently pursuing a degree in Marketing, Communications, or related field",
        "Strong social media knowledge and content creation skills",
        "Excellent writing and storytelling abilities",
        "Creative mindset with attention to trends",
        "Experience with social media analytics",
      ],
      responsibilities: [
        "Create and schedule social media content",
        "Monitor social media trends and engagement",
        "Collaborate with creative teams on campaigns",
        "Analyze social media performance metrics",
        "Engage with online community",
      ],
    },
    {
      id: "9",
      title: "Machine Learning Intern",
      company: "OpenAI",
      logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop",
      location: "San Francisco, CA",
      type: "On-site",
      employmentType: "Full-time",
      salary: "$10,000/month",
      duration: "3 months",
      category: "IT & Software",
      postedDate: "1 day ago",
      deadline: "Feb 5, 2026",
      description:
        "Work on cutting-edge AI and machine learning projects. Help build the future of artificial intelligence.",
      requirements: [
        "Currently pursuing a Master's or PhD in Computer Science, AI, or related field",
        "Strong background in machine learning and deep learning",
        "Proficiency in Python and ML frameworks (PyTorch, TensorFlow)",
        "Experience with research and academic publications",
        "Strong mathematical foundation",
      ],
      responsibilities: [
        "Develop and train machine learning models",
        "Conduct research on novel AI techniques",
        "Implement and optimize ML algorithms",
        "Collaborate with research team on publications",
        "Contribute to cutting-edge AI projects",
      ],
    },
  ];

  const toggleFilter = (
    filterArray: string[],
    setFilterArray: (value: string[]) => void,
    value: string,
  ) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter((item) => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedEmploymentTypes([]);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedTypes.length > 0 ||
    selectedEmploymentTypes.length > 0;

  // If an internship is selected, show the detail view
  const selectedInternship = internships.find(
    (i) => i.id === selectedInternshipId,
  );

  if (selectedInternship) {
    return (
      <InternshipDetail
        internship={selectedInternship}
        onClose={() => setSelectedInternshipId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold mb-3">Explore Internships</h1>
          <p className="text-lg text-white/90 mb-8">
            Discover thousands of verified internship opportunities from top
            companies
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 max-w-6xl">
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, skill, or company..."
                className="flex-1 outline-none text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="relative sm:w-48">
              <select className="appearance-none w-full px-4 py-2 pr-10 bg-white text-gray-700 cursor-pointer outline-none rounded-lg border border-gray-200">
                <option>All Categories</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() =>
                          toggleFilter(
                            selectedCategories,
                            setSelectedCategories,
                            category,
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-600 text-sm group-hover:text-gray-900">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h4 className="text-gray-900 mb-3">Work Type</h4>
                <div className="space-y-2">
                  {types.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() =>
                          toggleFilter(selectedTypes, setSelectedTypes, type)
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-600 text-sm group-hover:text-gray-900">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Employment Type Filter */}
              <div className="mb-6">
                <h4 className="text-gray-900 mb-3">Employment Type</h4>
                <div className="space-y-2">
                  {employmentTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmploymentTypes.includes(type)}
                        onChange={() =>
                          toggleFilter(
                            selectedEmploymentTypes,
                            setSelectedEmploymentTypes,
                            type,
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-600 text-sm group-hover:text-gray-900">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Sort Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Title */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Available Internships
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Showing {internships.length} internships
                  </p>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </button>

                {/* Sort */}
                <div className="relative">
                  <select className="appearance-none px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg text-gray-700 cursor-pointer outline-none w-full sm:w-auto">
                    <option>Most Recent</option>
                    <option>Deadline Soon</option>
                    <option>Salary: High to Low</option>
                    <option>Salary: Low to High</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Internship Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {internships.map((internship, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                  onClick={() => setSelectedInternshipId(internship.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        <img
                          src={internship.logo}
                          alt={internship.company}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 line-clamp-2 mb-1">
                          {internship.title}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Building2 className="w-3 h-3" />
                          {internship.company}
                        </div>
                      </div>
                    </div>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Bookmark className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {internship.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      {internship.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <DollarSign className="w-4 h-4" />
                      {internship.salary}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      Duration: {internship.duration}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                      {internship.category}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs">
                      {internship.type}
                    </span>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2 text-gray-700 text-sm mb-4 border-t border-gray-100 pt-4">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {internship.deadline}</span>
                  </div>

                  {/* Apply Now Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setApplyingInternship(internship);
                      setIsApplicationModalOpen(true);
                    }}
                  >
                    Apply Now
                  </Button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
                2
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
                3
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
                Next
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="absolute inset-y-0 left-0 w-full max-w-sm bg-white p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-gray-900 mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() =>
                        toggleFilter(
                          selectedCategories,
                          setSelectedCategories,
                          category,
                        )
                      }
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 text-sm group-hover:text-gray-900">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="mb-6">
              <h4 className="text-gray-900 mb-3">Work Type</h4>
              <div className="space-y-2">
                {types.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() =>
                        toggleFilter(selectedTypes, setSelectedTypes, type)
                      }
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 text-sm group-hover:text-gray-900">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Employment Type Filter */}
            <div className="mb-6">
              <h4 className="text-gray-900 mb-3">Employment Type</h4>
              <div className="space-y-2">
                {employmentTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmploymentTypes.includes(type)}
                      onChange={() =>
                        toggleFilter(
                          selectedEmploymentTypes,
                          setSelectedEmploymentTypes,
                          type,
                        )
                      }
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 text-sm group-hover:text-gray-900">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={() => setShowFilters(false)}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {isApplicationModalOpen && applyingInternship && (
        <ApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          internshipTitle={applyingInternship?.title || ""}
          companyName={applyingInternship?.company || ""}
          companyLogo={applyingInternship?.logo}
          workType={applyingInternship?.type}
        />
      )}
    </div>
  );
}
