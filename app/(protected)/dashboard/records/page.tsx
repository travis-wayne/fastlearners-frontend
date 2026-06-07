"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { StudentRecordsPage } from "@/components/records/StudentRecordsPage";
import { GuardianRecordsPage } from "@/components/records/GuardianRecordsPage";
import { RecordsSkeleton } from "@/components/records/RecordsSkeleton";

export default function RecordsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (isHydrated && user?.role) {
      const role = user.role[0];
      if (role !== "student" && role !== "guardian") {
        router.replace("/dashboard");
      }
    }
  }, [isHydrated, user, router]);

  if (!isHydrated) {
    return (
      <div className="container py-6">
        <RecordsSkeleton />
      </div>
    );
  }

  const role = user?.role?.[0];

  if (role === "student") {
    return <StudentRecordsPage />;
  }

  if (role === "guardian") {
    return <GuardianRecordsPage />;
  }

  return null;
}
