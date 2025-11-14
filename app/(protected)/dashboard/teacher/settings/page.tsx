"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { usePermissionCheck } from "@/hooks/useRBACGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const { hasPermission, userRole } = usePermissionCheck();
  const canAccessTeacherSettings =
    hasPermission("manage_lessons") || userRole === "teacher";
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (canAccessTeacherSettings) {
      setIsRedirecting(true);
      router.push("/dashboard/settings");
    }
  }, [canAccessTeacherSettings, router]);

  if (!canAccessTeacherSettings) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>
          <strong>Access Restricted:</strong> Only teachers can access these
          settings.
        </AlertDescription>
      </Alert>
    );
  }

  if (isRedirecting) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">
            Redirecting to settings...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
