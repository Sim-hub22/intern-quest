import { connection } from "next/server";
import { notFound } from "next/navigation";

import { InternshipDetailClient } from "@/components/internship-detail-client";
import { createContext } from "@/server/api/context";
import { appRouter } from "@/server/api/root";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate at least one static path for Cache Components mode
// In production, this should fetch real IDs from the database
export async function generateStaticParams() {
  return [
    { id: "00000000-0000-0000-0000-000000000000" }, // Dummy UUID for build
  ];
}

export default async function InternshipDetailPage({ params }: PageProps) {
  // Use connection() to opt-out of caching for this page
  await connection();
  
  const { id } = await params;

  // Create tRPC context and caller for server-side data fetching
  // No session needed for public opportunity data
  const ctx = await createContext({});
  const caller = appRouter.createCaller(ctx);

  let opportunityData;
  try {
    opportunityData = await caller.opportunity.getById({ id });
  } catch (error) {
    // If opportunity not found or not public, show 404
    return notFound();
  }

  // Map database fields to InternshipDetail component format
  const internship = {
    id: opportunityData.id,
    title: opportunityData.title,
    company: "Company Name", // TODO: Will come from recruiter profile in future
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop", // TODO: Company logo from profile
    location: opportunityData.location ?? "Remote",
    type: opportunityData.mode, // "remote" | "onsite" | "hybrid"
    employmentType: opportunityData.type, // "internship" | "fellowship" | "volunteer"
    salary: opportunityData.stipend
      ? `NPR ${opportunityData.stipend.toLocaleString()}/month`
      : "Unpaid",
    duration: opportunityData.duration ?? "Not specified",
    category: opportunityData.category,
    postedDate: new Date(opportunityData.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    deadline: new Date(opportunityData.deadline).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    description: opportunityData.description,
    requirements:
      opportunityData.skills && opportunityData.skills.length > 0
        ? opportunityData.skills.map((skill: string) => `Proficiency in ${skill}`)
        : ["No specific requirements listed"],
    responsibilities: [
      "Responsibilities will be discussed during the interview process",
    ], // TODO: Add responsibilities field to schema in future
    positions: opportunityData.positions,
    skills: opportunityData.skills ?? [],
  };

  return <InternshipDetailClient internship={internship} />;
}
