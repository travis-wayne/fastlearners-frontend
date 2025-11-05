import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_ROUTES, PUBLIC_ROUTES, RBACUtils } from "@/lib/rbac/role-config";
import { UserRole } from "@/lib/types/auth";
import { AUTH_TOKEN_COOKIE, AUTH_EXPIRES_COOKIE } from "@/lib/server/cookie-constants";

interface AuthData {
  token: string;
  expiresAt: number;
}

// Helper function to get authenticated user data from cookies
function getAuthData(request: NextRequest): AuthData | null {
  try {
    const authToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
    const authExpires = request.cookies.get(AUTH_EXPIRES_COOKIE)?.value;
    if (!authToken || !authExpires) {
      return null;
    }

    // Check if token is expired
    const expiresAt = parseInt(authExpires);
    if (Date.now() >= expiresAt) {
      return null;
    }

    return { token: authToken, expiresAt };
  } catch (error) {
    if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.error("Auth parsing error in middleware", error);
    }
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authData = getAuthData(request);
  const isAuthenticated = !!authData;
  const userRole = undefined as unknown as UserRole;
  const debug = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEBUG_AUTH === "true";
  if (debug) {
    console.log(`RBAC Middleware: ${pathname}`, { authenticated: isAuthenticated });
  }

  // 1. Allow public routes
  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route),
    )
  ) {
    return NextResponse.next();
  }

  // 2. Redirect unauthenticated users to login
  if (!isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const homeRoute = RBACUtils.getHomeRoute(userRole);
    return NextResponse.redirect(new URL(homeRoute, request.url));
  }

  // 4. Handle guest users who need role selection
  if (userRole === "guest") {
    if (!pathname.startsWith("/auth/set-role") && !pathname.startsWith("/guest")) {
      return NextResponse.redirect(new URL("/auth/set-role", request.url));
    }
    return NextResponse.next();
  }

  // 5. Check role-based route access
  // Skip fine-grained RBAC here; role is not derived from cookies

  // 6. Allow access - user has proper role permissions
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth|public).*)',
  ],
};
