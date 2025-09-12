import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_ROUTES, PUBLIC_ROUTES, RBACUtils } from "@/lib/rbac/role-config";
import { UserRole } from "@/lib/types/auth";

interface AuthData {
  user: {
    id: number;
    role: UserRole[];
    email: string;
    name?: string;
  };
  token: string;
  expiresAt: number;
}

// Helper function to get authenticated user data from cookies
function getAuthData(request: NextRequest): AuthData | null {
  try {
    const authToken = request.cookies.get("auth_token")?.value;
    const authUser = request.cookies.get("auth_user")?.value;
    const authExpires = request.cookies.get("auth_expires")?.value;

    if (!authToken || !authUser || !authExpires) {
      return null;
    }

    // Check if token is expired
    const expiresAt = parseInt(authExpires);
    if (Date.now() >= expiresAt) {
      return null;
    }

    // Parse and validate user data
    const user = JSON.parse(authUser);
    if (!user || !user.id || !user.role || !Array.isArray(user.role)) {
      return null;
    }

    return {
      user,
      token: authToken,
      expiresAt,
    };
  } catch (error) {
    console.error("❌ Error parsing auth data in middleware:", error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authData = getAuthData(request);
  const isAuthenticated = !!authData;
  const userRole = authData?.user?.role?.[0] as UserRole;

  console.log(`🛡️ RBAC Middleware: ${pathname}`, {
    authenticated: isAuthenticated,
    role: userRole,
    userId: authData?.user?.id,
  });

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
    console.log(`🔒 Redirecting ${pathname} to login (not authenticated)`);
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const homeRoute = RBACUtils.getHomeRoute(userRole);
    console.log(
      `🏠 Redirecting authenticated user from ${pathname} to ${homeRoute}`,
    );
    return NextResponse.redirect(new URL(homeRoute, request.url));
  }

  // 4. Handle guest users who need onboarding
  if (userRole === "guest") {
    if (!pathname.startsWith("/onboarding") && !pathname.startsWith("/guest")) {
      console.log(`📋 Redirecting guest from ${pathname} to onboarding`);
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.next();
  }

  // 5. Check role-based route access
  if (!RBACUtils.canAccessRoute(userRole, pathname)) {
    const homeRoute = RBACUtils.getHomeRoute(userRole);
    console.log(
      `❌ Access denied: ${userRole} cannot access ${pathname}, redirecting to ${homeRoute}`,
    );

    // Create a 403 response with redirect
    const response = NextResponse.redirect(new URL(homeRoute, request.url));
    response.headers.set("X-Middleware-Error", "RBAC_ACCESS_DENIED");
    response.headers.set("X-User-Role", userRole);
    response.headers.set("X-Attempted-Route", pathname);

    return response;
  }

  // 6. Allow access - user has proper role permissions
  const response = NextResponse.next();
  response.headers.set("X-User-Role", userRole);
  response.headers.set("X-User-ID", authData.user.id.toString());

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/guest/:path*",
    "/guardian/:path*",
    "/teacher/:path*",
    "/auth/:path*",
    "/onboarding/:path*",
  ],
};
