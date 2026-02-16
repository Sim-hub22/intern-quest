import { getSessionCookie } from "better-auth/cookies";
import { Route } from "next";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/recruiter/dashboard",
  "/recruiter/manage-opportunities",
  "/recruiter/post-opportunity",
  "/recruiter/post-opportunity",
  "/recruiter/quiz-review",
  "/recruiter/view-applications",
] as const satisfies Route[];

const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
] as const satisfies Route[];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
