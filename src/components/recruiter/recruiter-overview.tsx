"use client";

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
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RecruiterOverviewProps {
  onNavigateToPostOpportunity?: () => void;
  onNavigateToManageOpportunities?: () => void;
  onNavigateToApplications?: () => void;
  onNavigateToCreateQuiz?: () => void;
}

export function RecruiterOverview({
  onNavigateToPostOpportunity,
  onNavigateToManageOpportunities,
  onNavigateToApplications,
  onNavigateToCreateQuiz,
}: RecruiterOverviewProps = {}) {
  const summaryCards = [
    {
      label: "Active Opportunities",
      value: "24",
      change: "+4 this week",
      trend: "+18%",
      icon: Briefcase,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      trendPositive: true,
    },
    {
      label: "Total Applications",
      value: "156",
      change: "+23 today",
      trend: "+12%",
      icon: Users,
      bgColor: "bg-chart-1/15",
      iconColor: "text-chart-1",
      trendPositive: true,
    },
    {
      label: "Pending Reviews",
      value: "12",
      change: "3 urgent",
      trend: "-8%",
      icon: FileText,
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      trendPositive: false,
    },
    {
      label: "Scheduled Interviews",
      value: "8",
      change: "2 today",
      trend: "+5%",
      icon: Calendar,
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <Card
              key={index}
              className="transition-all hover:shadow-md hover:ring-primary/20"
            >
              <CardContent className="pt-0">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <Badge
                    variant={card.trendPositive ? "secondary" : "destructive"}
                    className="gap-1"
                  >
                    <TrendingUp
                      className={`w-3 h-3 ${card.trendPositive ? "" : "rotate-180"}`}
                    />
                    {card.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-foreground">{card.value}</h3>
                  <p className="text-muted-foreground text-sm">{card.label}</p>
                  <p className="text-muted-foreground text-xs">{card.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {onNavigateToPostOpportunity ? (
                <Button
                  onClick={onNavigateToPostOpportunity}
                  className="h-auto flex-col items-start gap-4 p-5 group"
                >
                  <div className="flex w-full items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/20">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="mb-1 font-semibold">Post Opportunity</p>
                      <p className="text-xs text-primary-foreground/80">
                        Create new internship listing
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-auto flex-col items-start gap-4 p-5 group"
                >
                  <Link href="/post-opportunity">
                    <div className="flex w-full items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/20">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="mb-1 font-semibold">Post Opportunity</p>
                        <p className="text-xs text-primary-foreground/80">
                          Create new internship listing
                        </p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>
                </Button>
              )}

              {onNavigateToApplications ? (
                <Button
                  variant="outline"
                  onClick={onNavigateToApplications}
                  className="h-auto flex-col items-start gap-4 p-5 group"
                >
                  <div className="flex w-full items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="mb-1 font-semibold text-foreground">
                        View Applications
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Review all candidates
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="h-auto flex-col items-start gap-4 p-5 group"
                >
                  <Link href="/view-applications">
                    <div className="flex w-full items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="mb-1 font-semibold text-foreground">
                          View Applications
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Review all candidates
                        </p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>
                </Button>
              )}

              {onNavigateToCreateQuiz ? (
                <Button
                  variant="outline"
                  onClick={onNavigateToCreateQuiz}
                  className="h-auto flex-col items-start gap-4 p-5 group"
                >
                  <div className="flex w-full items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="mb-1 font-semibold text-foreground">
                        Create Assessment
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Build custom quizzes
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="h-auto flex-col items-start gap-4 p-5 group"
                >
                  <Link href="/quiz-review">
                    <div className="flex w-full items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="mb-1 font-semibold text-foreground">
                          Create Assessment
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Build custom quizzes
                        </p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity Feed */}
            <Card className="pb-0">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <span className="text-xs text-muted-foreground">
                  Last 24 hours
                </span>
              </CardHeader>
              <CardContent className="p-0">
                {recentActivity.map((activity) => (
                  <div key={activity.id}>
                    <div className="p-6 transition-colors hover:bg-muted/50 border-t">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                            activity.type === "warning"
                              ? "bg-amber-500/10"
                              : activity.type === "success"
                                ? "bg-emerald-500/10"
                                : "bg-primary/10"
                          }`}
                        >
                          <activity.icon
                            className={`h-5 w-5 ${
                              activity.type === "warning"
                                ? "text-amber-600 dark:text-amber-400"
                                : activity.type === "success"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-primary"
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="mb-1 text-sm font-medium text-foreground">
                            {activity.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.message}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground/60" />
                            <p className="text-xs text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Performing Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingOpportunities.map((opp, index) => (
                    <div key={opp.id} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-semibold text-sm text-primary-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {opp.title}
                        </p>
                        <div className="mt-1 flex items-center gap-4">
                          <span className="text-xs text-muted-foreground">
                            {opp.views} views
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {opp.applications} applications
                          </span>
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {opp.conversion} conversion
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardAction>
                  {onNavigateToManageOpportunities ? (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={onNavigateToManageOpportunities}
                    >
                      View All
                    </Button>
                  ) : (
                    <Button variant="link" size="sm" asChild>
                      <Link href="/manage-opportunities">View All</Link>
                    </Button>
                  )}
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className={`rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                      deadline.status === "urgent"
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="pr-2 text-sm font-medium text-foreground">
                        {deadline.title}
                      </h3>
                      <Badge
                        variant={
                          deadline.status === "urgent"
                            ? "destructive"
                            : "secondary"
                        }
                        className="shrink-0"
                      >
                        {deadline.daysLeft}d left
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{deadline.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{deadline.applicants} applicants</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 bg-primary text-primary-foreground ring-0">
              <CardContent className="pt-0">
                <h3 className="mb-4 font-semibold">This Month</h3>
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-sm text-primary-foreground/80">
                      Total Hired
                    </p>
                    <p className="font-semibold">18 Candidates</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-primary-foreground/80">
                      Avg. Time to Hire
                    </p>
                    <p className="font-semibold">14 Days</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-primary-foreground/80">
                      Success Rate
                    </p>
                    <p className="font-semibold">87%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
