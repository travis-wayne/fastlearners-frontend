"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRoleBasedRoute, useAuthStore } from "@/store/authStore";

import { UserRole } from "@/lib/types/auth";
import { useAuthInit } from "@/hooks/useAuthInit";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requireCompleteProfile?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  requireCompleteProfile = false,
  redirectTo,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isProfileComplete } = useAuthStore();
  const { isInitialized, isLoading } = useAuthInit();

  useEffect(() => {
    console.log("ProtectedRoute - Auth state check:", {
      isLoading,
      isInitialized,
      isAuthenticated,
      user: user ? { id: user.id, role: user.role, name: user.name } : null,
      requiredRoles,
      requireCompleteProfile,
      currentPath: window.location.pathname,
    });

    // Wait for initialization to complete
    if (isInitialized) {
      // Not authenticated - redirect to login
      if (!isAuthenticated || !user) {
        console.log(
          "ProtectedRoute - Redirecting to login: not authenticated or no user",
        );
        router.push(redirectTo || "/auth/login");
        return;
      }

      // Check if user has required roles
      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) =>
          user.role.includes(role),
        );
        if (!hasRequiredRole) {
          // Redirect to appropriate dashboard based on user's role
          const userRoute = getRoleBasedRoute(user);
          router.push(userRoute);
          return;
        }
      }

      // Check if profile completion is required
      if (requireCompleteProfile && !isProfileComplete()) {
        router.push("/onboarding/complete-profile");
        return;
      }

      // Guest users with incomplete profiles should be redirected
      // TODO: Re-enable this when profile completion flow is ready
      // if (user.role[0] === 'guest' && !isProfileComplete()) {
      //   router.push('/onboarding/complete-profile');
      //   return;
      // }
    }
  }, [
    isAuthenticated,
    user,
    isLoading,
    isInitialized,
    isProfileComplete,
    router,
    requiredRoles,
    requireCompleteProfile,
    redirectTo,
  ]);

  // Show loading state while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Don't render if user doesn't have required roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) =>
      user.role.includes(role),
    );
    if (!hasRequiredRole) {
      return null;
    }
  }

  // Don't render if profile completion is required but not met
  if (requireCompleteProfile && !isProfileComplete()) {
    return null;
  }

  return <>{children}</>;
}

// Specific role-based route components
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRoles={["admin", "superadmin"]}>{children}</ProtectedRoute>;
}

export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRoles={["superadmin"]}>{children}</ProtectedRoute>;
}

export function TeacherRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRoles={["teacher", "admin", "superadmin"]}>{children}</ProtectedRoute>;
}

export function StudentRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={["student"]} requireCompleteProfile={true}>
      {children}
    </ProtectedRoute>
  );
}

export function GuardianRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={["guardian"]} requireCompleteProfile={true}>
      {children}
    </ProtectedRoute>
  );
}

export function AuthenticatedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
