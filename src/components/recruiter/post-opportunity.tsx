"use client";

import { trpcClient } from "@/lib/trpc";
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  Tag,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PostOpportunityV2Props {
  onNavigateBack?: () => void;
}

export function PostOpportunityV2({ onNavigateBack }: PostOpportunityV2Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: "",
    category: "",
    duration: "",
    locationType: "onsite" as "onsite" | "remote" | "hybrid",
    location: "",
    description: "",
    requirements: "",
    responsibilities: "",
    skills: "",
    deadline: "",
    salary: "",
    positions: "1",
    companyLogo: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreateOpportunity = async () => {
    try {
      setIsSubmitting(true);
      
      // Parse and validate form data
      const skillsArray = formData.skills
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      const stipendValue = formData.salary ? parseFloat(formData.salary) : null;
      const deadlineDate = formData.deadline ? new Date(formData.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days from now
      
      await trpcClient.opportunity.create.mutate({
        title: formData.jobTitle,
        description: formData.description,
        type: "internship" as const,
        mode: formData.locationType,
        location: formData.location || undefined,
        category: formData.category,
        skills: skillsArray,
        stipend: stipendValue,
        duration: formData.duration || undefined,
        deadline: deadlineDate,
        positions: parseInt(formData.positions) || 1,
      });
      
      toast.success("Opportunity posted successfully!");
      router.push("/recruiter/manage-opportunities");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to post opportunity";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: "Basic Information", icon: Briefcase },
    { id: 2, title: "Details & Requirements", icon: FileText },
    { id: 3, title: "Additional Info", icon: Tag },
    { id: 4, title: "Review & Submit", icon: CheckCircle },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, companyLogo: e.target.files[0] });
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.jobTitle.trim())
        newErrors.jobTitle = "Job title is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.duration.trim())
        newErrors.duration = "Duration is required";
      if (!formData.location.trim())
        newErrors.location = "Location is required";
    } else if (step === 2) {
      if (!formData.description.trim())
        newErrors.description = "Description is required";
      if (!formData.requirements.trim())
        newErrors.requirements = "Requirements are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      await handleCreateOpportunity();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onNavigateBack}
            className="text-blue-600 hover:text-blue-700 mb-4 text-sm"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-gray-900 mb-2">Post New Opportunity</h1>
          <p className="text-gray-600">
            Create a new internship opportunity for students
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <span>✓</span>
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm ${currentStep >= step.id ? "text-gray-900" : "text-gray-500"}`}
                    >
                      Step {step.id}
                    </p>
                    <p
                      className={`text-xs ${currentStep >= step.id ? "text-gray-600" : "text-gray-400"}`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-gray-900 mb-6">Basic Information</h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="jobTitle"
                    className="block text-gray-700 text-sm mb-2"
                  >
                    Job Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pl-10 border rounded-lg outline-none transition-colors ${
                        errors.jobTitle
                          ? "border-red-500"
                          : "border-gray-300 focus:border-blue-600"
                      }`}
                      placeholder="e.g. Software Engineering Intern"
                    />
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.jobTitle && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.jobTitle}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-gray-700 text-sm mb-2"
                    >
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pl-10 border rounded-lg outline-none transition-colors ${
                          errors.category
                            ? "border-red-500"
                            : "border-gray-300 focus:border-blue-600"
                        }`}
                      >
                        <option value="">Select a category</option>
                        <option value="software-engineering">
                          Software Engineering
                        </option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="data-science">Data Science</option>
                        <option value="business">Business</option>
                        <option value="finance">Finance</option>
                        <option value="other">Other</option>
                      </select>
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-gray-700 text-sm mb-2"
                    >
                      Duration *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pl-10 border rounded-lg outline-none transition-colors ${
                          errors.duration
                            ? "border-red-500"
                            : "border-gray-300 focus:border-blue-600"
                        }`}
                        placeholder="e.g. 3 months"
                      />
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.duration && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.duration}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="locationType"
                      className="block text-gray-700 text-sm mb-2"
                    >
                      Location Type
                    </label>
                    <select
                      id="locationType"
                      name="locationType"
                      value={formData.locationType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
                    >
                      <option value="onsite">On-site</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-gray-700 text-sm mb-2"
                    >
                      Location *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pl-10 border rounded-lg outline-none transition-colors ${
                          errors.location
                            ? "border-red-500"
                            : "border-gray-300 focus:border-blue-600"
                        }`}
                        placeholder="e.g. San Francisco, CA"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details & Requirements */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-gray-900 mb-6">Details & Requirements</h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-gray-700 text-sm mb-2"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors resize-none ${
                      errors.description
                        ? "border-red-500"
                        : "border-gray-300 focus:border-blue-600"
                    }`}
                    placeholder="Provide a detailed description of the internship opportunity..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="requirements"
                    className="block text-gray-700 text-sm mb-2"
                  >
                    Requirements *
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors resize-none ${
                      errors.requirements
                        ? "border-red-500"
                        : "border-gray-300 focus:border-blue-600"
                    }`}
                    placeholder="List the requirements for applicants (one per line)..."
                  />
                  {errors.requirements && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.requirements}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="responsibilities"
                    className="block text-gray-700 text-sm mb-2"
                  >
                    Responsibilities
                  </label>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors resize-none"
                    placeholder="List key responsibilities (one per line)..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="skills"
                    className="block text-gray-700 text-sm mb-2"
                  >
                    Required Skills
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
                    placeholder="e.g. React, Node.js, Python (comma separated)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Info */}
          {currentStep === 3 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-gray-900 mb-6">Additional Information</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="deadline"
                      className="block text-gray-700 text-sm mb-2"
                    >
                      Application Deadline
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="salary"
                      className="block text-gray-700 text-sm mb-2"
                    >
                      Salary/Stipend (per month)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
                        placeholder="e.g. 2000"
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="positions"
                    className="block text-gray-700 text-sm mb-2"
                  >
                    Number of Positions
                  </label>
                  <input
                    type="number"
                    id="positions"
                    name="positions"
                    value={formData.positions}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="companyLogo"
                    className="block text-gray-700 text-sm mb-2"
                  >
                    Upload Company Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm mb-2">
                      {formData.companyLogo
                        ? formData.companyLogo.name
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-gray-500 text-xs">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      id="companyLogo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="companyLogo"
                      className="mt-3 inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-sm"
                    >
                      Choose File
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-gray-900 mb-6">Review & Submit</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Job Title
                  </label>
                  <p className="text-gray-900">{formData.jobTitle}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Category
                  </label>
                  <p className="text-gray-900">{formData.category}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Duration
                  </label>
                  <p className="text-gray-900">{formData.duration}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Location Type
                  </label>
                  <p className="text-gray-900">{formData.locationType}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Location
                  </label>
                  <p className="text-gray-900">{formData.location}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Description
                  </label>
                  <p className="text-gray-900">{formData.description}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Requirements
                  </label>
                  <p className="text-gray-900">{formData.requirements}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Responsibilities
                  </label>
                  <p className="text-gray-900">{formData.responsibilities}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Required Skills
                  </label>
                  <p className="text-gray-900">{formData.skills}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Application Deadline
                  </label>
                  <p className="text-gray-900">{formData.deadline}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Salary/Stipend (per month)
                  </label>
                  <p className="text-gray-900">{formData.salary}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Number of Positions
                  </label>
                  <p className="text-gray-900">{formData.positions}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Company Logo
                  </label>
                  <p className="text-gray-900">
                    {formData.companyLogo
                      ? formData.companyLogo.name
                      : "No logo uploaded"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            ) : (
              <button
                type="button"
                onClick={onNavigateBack}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Posting..." : "Post Opportunity"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
