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
  const debug = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEBUG_AUTH === "true";
  
  if (debug) {
    const authToken = request.cookies.get(AUTH_TOKEN_COOKIE);
    const authExpires = request.cookies.get(AUTH_EXPIRES_COOKIE);
    const tokenPresent = !!authToken?.value;
    const expiresPresent = !!authExpires?.value;
    const expiresAt = expiresPresent ? parseInt(authExpires.value) : null;
    const isExpired = expiresAt ? Date.now() >= expiresAt : null;
    const redirectTarget = !isAuthenticated ? "/auth/login" : pathname;
    
    console.log(`RBAC Middleware: ${pathname}`, {
      authenticated: isAuthenticated,
      tokenPresent,
      expiresPresent,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      isExpired,
      redirectTarget,
      requestUrl: request.url,
    });
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

  // 3. Redirect authenticated users away from auth pages (except set-role)
  // Note: This block is commented out since the matcher excludes /auth/* paths.
  // If you want middleware to handle /auth routing, update config.matcher to include /auth/* paths explicitly.
  // if (AUTH_ROUTES.some((route) => pathname.startsWith(route)) && !pathname.startsWith("/auth/set-role")) {
  //   // Redirect to a default route - client will handle role-based routing after hydration
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // 4. Allow access - fine-grained RBAC is handled client-side after session hydration
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth|public).*)',
  ],
};
