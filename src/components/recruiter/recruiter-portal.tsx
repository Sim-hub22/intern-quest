"use client";

import {
  Bell,
  Briefcase,
  CheckSquare,
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { ApplicantListV2 } from "./applicant-list";
import { ManageOpportunitiesV2 } from "./manage-opportunities";
import { OpportunityCreationWizard } from "./opportunity-creation-wizard";
import { PostOpportunityV2 } from "./post-opportunity";
import { QuizCreationV2 } from "./quiz-creation";
import { QuizReviewV2 } from "./quiz-review";
import { RecruiterOverview } from "./recruiter-overview";
import { ViewApplications } from "./view-applications";

type RecruiterPage =
  | "dashboard"
  | "post-opportunity"
  | "post-opportunity-wizard"
  | "manage-opportunities"
  | "view-applications"
  | "applicants"
  | "create-quiz"
  | "quiz-review";

interface RecruiterPortalProps {
  onExit?: () => void;
}

export function RecruiterPortal({ onExit }: RecruiterPortalProps) {
  const [currentPage, setCurrentPage] = useState<RecruiterPage>("dashboard");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: "dashboard" as RecruiterPage,
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview & stats",
    },
    {
      id: "post-opportunity-wizard" as RecruiterPage,
      label: "Post Opportunity",
      icon: Briefcase,
      description: "Create new posting",
    },
    {
      id: "manage-opportunities" as RecruiterPage,
      label: "Manage Opportunities",
      icon: ClipboardList,
      description: "View & edit postings",
    },
    {
      id: "view-applications" as RecruiterPage,
      label: "View Applications",
      icon: Users,
      description: "View all applications",
    },
    {
      id: "quiz-review" as RecruiterPage,
      label: "Review Quizzes",
      icon: CheckSquare,
      description: "Grade submissions",
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <RecruiterOverview
            onNavigateToPostOpportunity={() =>
              setCurrentPage("post-opportunity-wizard")
            }
            onNavigateToManageOpportunities={() =>
              setCurrentPage("manage-opportunities")
            }
            onNavigateToApplications={() => setCurrentPage("view-applications")}
            onNavigateToCreateQuiz={() => setCurrentPage("create-quiz")}
          />
        );
      case "post-opportunity":
        return (
          <PostOpportunityV2
            onNavigateBack={() => setCurrentPage("dashboard")}
          />
        );
      case "post-opportunity-wizard":
        return (
          <OpportunityCreationWizard
            onNavigateBack={() => setCurrentPage("dashboard")}
          />
        );
      case "manage-opportunities":
        return (
          <ManageOpportunitiesV2
            onNavigateBack={() => setCurrentPage("dashboard")}
            onNavigateToApplicants={(id) => {
              setSelectedOpportunityId(id);
              setCurrentPage("applicants");
            }}
          />
        );
      case "view-applications":
        return (
          <ViewApplications
            onNavigateBack={() => setCurrentPage("dashboard")}
          />
        );
      case "applicants":
        return (
          <ApplicantListV2
            opportunityId={selectedOpportunityId}
            onNavigateBack={() => setCurrentPage("manage-opportunities")}
          />
        );
      case "create-quiz":
        return (
          <QuizCreationV2 onNavigateBack={() => setCurrentPage("dashboard")} />
        );
      case "quiz-review":
        return (
          <QuizReviewV2 onNavigateBack={() => setCurrentPage("dashboard")} />
        );
      default:
        return (
          <RecruiterOverview
            onNavigateToPostOpportunity={() =>
              setCurrentPage("post-opportunity")
            }
            onNavigateToManageOpportunities={() =>
              setCurrentPage("manage-opportunities")
            }
            onNavigateToApplications={() => setCurrentPage("view-applications")}
            onNavigateToCreateQuiz={() => setCurrentPage("create-quiz")}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          isSidebarOpen ? "w-72" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold">Recruiter</p>
                <p className="text-gray-500 text-xs">Portal</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-600"}`}
                  />
                  {isSidebarOpen && (
                    <div className="text-left">
                      <p
                        className={`font-medium text-sm ${isActive ? "text-white" : "text-gray-900"}`}
                      >
                        {item.label}
                      </p>
                      <p
                        className={`text-xs ${isActive ? "text-blue-100" : "text-gray-500"}`}
                      >
                        {item.description}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && (
              <span className="font-medium text-sm">Exit Portal</span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-3 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold">Recruiter</p>
              <p className="text-gray-500 text-xs">Portal</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`}
                  />
                  <div className="text-left">
                    <p
                      className={`font-medium text-sm ${isActive ? "text-white" : "text-gray-900"}`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-xs ${isActive ? "text-blue-100" : "text-gray-500"}`}
                    >
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onExit?.();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4 lg:ml-0 ml-16">
            <div>
              <h2 className="text-gray-900 font-semibold">
                {navigationItems.find((item) => item.id === currentPage)
                  ?.label || "Dashboard"}
              </h2>
              <p className="text-gray-500 text-xs hidden sm:block">
                {navigationItems.find((item) => item.id === currentPage)
                  ?.description || "Manage your recruitment"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">RC</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="h-[calc(100vh-4rem)]">{renderPage()}</div>
      </main>
    </div>
  );
}
