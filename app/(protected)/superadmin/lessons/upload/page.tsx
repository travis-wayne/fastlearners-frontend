"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SmartCSVUpload } from "@/components/upload/SmartCSVUpload";
import { usePermissionCheck } from "@/hooks/useRBACGuard";

export default function LessonUploadPage() {
  const { hasPermission, userRole } = usePermissionCheck();
  const [completedUploads, setCompletedUploads] = useState<Set<string>>(new Set());

  // Check permissions
  const canManageLessons = hasPermission('manage_lessons');

  const handleUploadSuccess = (configKey: string) => {
    setCompletedUploads(prev => new Set([...Array.from(prev), configKey]));
  };

  if (!canManageLessons) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <Link href="/superadmin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <DashboardHeader
          heading="Upload Lesson Files"
          text="Upload and manage lesson content and materials"
        />

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Access Restricted:</strong> Only Teachers, Admins, and SuperAdmins can upload lesson content. 
            Your current role ({userRole}) does not have permission to manage lessons.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Link href="/superadmin/lessons">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upload Options
          </Button>
        </Link>
      </div>

      <SmartCSVUpload 
        onUploadSuccess={handleUploadSuccess}
        completedUploads={completedUploads}
      />
    </div>
  );
}
