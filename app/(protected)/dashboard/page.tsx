"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { useAuthStore } from "@/store/authStore";
import { 
  StudentDashboard, 
  AdminDashboard, 
  GuardianDashboard,
  TeacherDashboard,
  SuperAdminDashboard 
} from "@/components/dashboard/role-dashboards";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";

// Role-specific welcome messages and descriptions
const getRoleContent = (role: string) => {
  switch (role) {
    case UserRole.STUDENT:
      return {
        heading: "Welcome back, Student!",
        text: "Ready to continue your learning journey? Let's pick up where you left off."
      };
    case UserRole.GUARDIAN:
      return {
        heading: "Guardian Dashboard",
        text: "Monitor your children's progress and stay connected with their learning journey."
      };
    case UserRole.ADMIN:
    case UserRole.SUPERADMIN:
      return {
        heading: "Admin Dashboard",
        text: "Manage platform content, users, and monitor system performance."
      };
    case UserRole.TEACHER:
      return {
        heading: "Teacher Dashboard",
        text: "Manage your classes, create lessons, and track student progress."
      };
    case UserRole.GUEST:
      return {
        heading: "Welcome to FastLearners!",
        text: "Explore our platform and discover what we have to offer."
      };
    default:
      return {
        heading: "Dashboard",
        text: "Welcome to your personalized dashboard."
      };
  }
};

// Component that renders the appropriate dashboard based on user role
function RoleDashboard({ userRole }: { userRole: string }) {
  switch (userRole) {
    case UserRole.STUDENT:
      return <StudentDashboard />;
      
    case UserRole.GUARDIAN:
      return <GuardianDashboard />;
      
    case UserRole.ADMIN:
    case UserRole.SUPERADMIN:
      return <AdminDashboard />;
      
    case UserRole.TEACHER:
      return <TeacherDashboard />;
      
    case UserRole.GUEST:
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="eye" />
          <EmptyPlaceholder.Title>Explore FastLearners</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            As a guest, you can browse our content. Sign up to unlock the full learning experience!
          </EmptyPlaceholder.Description>
          <div className="flex gap-2">
            <Button>Upgrade Account</Button>
            <Button variant="outline">Browse Content</Button>
          </div>
        </EmptyPlaceholder>
      );
      
    default:
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="alertCircle" />
          <EmptyPlaceholder.Title>Role Not Recognized</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
          We couldn&apos;t determine your role. Please contact support.
          </EmptyPlaceholder.Description>
          <Button>Contact Support</Button>
        </EmptyPlaceholder>
      );
  }
}

export default function UnifiedDashboardPage() {
  const { user } = useAuthStore();
  
  // Show loading state while user data is being fetched
  if (!user) {
    return (
      <>
        <DashboardHeader
          heading="Dashboard"
          text="Loading your personalized dashboard..."
        />
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  // Get the user's primary role (first role in the array)
  const primaryRole = user.role[0] || UserRole.GUEST;
  const roleContent = getRoleContent(primaryRole);

  return (
    <>
      <DashboardHeader
        heading={roleContent.heading}
        text={roleContent.text}
      />
      <RoleDashboard userRole={primaryRole} />
    </>
  );
}
