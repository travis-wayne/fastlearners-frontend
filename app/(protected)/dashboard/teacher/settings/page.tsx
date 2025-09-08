"use client";

import { SharedSettingsPage } from "@/components/settings/shared-settings-page";
import { usePermissionCheck } from "@/hooks/useRBACGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { hasPermission, userRole } = usePermissionCheck();
  const canAccessTeacherSettings = hasPermission('manage_lessons') || userRole === 'teacher';

  if (!canAccessTeacherSettings) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>
          <strong>Access Restricted:</strong> Only teachers can access these settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <SharedSettingsPage 
      customTitle="Teacher Settings"
      customDescription="Manage your teacher profile, security, and account settings."
      hideAccountTab={true}
    />
  );
}
