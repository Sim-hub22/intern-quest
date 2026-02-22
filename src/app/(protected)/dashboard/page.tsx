import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { verifySession } from "@/lib/dal";
import { createContext } from "@/server/api/context";
import { appRouter } from "@/server/api/root";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
  XCircle,
} from "lucide-react";

export default async function CandidateDashboardPage() {
  // Use connection() to opt-out of caching for this page
  await connection();
  
  // Verify session
  const session = await verifySession();

  // Redirect recruiters to their dashboard
  if (session.user.role === "recruiter") {
    redirect("/recruiter/dashboard");
  }

  // Redirect admins to their dashboard
  if (session.user.role === "admin") {
    redirect("/admin" as any);
  }

  // Fetch candidate data via tRPC - pass the verified session
  const ctx = await createContext({ session });
  const caller = appRouter.createCaller(ctx);

  // Fetch applications - handle errors gracefully
  let applications;
  try {
    applications = await caller.application.listByCandidate({
      limit: 10,
    });
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    applications = {
      applications: [],
      total: 0,
    };
  }

  // Fetch recommended opportunities - handle errors gracefully
  let opportunities;
  try {
    opportunities = await caller.opportunity.list({
      limit: 6,
    });
  } catch (error) {
    // If opportunity list fails, return empty result
    console.error("Failed to fetch opportunities:", error);
    opportunities = {
      opportunities: [],
      total: 0,
    };
  }

  // Calculate statistics
  const stats = {
    total: applications.total,
    pending: applications.applications.filter((a) => a.status === "pending")
      .length,
    shortlisted: applications.applications.filter(
      (a) => a.status === "shortlisted",
    ).length,
    accepted: applications.applications.filter((a) => a.status === "accepted")
      .length,
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { variant: "default" | "secondary" | "destructive"; label: string }
    > = {
      pending: { variant: "secondary", label: "Pending" },
      reviewing: { variant: "default", label: "Under Review" },
      shortlisted: { variant: "default", label: "Shortlisted" },
      accepted: { variant: "default", label: "Accepted" },
      rejected: { variant: "destructive", label: "Rejected" },
      withdrawn: { variant: "secondary", label: "Withdrawn" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {session.user.name || session.user.email}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shortlisted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accepted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
            <Link href={"/applications" as any}>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {applications.applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No applications yet</p>
              <p className="text-sm">
                Start applying to internships to see them here
              </p>
              <Link href="/internships">
                <Button className="mt-4">Browse Internships</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.applications.slice(0, 5).map((application) => {
                // Skip if opportunity data is missing
                if (!application.opportunity) return null;

                return (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {application.opportunity.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Applied{" "}
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(application.status)}
                      <Link
                        href={
                          `/internships/${application.opportunity.id}` as any
                        }
                      >
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Opportunities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recommended Opportunities</CardTitle>
            <Link href="/internships">
              <Button variant="outline" size="sm">
                Browse All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.opportunities.map((opp) => (
              <Link
                key={opp.id}
                href={`/internships/${opp.id}` as any}
                className="block"
              >
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">
                    {opp.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span className="capitalize">{opp.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Deadline:{" "}
                        {new Date(opp.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge variant="secondary" className="capitalize">
                      {opp.category}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
