import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to check if user is authenticated from cookies
function isAuthenticated(request: NextRequest): boolean {
  try {
    const authToken = request.cookies.get('auth_token')?.value;
    const authUser = request.cookies.get('auth_user')?.value;
    const authExpires = request.cookies.get('auth_expires')?.value;
    
    if (!authToken || !authUser || !authExpires) {
      return false;
    }
    
    // Check if token is expired
    const expiresAt = parseInt(authExpires);
    if (Date.now() >= expiresAt) {
      return false;
    }
    
    // Validate user data
    const user = JSON.parse(authUser);
    return !!(user && user.id && user.role);
  } catch (error) {
    console.error('Error checking auth cookies in middleware:', error);
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = isAuthenticated(request);
  
  console.log(`Middleware: ${pathname}, authenticated: ${authenticated}`);

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/billing', '/settings', '/admin', '/guest', '/parent'];
  const authRoutes = ['/auth/login', '/auth/register'];
  const onboardingRoutes = ['/onboarding'];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isOnboardingRoute = onboardingRoutes.some(route => pathname.startsWith(route));

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !authenticated) {
    console.log(`Middleware: Redirecting ${pathname} to login (not authenticated)`);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect authenticated users away from auth pages (unless it's during registration flow)
  if (isAuthRoute && authenticated && !pathname.includes('verify') && !pathname.includes('create-password')) {
    console.log(`Middleware: Redirecting ${pathname} to guest (already authenticated)`);
    return NextResponse.redirect(new URL('/guest', request.url));
  }

  // Allow onboarding routes for authenticated users only
  if (isOnboardingRoute && !authenticated) {
    console.log(`Middleware: Redirecting ${pathname} to login (onboarding requires auth)`);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/guest/:path*',
    '/parent/:path*',
    '/auth/:path*',
    '/onboarding/:path*',
  ],
};
