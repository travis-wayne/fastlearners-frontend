"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { DashboardHeader } from "@/components/dashboard/header";
import { GuardiansForm } from "../settings/guardians/guardians-form";

export default function GuardiansPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !user?.role?.includes("student")) {
      router.push("/dashboard");
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !user?.role?.includes("student")) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Guardians"
        text="Manage guardian requests and monitor who can view your progress."
      />
      <div className="grid gap-10">
        <GuardiansForm />
      </div>
    </div>
  );
}
