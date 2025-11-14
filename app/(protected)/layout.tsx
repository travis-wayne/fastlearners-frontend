"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontProvider } from "@/context/font-provider";
import { useAuthStore } from "@/store/authStore";

import { sidebarLinks } from "@/config/dashboard";
import { useAuthInit } from "@/hooks/useAuthInit";
import { Breadcrumb } from "@/components/dashboard/breadcrumb";
import { SearchCommand } from "@/components/dashboard/search-command";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { MarqueeMessages } from "@/components/navigation/marquee-messages";
import { NetworkStatus } from "@/components/navigation/network-status";
import { NotificationCenter } from "@/components/navigation/notification-center";
import { ProfileCompletionBanner } from "@/components/onboarding/profile-completion-banner";
import { AcademicProvider } from "@/components/providers/academic-context";
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
        <div className="size-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
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
            <header className="sticky top-0 z-50 flex h-14 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md lg:h-[60px] xl:px-8">
              <MaxWidthWrapper className="flex max-w-full items-center gap-x-3 px-0">
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

            <div className="sticky top-14 z-40 lg:top-[60px]">
              <ProfileCompletionBanner />
            </div>

            <main className="flex-1 p-4 pb-16 xl:px-8">
              <MaxWidthWrapper className="flex h-full max-w-full flex-col gap-4 px-0 lg:gap-6">
                {children}
              </MaxWidthWrapper>
            </main>
          </div>

          {/* Marquee Messages at bottom - full screen width and sticky */}
          <div className="fixed inset-x-0 bottom-0 z-40">
            <MarqueeMessages />
          </div>
        </div>
      </FontProvider>
    </AcademicProvider>
  );
}
