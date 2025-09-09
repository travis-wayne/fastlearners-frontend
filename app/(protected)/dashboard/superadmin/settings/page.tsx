"use client";

import { SharedSettingsPage } from "@/components/settings/shared-settings-page";
import { usePermissionCheck } from "@/hooks/useRBACGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { hasPermission, userRole } = usePermissionCheck();
  const canAccessSuperAdminSettings = hasPermission('manage_platform') || userRole === 'superadmin';

  if (!canAccessSuperAdminSettings) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>
          <strong>Access Restricted:</strong> Only super administrators can access these settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <SharedSettingsPage 
      customTitle="Super Administrator Settings"
      customDescription="Manage your super administrator profile, security, and account settings."
      hideAccountTab={true}
    />
  );
}
