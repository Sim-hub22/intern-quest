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
