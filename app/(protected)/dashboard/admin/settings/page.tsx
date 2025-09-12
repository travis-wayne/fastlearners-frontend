"use client";

import { AlertCircle } from "lucide-react";

import { usePermissionCheck } from "@/hooks/useRBACGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SharedSettingsPage } from "@/components/settings/shared-settings-page";

export default function SettingsPage() {
  const { hasPermission, userRole } = usePermissionCheck();
  const canAccessAdminSettings =
    hasPermission("manage_platform") || userRole === "admin";

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

  return (
    <SharedSettingsPage
      customTitle="Administrator Settings"
      customDescription="Manage your administrator profile, security, and account settings."
      hideAccountTab={true}
    />
  );
}
