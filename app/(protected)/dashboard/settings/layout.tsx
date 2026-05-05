"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

import { Main } from "@/components/settings/layout/main";
import { DashboardHeader } from "@/components/dashboard/header";
import { Separator } from "@/components/ui/separator";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const navItems = [
    {
      title: "Profile",
      href: "/dashboard/settings/profile",
    },
    {
      title: "Account",
      href: "/dashboard/settings/account",
    },
    {
      title: "Appearance",
      href: "/dashboard/settings/appearance",
    },
    {
      title: "Notifications",
      href: "/dashboard/settings/notifications",
    },
    {
      title: "Billing",
      href: "/dashboard/settings/billing",
    },
    ...(user?.role?.includes("student") ? [{
      title: "Guardians",
      href: "/dashboard/settings/guardians",
    }] : []),
    ...(user?.role?.includes("guardian") ? [{
      title: "Children",
      href: "/dashboard/settings/children",
    }] : []),
  ];

  if (isLoading) {
    return (
      <Main fixed>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="mt-2 text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </Main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Main fixed>
      <div className="space-y-6">
        <DashboardHeader heading="Settings" text="Manage account and website settings." />
        <Separator />
        
        <div className="scrollbar-hide flex overflow-x-auto pb-1">
          <nav className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="divide-y divide-muted pb-10">
          {children}
        </div>
      </div>
    </Main>
  );
}
