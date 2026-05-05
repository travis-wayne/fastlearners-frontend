"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { DashboardHeader } from "@/components/dashboard/header";
import { ChildrenForm } from "../settings/children/children-form";

export default function ChildrenPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !user?.role?.includes("guardian")) {
      router.push("/dashboard");
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !user?.role?.includes("guardian")) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="My Children"
        text="Invite children and manage your monitoring requests."
      />
      <div className="grid gap-10">
        <ChildrenForm />
      </div>
    </div>
  );
}
