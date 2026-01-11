"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Bell,
  Monitor,
  Palette,
  UserCog,
  Wrench,
  Settings2,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
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
      <div className="relative mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-2 pb-8 pt-4 md:px-4 lg:px-6">
        {/* Subtle background like shadcn dashboard */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.10),transparent_55%)]" />

        {/* Hero header */}
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-background to-muted/60 p-6 shadow-sm md:p-8">
          <div className="absolute right-0 top-0 -z-0 size-40 rounded-full bg-primary/10 blur-3xl md:size-64" />
          <div className="absolute -left-12 bottom-0 -z-0 size-40 rounded-full bg-muted/40 blur-3xl md:size-56" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm md:size-14">
                <Settings2 className="size-6 md:size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Settings
                </h1>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground md:text-base">
                  Fine‑tune your profile, security, appearance, and notifications to
                  match how you learn best.
                </p>
                {user && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary">
                      {user.role?.[0] ?? "Learner"}
                    </Badge>
                    {user.email && (
                      <span className="truncate text-xs md:text-sm">
                        {user.email}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-card/70 px-4 py-3 shadow-sm backdrop-blur">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Account protection
                  </p>
                  <p className="text-sm font-semibold">Secure</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-card/70 px-4 py-3 shadow-sm backdrop-blur">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bell className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Notification preset
                  </p>
                  <p className="text-sm font-semibold">Balanced</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout body */}
        <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row lg:gap-10 xl:gap-12">
          <aside className="w-full min-w-[240px] lg:sticky lg:top-4 lg:w-1/4 xl:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex min-h-0 w-full flex-col">
            {children}
          </div>
        </div>
      </div>
    </Main>
  );
}
