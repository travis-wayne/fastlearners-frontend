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
    <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8">
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
