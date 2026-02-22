import type { NextRequest } from "next/server";

import { auth } from "@/server/auth";

interface CreateContextOptions {
  req?: NextRequest;
  session?: Awaited<ReturnType<typeof auth.api.getSession>>;
}

export async function createContext(
  options: NextRequest | CreateContextOptions,
) {
  // Support both old signature (NextRequest) and new signature (options object)
  if ("headers" in options && !("req" in options)) {
    // Old signature: NextRequest directly
    const session = await auth.api.getSession({
      headers: options.headers,
    });
    return { session };
  }

  // New signature: options object
  const { req, session: providedSession } = options as CreateContextOptions;

  if (providedSession) {
    // Use provided session (for server components)
    return { session: providedSession };
  }

  if (req) {
    // Fetch session from request
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    return { session };
  }

  // No session available
  return { session: null };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
