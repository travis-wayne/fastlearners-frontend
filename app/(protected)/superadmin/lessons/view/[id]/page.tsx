"use client";

import { useRouter } from "next/navigation";
import { LessonDetailView } from "@/components/lessons/LessonDetailView";
import { usePermissionCheck } from "@/hooks/useRBACGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LessonViewPageProps {
  params: {
    id: string;
  };
}

export default function LessonViewPage({ params }: LessonViewPageProps) {
  const router = useRouter();
  const { hasPermission, userRole } = usePermissionCheck();
  const lessonId = parseInt(params.id);

  // Check permissions
  const canManageLessons = hasPermission('manage_lessons');

  if (!canManageLessons) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Access Restricted:</strong> Only Teachers, Admins, and SuperAdmins can view lesson content. 
            Your current role ({userRole}) does not have permission to manage lessons.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isNaN(lessonId)) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Invalid lesson ID provided.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleDelete = () => {
    // Navigate back to lessons list after deletion
    router.push("/superadmin/lessons");
  };

  return (
    <div className="space-y-6 p-6">
      <LessonDetailView 
        lessonId={lessonId} 
        onDelete={handleDelete}
      />
    </div>
  );
}
