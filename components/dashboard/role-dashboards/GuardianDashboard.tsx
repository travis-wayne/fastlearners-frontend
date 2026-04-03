"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Clock,
  Info,
  Loader2,
  UserPlus
} from "lucide-react";


import { GlassGreetingCard } from "@/components/dashboard/glass-greeting-card";
import { OverviewGrid } from "@/components/dashboard/OverviewGrid";
import { DismissibleCard } from "@/components/ui/dismissible-card";

import { getGuardianDashboard } from "@/lib/api/dashboard";
import { getGuardianChildrenHistory } from "@/lib/api/guardian";
import type { ChildRequestItem } from "@/lib/types/guardian";
import { useAuthStore } from "@/store/authStore";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

function formatDisplayName(user?: {
  name?: string | null;
  username?: string | null;
  email?: string | null;
}) {
  if (!user) return "Guardian";
  const candidates = [user.name, user.username, user.email].filter(
    (v): v is string => typeof v === "string" && v.trim().length > 0,
  );
  const first = candidates[0];
  if (!first) return "Guardian";
  const base = first.includes("@") ? first.split("@")[0] : first;
  return base.split(" ")[0].replace(/\./g, " ");
}

export function GuardianDashboard() {
  const { user } = useAuthStore();
  const displayName = formatDisplayName(user as any);

  const [dashboardData, setDashboardData] = useState<{ children: number; report: null } | null>(null);
  const [childrenHistory, setChildrenHistory] = useState<ChildRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dashResponse, historyResponse] = await Promise.all([
          getGuardianDashboard(),
          getGuardianChildrenHistory(),
        ]);

        if (dashResponse.success && dashResponse.content) {
          setDashboardData(dashResponse.content);
        }
        if (historyResponse.success && historyResponse.content) {
          setChildrenHistory(historyResponse.content.history.request_history ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch guardian data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalChildren = dashboardData?.children ?? 0;
  const pendingCount = childrenHistory.filter(c => c.status === 'pending').length;
  const acceptedCount = childrenHistory.filter(c => c.status === 'accepted').length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="dashboard-spacing"
    >
      <motion.div variants={itemVariants}>
        <DismissibleCard
          id="guardian_dashboard_intro"
          title="Welcome to your Guardian Dashboard!"
          icon={<Info className="size-5 text-blue-500" />}
          content="Monitor your children's learning progress. Use the Children link in the sidebar to manage your linked students."
          className="mb-6 border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/20"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassGreetingCard
          userName={displayName}
          role="Guardian"
          level={acceptedCount}
          streak={pendingCount}
          lessonsToday={totalChildren}
        />
      </motion.div>

      <div className="responsive-gap grid grid-cols-1 sm:grid-cols-3">
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -2 }}>
          <Card className="relative overflow-hidden border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50 dark:border-gray-700/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardContent className="responsive-padding">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <Users className="size-6 text-blue-600" />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-medium text-muted-foreground">Total Children</p>
                   {isLoading ? (
                     <Loader2 className="size-5 animate-spin text-muted-foreground" />
                   ) : (
                     <h3 className="text-2xl font-bold">{totalChildren}</h3>
                   )}
                   <p className="text-[10px] text-muted-foreground">Linked Children</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -2 }}>
          <Card className="relative overflow-hidden border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50 dark:border-gray-700/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardContent className="responsive-padding">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-amber-500/10 p-3">
                  <Clock className="size-6 text-amber-600" />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                   {isLoading ? (
                     <Loader2 className="size-5 animate-spin text-muted-foreground" />
                   ) : (
                     <h3 className="text-2xl font-bold">{pendingCount}</h3>
                   )}
                   <p className="text-[10px] text-muted-foreground">Waiting response</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -2 }}>
          <Card className="relative overflow-hidden border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50 dark:border-gray-700/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardContent className="responsive-padding">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-emerald-500/10 p-3">
                  <UserCheck className="size-6 text-emerald-600" />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                   {isLoading ? (
                     <Loader2 className="size-5 animate-spin text-muted-foreground" />
                   ) : (
                     <h3 className="text-2xl font-bold">{acceptedCount}</h3>
                   )}
                   <p className="text-[10px] text-muted-foreground">Linked students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="responsive-gap grid grid-cols-1 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Linked Children</CardTitle>
                <CardDescription>Recent child link requests and their status</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/settings/children">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                      <Skeleton className="h-6 w-[80px]" />
                    </div>
                  ))}
                </div>
              ) : childrenHistory.length > 0 ? (
                <div className="space-y-4">
                  {childrenHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                          <Users className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.child_name || "Pending Invitation"}</p>
                          <p className="text-xs text-muted-foreground">{item.child_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.class && <Badge variant="outline" className="hidden sm:inline-flex">{item.class}</Badge>}
                        <Badge
                          variant={
                            item.status === "accepted"
                              ? "default"
                              : item.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Users className="size-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No children linked yet</h3>
                  <p className="mb-6 text-sm text-muted-foreground">Invite your children to monitor their learning progress.</p>
                  <Button asChild>
                    <Link href="/dashboard/settings/children">
                      <UserPlus className="mr-2 size-4" />
                      Invite a Child
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <OverviewGrid
            stats={[
              { label: "Total Children", value: totalChildren },
              { label: "Pending Requests", value: pendingCount },
              { label: "Accepted", value: acceptedCount },
              { label: "Cancelled", value: childrenHistory.filter(c => c.status === 'cancelled').length },
            ]}
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and linked children</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/dashboard/settings/children">Manage Children</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/settings">Account Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
