import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  DollarSign,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { ApplicationModal } from "./application-model";
import { Internship } from "./internship-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./ui/image-with-fallback";

interface InternshipDetailProps {
  internship: Internship;
  onClose?: () => void;
  onBack?: () => void;
}

export function InternshipDetail({
  internship,
  onClose,
  onBack,
}: InternshipDetailProps) {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const handleBack = () => {
    if (onClose) onClose();
    if (onBack) onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Gradient Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="gap-2 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to results
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card with Company Info and Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Company Logo and Info */}
          <div className="flex items-start gap-4 mb-6">
            <ImageWithFallback
              src={internship.logo}
              alt={internship.company}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {internship.title}
              </h1>
              <p className="text-base text-orange-400 font-medium mb-2">
                {internship.company.toUpperCase()}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{internship.location.split(",")[0]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{internship.type}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100"
            >
              <Bookmark className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Salary Card */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Offered Salary</p>
              <p className="text-lg font-semibold text-gray-900">
                {internship.salary}
              </p>
              <p className="text-xs text-gray-500">Monthly</p>
            </div>

            {/* Location Card */}
            <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-pink-600" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Location</p>
              <p className="text-lg font-semibold text-gray-900">
                {internship.type}
              </p>
            </div>

            {/* Level Card */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Level</p>
              <p className="text-lg font-semibold text-gray-900">Entry</p>
            </div>

            {/* Openings Card */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Openings</p>
              <p className="text-lg font-semibold text-gray-900">1</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Description:
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {internship.description}
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="font-medium text-gray-900 w-32">Type:</span>
                  <span className="text-blue-600">
                    {internship.type} Internship
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-900 w-32">
                    Location:
                  </span>
                  <span className="text-gray-700">{internship.location}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-900 w-32">
                    Number of positions:
                  </span>
                  <span className="text-gray-700">1</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-900 w-32">
                    Duration:
                  </span>
                  <span className="text-gray-700">{internship.duration}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-900 w-32">
                    Working days:
                  </span>
                  <span className="text-gray-700">Monday to Friday</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-900 w-32">Time:</span>
                  <span className="text-gray-700">9:30 AM to 5:30 PM</span>
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Responsibilities of the Candidate:
              </h2>
              <ul className="space-y-3">
                {internship.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex gap-3 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Requirements:
              </h2>
              <ul className="space-y-3">
                {internship.requirements.map((requirement, index) => (
                  <li key={index} className="flex gap-3 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Skills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {internship.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-teal-50 text-teal-700 border-teal-200"
                >
                  {internship.type} work
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Communication
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* About Company */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                About Company
              </h3>

              <h4 className="text-lg font-semibold text-pink-600 mb-3">
                {internship.company}
              </h4>

              <div className="space-y-2 text-sm mb-4">
                <div>
                  <span className="font-medium text-gray-900">Address:</span>
                  <span className="text-gray-700 ml-2">
                    {internship.location}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                We are a leading technology company focused on innovation and
                excellence. Join our team to build products that impact millions
                of users worldwide.
              </p>

              <Button
                variant="outline"
                className="w-full text-blue-600 hover:bg-blue-50"
              >
                View Company Profile →
              </Button>
            </div>

            {/* Apply Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Are you interested in this Internship?
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Application ends:</p>
                <p className="text-base font-semibold text-gray-900">
                  February 5, 2026
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                size="lg"
                onClick={() => setIsApplicationModalOpen(true)}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        internshipTitle={internship.title}
        companyName={internship.company}
        companyLogo={internship.logo}
        workType={internship.type}
      />
    </div>
  );
}
