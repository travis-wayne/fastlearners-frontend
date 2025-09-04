import { UserRole } from '@/lib/types/auth';

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
    homeRoute: '/onboarding',
    allowedRoutes: [
      '/onboarding',
      '/auth',
      '/guest', // Limited browsing
      '/role', // Role selection during onboarding
    ],
    restrictedRoutes: [
      '/dashboard',
      '/admin',
      '/teacher',
      '/guardian',
      '/billing',
    ],
    requiresOnboarding: true,
    canSwitchRoles: true, // Can choose student or guardian once
  },

  student: {
    homeRoute: '/dashboard',
    allowedRoutes: [
      '/dashboard',
      '/lessons',
      '/progress',
      '/exercises',
      '/billing',
      '/settings',
    ],
    restrictedRoutes: [
      '/admin',
      '/teacher',
      '/guardian',
      '/onboarding', // Cannot go back to onboarding
      '/role', // Cannot change role after selection
    ],
    requiresOnboarding: false,
    canSwitchRoles: false, // Permanent choice
  },

  guardian: {
    homeRoute: '/guardian',
    allowedRoutes: [
      '/guardian',
      '/dashboard', // Can access student view to help children
      '/progress', // View children's progress
      '/billing',
      '/settings',
    ],
    restrictedRoutes: [
      '/admin',
      '/teacher',
      '/onboarding', // Cannot go back to onboarding
      '/role', // Cannot change role after selection
    ],
    requiresOnboarding: false,
    canSwitchRoles: false, // Permanent choice
  },

  teacher: {
    homeRoute: '/teacher',
    allowedRoutes: [
      '/teacher',
      '/admin/lessons', // Can manage lessons
      '/dashboard', // Can view student perspective
      '/lessons',
      '/exercises',
      '/settings',
    ],
    restrictedRoutes: [
      '/admin/users', // Cannot manage users
      '/admin/roles', // Cannot assign roles
      '/onboarding',
      '/guardian',
      '/billing', // Teachers don't handle billing
    ],
    requiresOnboarding: false,
    canSwitchRoles: false,
    assignedBy: ['superadmin'],
  },

  admin: {
    homeRoute: '/admin',
    allowedRoutes: [
      '/admin',
      '/teacher', // Can access teacher features
      '/dashboard',
      '/guardian',
      '/lessons',
      '/exercises',
      '/progress',
      '/settings',
    ],
    restrictedRoutes: [
      '/onboarding',
      '/admin/superadmin', // Cannot access superadmin features
    ],
    requiresOnboarding: false,
    canSwitchRoles: false,
    assignedBy: ['superadmin'],
  },

  superadmin: {
    homeRoute: '/admin',
    allowedRoutes: ['*'], // Access to everything
    restrictedRoutes: [], // No restrictions
    requiresOnboarding: false,
    canSwitchRoles: false,
    assignedBy: ['superadmin'], // Only superadmin can create other superadmins
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
    '/admin/roles',
    '/admin/users/assign-roles',
    '/admin/system-config',
  ],
  
  // Admin and above
  ADMIN: [
    '/admin/users',
    '/admin/classes',
    '/admin/reports',
  ],
  
  // Teacher and above
  TEACHER: [
    '/admin/lessons',
    '/teacher/create',
    '/teacher/evaluate',
  ],
  
  // Student/Guardian specific
  STUDENT: [
    '/dashboard/exercises',
    '/dashboard/progress',
  ],
  
  GUARDIAN: [
    '/guardian/children',
    '/guardian/reports',
  ],
};

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

/**
 * Routes that should redirect authenticated users
 */
export const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
];

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
    if (userRole === 'superadmin') {
      return true;
    }
    
    // Check if route is explicitly restricted
    if (config.restrictedRoutes.some(restrictedRoute => 
      route.startsWith(restrictedRoute)
    )) {
      return false;
    }
    
    // Check if route is explicitly allowed
    if (config.allowedRoutes.some(allowedRoute => 
      route.startsWith(allowedRoute)
    )) {
      return true;
    }
    
    // Check protected route patterns
    for (const [permission, patterns] of Object.entries(PROTECTED_ROUTE_PATTERNS)) {
      const matchesPattern = patterns.some(pattern => route.startsWith(pattern));
      if (matchesPattern) {
        return this.hasPermission(userRole, permission as keyof typeof PROTECTED_ROUTE_PATTERNS);
      }
    }
    
    return false;
  }
  
  /**
   * Check if user has specific permission
   */
  static hasPermission(userRole: UserRole, permission: keyof typeof PROTECTED_ROUTE_PATTERNS): boolean {
    const userLevel = ROLE_HIERARCHY[userRole];
    
    switch (permission) {
      case 'SUPERADMIN':
        return userLevel >= ROLE_HIERARCHY.superadmin;
      case 'ADMIN':
        return userLevel >= ROLE_HIERARCHY.admin;
      case 'TEACHER':
        return userLevel >= ROLE_HIERARCHY.teacher;
      case 'STUDENT':
        return userRole === 'student' || userLevel >= ROLE_HIERARCHY.teacher;
      case 'GUARDIAN':
        return userRole === 'guardian' || userLevel >= ROLE_HIERARCHY.admin;
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
  static canAssignRole(currentUserRole: UserRole, targetRole: UserRole): boolean {
    const assignmentRoles = this.getAssignmentRoles(targetRole);
    return assignmentRoles.length === 0 || assignmentRoles.includes(currentUserRole);
  }
}
