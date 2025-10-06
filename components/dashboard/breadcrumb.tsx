"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  title: string;
  href: string;
  isLast?: boolean;
}

export function Breadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter(Boolean);

    // Start with home
    const breadcrumbs: BreadcrumbItem[] = [
      { title: "Dashboard", href: "/dashboard" },
    ];

    // Build breadcrumbs from path segments
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Skip the first segment if it's already covered by Dashboard
      if (segment === "dashboard") return;

      // Format segment title
      const title = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        title,
        href: currentPath,
        isLast: index === pathSegments.length - 1,
      });
    });

    // Mark the last item
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isLast = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className,
      )}
    >
      <Home className="size-4" />
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && <ChevronRight className="size-4" />}
          {item.isLast ? (
            <span className="font-medium text-foreground">{item.title}</span>
          ) : (
            <Link
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
