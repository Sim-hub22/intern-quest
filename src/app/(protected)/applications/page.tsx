import { connection } from "next/server";
import Link from "next/link";

import { verifySession } from "@/lib/dal";
import { createContext } from "@/server/api/context";
import { appRouter } from "@/server/api/root";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { WithdrawButton } from "./withdraw-button";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  // Use connection() to opt-out of caching
  await connection();

  // Verify session
  const session = await verifySession();

  const { status } = await searchParams;

  // Create tRPC context and caller - pass the verified session
  const ctx = await createContext({ session });
  const caller = appRouter.createCaller(ctx);

  // Fetch applications based on status filter
  const applications = await caller.application.listByCandidate({
    status: status as
      | "pending"
      | "reviewing"
      | "shortlisted"
      | "accepted"
      | "rejected"
      | "withdrawn"
      | undefined,
    limit: 50,
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
        icon: React.ComponentType<{ className?: string }>;
      }
    > = {
      pending: {
        variant: "secondary",
        label: "Pending",
        icon: Clock,
      },
      reviewing: {
        variant: "default",
        label: "Under Review",
        icon: AlertCircle,
      },
      shortlisted: {
        variant: "default",
        label: "Shortlisted",
        icon: TrendingUp,
      },
      accepted: {
        variant: "default",
        label: "Accepted",
        icon: CheckCircle2,
      },
      rejected: {
        variant: "destructive",
        label: "Rejected",
        icon: XCircle,
      },
      withdrawn: {
        variant: "outline",
        label: "Withdrawn",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="capitalize flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Calculate stats for tabs
  const stats = {
    all: applications.total,
    pending: applications.applications.filter((a) => a.status === "pending")
      .length,
    reviewing: applications.applications.filter((a) => a.status === "reviewing")
      .length,
    shortlisted: applications.applications.filter(
      (a) => a.status === "shortlisted",
    ).length,
    accepted: applications.applications.filter((a) => a.status === "accepted")
      .length,
    rejected: applications.applications.filter((a) => a.status === "rejected")
      .length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">
          Track and manage all your internship applications
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.all}</div>
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

      {/* Applications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>
                {applications.total} application
                {applications.total !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {applications.applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No applications found</p>
              <p className="text-sm">
                {status
                  ? `No applications with status "${status}"`
                  : "Start applying to internships to see them here"}
              </p>
              <Link href="/internships">
                <Button className="mt-4">Browse Internships</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.applications.map((application) => {
                // Skip if opportunity data is missing
                if (!application.opportunity) return null;

                const opportunity = application.opportunity;
                const canWithdraw =
                  application.status !== "withdrawn" &&
                  application.status !== "accepted" &&
                  application.status !== "rejected";

                return (
                  <div
                    key={application.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <Link
                              href={`/internships/${opportunity.id}` as any}
                              className="hover:underline"
                            >
                              <h3 className="font-semibold text-lg text-gray-900">
                                {opportunity.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                <span className="capitalize">
                                  {opportunity.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span className="capitalize">
                                  {opportunity.mode}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Applied{" "}
                                  {new Date(
                                    application.appliedAt,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        {getStatusBadge(application.status)}
                        <div className="flex gap-2">
                          <Link
                            href={`/internships/${opportunity.id}` as any}
                          >
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          {canWithdraw && (
                            <WithdrawButton applicationId={application.id} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {application.coverLetter && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Cover Letter
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
