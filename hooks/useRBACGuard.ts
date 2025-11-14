"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

import { RBACUtils } from "@/lib/rbac/role-config";

interface UseRBACGuardOptions {
  redirectOnUnauthorized?: boolean;
  showToast?: boolean;
}

/**
 * Hook to validate user access to current route
 * Provides client-side RBAC validation in addition to middleware
 */
export function useRBACGuard(options: UseRBACGuardOptions = {}) {
  const { redirectOnUnauthorized = true, showToast = true } = options;
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  const userRole = user?.role[0];
  const canAccess = user
    ? RBACUtils.canAccessRoute(user, pathname)
    : false;
  const homeRoute = userRole ? RBACUtils.getHomeRoute(userRole) : "/auth/login";

  useEffect(() => {
    // Don't validate on initial load or if user data is not available yet
    if (!isAuthenticated || !user || !userRole) {
      return;
    }

    // Check if user can access current route
    if (!canAccess) {
      console.log("🚫 Client RBAC: Access denied for", { userRole, pathname });

      if (showToast) {
        toast.error("Access Denied", {
          description: `You don't have permission to access this page.`,
        });
      }

      if (redirectOnUnauthorized) {
        router.push(homeRoute);
      }
    }
  }, [
    pathname,
    userRole,
    canAccess,
    homeRoute,
    isAuthenticated,
    user,
    router,
    redirectOnUnauthorized,
    showToast,
  ]);

  return {
    canAccess,
    userRole,
    homeRoute,
    isAuthenticated,
    isLoading: !user && isAuthenticated, // User should be available if authenticated
  };
}

/**
 * Hook to check if user can access specific feature
 */
export function useFeatureAccess(feature: string) {
  const { user } = useAuthStore();
  const userRole = user?.role[0];

  // You can extend this to use RBAC permissions
  const canAccessFeature = user
    ? user.role.some((role) => {
        // Add your feature-specific logic here
        return true; // Placeholder
      })
    : false;

  return {
    canAccess: canAccessFeature,
    userRole,
  };
}

/**
 * Hook to check if user can perform specific action
 */
export function usePermissionCheck() {
  const { user } = useAuthStore();
  const userRole = user?.role[0];

  // DEBUG: Log user and role info
  console.log("🔍 [PERMISSION DEBUG] usePermissionCheck called:");
  console.log("  User:", user ? { email: user.email, roles: user.role } : null);
  console.log("  Primary Role:", userRole);

  const hasPermission = (permission: string): boolean => {
    if (!userRole) {
      console.log(
        `❌ [PERMISSION DEBUG] No userRole for permission "${permission}"`,
      );
      return false;
    }

    console.log(
      `🔍 [PERMISSION DEBUG] Checking permission "${permission}" for role "${userRole}"`,
    );

    let result = false;
    // Map permissions to RBAC utilities
    switch (permission) {
      case "manage_lessons":
        result = RBACUtils.hasPermission(userRole, "TEACHER");
        console.log(
          `   - RBACUtils.hasPermission(${userRole}, 'TEACHER') = ${result}`,
        );
        break;
      case "manage_users":
        result = RBACUtils.hasPermission(userRole, "ADMIN");
        console.log(
          `   - RBACUtils.hasPermission(${userRole}, 'ADMIN') = ${result}`,
        );
        break;
      case "system_config":
        result = RBACUtils.hasPermission(userRole, "SUPERADMIN");
        console.log(
          `   - RBACUtils.hasPermission(${userRole}, 'SUPERADMIN') = ${result}`,
        );
        break;
      case "assign_roles":
        result = userRole === "superadmin";
        console.log(`   - userRole === 'superadmin' = ${result}`);
        break;
      case "view_progress":
        result = [
          "student",
          "guardian",
          "teacher",
          "admin",
          "superadmin",
        ].includes(userRole);
        console.log(`   - userRole in allowed roles = ${result}`);
        break;
      case "switch_roles":
        result = RBACUtils.canSwitchRoles(userRole);
        console.log(`   - RBACUtils.canSwitchRoles(${userRole}) = ${result}`);
        break;
      case "view_admin_panel":
        result = RBACUtils.hasPermission(userRole, "ADMIN");
        console.log(
          `   - RBACUtils.hasPermission(${userRole}, 'ADMIN') for admin panel = ${result}`,
        );
        break;
      case "create_user":
        result = RBACUtils.hasPermission(userRole, "ADMIN");
        console.log(
          `   - RBACUtils.hasPermission(${userRole}, 'ADMIN') for user creation = ${result}`,
        );
        break;
      default:
        result = false;
        console.log(`   - Unknown permission "${permission}" = ${result}`);
        break;
    }

    console.log(
      `🎯 [PERMISSION DEBUG] Final result for "${permission}": ${result}`,
    );
    return result;
  };

  const canAssignRole = (targetRole: string): boolean => {
    if (!userRole) return false;
    return RBACUtils.canAssignRole(userRole, targetRole as any);
  };

  // Get all available permissions for debugging
  const permissions = {
    manage_lessons: hasPermission("manage_lessons"),
    manage_users: hasPermission("manage_users"),
    system_config: hasPermission("system_config"),
    assign_roles: hasPermission("assign_roles"),
    view_progress: hasPermission("view_progress"),
    switch_roles: hasPermission("switch_roles"),
    view_admin_panel: hasPermission("view_admin_panel"),
    create_user: hasPermission("create_user"),
  };

  return {
    hasPermission,
    canAssignRole,
    userRole,
    permissions, // Include all permissions for debugging
  };
}
