import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];
const PROTECTED_PREFIX = "/dashboard";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const isAuthPath = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isProtected = pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`);

  if (sessionCookie && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!sessionCookie && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/login/:path*",
    "/signup",
    "/signup/:path*",
    "/forgot-password",
    "/forgot-password/:path*",
  ],
};
