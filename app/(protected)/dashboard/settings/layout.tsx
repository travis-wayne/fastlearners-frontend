"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Bell, Monitor, Palette, UserCog, Wrench } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Main } from "@/components/settings/layout/main";

import { SidebarNav } from "./components/sidebar-nav";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/dashboard/settings/profile",
    icon: <UserCog size={18} />,
  },
  {
    title: "Account",
    href: "/dashboard/settings/account",
    icon: <Wrench size={18} />,
  },
  {
    title: "Appearance",
    href: "/dashboard/settings/appearance",
    icon: <Palette size={18} />,
  },
  {
    title: "Notifications",
    href: "/dashboard/settings/notifications",
    icon: <Bell size={18} />,
  },
  {
    title: "Billing",
    href: "/dashboard/settings/billing",
    icon: <Monitor size={18} />,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

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
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
        {user && (
          <p className="text-sm text-muted-foreground">Role: {user.role[0]}</p>
        )}
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="top-0 lg:sticky lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex w-full overflow-y-hidden p-1">{children}</div>
      </div>
    </Main>
  );
}
