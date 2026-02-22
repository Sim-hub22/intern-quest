"use client";

import { useRouter } from "next/navigation";

import { InternshipDetail } from "./internship-detail";
import type { Internship } from "./internship-card";

interface InternshipDetailClientProps {
  internship: Internship & {
    positions: number;
    skills: string[];
  };
}

export function InternshipDetailClient({
  internship,
}: InternshipDetailClientProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return <InternshipDetail internship={internship} onBack={handleBack} />;
}
