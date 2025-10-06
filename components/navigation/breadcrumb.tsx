"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";

export function Breadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = () => {
    const segments = pathname
      .split("/")
      .filter((segment) => segment.length > 0);
    const breadcrumbs: { title: string; href: string; icon?: string }[] = [];

    // Add home as first item
    if (user) {
      const userRole = user.role[0];
      breadcrumbs.push({
        title: "Home",
        href: userRole === "guest" ? "/onboarding" : "/dashboard",
        icon: "home",
      });
    }

    // Build breadcrumbs from path segments
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Skip if this is the last segment (current page)
      if (index === segments.length - 1) {
        breadcrumbs.push({
          title: formatSegmentTitle(segment),
          href: currentPath,
        });
      } else {
        breadcrumbs.push({
          title: formatSegmentTitle(segment),
          href: currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const formatSegmentTitle = (segment: string): string => {
    // Handle special route names
    const specialRoutes: Record<string, string> = {
      dashboard: "Dashboard",
      superadmin: "Super Admin",
      admin: "Admin",
      teacher: "Teacher",
      student: "Student",
      guardian: "Guardian",
      lessons: "Lessons",
      upload: "Upload",
      trash: "Trash",
      settings: "Settings",
      billing: "Billing",
      charts: "Charts",
      orders: "Orders",
      onboarding: "Get Started",
      auth: "Authentication",
      login: "Login",
      register: "Sign Up",
    };

    return (
      specialRoutes[segment] ||
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs if there's only one item
  }

  return (
    <nav
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className,
      )}
    >
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = breadcrumb.icon
          ? Icons[breadcrumb.icon as keyof typeof Icons]
          : null;

        return (
          <Fragment key={breadcrumb.href}>
            {index === 0 && Icon ? <Icon className="size-4 shrink-0" /> : null}

            {isLast ? (
              <span className="truncate font-medium text-foreground">
                {breadcrumb.title}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="truncate transition-colors hover:text-foreground"
              >
                {breadcrumb.title}
              </Link>
            )}

            {!isLast && <ChevronRight className="size-4 shrink-0" />}
          </Fragment>
        );
      })}
    </nav>
  );
}
