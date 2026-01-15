"use client";

import { useState } from "react";
import { MoreHorizontal, Eye, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { trashLesson } from "@/lib/api/superadmin-lessons";

interface LessonActionsDropdownProps {
  lessonId: number;
  lessonTopic: string;
  onView?: (lessonId: number) => void;
  onTrashSuccess?: (lessonId: number) => void;
}

export function LessonActionsDropdown({
  lessonId,
  lessonTopic,
  onView,
  onTrashSuccess,
}: LessonActionsDropdownProps) {
  const [showTrashDialog, setShowTrashDialog] = useState(false);
  const [isTrashLoading, setIsTrashLoading] = useState(false);

  const handleTrash = async () => {
    setIsTrashLoading(true);
    try {
      const response = await trashLesson(lessonId);
      if (response.success) {
        toast.success("Lesson moved to trash", {
          description: `"${lessonTopic}" has been moved to trash.`,
        });
        onTrashSuccess?.(lessonId);
        setShowTrashDialog(false);
      } else {
        toast.error("Failed to trash lesson", {
          description: response.message || "An error occurred",
        });
      }
    } catch (error: any) {
      toast.error("Failed to trash lesson", {
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsTrashLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onView?.(lessonId);
            }}
          >
            <Eye className="mr-2 size-4" />
            View Lesson
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setShowTrashDialog(true);
            }}
          >
            <Trash2 className="mr-2 size-4" />
            Move to Trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showTrashDialog}
        onOpenChange={setShowTrashDialog}
        title="Move to Trash"
        description={`Are you sure you want to move "${lessonTopic}" to trash? You can restore it later from the trash.`}
        confirmLabel="Move to Trash"
        cancelLabel="Cancel"
        onConfirm={handleTrash}
        variant="destructive"
        loading={isTrashLoading}
      />
    </>
  );
}
