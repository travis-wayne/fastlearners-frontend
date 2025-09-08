"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

import { Icons } from "@/components/shared/icons";
import { UserRole } from "@/types";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: string;
  isCurrentPage?: boolean;
}

interface EnhancedBreadcrumbProps {
  className?: string;
  showHomeIcon?: boolean;
  maxItems?: number;
}

// Path mappings for better labels
const pathMappings: Record<string, string> = {
  // Common paths
  "dashboard": "Dashboard",
  "lessons": "Lessons",
  "subjects": "Subjects",
  "quizzes": "Quizzes",
  "reports": "Reports",
  "settings": "Settings",
  "billing": "Billing",
  "profile": "Profile",
  "notifications": "Notifications",
  
  // Quiz states
  "available": "Available",
  "ongoing": "Ongoing", 
  "completed": "Completed",
  "join": "Join Quiz",
  
  // Actions
  "create": "Create",
  "edit": "Edit",
  "upload": "Upload",
  "trash": "Trash",
  "analytics": "Analytics",
  "performance": "Performance",
  
  // Roles
  "teacher": "Teacher",
  "admin": "Admin", 
  "superadmin": "Super Admin",
  "student": "Student",
  "guardian": "Guardian",
  
  // Management
  "users": "Users",
  "roles": "Roles",
  "schools": "Schools",
  "classes": "Classes",
  "content": "Content",
  "curriculum": "Curriculum",
  "assignments": "Assignments",
  "logs": "System Logs",
  
  // Academic
  "past-questions": "Past Questions",
  "achievements": "Achievements",
  "children": "My Children",
  "progress": "Progress",
};

// Context-aware breadcrumb structures for specific paths
const contextualBreadcrumbs: Record<string, BreadcrumbItem[]> = {
  // Subject → Lesson hierarchy example
  "/dashboard/subjects/mathematics": [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Subjects", href: "/dashboard/subjects", icon: "bookOpen" },
    { label: "Mathematics", href: "/dashboard/subjects/mathematics", icon: "calculator", isCurrentPage: true },
  ],
  
  // Lesson detail example
  "/dashboard/lessons/intro-algebra": [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Subjects", href: "/dashboard/subjects", icon: "bookOpen" },
    { label: "Mathematics", href: "/dashboard/subjects/mathematics", icon: "calculator" },
    { label: "Introduction to Algebra", href: "/dashboard/lessons/intro-algebra", icon: "graduationCap", isCurrentPage: true },
  ],
  
  // Quiz taking flow
  "/dashboard/quizzes/quadratic-equations": [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Quizzes", href: "/dashboard/quizzes", icon: "helpCircle" },
    { label: "Available", href: "/dashboard/quizzes/available", icon: "helpCircle" },
    { label: "Quadratic Equations Quiz", href: "/dashboard/quizzes/quadratic-equations", icon: "helpCircle", isCurrentPage: true },
  ],
};

export function EnhancedBreadcrumb({ 
  className, 
  showHomeIcon = true, 
  maxItems = 4 
}: EnhancedBreadcrumbProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  const primaryRole = user?.role[0] || UserRole.GUEST;

  const breadcrumbs = useMemo(() => {
    // Check for contextual breadcrumbs first
    if (contextualBreadcrumbs[pathname]) {
      return contextualBreadcrumbs[pathname];
    }

    // Generate breadcrumbs from path segments
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')) {
      return [{ label: "Dashboard", href: "/dashboard", icon: "dashboard", isCurrentPage: true }];
    }

    const items: BreadcrumbItem[] = [];
    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Get label from mapping or format segment
      let label = pathMappings[segment] || segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Determine icon based on segment
      let icon = getSegmentIcon(segment, index, segments);

      // Special handling for role-specific paths
      if (segments[1] === primaryRole) {
        // Skip the role segment in display for cleaner breadcrumbs
        if (segment === primaryRole) return;
        
        // Adjust path to include role
        currentPath = `/dashboard/${primaryRole}${currentPath.replace('/dashboard', '')}`;
      }

      items.push({
        label,
        href: currentPath,
        icon,
        isCurrentPage: isLast
      });
    });

    return items;
  }, [pathname, primaryRole]);

  const getSegmentIcon = (segment: string, index: number, segments: string[]): string => {
    // Dashboard is always first
    if (segment === 'dashboard') return 'dashboard';
    
    // Role-based icons
    if (segment === 'teacher') return 'graduationCap';
    if (segment === 'admin') return 'shield';
    if (segment === 'superadmin') return 'crown';
    
    // Content type icons
    if (segment === 'lessons') return 'bookOpen';
    if (segment === 'subjects') return 'bookOpen';
    if (segment === 'quizzes') return 'helpCircle';
    if (segment === 'reports') return 'barChart3';
    if (segment === 'users') return 'users';
    if (segment === 'settings') return 'settings';
    if (segment === 'billing') return 'creditCard';
    if (segment === 'analytics') return 'barChart3';
    if (segment === 'upload') return 'upload';
    if (segment === 'create') return 'plus';
    if (segment === 'edit') return 'edit';
    
    // Subject-specific icons (if we can detect them)
    if (segment === 'mathematics') return 'calculator';
    if (segment === 'physics') return 'atom';
    if (segment === 'chemistry') return 'testTube';
    if (segment === 'biology') return 'leaf';
    if (segment === 'english') return 'bookOpen';
    
    // Default icon based on position
    if (index === segments.length - 1) return 'file'; // Current page
    return 'folder'; // Intermediate page
  };

  // Truncate breadcrumbs if too many items
  const displayBreadcrumbs = breadcrumbs.length > maxItems 
    ? [
        breadcrumbs[0], // Always show first (Dashboard)
        { label: "...", href: "#", icon: "moreHorizontal" },
        ...breadcrumbs.slice(-2) // Show last 2 items
      ]
    : breadcrumbs;

  if (displayBreadcrumbs.length <= 1) {
    return null; // Don't show breadcrumb for single item
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}
    >
      <ol className="flex items-center gap-1">
        {displayBreadcrumbs.map((item, index) => {
          const Icon = Icons[item.icon as keyof typeof Icons] || Icons.folder;
          const isLast = index === displayBreadcrumbs.length - 1;
          const isEllipsis = item.label === "...";

          return (
            <li key={`${item.href}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="size-3 text-muted-foreground/60" />
              )}
              
              {isEllipsis ? (
                <span className="px-1 text-muted-foreground/60">
                  {item.label}
                </span>
              ) : isLast || item.isCurrentPage ? (
                <span 
                  className="flex items-center gap-1.5 font-medium text-foreground"
                  aria-current="page"
                >
                  {(showHomeIcon || index > 0) && (
                    <Icon className="size-3.5" />
                  )}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  {(showHomeIcon || index > 0) && (
                    <Icon className="size-3.5" />
                  )}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Compact version for mobile
 */
export function EnhancedBreadcrumbCompact({ className }: EnhancedBreadcrumbProps) {
  const pathname = usePathname();
  
  const currentPageName = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')) {
      return "Dashboard";
    }
    
    const lastSegment = segments[segments.length - 1];
    return pathMappings[lastSegment] || lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [pathname]);

  return (
    <div className={cn("flex items-center gap-2 text-sm font-medium", className)}>
      <Home className="size-4 text-muted-foreground" />
      <span>{currentPageName}</span>
    </div>
  );
}
