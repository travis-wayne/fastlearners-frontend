import { UserRole } from "@/lib/types/auth";

/**
 * Single source of truth for role-based routing and access control
 */

export interface RoleConfig {
  homeRoute: string;
  allowedRoutes: string[];
  restrictedRoutes: string[];
  requiresOnboarding: boolean;
  canSwitchRoles: boolean;
  assignedBy?: UserRole[];
}

export const ROLE_CONFIGURATIONS: Record<UserRole, RoleConfig> = {
  guest: {
    homeRoute: "/onboarding",
    allowedRoutes: [
      "/login",
      "/register",
      "/onboarding",
      "/auth",
      "/auth/role", // Role selection during onboarding
      "/role", // Role selection during onboarding
    ],
    restrictedRoutes: ["/dashboard", "/superadmin", "/admin", "/teacher"],
    requiresOnboarding: true,
    canSwitchRoles: true, // Can choose student or guardian once
  },

  student: {
    homeRoute: "/dashboard",
    allowedRoutes: ["/dashboard", "/lessons", "/exercises", "/profile"],
    restrictedRoutes: [
      "/superadmin",
      "/admin",
      "/teacher",
      "/onboarding", // Cannot go back to onboarding
    ],
    requiresOnboarding: false,
    canSwitchRoles: false, // Permanent choice - can only switch from Guest → Student once
  },

  guardian: {
    homeRoute: "/dashboard",
    allowedRoutes: [
      "/dashboard",
      "/progress", // View children's progress
      "/profile",
      "/guardian-tools",
    ],
    restrictedRoutes: [
      "/superadmin",
      "/admin",
      "/teacher",
      "/onboarding", // Cannot go back to onboarding
    ],
    requiresOnboarding: false,
    canSwitchRoles: false, // Permanent choice - can only switch from Guest → Guardian once
  },

  teacher: {
    homeRoute: "/dashboard/teacher/lessons",
    allowedRoutes: [
      "/dashboard/teacher",
      "/dashboard",
      "/teacher",
      "/lessons",
      "/uploads",
      "/profile",
    ],
    restrictedRoutes: ["/superadmin", "/admin", "/onboarding"],
    requiresOnboarding: false,
    canSwitchRoles: false,
    assignedBy: ["superadmin"], // Must be assigned manually by superadmin
  },

  admin: {
    homeRoute: "/dashboard/admin/charts",
    allowedRoutes: [
      "/dashboard/admin",
      "/dashboard",
      "/admin",
      "/users",
      "/reports",
      "/profile",
    ],
    restrictedRoutes: [
      "/superadmin",
      "/teacher", // Admin cannot access teacher-specific routes
      "/onboarding",
    ],
    requiresOnboarding: false,
    canSwitchRoles: false,
    assignedBy: ["superadmin"], // Must be assigned manually by superadmin
  },

  superadmin: {
    homeRoute: "/dashboard/superadmin/lessons",
    allowedRoutes: [
      "/dashboard/superadmin",
      "/dashboard",
      "/superadmin",
      "/users",
      "/lessons",
      "/uploads",
      "/reports",
      "/settings",
      "/profile",
    ],
    restrictedRoutes: [],
    requiresOnboarding: false,
    canSwitchRoles: false,
    assignedBy: ["superadmin"], // Only superadmin can create other superadmins
  },
};

/**
 * Role hierarchy for access control
 * Higher roles inherit permissions from lower roles
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  student: 1,
  guardian: 1,
  teacher: 2,
  admin: 3,
  superadmin: 4,
};

/**
 * Routes that require specific permissions
 */
export const PROTECTED_ROUTE_PATTERNS = {
  // Superadmin only
  SUPERADMIN: [
    "/admin/roles",
    "/admin/users/assign-roles",
    "/admin/system-config",
  ],

  // Admin and above
  ADMIN: ["/admin/users", "/admin/classes", "/admin/reports"],

  // Teacher and above
  TEACHER: ["/admin/lessons", "/teacher/create", "/teacher/evaluate"],

  // Student/Guardian specific
  STUDENT: ["/dashboard/exercises", "/dashboard/progress"],

  GUARDIAN: ["/guardian/children", "/guardian/reports"],
};

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/role", 
];

/**
 * Routes that should redirect authenticated users
 */
export const AUTH_ROUTES = ["/auth/login", "/auth/register"];

/**
 * Utility functions for role-based access control
 */
export class RBACUtils {
  /**
   * Check if a user can access a specific route
   */
  static canAccessRoute(userRole: UserRole, route: string): boolean {
    const config = ROLE_CONFIGURATIONS[userRole];

    // Superadmin can access everything
    if (userRole === "superadmin") {
      return true;
    }

    // Check if route is explicitly restricted
    if (
      config.restrictedRoutes.some((restrictedRoute) =>
        route.startsWith(restrictedRoute),
      )
    ) {
      return false;
    }

    // Check if route is explicitly allowed
    if (
      config.allowedRoutes.some((allowedRoute) =>
        route.startsWith(allowedRoute),
      )
    ) {
      return true;
    }

    // Check protected route patterns
    for (const [permission, patterns] of Object.entries(
      PROTECTED_ROUTE_PATTERNS,
    )) {
      const matchesPattern = patterns.some((pattern) =>
        route.startsWith(pattern),
      );
      if (matchesPattern) {
        return this.hasPermission(
          userRole,
          permission as keyof typeof PROTECTED_ROUTE_PATTERNS,
        );
      }
    }

    return false;
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(
    userRole: UserRole,
    permission: keyof typeof PROTECTED_ROUTE_PATTERNS,
  ): boolean {
    const userLevel = ROLE_HIERARCHY[userRole];

    switch (permission) {
      case "SUPERADMIN":
        return userLevel >= ROLE_HIERARCHY.superadmin;
      case "ADMIN":
        return userLevel >= ROLE_HIERARCHY.admin;
      case "TEACHER":
        return userLevel >= ROLE_HIERARCHY.teacher;
      case "STUDENT":
        return userRole === "student" || userLevel >= ROLE_HIERARCHY.teacher;
      case "GUARDIAN":
        return userRole === "guardian" || userLevel >= ROLE_HIERARCHY.admin;
      default:
        return false;
    }
  }

  /**
   * Get the correct home route for a user role
   */
  static getHomeRoute(userRole: UserRole): string {
    return ROLE_CONFIGURATIONS[userRole].homeRoute;
  }

  /**
   * Check if user needs onboarding
   */
  static requiresOnboarding(userRole: UserRole): boolean {
    return ROLE_CONFIGURATIONS[userRole].requiresOnboarding;
  }

  /**
   * Check if user can switch roles
   */
  static canSwitchRoles(userRole: UserRole): boolean {
    return ROLE_CONFIGURATIONS[userRole].canSwitchRoles;
  }

  /**
   * Get roles that can assign a specific role
   */
  static getAssignmentRoles(targetRole: UserRole): UserRole[] {
    return ROLE_CONFIGURATIONS[targetRole].assignedBy || [];
  }

  /**
   * Validate if current user can assign target role
   */
  static canAssignRole(
    currentUserRole: UserRole,
    targetRole: UserRole,
  ): boolean {
    const assignmentRoles = this.getAssignmentRoles(targetRole);
    return (
      assignmentRoles.length === 0 || assignmentRoles.includes(currentUserRole)
    );
  }
}
