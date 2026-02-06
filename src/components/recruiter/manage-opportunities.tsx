"use client";

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
import { useState } from "react";

interface ManageOpportunitiesV2Props {
  onNavigateBack?: () => void;
  onNavigateToApplicants?: (opportunityId: number) => void;
}

export function ManageOpportunitiesV2({
  onNavigateBack,
  onNavigateToApplicants,
}: ManageOpportunitiesV2Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const opportunities = [
    {
      id: 1,
      title: "Software Engineering Intern",
      category: "Software Engineering",
      location: "San Francisco, CA",
      type: "On-site",
      duration: "3 months",
      applications: 45,
      deadline: "Dec 15, 2025",
      postedDate: "Nov 20, 2025",
      status: "Open",
    },
    {
      id: 2,
      title: "UI/UX Design Intern",
      category: "Design",
      location: "Remote",
      type: "Remote",
      duration: "4 months",
      applications: 62,
      deadline: "Dec 20, 2025",
      postedDate: "Nov 22, 2025",
      status: "Open",
    },
    {
      id: 3,
      title: "Data Science Intern",
      category: "Data Science",
      location: "New York, NY",
      type: "Hybrid",
      duration: "6 months",
      applications: 38,
      deadline: "Dec 25, 2025",
      postedDate: "Nov 25, 2025",
      status: "Open",
    },
    {
      id: 4,
      title: "Marketing Intern",
      category: "Marketing",
      location: "Austin, TX",
      type: "On-site",
      duration: "3 months",
      applications: 28,
      deadline: "Dec 5, 2025",
      postedDate: "Oct 15, 2025",
      status: "Deadline Passed",
    },
    {
      id: 5,
      title: "Frontend Developer Intern",
      category: "Software Engineering",
      location: "Seattle, WA",
      type: "Remote",
      duration: "5 months",
      applications: 51,
      deadline: "Nov 30, 2025",
      postedDate: "Oct 20, 2025",
      status: "Closed",
    },
  ];

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

  const handleEdit = (id: number) => {
    console.log("Edit opportunity:", id);
    // Handle edit
  };

  const handleClose = (id: number) => {
    if (window.confirm("Are you sure you want to close this opportunity?")) {
      console.log("Close opportunity:", id);
      // Handle close
    }
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this opportunity? This action cannot be undone.",
      )
    ) {
      console.log("Delete opportunity:", id);
      // Handle delete
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-700";
      case "Closed":
        return "bg-gray-100 text-gray-700";
      case "Deadline Passed":
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
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Deadline Passed">Deadline Passed</option>
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
            <p className="text-green-600 text-sm mb-1">Open</p>
            <p className="text-green-900">
              {opportunities.filter((o) => o.status === "Open").length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Closed</p>
            <p className="text-gray-900">
              {opportunities.filter((o) => o.status === "Closed").length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600 text-sm mb-1">Deadline Passed</p>
            <p className="text-red-900">
              {
                opportunities.filter((o) => o.status === "Deadline Passed")
                  .length
              }
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
                            {opportunity.duration}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                            {opportunity.type}
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
                        {opportunity.location}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {opportunity.applications}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {opportunity.deadline}
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
