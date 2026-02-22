"use client";

import { authClient } from "@/lib/auth-client";
import { trpcClient } from "@/lib/trpc";
import {
  Calendar,
  Clock,
  X as CloseIcon,
  Edit,
  MapPin,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ManageOpportunitiesV2Props {
  onNavigateBack?: () => void;
  onNavigateToApplicants?: (opportunityId: string) => void;
}

type Opportunity = {
  id: string;
  title: string;
  category: string;
  location: string | null;
  mode: "onsite" | "remote" | "hybrid";
  type: "internship" | "fellowship" | "volunteer";
  duration: string | null;
  deadline: string;
  createdAt: string;
  status: "draft" | "published" | "closed" | "archived";
  _count?: { applications: number };
};

export function ManageOpportunitiesV2({
  onNavigateBack,
  onNavigateToApplicants,
}: ManageOpportunitiesV2Props) {
  const { data: session } = authClient.useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch opportunities on mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchOpportunities();
    }
  }, [session?.user?.id]);

  const fetchOpportunities = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      const result = await trpcClient.opportunity.listByRecruiter.query({
        recruiterId: session.user.id,
        limit: 100, // Get all for now, we'll implement pagination later
      });
      setOpportunities(result.opportunities);
    } catch (error) {
      toast.error("Failed to load opportunities");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || opportunity.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || opportunity.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (id: string) => {
    console.log("Edit opportunity:", id);
    // TODO: Navigate to edit page or open modal
  };

  const handleClose = async (id: string) => {
    if (window.confirm("Are you sure you want to close this opportunity?")) {
      try {
        await trpcClient.opportunity.updateStatus.mutate({
          id,
          status: "closed",
        });
        toast.success("Opportunity closed successfully");
        fetchOpportunities(); // Refresh the list
      } catch (error) {
        toast.error("Failed to close opportunity");
        console.error(error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this opportunity? This action cannot be undone.",
      )
    ) {
      try {
        await trpcClient.opportunity.delete.mutate({ id });
        toast.success("Opportunity deleted successfully");
        fetchOpportunities(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete opportunity");
        console.error(error);
      }
    }
  };

  const getStatusColor = (status: "draft" | "published" | "closed" | "archived") => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      case "archived":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading opportunities...</div>
      </div>
    );
  }

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
          <h1 className="text-gray-900 mb-2">Manage Opportunities</h1>
          <p className="text-gray-600">
            View and manage all your internship postings
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Data Science">Data Science</option>
              <option value="Business">Business</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
            >
              <option value="all">All Dates</option>
              <option value="today">Posted Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Total</p>
            <p className="text-gray-900">{opportunities.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm mb-1">Published</p>
            <p className="text-green-900">
              {opportunities.filter((o) => o.status === "published").length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Draft</p>
            <p className="text-gray-900">
              {opportunities.filter((o) => o.status === "draft").length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600 text-sm mb-1">Closed</p>
            <p className="text-red-900">
              {opportunities.filter((o) => o.status === "closed").length}
            </p>
          </div>
        </div>

        {/* Opportunities Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Opportunity
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Applications
                  </th>
                  <th className="text-left px-6 py-4 text-gray-700 text-sm">
                    Deadline
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
                {filteredOpportunities.map((opportunity) => (
                  <tr
                    key={opportunity.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                        <div>
                        <button
                          onClick={() =>
                            onNavigateToApplicants?.(opportunity.id)
                          }
                          className="text-gray-900 hover:text-blue-600"
                        >
                          {opportunity.title}
                        </button>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {opportunity.duration || "Not specified"}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs capitalize">
                            {opportunity.mode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {opportunity.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {opportunity.location || "Not specified"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {opportunity._count?.applications || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(opportunity.deadline).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusColor(opportunity.status)}`}
                      >
                        {opportunity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(opportunity.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleClose(opportunity.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Close Posting"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(opportunity.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center mt-6">
            <p className="text-gray-600">
              No opportunities found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
