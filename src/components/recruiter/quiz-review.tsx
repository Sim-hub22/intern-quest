"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface QuizReviewV2Props {
  onNavigateBack?: () => void;
}

export function QuizReviewV2({ onNavigateBack }: QuizReviewV2Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuiz, setSelectedQuiz] = useState("all");

  const quizAttempts = [
    {
      id: 1,
      candidateName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      quizTitle: "Frontend Development Assessment",
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      timeTaken: "24 minutes",
      submittedDate: "Dec 7, 2025",
      status: "Passed",
      avatar: "SJ",
    },
    {
      id: 2,
      candidateName: "Michael Chen",
      email: "michael.chen@email.com",
      quizTitle: "Frontend Development Assessment",
      score: 92,
      totalQuestions: 20,
      correctAnswers: 18,
      timeTaken: "22 minutes",
      submittedDate: "Dec 7, 2025",
      status: "Passed",
      avatar: "MC",
    },
    {
      id: 3,
      candidateName: "Emily Davis",
      email: "emily.davis@email.com",
      quizTitle: "Data Science Fundamentals",
      score: 78,
      totalQuestions: 15,
      correctAnswers: 12,
      timeTaken: "18 minutes",
      submittedDate: "Dec 6, 2025",
      status: "Passed",
      avatar: "ED",
    },
    {
      id: 4,
      candidateName: "James Wilson",
      email: "james.wilson@email.com",
      quizTitle: "Frontend Development Assessment",
      score: 55,
      totalQuestions: 20,
      correctAnswers: 11,
      timeTaken: "28 minutes",
      submittedDate: "Dec 6, 2025",
      status: "Failed",
      avatar: "JW",
    },
    {
      id: 5,
      candidateName: "Olivia Martinez",
      email: "olivia.martinez@email.com",
      quizTitle: "UI/UX Design Principles",
      score: 88,
      totalQuestions: 18,
      correctAnswers: 16,
      timeTaken: "20 minutes",
      submittedDate: "Dec 5, 2025",
      status: "Passed",
      avatar: "OM",
    },
    {
      id: 6,
      candidateName: "Daniel Brown",
      email: "daniel.brown@email.com",
      quizTitle: "Data Science Fundamentals",
      score: 45,
      totalQuestions: 15,
      correctAnswers: 7,
      timeTaken: "25 minutes",
      submittedDate: "Dec 5, 2025",
      status: "Failed",
      avatar: "DB",
    },
  ];

  const filteredAttempts = quizAttempts.filter((attempt) => {
    const matchesSearch =
      attempt.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attempt.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || attempt.status.toLowerCase() === statusFilter;
    const matchesQuiz =
      selectedQuiz === "all" || attempt.quizTitle === selectedQuiz;
    return matchesSearch && matchesStatus && matchesQuiz;
  });

  const handleViewAnswers = (id: number) => {
    console.log("View full answer review for attempt:", id);
    // Handle view answers
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
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
            ← Back to Dashboard
          </button>
          <h1 className="text-gray-900 mb-2">Quiz Review</h1>
          <p className="text-gray-600">
            Review candidate quiz attempts and performance
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <select
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
            >
              <option value="all">All Quizzes</option>
              <option value="Frontend Development Assessment">
                Frontend Development Assessment
              </option>
              <option value="Data Science Fundamentals">
                Data Science Fundamentals
              </option>
              <option value="UI/UX Design Principles">
                UI/UX Design Principles
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Total Attempts</p>
            <p className="text-gray-900">{quizAttempts.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm mb-1">Passed</p>
            <p className="text-green-900">
              {quizAttempts.filter((a) => a.status === "Passed").length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600 text-sm mb-1">Failed</p>
            <p className="text-red-900">
              {quizAttempts.filter((a) => a.status === "Failed").length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm mb-1">Avg. Score</p>
            <p className="text-blue-900">
              {Math.round(
                quizAttempts.reduce((sum, a) => sum + a.score, 0) /
                  quizAttempts.length,
              )}
              %
            </p>
          </div>
        </div>

        {/* Quiz Attempts Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Candidate
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Quiz
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Score
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Time Taken
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Submitted
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAttempts.map((attempt) => (
                  <tr
                    key={attempt.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-sm">
                            {attempt.avatar}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-900 text-sm">
                            {attempt.candidateName}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {attempt.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 text-sm">
                        {attempt.quizTitle}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${getScoreBgColor(attempt.score)}`}
                      >
                        <span
                          className={`text-lg ${getScoreColor(attempt.score)}`}
                        >
                          {attempt.score}%
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        {attempt.correctAnswers}/{attempt.totalQuestions}{" "}
                        correct
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {attempt.timeTaken}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {attempt.submittedDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          attempt.status === "Passed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {attempt.status === "Passed" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {attempt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewAnswers(attempt.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Answers
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAttempts.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center mt-6">
            <p className="text-gray-600">
              No quiz attempts found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
