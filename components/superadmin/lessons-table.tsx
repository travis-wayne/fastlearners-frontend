"use client";

import React, { useCallback, startTransition } from "react";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useLessonsStore } from "@/lib/store/lessons";
import { Lesson } from "@/lib/types/lessons";
import { trashLesson } from "@/lib/api/superadmin-lessons";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface LessonsTableProps {
  onLessonSelect?: (lessonId: number) => void;
  onTrashSuccess?: (lessonId: number) => void;
  showPagination?: boolean;
  selectedSubject?: string | null;
  onBackToSubjects?: () => void;
}

interface RowActionsProps {
  lesson: Lesson;
  onView?: (lessonId: number) => void;
  onTrashSuccess?: (lessonId: number) => void;
}

function RowActions({ lesson, onView, onTrashSuccess }: RowActionsProps) {
  const [showTrashDialog, setShowTrashDialog] = React.useState(false);
  const [isTrashLoading, setIsTrashLoading] = React.useState(false);

  const handleView = useCallback(() => {
    onView?.(lesson.id);
  }, [onView, lesson.id]);

  const handleTrash = useCallback(async () => {
    setIsTrashLoading(true);
    try {
      const response = await trashLesson(lesson.id);
      if (response.success) {
        toast.success(`"${lesson.topic}" moved to trash`);
        onTrashSuccess?.(lesson.id);
      } else {
        toast.error(response.message || "Failed to move lesson to trash");
      }
    } catch (error) {
      toast.error("An error occurred while moving the lesson to trash");
    } finally {
      setIsTrashLoading(false);
      setShowTrashDialog(false);
    }
  }, [lesson.id, lesson.topic, onTrashSuccess]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 p-0 hover:bg-muted"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={handleView} className="cursor-pointer">
            <Eye className="mr-2 size-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowTrashDialog(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
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
        description={`Are you sure you want to move "${lesson.topic}" to trash? You can restore it later from the trash.`}
        confirmLabel="Move to Trash"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleTrash}
        loading={isTrashLoading}
      />
    </>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Topic</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>Week</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-5 w-48" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-12" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="size-8" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function LessonsTable({
  onLessonSelect,
  onTrashSuccess,
  showPagination = true,
  selectedSubject,
  onBackToSubjects,
}: LessonsTableProps) {
  const {
    lessons,
    isLoadingLessons,
    error,
    currentPage,
    totalPages,
    totalLessons,
    fetchLessons,
    clearError,
  } = useLessonsStore();

  const handleLessonSelect = useCallback(
    (lessonId: number) => {
      startTransition(() => {
        onLessonSelect?.(lessonId);
      });
    },
    [onLessonSelect]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      startTransition(() => {
        fetchLessons(page);
      });
    },
    [fetchLessons]
  );

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
            Active
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  // Show loading skeleton
  if (isLoadingLessons) {
    return (
      <div className="space-y-4">
        {selectedSubject && onBackToSubjects && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToSubjects}
            className="gap-2"
          >
            <ChevronLeft className="size-4" />
            Back to Subjects
          </Button>
        )}
        <TableSkeleton />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={clearError} className="ml-2">
            Dismiss
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show empty state
  if (!lessons || lessons.length === 0) {
    return (
      <div className="space-y-4">
        {selectedSubject && onBackToSubjects && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToSubjects}
            className="gap-2"
          >
            <ChevronLeft className="size-4" />
            Back to Subjects
          </Button>
        )}
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 sm:py-16">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted sm:mb-6 sm:size-20">
              <BookOpen className="size-8 text-muted-foreground sm:size-10" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
              No lessons found
            </h3>
            <p className="max-w-md text-center text-sm text-muted-foreground sm:text-base">
              {selectedSubject
                ? `No lessons found for ${selectedSubject}. Try selecting different filters.`
                : "Try adjusting your filters to find lessons. Make sure you've selected a class, subject, term, and week."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with back button and count */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {selectedSubject && onBackToSubjects && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToSubjects}
              className="gap-2"
            >
              <ChevronLeft className="size-4" />
              Back
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="size-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">
                {selectedSubject ? `${selectedSubject} Lessons` : "Lessons"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"} found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] font-semibold">Topic</TableHead>
              <TableHead className="font-semibold">Class</TableHead>
              <TableHead className="font-semibold">Subject</TableHead>
              <TableHead className="font-semibold">Term</TableHead>
              <TableHead className="font-semibold">Week</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="w-[70px] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map((lesson) => (
              <TableRow
                key={lesson.id}
                className="cursor-pointer"
                onClick={() => handleLessonSelect(lesson.id)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                    <span className="line-clamp-1">{lesson.topic}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {lesson.class}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="line-clamp-1 text-muted-foreground">
                    {lesson.subject}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{lesson.term}</span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{lesson.week}</span>
                </TableCell>
                <TableCell>{getStatusBadge(lesson.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="size-3" />
                    <span className="text-xs">
                      {new Date(lesson.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <RowActions
                    lesson={lesson}
                    onView={handleLessonSelect}
                    onTrashSuccess={onTrashSuccess}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => handlePageChange(1)}
              disabled={currentPage <= 1}
            >
              <ChevronsLeft className="size-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="mx-2 flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] + 1 < page && (
                      <span className="px-1 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className="size-8"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="size-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage >= totalPages}
            >
              <ChevronsRight className="size-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
