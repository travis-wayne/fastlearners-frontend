"use client";

import { useEffect, useState } from "react";
import { Trash2, RotateCcw, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import {
  getTrashedLessons,
  restoreLesson,
  permanentlyDeleteLesson,
} from "@/lib/api/superadmin-lessons";
import { TrashedLesson } from "@/lib/types/superadmin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TrashedLessonsPage() {
  const [lessons, setLessons] = useState<TrashedLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "restore" | "delete" | null;
    lessonId: number | null;
    lessonTopic: string | null;
    loading: boolean;
  }>({
    open: false,
    action: null,
    lessonId: null,
    lessonTopic: null,
    loading: false,
  });

  const fetchTrashedLessons = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getTrashedLessons({ page });

      if (!response.success) {
        setError(response.message || "Failed to fetch trashed lessons");
        return;
      }

      if (response.content) {
        setLessons(response.content.lessons);
        setTotalPages(response.content.meta.last_page);
        setCurrentPage(response.content.meta.current_page);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching trashed lessons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedLessons();
  }, []);

  const handleRestore = (lessonId: number, lessonTopic: string) => {
    setConfirmDialog({
      open: true,
      action: "restore",
      lessonId,
      lessonTopic,
      loading: false,
    });
  };

  const handlePermanentDelete = (lessonId: number, lessonTopic: string) => {
    setConfirmDialog({
      open: true,
      action: "delete",
      lessonId,
      lessonTopic,
      loading: false,
    });
  };

  const confirmAction = async () => {
    if (!confirmDialog.lessonId || !confirmDialog.action) return;

    setConfirmDialog((prev) => ({ ...prev, loading: true }));

    try {
      let response;

      if (confirmDialog.action === "restore") {
        response = await restoreLesson(confirmDialog.lessonId);
        if (response.success) {
          toast.success("Lesson restored successfully!");
          // Remove from list
          setLessons((prev) => prev.filter((l) => l.id !== confirmDialog.lessonId));
        } else {
          toast.error(response.message || "Failed to restore lesson");
        }
      } else if (confirmDialog.action === "delete") {
        response = await permanentlyDeleteLesson(confirmDialog.lessonId);
        if (response.success) {
          toast.success("Lesson permanently deleted!");
          // Remove from list
          setLessons((prev) => prev.filter((l) => l.id !== confirmDialog.lessonId));
        } else {
          toast.error(response.message || "Failed to delete lesson");
        }
      }

      // Close dialog
      setConfirmDialog({
        open: false,
        action: null,
        lessonId: null,
        lessonTopic: null,
        loading: false,
      });
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-6 duration-500 animate-in fade-in-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trashed Lessons</h2>
          <p className="text-muted-foreground">
            Restore or permanently delete lessons
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchTrashedLessons(currentPage)}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 size-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lessons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trashed Lessons</CardTitle>
          <CardDescription>
            {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} in trash
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Trash2 className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm font-medium">No lessons in trash</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Deleted lessons will appear here
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Week</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">{lesson.topic}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{lesson.class}</Badge>
                      </TableCell>
                      <TableCell>{lesson.subject}</TableCell>
                      <TableCell>{lesson.term}</TableCell>
                      <TableCell>{lesson.week}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{lesson.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(lesson.id, lesson.topic)}
                          >
                            <RotateCcw className="mr-1 size-3" />
                            Restore
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handlePermanentDelete(lesson.id, lesson.topic)
                            }
                          >
                            <Trash2 className="mr-1 size-3" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchTrashedLessons(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchTrashedLessons(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          !confirmDialog.loading &&
          setConfirmDialog({
            open,
            action: null,
            lessonId: null,
            lessonTopic: null,
            loading: false,
          })
        }
        title={
          confirmDialog.action === "restore"
            ? "Restore Lesson"
            : "Permanently Delete Lesson"
        }
        description={
          confirmDialog.action === "restore"
            ? `Are you sure you want to restore "${confirmDialog.lessonTopic}"? It will be moved back to the active lessons list.`
            : `Are you sure you want to permanently delete "${confirmDialog.lessonTopic}"? This action cannot be undone.`
        }
        confirmLabel={confirmDialog.action === "restore" ? "Restore" : "Delete"}
        cancelLabel="Cancel"
        onConfirm={confirmAction}
        variant={confirmDialog.action === "delete" ? "destructive" : "default"}
        loading={confirmDialog.loading}
      />
    </div>
  );
}
