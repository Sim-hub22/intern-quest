import { RecruiterOverview } from "@/components/recruiter/recruiter-overview";
import { verifySession } from "@/lib/dal";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardPage />
    </Suspense>
  );
}

async function DashboardPage() {
  await verifySession();

  return <RecruiterOverview />;
}
