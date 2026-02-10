import "server-only";

import { auth } from "@/server/auth";
import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

/**
 * Verify user session and redirect to login if not authenticated.
 * Uses React cache to memoize the session check during a render pass.
 *
 * This follows Next.js recommendation to check auth in page components
 * (not layouts) to ensure session is re-checked on every route change.
 *
 * @returns The authenticated session
 * @throws Redirects to /login if no session exists
 */
export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname");
    const loginUrl = pathname
      ? (`/login?callbackUrl=${encodeURIComponent(pathname)}` as Route)
      : "/login";
    redirect(loginUrl);
  }

  return session;
});

const ROLE = {
  ADMIN: "admin",
  RECRUITER: "recruiter",
  CANDIDATE: "candidate",
} as const;

type PlatformRole = (typeof ROLE)[keyof typeof ROLE];

function hasRole(
  session: { user: { role?: string | null } },
  allowed: PlatformRole[],
): boolean {
  const role = session.user?.role as PlatformRole | undefined;
  return role != null && allowed.includes(role);
}

/**
 * Verify session and require recruiter role. Redirects to /dashboard if not a recruiter.
 */
export const verifyRecruiterSession = cache(async () => {
  const session = await verifySession();
  if (!hasRole(session, [ROLE.RECRUITER])) {
    redirect("/dashboard" as Route);
  }
  return session;
});

/**
 * Verify session and require admin role. Redirects to /dashboard if not an admin.
 */
export const verifyAdminSession = cache(async () => {
  const session = await verifySession();
  if (!hasRole(session, [ROLE.ADMIN])) {
    redirect("/dashboard" as Route);
  }
  return session;
});
