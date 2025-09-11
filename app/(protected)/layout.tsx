"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sidebarLinks } from "@/config/dashboard";
import { useAuthStore } from "@/store/authStore";
import { useAuthInit } from "@/hooks/useAuthInit";
import { SearchCommand } from "@/components/dashboard/search-command";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { NotificationCenter } from "@/components/navigation/notification-center";
import { NetworkStatus } from "@/components/navigation/network-status";
import { MarqueeMessages } from "@/components/navigation/marquee-messages";
import { Breadcrumb } from "@/components/dashboard/breadcrumb";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { isInitialized, isLoading } = useAuthInit();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full size-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items.filter(
      ({ authorizeOnly }) => {
        if (!authorizeOnly) return true;
        if (!user.role) return false;
        // Convert enum to string for comparison with user.role array from API
        const roleString = authorizeOnly.toLowerCase();
        return user.role.includes(roleString as any);
      }
    ),
  }));

  return (
    <div className="relative flex min-h-screen w-full">
      <DashboardSidebar links={filteredLinks} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-14 bg-background/80 backdrop-blur-md border-b border-border/40 px-4 lg:h-[60px] xl:px-8">
          <MaxWidthWrapper className="flex max-w-7xl items-center gap-x-3 px-0">
            <MobileSheetSidebar links={filteredLinks} />

            <div className="w-full flex-1">
              <Breadcrumb />
            </div>

            <SearchCommand links={filteredLinks} className="mr-2" />
            <NetworkStatus className="mr-2" />
            <NotificationCenter className="mr-2" />
            <ModeToggle />
            <UserAccountNav />
          </MaxWidthWrapper>
        </header>

        <main className="flex-1 p-4 xl:px-8 pb-16">
          <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
            {children}
          </MaxWidthWrapper>
        </main>
      </div>
      
      {/* Marquee Messages at bottom - full screen width and sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <MarqueeMessages />
      </div>
    </div>
  );
}
