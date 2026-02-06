import {
  AlertCircle,
  ArrowUpRight,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

interface RecruiterOverviewProps {
  onNavigateToPostOpportunity?: () => void;
  onNavigateToApplications?: () => void;
  onNavigateToCreateQuiz?: () => void;
  onNavigateToManageOpportunities?: () => void;
}

export function RecruiterOverview({
  onNavigateToPostOpportunity,
  onNavigateToApplications,
  onNavigateToCreateQuiz,
  onNavigateToManageOpportunities,
}: RecruiterOverviewProps) {
  const summaryCards = [
    {
      label: "Active Opportunities",
      value: "24",
      change: "+4 this week",
      trend: "+18%",
      icon: Briefcase,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      trendPositive: true,
    },
    {
      label: "Total Applications",
      value: "156",
      change: "+23 today",
      trend: "+12%",
      icon: Users,
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
      trendPositive: true,
    },
    {
      label: "Pending Reviews",
      value: "12",
      change: "3 urgent",
      trend: "-8%",
      icon: FileText,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      trendPositive: false,
    },
    {
      label: "Scheduled Interviews",
      value: "8",
      change: "2 today",
      trend: "+5%",
      icon: Calendar,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      trendPositive: true,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      title: "New Applications",
      message: "23 candidates applied for Software Engineering role",
      time: "5 minutes ago",
      type: "info",
      icon: Users,
    },
    {
      id: 2,
      title: "Deadline Alert",
      message: "UI/UX Design Internship closing in 7 days",
      time: "2 hours ago",
      type: "warning",
      icon: AlertCircle,
    },
    {
      id: 3,
      title: "Quiz Completed",
      message: "8 candidates finished Frontend Development assessment",
      time: "3 hours ago",
      type: "success",
      icon: CheckCircle,
    },
    {
      id: 4,
      title: "Interview Scheduled",
      message: "Sarah Johnson - Software Engineering position",
      time: "5 hours ago",
      type: "info",
      icon: Calendar,
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: "UI/UX Design Internship",
      deadline: "Dec 15, 2025",
      daysLeft: 7,
      applicants: 45,
      status: "urgent",
    },
    {
      id: 2,
      title: "Frontend Development Internship",
      deadline: "Dec 20, 2025",
      daysLeft: 12,
      applicants: 62,
      status: "normal",
    },
    {
      id: 3,
      title: "Data Science Internship",
      deadline: "Dec 25, 2025",
      daysLeft: 17,
      applicants: 38,
      status: "normal",
    },
  ];

  const topPerformingOpportunities = [
    {
      id: 1,
      title: "Software Engineering Intern",
      views: 1234,
      applications: 62,
      conversion: "5.0%",
    },
    {
      id: 2,
      title: "Product Management Intern",
      views: 987,
      applications: 45,
      conversion: "4.6%",
    },
    {
      id: 3,
      title: "Data Science Intern",
      views: 856,
      applications: 38,
      conversion: "4.4%",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">
            Track your recruitment performance and manage active opportunities
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-blue-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    card.trendPositive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <TrendingUp
                    className={`w-3 h-3 ${card.trendPositive ? "" : "rotate-180"}`}
                  />
                  {card.trend}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-gray-900">{card.value}</h3>
                <p className="text-gray-600 text-sm">{card.label}</p>
                <p className="text-gray-500 text-xs">{card.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Quick Actions</h2>
            <p className="text-gray-500 text-sm">
              Get started with common tasks
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onNavigateToPostOpportunity}
              className="group flex items-center gap-4 p-5 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold mb-1">Post Opportunity</p>
                <p className="text-blue-100 text-xs">
                  Create new internship listing
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={onNavigateToApplications}
              className="group flex items-center gap-4 p-5 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-md transition-all bg-white"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left flex-1">
                <p className="text-gray-900 font-semibold mb-1">
                  View Applications
                </p>
                <p className="text-gray-600 text-xs">Review all candidates</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={onNavigateToCreateQuiz}
              className="group flex items-center gap-4 p-5 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-md transition-all bg-white"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left flex-1">
                <p className="text-gray-900 font-semibold mb-1">
                  Create Assessment
                </p>
                <p className="text-gray-600 text-xs">Build custom quizzes</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity Feed */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-900">Recent Activity</h2>
                  <span className="text-xs text-gray-500">Last 24 hours</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          activity.type === "warning"
                            ? "bg-yellow-100"
                            : activity.type === "success"
                              ? "bg-green-100"
                              : "bg-blue-100"
                        }`}
                      >
                        <activity.icon
                          className={`w-5 h-5 ${
                            activity.type === "warning"
                              ? "text-yellow-600"
                              : activity.type === "success"
                                ? "text-green-600"
                                : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium text-sm mb-1">
                          {activity.title}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {activity.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <p className="text-gray-500 text-xs">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Opportunities */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-gray-900">Top Performing Opportunities</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topPerformingOpportunities.map((opp, index) => (
                    <div key={opp.id} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium text-sm">
                          {opp.title}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-gray-600 text-xs">
                            {opp.views} views
                          </span>
                          <span className="text-gray-600 text-xs">
                            {opp.applications} applications
                          </span>
                          <span className="text-green-600 text-xs font-medium">
                            {opp.conversion} conversion
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-900">Upcoming Deadlines</h2>
                  <button
                    onClick={onNavigateToManageOpportunities}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      deadline.status === "urgent"
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-gray-900 font-medium text-sm pr-2">
                        {deadline.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          deadline.status === "urgent"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {deadline.daysLeft}d left
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{deadline.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{deadline.applicants} applicants</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-semibold mb-4">This Month</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Hired</p>
                  <p className="font-semibold">18 Candidates</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">
                    Avg. Time to Hire
                  </p>
                  <p className="font-semibold">14 Days</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Success Rate</p>
                  <p className="font-semibold">87%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
