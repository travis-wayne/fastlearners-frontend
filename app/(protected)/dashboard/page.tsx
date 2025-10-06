"use client";

import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  AdminDashboard,
  GuardianDashboard,
  StudentDashboard,
  SuperAdminDashboard,
  TeacherDashboard,
  GuestDashboard,
} from "@/components/dashboard/role-dashboards";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

// Loading component with nice animation
function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 text-center"
      >
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="size-8 rounded-full border-2 border-primary border-t-transparent"
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground"
        >
          Loading your personalized dashboard...
        </motion.p>
      </motion.div>
    </div>
  );
}

// Guest dashboard component

// Component that renders the appropriate dashboard based on user role
function RoleDashboard({ userRole }: { userRole: string }) {
  switch (userRole) {
    case "student":
      return <StudentDashboard />;
    case "guardian":
      return <GuardianDashboard />;
    case "teacher":
      return <TeacherDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "superadmin":
      return <SuperAdminDashboard />;
    case "guest":
      return <GuestDashboard />;
    default:
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex min-h-[60vh] items-center justify-center"
        >
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="alertCircle" />
            <EmptyPlaceholder.Title>Role Not Recognized</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              We couldn&apos;t determine your role. Please contact support.
            </EmptyPlaceholder.Description>
            <Button>Contact Support</Button>
          </EmptyPlaceholder>
        </motion.div>
      );
  }
}

export default function UnifiedDashboardPage() {
  const { user, isHydrated } = useAuthStore();

  // Show loading state while user data is being fetched
  if (!isHydrated || !user) {
    return <DashboardLoading />;
  }

  // Get the user's primary role (first role in the array)
  const primaryRole = user.role[0] || "guest";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <RoleDashboard userRole={primaryRole} />
    </motion.div>
  );
}
