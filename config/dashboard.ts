import { UserRole } from "@/types";
import type { SidebarNavItem } from "@/types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      // Unified Dashboard for Students & Guardians
      {
        href: "/dashboard",
        icon: "dashboard",
        title: "Dashboard",
        authorizeOnly: UserRole.STUDENT,
      },
      {
        href: "/dashboard/subjects",
        icon: "dashboard",
        title: "Subjects",
        authorizeOnly: UserRole.STUDENT,
      },
      {
        href: "/dashboard/lessons",
        icon: "dashboard",
        title: "Lessons",
        authorizeOnly: UserRole.STUDENT,
      },
      {
        href: "/dashboard/quizzes",
        icon: "dashboard",
        title: "Quizzes",
        authorizeOnly: UserRole.STUDENT,
      },
      {
        href: "/dashboard/past-questions",
        icon: "dashboard",
        title: "Past Questions",
        authorizeOnly: UserRole.STUDENT,
      },
      {
        href: "/dashboard/records",
        icon: "dashboard",
        title: "Records",
        authorizeOnly: UserRole.GUARDIAN,
      },
      {
        href: "/dashboard",
        icon: "dashboard",
        title: "Dashboard",
        authorizeOnly: UserRole.GUARDIAN,
      },
      // Role-specific lesson management for Teachers, Admins, and SuperAdmins
      {
        href: "/dashboard/teacher/lessons",
        icon: "graduationCap",
        title: "Lessons",
        authorizeOnly: UserRole.TEACHER,
      },
      {
        href: "/dashboard/admin/charts",
        icon: "lineChart",
        title: "Analytics",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/superadmin/lessons",
        icon: "bookOpen",
        title: "Lesson Management",
        authorizeOnly: UserRole.SUPERADMIN,
      },
      // Unified billing across roles
      {
        href: "/dashboard/admin/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/teacher/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.TEACHER,
      },
      {
        href: "/dashboard/superadmin/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.SUPERADMIN,
      },
      // Unified orders
      {
        href: "/dashboard/admin/orders",
        icon: "package",
        title: "Orders",
        badge: 2,
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/teacher/orders",
        icon: "package",
        title: "Orders",
        authorizeOnly: UserRole.TEACHER,
      },
      {
        href: "/dashboard/superadmin/orders",
        icon: "package",
        title: "Orders",
        authorizeOnly: UserRole.SUPERADMIN,
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      // Unified settings - students and guardians use main dashboard
      {
        href: "/dashboard/settings",
        icon: "settings",
        title: "Settings",
        authorizeOnly: UserRole.STUDENT,
      },
      {
        href: "/dashboard/settings",
        icon: "settings",
        title: "Settings",
        authorizeOnly: UserRole.GUARDIAN,
      },
      // Role-specific settings
      {
        href: "/dashboard/teacher/settings",
        icon: "settings",
        title: "Settings",
        authorizeOnly: UserRole.TEACHER,
      },
      {
        href: "/dashboard/admin/settings",
        icon: "settings",
        title: "Settings",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/superadmin/settings",
        icon: "settings",
        title: "Settings",
        authorizeOnly: UserRole.SUPERADMIN,
      },
      { href: "/", icon: "home", title: "Homepage" },
      { href: "/docs", icon: "bookOpen", title: "Documentation", authorizeOnly: UserRole.SUPERADMIN },
      {
        href: "#",
        icon: "messages",
        title: "Support",
        authorizeOnly: UserRole.STUDENT,
        disabled: true,
      },
    ],
  },
];
