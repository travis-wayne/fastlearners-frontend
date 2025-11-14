"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import { usePermissionCheck } from "@/hooks/useRBACGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const router = useRouter();
  const { hasPermission, userRole } = usePermissionCheck();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const canAccessAdminSettings =
    hasPermission("manage_platform") || userRole === "admin";

  useEffect(() => {
    if (canAccessAdminSettings) {
      setIsRedirecting(true);
      router.push("/dashboard/settings");
    }
  }, [canAccessAdminSettings, router]);

  if (!canAccessAdminSettings) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>
          <strong>Access Restricted:</strong> Only administrators can access
          these settings.
        </AlertDescription>
      </Alert>
    );
  }

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="mr-2 size-6 animate-spin" />
        <span>Redirecting to settings...</span>
      </div>
    );
  }

  // Fallback (should not reach here due to redirect)
  return null;
}
