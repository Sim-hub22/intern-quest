import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export async function AuthGuard({ children }: AuthGuardProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
