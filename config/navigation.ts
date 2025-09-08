import { UserRole, SidebarNavItem } from "@/types";

/**
 * Unified Navigation Configuration
 * Based on role-aware navigation system design
 */

export interface QuickAction {
  title: string;
  icon: string;
  href: string;
  description: string;
}

export interface RoleNavigationConfig {
  role: UserRole;
  sidebarSections: SidebarNavItem[];
  quickActions: QuickAction[];
  topbarActions?: {
    primary?: QuickAction;
    secondary?: QuickAction[];
  };
}

/**
 * Navigation configuration for each user role
 */
export const roleNavigationConfig: Record<UserRole, RoleNavigationConfig> = {
  guest: {
    role: UserRole.GUEST,
    sidebarSections: [
      {
        title: "EXPLORE",
        items: [
          {
            href: "/",
            icon: "home",
            title: "Home",
          },
          {
            href: "/explore",
            icon: "compass",
            title: "Explore Lessons",
          },
          {
            href: "/about",
            icon: "info",
            title: "About",
          },
        ],
      },
      {
        title: "GET STARTED",
        items: [
          {
            href: "/auth/login",
            icon: "logIn",
            title: "Login",
          },
          {
            href: "/auth/register",
            icon: "userPlus",
            title: "Register",
          },
        ],
      },
    ],
    quickActions: [
      {
        title: "Sign Up",
        icon: "userPlus",
        href: "/auth/register",
        description: "Create your account",
      },
    ],
  },

  student: {
    role: UserRole.STUDENT,
    sidebarSections: [
      {
        title: "LEARNING",
        items: [
          {
            href: "/dashboard",
            icon: "dashboard",
            title: "Dashboard",
          },
          {
            href: "/dashboard/subjects",
            icon: "bookOpen",
            title: "Subjects",
            description: "Browse all subjects and schemes of work",
          },
          {
            href: "/dashboard/lessons",
            icon: "graduationCap",
            title: "My Lessons",
            description: "Continue your learning journey",
          },
          {
            href: "/dashboard/past-questions",
            icon: "fileText",
            title: "Past Questions",
            description: "Practice with previous exam questions",
          },
        ],
      },
      {
        title: "ASSESSMENTS",
        items: [
          {
            href: "/dashboard/quizzes/available",
            icon: "helpCircle",
            title: "Available Quizzes",
            description: "Take new quizzes",
          },
          {
            href: "/dashboard/quizzes/ongoing",
            icon: "clock",
            title: "Ongoing Quizzes",
            description: "Continue in-progress quizzes",
          },
          {
            href: "/dashboard/quizzes/completed",
            icon: "checkCircle",
            title: "Completed Quizzes",
            description: "Review your quiz history",
          },
        ],
      },
      {
        title: "PROGRESS",
        items: [
          {
            href: "/dashboard/reports",
            icon: "barChart3",
            title: "Reports",
          },
          {
            href: "/dashboard/achievements",
            icon: "trophy",
            title: "Achievements",
          },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          {
            href: "/dashboard/settings",
            icon: "settings",
            title: "Settings",
          },
          {
            href: "/dashboard/billing",
            icon: "creditCard",
            title: "Billing",
          },
        ],
      },
    ],
    quickActions: [
      {
        title: "Take Quiz",
        icon: "play",
        href: "/dashboard/quizzes/available",
        description: "Start a new quiz",
      },
      {
        title: "Continue Learning",
        icon: "bookOpen",
        href: "/dashboard/lessons/continue",
        description: "Resume where you left off",
      },
    ],
    topbarActions: {
      primary: {
        title: "Join Quiz",
        icon: "play",
        href: "/dashboard/quizzes/join",
        description: "Join an active quiz",
      },
    },
  },

  guardian: {
    role: UserRole.GUARDIAN,
    sidebarSections: [
      {
        title: "OVERVIEW",
        items: [
          {
            href: "/dashboard",
            icon: "dashboard",
            title: "Dashboard",
          },
          {
            href: "/dashboard/children",
            icon: "users",
            title: "My Children",
          },
        ],
      },
      {
        title: "MONITORING",
        items: [
          {
            href: "/dashboard/reports",
            icon: "barChart3",
            title: "Child Reports",
          },
          {
            href: "/dashboard/progress",
            icon: "trendingUp",
            title: "Progress Tracking",
          },
          {
            href: "/dashboard/lessons",
            icon: "bookOpen",
            title: "Lessons View",
            description: "Read-only access",
          },
          {
            href: "/dashboard/quizzes",
            icon: "helpCircle",
            title: "Quizzes View",
            description: "Read-only access",
          },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          {
            href: "/dashboard/settings",
            icon: "settings",
            title: "Settings",
          },
          {
            href: "/dashboard/billing",
            icon: "creditCard",
            title: "Billing",
          },
        ],
      },
    ],
    quickActions: [
      {
        title: "View Reports",
        icon: "barChart3",
        href: "/dashboard/reports",
        description: "Check child's progress",
      },
    ],
    topbarActions: {
      primary: {
        title: "Child Reports",
        icon: "barChart3",
        href: "/dashboard/reports",
        description: "Quick access to reports",
      },
    },
  },

  teacher: {
    role: UserRole.TEACHER,
    sidebarSections: [
      {
        title: "OVERVIEW",
        items: [
          {
            href: "/dashboard",
            icon: "dashboard",
            title: "Dashboard",
          },
          {
            href: "/dashboard/teacher/classes",
            icon: "users",
            title: "My Classes",
          },
        ],
      },
      {
        title: "CONTENT",
        items: [
          {
            href: "/dashboard/teacher/lessons",
            icon: "bookOpen",
            title: "Manage Lessons",
          },
          {
            href: "/dashboard/teacher/quizzes",
            icon: "helpCircle",
            title: "Quizzes",
          },
          {
            href: "/dashboard/teacher/assignments",
            icon: "clipboard",
            title: "Assignments",
          },
        ],
      },
      {
        title: "ANALYTICS",
        items: [
          {
            href: "/dashboard/teacher/reports",
            icon: "barChart3",
            title: "Class Reports",
          },
          {
            href: "/dashboard/teacher/performance",
            icon: "trendingUp",
            title: "Performance Analytics",
          },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          {
            href: "/dashboard/teacher/settings",
            icon: "settings",
            title: "Settings",
          },
          {
            href: "/dashboard/teacher/billing",
            icon: "creditCard",
            title: "Billing",
          },
        ],
      },
    ],
    quickActions: [
      {
        title: "Upload Lesson",
        icon: "upload",
        href: "/dashboard/teacher/lessons/upload",
        description: "Add new lesson content",
      },
      {
        title: "Create Quiz",
        icon: "plus",
        href: "/dashboard/teacher/quizzes/create",
        description: "Create a new quiz",
      },
    ],
    topbarActions: {
      primary: {
        title: "+ Lesson Upload",
        icon: "upload",
        href: "/dashboard/teacher/lessons/upload",
        description: "Quick lesson upload",
      },
      secondary: [
        {
          title: "Create Quiz",
          icon: "plus",
          href: "/dashboard/teacher/quizzes/create",
          description: "New quiz",
        },
      ],
    },
  },

  admin: {
    role: UserRole.ADMIN,
    sidebarSections: [
      {
        title: "OVERVIEW",
        items: [
          {
            href: "/dashboard",
            icon: "dashboard",
            title: "Dashboard",
          },
          {
            href: "/dashboard/admin/analytics",
            icon: "barChart3",
            title: "Analytics",
          },
        ],
      },
      {
        title: "MANAGEMENT",
        items: [
          {
            href: "/dashboard/admin/users",
            icon: "users",
            title: "User Management",
          },
          {
            href: "/dashboard/admin/classes",
            icon: "school",
            title: "Classes & Groups",
          },
          {
            href: "/dashboard/admin/content",
            icon: "fileText",
            title: "Content Management",
          },
        ],
      },
      {
        title: "REPORTS",
        items: [
          {
            href: "/dashboard/admin/reports",
            icon: "pieChart",
            title: "System Reports",
          },
          {
            href: "/dashboard/admin/performance",
            icon: "trendingUp",
            title: "Performance Analytics",
          },
        ],
      },
      {
        title: "SYSTEM",
        items: [
          {
            href: "/dashboard/admin/settings",
            icon: "settings",
            title: "School Settings",
          },
          {
            href: "/dashboard/admin/billing",
            icon: "creditCard",
            title: "Billing",
          },
        ],
      },
    ],
    quickActions: [
      {
        title: "Add User",
        icon: "userPlus",
        href: "/dashboard/admin/users/create",
        description: "Create new user account",
      },
      {
        title: "View Reports",
        icon: "barChart3",
        href: "/dashboard/admin/reports",
        description: "System analytics",
      },
    ],
    topbarActions: {
      primary: {
        title: "+ User",
        icon: "userPlus",
        href: "/dashboard/admin/users/create",
        description: "Add new user",
      },
    },
  },

  superadmin: {
    role: UserRole.SUPERADMIN,
    sidebarSections: [
      {
        title: "OVERVIEW",
        items: [
          {
            href: "/dashboard",
            icon: "dashboard",
            title: "Dashboard",
          },
          {
            href: "/dashboard/superadmin/analytics",
            icon: "barChart3",
            title: "Global Analytics",
          },
        ],
      },
      {
        title: "ADMINISTRATION",
        items: [
          {
            href: "/dashboard/superadmin/roles",
            icon: "shield",
            title: "Role Management",
          },
          {
            href: "/dashboard/superadmin/users",
            icon: "users",
            title: "User Management",
          },
          {
            href: "/dashboard/superadmin/schools",
            icon: "building",
            title: "School Management",
          },
        ],
      },
      {
        title: "CONTENT",
        items: [
          {
            href: "/dashboard/superadmin/lessons",
            icon: "bookOpen",
            title: "Global Content",
          },
          {
            href: "/dashboard/superadmin/curriculum",
            icon: "graduationCap",
            title: "Curriculum Management",
          },
        ],
      },
      {
        title: "SYSTEM",
        items: [
          {
            href: "/dashboard/superadmin/billing",
            icon: "creditCard",
            title: "Billing & Subscriptions",
          },
          {
            href: "/dashboard/superadmin/settings",
            icon: "settings",
            title: "System Settings",
          },
          {
            href: "/dashboard/superadmin/logs",
            icon: "fileText",
            title: "System Logs",
          },
        ],
      },
    ],
    quickActions: [
      {
        title: "System Settings",
        icon: "settings",
        href: "/dashboard/superadmin/settings",
        description: "Global system configuration",
      },
      {
        title: "User Management",
        icon: "users",
        href: "/dashboard/superadmin/users",
        description: "Manage all users",
      },
    ],
    topbarActions: {
      primary: {
        title: "System Settings",
        icon: "settings",
        href: "/dashboard/superadmin/settings",
        description: "Quick settings access",
      },
    },
  },
};

/**
 * Global navigation items that appear for all authenticated users
 */
export const globalNavItems: SidebarNavItem[] = [
  {
    title: "SUPPORT",
    items: [
      {
        href: "/docs",
        icon: "bookOpen",
        title: "Documentation",
      },
      {
        href: "/support",
        icon: "helpCircle",
        title: "Support",
      },
      {
        href: "/",
        icon: "home",
        title: "Homepage",
      },
    ],
  },
];

/**
 * Get navigation configuration for a specific role
 */
export function getNavigationForRole(role: UserRole): RoleNavigationConfig {
  return roleNavigationConfig[role] || roleNavigationConfig.guest;
}

/**
 * Get complete sidebar configuration for a role (includes global items)
 */
export function getSidebarConfig(role: UserRole): SidebarNavItem[] {
  const roleConfig = getNavigationForRole(role);
  
  // For guests, don't add global items
  if (role === UserRole.GUEST) {
    return roleConfig.sidebarSections;
  }
  
  // For authenticated users, combine role-specific + global
  return [...roleConfig.sidebarSections, ...globalNavItems];
}

/**
 * Get quick actions for a role
 */
export function getQuickActions(role: UserRole): QuickAction[] {
  const roleConfig = getNavigationForRole(role);
  return roleConfig.quickActions;
}

/**
 * Get topbar actions for a role
 */
export function getTopbarActions(role: UserRole) {
  const roleConfig = getNavigationForRole(role);
  return roleConfig.topbarActions;
}
