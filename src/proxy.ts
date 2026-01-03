import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/settings"];
const authRoutes = [
  "/login",
  "/signup",
  "/verify-email",
  "/reset-password",
  "/forgot-password",
];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.session.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to / if the user is authenticated
  if (isAuthRoute && session?.session.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
