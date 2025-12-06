"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FontProvider } from "@/context/font-provider";
import { useAuthStore } from "@/store/authStore";

import { sidebarLinks } from "@/config/dashboard";
import { Z_INDEX } from "@/config/z-index";
import { useAuthInit } from "@/hooks/useAuthInit";
import { Breadcrumb } from "@/components/dashboard/breadcrumb";
import { SearchCommand } from "@/components/dashboard/search-command";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { NetworkStatus } from "@/components/navigation/network-status";
import { NotificationCenter } from "@/components/navigation/notification-center";
import { ProfileCompletionBanner } from "@/components/onboarding/profile-completion-banner";
import { AcademicProvider } from "@/components/providers/academic-context";

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
        <div className="size-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card px-8 py-10 text-center shadow-sm">
          <div className="size-10 animate-spin rounded-full border-2 border-primary/60 border-t-transparent" />
          <div>
            <p className="text-lg font-semibold text-foreground">
              Securing your workspace
            </p>
            <p className="text-sm text-muted-foreground">
              Hang tight while we redirect you to the correct destination.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items.filter(({ authorizeOnly }) => {
      if (!authorizeOnly) return true;
      if (!user.role) return false;
      // Convert enum to string for comparison with user.role array from API
      const roleString = authorizeOnly.toLowerCase();
      return user.role.includes(roleString as any);
    }),
  }));

  return (
    <AcademicProvider>
      <FontProvider>
        <div className="relative flex min-h-screen w-full">
          <DashboardSidebar links={filteredLinks} />

          <div className="flex flex-1 flex-col">
            <header
              className="sticky top-0 flex h-14 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md lg:h-[60px] xl:px-8"
              style={{ zIndex: Z_INDEX.navbar }}
            >
              <div className="flex w-full items-center gap-x-3">
                <MobileSheetSidebar links={filteredLinks} />

                <div className="w-full flex-1">
                  <Breadcrumb />
                </div>

                <SearchCommand links={filteredLinks} className="mr-2" />
                <NetworkStatus className="mr-2" />
                <NotificationCenter className="mr-2" />
                <ModeToggle />
                <UserAccountNav />
              </div>
            </header>

            <div
              className="sticky top-14 lg:top-[60px]"
              style={{ zIndex: Z_INDEX.stickyBanner }}
            >
              <ProfileCompletionBanner />
            </div>

            <main className="flex-1 px-4 pb-16 pt-4 xl:px-8">
              <div className="flex size-full flex-col gap-4 lg:gap-6">
                {children}
              </div>
            </main>
          </div>

          {/* TODO: Reintroduce the MarqueeMessages banner once the API is restored. */}
        </div>
      </FontProvider>
    </AcademicProvider>
  );
}
