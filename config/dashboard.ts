import { UserRole, SidebarNavItem } from "@/types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/parent",
        icon: "users",
        title: "Parent Dashboard",
        authorizeOnly: UserRole.GUARDIAN,
      },
      {
        href: "/dashboard",
        icon: "dashboard",
        title: "Student Dashboard",
        authorizeOnly: UserRole.STUDENT,
      },
      {
        href: "/guest",
        icon: "eye",
        title: "Guest Dashboard",
        authorizeOnly: UserRole.GUEST,
      },
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.STUDENT,
      },
      { href: "/dashboard/charts", icon: "lineChart", title: "Charts" },
      {
        href: "/admin/orders",
        icon: "package",
        title: "Orders",
        badge: 2,
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/parent/orders",
        icon: "package",
        title: "Parent Orders",
        authorizeOnly: UserRole.GUARDIAN,
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      // { href: "/guest/settings", icon: "settings", title: "Guest Settings", authorizeOnly: UserRole.GUEST },
      { href: "/", icon: "home", title: "Homepage" },
      { href: "/docs", icon: "bookOpen", title: "Documentation" },
      {
        href: "#",
        icon: "messages",
        title: "Support",
        disabled: true,
      },
    ],
  },
];
