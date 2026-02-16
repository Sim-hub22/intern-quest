"use client";

import {
  Award,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Star,
  UserCheck,
  UserX,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { QuizAssignmentModal } from "./quiz-assignment-modal";

interface ViewApplicationsProps {
  onNavigateBack?: () => void;
}

type ApplicationStatus =
  | "pending"
  | "shortlisted"
  | "rejected"
  | "interviewing"
  | "hired";

interface Application {
  id: number;
  candidateName: string;
  email: string;
  phone: string;
  opportunityTitle: string;
  opportunityId: number;
  appliedDate: string;
  status: ApplicationStatus;
  score: number;
  location: string;
  experience: string;
  education: string;
  skills: string[];
  resumeUrl: string;
  avatarColor: string;
}

export function ViewApplications({ onNavigateBack }: ViewApplicationsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [opportunityFilter, setOpportunityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedApplications, setSelectedApplications] = useState<number[]>(
    [],
  );
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizAssignmentType, setQuizAssignmentType] = useState<
    "single" | "bulk"
  >("single");
  const [currentApplicationId, setCurrentApplicationId] = useState<
    number | null
  >(null);

  // Mock data
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      candidateName: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      opportunityTitle: "Software Engineering Intern",
      opportunityId: 1,
      appliedDate: "2025-12-08",
      status: "pending",
      score: 92,
      location: "San Francisco, CA",
      experience: "2 years",
      education: "BS Computer Science, Stanford",
      skills: ["React", "TypeScript", "Node.js", "Python"],
      resumeUrl: "#",
      avatarColor: "bg-blue-600",
    },
    {
      id: 2,
      candidateName: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1 (555) 234-5678",
      opportunityTitle: "UI/UX Design Intern",
      opportunityId: 2,
      appliedDate: "2025-12-07",
      status: "shortlisted",
      score: 88,
      location: "Remote",
      experience: "1 year",
      education: "BA Design, RISD",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      resumeUrl: "#",
      avatarColor: "bg-purple-600",
    },
    {
      id: 3,
      candidateName: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "+1 (555) 345-6789",
      opportunityTitle: "Data Science Intern",
      opportunityId: 3,
      appliedDate: "2025-12-09",
      status: "pending",
      score: 95,
      location: "New York, NY",
      experience: "3 years",
      education: "MS Data Science, MIT",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      resumeUrl: "#",
      avatarColor: "bg-green-600",
    },
    {
      id: 4,
      candidateName: "James Wilson",
      email: "james.w@email.com",
      phone: "+1 (555) 456-7890",
      opportunityTitle: "Software Engineering Intern",
      opportunityId: 1,
      appliedDate: "2025-12-06",
      status: "interviewing",
      score: 85,
      location: "Austin, TX",
      experience: "1.5 years",
      education: "BS Software Engineering, UT Austin",
      skills: ["JavaScript", "React", "AWS", "MongoDB"],
      resumeUrl: "#",
      avatarColor: "bg-yellow-600",
    },
    {
      id: 5,
      candidateName: "Priya Patel",
      email: "priya.p@email.com",
      phone: "+1 (555) 567-8901",
      opportunityTitle: "Product Management Intern",
      opportunityId: 4,
      appliedDate: "2025-12-05",
      status: "shortlisted",
      score: 90,
      location: "Seattle, WA",
      experience: "2 years",
      education: "MBA, Harvard Business School",
      skills: ["Product Strategy", "Analytics", "Agile", "SQL"],
      resumeUrl: "#",
      avatarColor: "bg-pink-600",
    },
    {
      id: 6,
      candidateName: "David Kim",
      email: "david.k@email.com",
      phone: "+1 (555) 678-9012",
      opportunityTitle: "UI/UX Design Intern",
      opportunityId: 2,
      appliedDate: "2025-12-04",
      status: "rejected",
      score: 72,
      location: "Los Angeles, CA",
      experience: "6 months",
      education: "BA Graphic Design, UCLA",
      skills: ["Photoshop", "Illustrator", "Sketch"],
      resumeUrl: "#",
      avatarColor: "bg-red-600",
    },
  ]);

  const opportunities = [
    { id: 1, title: "Software Engineering Intern" },
    { id: 2, title: "UI/UX Design Intern" },
    { id: 3, title: "Data Science Intern" },
    { id: 4, title: "Product Management Intern" },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    shortlisted: "bg-blue-100 text-blue-700 border-blue-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    interviewing: "bg-purple-100 text-purple-700 border-purple-200",
    hired: "bg-green-100 text-green-700 border-green-200",
  };

  const statusIcons = {
    pending: Clock,
    shortlisted: Star,
    rejected: XCircle,
    interviewing: Users,
    hired: CheckCircle,
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesOpportunity =
      opportunityFilter === "all" ||
      app.opportunityId.toString() === opportunityFilter;

    return matchesSearch && matchesStatus && matchesOpportunity;
  });

  // Handle status change
  const handleStatusChange = (
    applicationId: number,
    newStatus: ApplicationStatus,
  ) => {
    if (newStatus === "shortlisted") {
      // Open quiz assignment modal for shortlisting
      setCurrentApplicationId(applicationId);
      setQuizAssignmentType("single");
      setShowQuizModal(true);
    } else {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );
    }
  };

  // Handle bulk shortlist with quiz
  const handleBulkShortlist = () => {
    setQuizAssignmentType("bulk");
    setShowQuizModal(true);
  };

  // Handle quiz assignment confirmation
  const handleQuizAssignment = (quizId: string, sendImmediately: boolean) => {
    if (quizAssignmentType === "bulk") {
      // Bulk shortlist and assign quiz
      setApplications((prev) =>
        prev.map((app) =>
          selectedApplications.includes(app.id)
            ? { ...app, status: "shortlisted" }
            : app,
        ),
      );
      setSelectedApplications([]);

      // Here you would typically make an API call to assign the quiz
      console.log(
        `Assigned quiz ${quizId} to ${selectedApplications.length} candidates`,
        { sendImmediately },
      );
    } else if (currentApplicationId) {
      // Single shortlist and assign quiz
      setApplications((prev) =>
        prev.map((app) =>
          app.id === currentApplicationId
            ? { ...app, status: "shortlisted" }
            : app,
        ),
      );

      // Here you would typically make an API call to assign the quiz
      console.log(
        `Assigned quiz ${quizId} to application ${currentApplicationId}`,
        { sendImmediately },
      );
    }

    setCurrentApplicationId(null);
  };

  // Handle bulk status change
  const handleBulkStatusChange = (newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        selectedApplications.includes(app.id)
          ? { ...app, status: newStatus }
          : app,
      ),
    );
    setSelectedApplications([]);
  };

  // Toggle selection
  const toggleSelection = (id: number) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id],
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map((app) => app.id));
    }
  };

  // Get status counts
  const statusCounts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    interviewing: applications.filter((a) => a.status === "interviewing")
      .length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    hired: applications.filter((a) => a.status === "hired").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-900">Applications Management</h1>
            <button
              onClick={() => handleBulkStatusChange("shortlisted")}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm flex items-center gap-2"
              disabled={selectedApplications.length === 0}
            >
              <Download className="w-4 h-4" />
              Export Selected
            </button>
          </div>
          <p className="text-gray-600">
            Review and manage candidate applications across all opportunities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {(
            [
              "all",
              "pending",
              "shortlisted",
              "interviewing",
              "hired",
              "rejected",
            ] as const
          ).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`p-4 rounded-xl border-2 transition-all ${
                statusFilter === status
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-blue-200"
              }`}
            >
              <p
                className={`text-2xl font-semibold mb-1 ${
                  statusFilter === status ? "text-blue-600" : "text-gray-900"
                }`}
              >
                {statusCounts[status]}
              </p>
              <p className="text-gray-600 text-xs capitalize">{status}</p>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or opportunity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Opportunity Filter */}
            <div className="relative">
              <select
                value={opportunityFilter}
                onChange={(e) => setOpportunityFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white cursor-pointer"
              >
                <option value="all">All Opportunities</option>
                {opportunities.map((opp) => (
                  <option key={opp.id} value={opp.id}>
                    {opp.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-lg transition-all flex items-center gap-2 ${
                showFilters
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-200 hover:border-blue-200"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Applied
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score Range
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option value="all">All Scores</option>
                  <option value="90-100">90-100 (Excellent)</option>
                  <option value="80-89">80-89 (Good)</option>
                  <option value="70-79">70-79 (Average)</option>
                  <option value="0-69">Below 70</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Filter by location..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedApplications.length > 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <p className="text-blue-900 font-medium">
              {selectedApplications.length} application
              {selectedApplications.length > 1 ? "s" : ""} selected
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkShortlist()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Shortlist
              </button>
              <button
                onClick={() => handleBulkStatusChange("interviewing")}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Schedule Interview
              </button>
              <button
                onClick={() => handleBulkStatusChange("rejected")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => setSelectedApplications([])}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Applications List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={
                  selectedApplications.length === filteredApplications.length &&
                  filteredApplications.length > 0
                }
                onChange={toggleSelectAll}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-600"
              />
              <p className="text-gray-700 font-medium">
                {filteredApplications.length} Application
                {filteredApplications.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Applications */}
          <div className="divide-y divide-gray-100">
            {filteredApplications.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No applications found matching your filters
                </p>
              </div>
            ) : (
              filteredApplications.map((application) => {
                const StatusIcon = statusIcons[application.status];
                return (
                  <div
                    key={application.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      selectedApplications.includes(application.id)
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => toggleSelection(application.id)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-600"
                      />

                      {/* Avatar */}
                      <div
                        className={`w-12 h-12 ${application.avatarColor} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
                      >
                        {application.candidateName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-gray-900 font-semibold mb-1">
                              {application.candidateName}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {application.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {application.phone}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Briefcase className="w-4 h-4" />
                                {application.opportunityTitle}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                {application.location}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                Applied{" "}
                                {new Date(
                                  application.appliedDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Score Badge */}
                          <div className="flex items-center gap-2">
                            <div
                              className={`px-3 py-1 rounded-lg border ${
                                application.score >= 90
                                  ? "bg-green-50 border-green-200 text-green-700"
                                  : application.score >= 80
                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                    : "bg-yellow-50 border-yellow-200 text-yellow-700"
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                <span className="font-semibold">
                                  {application.score}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Skills & Details */}
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {application.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">
                            {application.education} • {application.experience}{" "}
                            experience
                          </p>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${statusColors[application.status]}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {application.status.charAt(0).toUpperCase() +
                                application.status.slice(1)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  application.id,
                                  "shortlisted",
                                )
                              }
                              className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center gap-1"
                              disabled={application.status === "shortlisted"}
                            >
                              <Star className="w-4 h-4" />
                              Shortlist
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  application.id,
                                  "interviewing",
                                )
                              }
                              className="px-3 py-1.5 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <Calendar className="w-4 h-4" />
                              Interview
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(application.id, "rejected")
                              }
                              className="px-3 py-1.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center gap-1"
                              disabled={application.status === "rejected"}
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                            <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              View Profile
                            </button>
                            <a
                              href={application.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Resume
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quiz Assignment Modal */}
      <QuizAssignmentModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        onConfirm={handleQuizAssignment}
        candidateCount={
          quizAssignmentType === "bulk" ? selectedApplications.length : 1
        }
        opportunityTitle={
          quizAssignmentType === "bulk"
            ? undefined
            : applications.find((app) => app.id === currentApplicationId)
                ?.opportunityTitle
        }
      />
    </div>
  );
}
