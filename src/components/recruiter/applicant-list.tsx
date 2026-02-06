"use client";

import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Download,
  Eye,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface ApplicantListV2Props {
  opportunityId: number;
  onNavigateBack?: () => void;
}

export function ApplicantListV2({
  opportunityId,
  onNavigateBack,
}: ApplicantListV2Props) {
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - in real app, would fetch based on opportunityId
  const opportunityTitle = "Software Engineering Intern";

  const applicants = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      education: "BS Computer Science, Stanford University",
      location: "San Francisco, CA",
      gpa: "3.9",
      appliedDate: "Dec 6, 2025",
      status: "New",
      avatar: "SJ",
      resumeUrl: "sarah_johnson_resume.pdf",
      skills: ["React", "Python", "JavaScript"],
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1 (555) 234-5678",
      education: "BS Software Engineering, MIT",
      location: "Boston, MA",
      gpa: "3.85",
      appliedDate: "Dec 5, 2025",
      status: "Reviewed",
      avatar: "MC",
      resumeUrl: "michael_chen_resume.pdf",
      skills: ["Java", "C++", "Python"],
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 345-6789",
      education: "BS Computer Science, UC Berkeley",
      location: "Berkeley, CA",
      gpa: "3.95",
      appliedDate: "Dec 4, 2025",
      status: "Shortlisted",
      avatar: "ED",
      resumeUrl: "emily_davis_resume.pdf",
      skills: ["React", "Node.js", "MongoDB"],
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "+1 (555) 456-7890",
      education: "BS Computer Engineering, Carnegie Mellon",
      location: "Pittsburgh, PA",
      gpa: "3.7",
      appliedDate: "Dec 3, 2025",
      status: "Quiz Assigned",
      avatar: "JW",
      resumeUrl: "james_wilson_resume.pdf",
      skills: ["JavaScript", "TypeScript", "AWS"],
    },
    {
      id: 5,
      name: "Olivia Martinez",
      email: "olivia.martinez@email.com",
      phone: "+1 (555) 567-8901",
      education: "BS Computer Science, Georgia Tech",
      location: "Atlanta, GA",
      gpa: "3.8",
      appliedDate: "Dec 2, 2025",
      status: "Rejected",
      avatar: "OM",
      resumeUrl: "olivia_martinez_resume.pdf",
      skills: ["Python", "Django", "PostgreSQL"],
    },
  ];

  const filteredApplicants = applicants.filter((applicant) => {
    return statusFilter === "all" || applicant.status === statusFilter;
  });

  const handleShortlist = (id: number) => {
    console.log("Shortlist applicant:", id);
    // Handle shortlist
  };

  const handleReject = (id: number) => {
    if (window.confirm("Are you sure you want to reject this applicant?")) {
      console.log("Reject applicant:", id);
      // Handle reject
    }
  };

  const handleViewProfile = (id: number) => {
    console.log("View full profile:", id);
    // Handle view profile
  };

  const handleAssignQuiz = (id: number) => {
    console.log("Assign quiz to applicant:", id);
    // Handle assign quiz
  };

  const handleDownloadResume = (url: string) => {
    console.log("Download resume:", url);
    // Handle download
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";
      case "Reviewed":
        return "bg-gray-100 text-gray-700";
      case "Shortlisted":
        return "bg-green-100 text-green-700";
      case "Quiz Assigned":
        return "bg-purple-100 text-purple-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onNavigateBack}
            className="text-blue-600 hover:text-blue-700 mb-4 text-sm"
          >
            ← Back to Manage Opportunities
          </button>
          <h1 className="text-gray-900 mb-2">
            Applicants for {opportunityTitle}
          </h1>
          <p className="text-gray-600">
            Review and manage candidate applications
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm">Filter by status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="New">New</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Quiz Assigned">Quiz Assigned</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="text-gray-600 text-sm">
              {filteredApplicants.length} applicant
              {filteredApplicants.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Total</p>
            <p className="text-gray-900">{applicants.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm mb-1">New</p>
            <p className="text-blue-900">
              {applicants.filter((a) => a.status === "New").length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm mb-1">Shortlisted</p>
            <p className="text-green-900">
              {applicants.filter((a) => a.status === "Shortlisted").length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-purple-600 text-sm mb-1">Quiz Assigned</p>
            <p className="text-purple-900">
              {applicants.filter((a) => a.status === "Quiz Assigned").length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600 text-sm mb-1">Rejected</p>
            <p className="text-red-900">
              {applicants.filter((a) => a.status === "Rejected").length}
            </p>
          </div>
        </div>

        {/* Applicants List */}
        <div className="space-y-4">
          {filteredApplicants.map((applicant) => (
            <div
              key={applicant.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-lg">
                      {applicant.avatar}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-gray-900 mb-1">{applicant.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {applicant.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {applicant.phone}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm ${getStatusColor(applicant.status)}`}
                      >
                        {applicant.status}
                      </span>
                    </div>

                    {/* Profile Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1 flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          Education
                        </p>
                        <p className="text-gray-900 text-sm">
                          {applicant.education}
                        </p>
                        <p className="text-gray-600 text-sm">
                          GPA: {applicant.gpa}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Location
                        </p>
                        <p className="text-gray-900 text-sm">
                          {applicant.location}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600 text-sm mb-2">Key Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {applicant.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Submitted on {applicant.appliedDate}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleShortlist(applicant.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleReject(applicant.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleViewProfile(applicant.id)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                      <button
                        onClick={() => handleAssignQuiz(applicant.id)}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center gap-2"
                      >
                        <ClipboardList className="w-4 h-4" />
                        Assign Quiz
                      </button>
                      <button
                        onClick={() =>
                          handleDownloadResume(applicant.resumeUrl)
                        }
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Resume
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplicants.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-600">
              No applicants found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
