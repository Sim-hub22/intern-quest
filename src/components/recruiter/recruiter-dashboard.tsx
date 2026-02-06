import {
  AlertCircle,
  Briefcase,
  Calendar,
  Eye,
  FileText,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

interface RecruiterDashboardV2Props {
  onNavigateToPostOpportunity?: () => void;
  onNavigateToApplications?: () => void;
  onNavigateToCreateQuiz?: () => void;
  onNavigateToManageOpportunities?: () => void;
}

export function RecruiterDashboardV2({
  onNavigateToPostOpportunity,
  onNavigateToApplications,
  onNavigateToCreateQuiz,
  onNavigateToManageOpportunities,
}: RecruiterDashboardV2Props) {
  const summaryCards = [
    {
      label: "Active Opportunities",
      value: "24",
      change: "+4 this week",
      icon: Briefcase,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "New Applications",
      value: "156",
      change: "+23 today",
      icon: Users,
      color: "cyan",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
    },
    {
      label: "Pending Quizzes to Review",
      value: "12",
      change: "3 urgent",
      icon: FileText,
      color: "indigo",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      label: "Upcoming Meetings",
      value: "8",
      change: "2 today",
      icon: Calendar,
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      message: "23 new applicants today",
      time: "Just now",
      type: "info",
      icon: Users,
    },
    {
      id: 2,
      message: "Deadline approaching for UI/UX Design Internship",
      time: "2 hours ago",
      type: "warning",
      icon: AlertCircle,
    },
    {
      id: 3,
      message: "8 candidates completed Frontend Quiz",
      time: "3 hours ago",
      type: "success",
      icon: FileText,
    },
    {
      id: 4,
      message: "Interview scheduled with Sarah Johnson",
      time: "5 hours ago",
      type: "info",
      icon: Calendar,
    },
    {
      id: 5,
      message: "Software Engineering Internship posted successfully",
      time: "1 day ago",
      type: "success",
      icon: Briefcase,
    },
    {
      id: 6,
      message: "15 new quiz submissions require review",
      time: "1 day ago",
      type: "warning",
      icon: FileText,
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: "UI/UX Design Internship",
      deadline: "Dec 15, 2025",
      daysLeft: 7,
      applicants: 45,
    },
    {
      id: 2,
      title: "Frontend Development Internship",
      deadline: "Dec 20, 2025",
      daysLeft: 12,
      applicants: 62,
    },
    {
      id: 3,
      title: "Data Science Internship",
      deadline: "Dec 25, 2025",
      daysLeft: 17,
      applicants: 38,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Recruiter Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with your internship
            postings.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <card.icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-1">{card.value}</h3>
              <p className="text-gray-600 text-sm mb-1">{card.label}</p>
              <p className="text-green-600 text-xs">{card.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onNavigateToPostOpportunity}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Post New Opportunity</p>
                <p className="text-blue-100 text-xs">
                  Create an internship posting
                </p>
              </div>
            </button>
            <button
              onClick={onNavigateToApplications}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all"
            >
              <Eye className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="text-gray-900 font-medium">View Applications</p>
                <p className="text-gray-600 text-xs">
                  Review candidate profiles
                </p>
              </div>
            </button>
            <button
              onClick={onNavigateToCreateQuiz}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition-all"
            >
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="text-gray-900 font-medium">Create Quiz</p>
                <p className="text-gray-600 text-xs">
                  Add assessment questions
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === "warning"
                          ? "bg-yellow-100"
                          : activity.type === "success"
                            ? "bg-green-100"
                            : "bg-blue-100"
                      }`}
                    >
                      <activity.icon
                        className={`w-4 h-4 ${
                          activity.type === "warning"
                            ? "text-yellow-600"
                            : activity.type === "success"
                              ? "text-green-600"
                              : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm">
                        {activity.message}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Upcoming Deadlines</h2>
                <button
                  onClick={onNavigateToManageOpportunities}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900">{deadline.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        deadline.daysLeft <= 7
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {deadline.daysLeft} days left
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {deadline.deadline}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {deadline.applicants} applicants
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
