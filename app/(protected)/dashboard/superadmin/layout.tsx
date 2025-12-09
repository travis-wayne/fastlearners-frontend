"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { LayoutDashboard, Upload, BookOpen, FolderCog } from "lucide-react";
import { toast } from "sonner";

interface SuperadminLayoutProps {
  children: React.ReactNode;
}

export default function SuperadminLayout({ children }: SuperadminLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.role.includes("superadmin")) {
      toast.error("Access Denied", { description: "You do not have permission to view this page." });
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user || !user.role.includes("superadmin")) {
      return null;
  }

  const tabs = [
    {
      href: "/dashboard/superadmin",
      label: "Overview",
      icon: LayoutDashboard,
      active: pathname === "/dashboard/superadmin",
    },
    {
      href: "/dashboard/superadmin/uploads",
      label: "Upload Files",
      icon: Upload,
      active: pathname === "/dashboard/superadmin/uploads",
    },
    {
      href: "/dashboard/superadmin/browse",
      label: "Browse Lessons",
      icon: BookOpen,
      active: pathname === "/dashboard/superadmin/browse",
    },
    {
      href: "/dashboard/superadmin/manage",
      label: "Manage Files",
      icon: FolderCog,
      active: pathname === "/dashboard/superadmin/manage",
    },
  ];

  return (
    <div className="flex flex-col space-y-6 p-8">
      {/* Sub-navigation Header */}
      <div className="flex flex-col gap-4 border-b pb-6">
        <div className="flex flex-col gap-2">
           <h1 className="text-3xl font-bold tracking-tight">Superadmin Dashboard</h1>
           <p className="text-muted-foreground">Manage lesson content and system settings.</p>
        </div>
        
        <nav className="flex items-center space-x-2">
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href}>
              <Button
                variant={tab.active ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "justify-start gap-2",
                  tab.active && "bg-secondary font-medium text-foreground"
                )}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
