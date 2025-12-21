"use client";

import React, { useCallback, startTransition } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Users,
  PlayCircle,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";

import { useLessonsStore } from "@/lib/store/lessons";
import { Lesson } from "@/lib/types/lessons";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LessonsListProps {
  onLessonSelect?: (lessonId: number) => void;
  showPagination?: boolean;
  compact?: boolean;
}

interface LessonCardProps {
  lesson: Lesson;
  onSelect?: (lessonId: number) => void;
  compact?: boolean;
}

function LessonCard({ lesson, onSelect, compact = false }: LessonCardProps) {
  const handleClick = useCallback(() => {
    startTransition(() => {
      onSelect?.(lesson.id);
    });
  }, [onSelect, lesson.id]);

  const statusColor =
    lesson.status === "in_progress"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
      : "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400 border-slate-200 dark:border-slate-700";

  const isCompleted = lesson.status === "completed";

  if (compact) {
    return (
      <Card
        className={cn(
          "group relative cursor-pointer border-2 bg-gradient-to-br from-card to-muted/30 transition-all duration-300 hover:scale-[1.02] hover:border-primary hover:shadow-lg",
        )}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : (
                  <PlayCircle className="size-4 text-primary" />
                )}
                <Badge
                  variant="outline"
                  className={cn("text-[10px] font-medium sm:text-xs", statusColor)}
                >
                  {lesson.status === "in_progress" ? "In Progress" : lesson.status}
                </Badge>
              </div>
              <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
                {lesson.topic}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {lesson.class} • {lesson.subject}
              </p>
              <div className="mt-2 flex items-center gap-1.5 sm:gap-2">
                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                  {lesson.term} Term
                </Badge>
                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                  Week {lesson.week}
                </Badge>
              </div>
            </div>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "group relative cursor-pointer border-2 bg-gradient-to-br from-card via-card to-muted/20 transition-all duration-300 hover:scale-[1.02] hover:border-primary hover:shadow-xl",
              isCompleted && "ring-2 ring-emerald-500/20",
            )}
            onClick={handleClick}
          >
            {/* Status indicator bar */}
            <div
              className={cn(
                "absolute left-0 top-0 h-1 w-full rounded-t-lg",
                isCompleted
                  ? "bg-emerald-500"
                  : lesson.status === "in_progress"
                    ? "bg-primary"
                    : "bg-muted",
              )}
            />

            <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3 md:p-6 md:pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-xl transition-colors sm:size-10",
                        isCompleted
                          ? "bg-emerald-100 dark:bg-emerald-900/30"
                          : "bg-primary/10 group-hover:bg-primary/20",
                      )}
                    >
                      {isCompleted ? (
                        <Award className="size-4 text-emerald-600 dark:text-emerald-400 sm:size-5" />
                      ) : (
                        <PlayCircle className="size-4 text-primary sm:size-5" />
                      )}
                    </div>
                    <Badge
                      className={cn(
                        "text-xs font-medium",
                        statusColor,
                      )}
                    >
                      {lesson.status === "in_progress" ? (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="size-3" />
                          In Progress
                        </span>
                      ) : lesson.status === "completed" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="size-3" />
                          Completed
                        </span>
                      ) : (
                        lesson.status
                      )}
                    </Badge>
                  </div>
                  <h3 className="line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary sm:text-xl">
                    {lesson.topic}
                  </h3>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {isCompleted && (
                    <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  <ChevronRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0 sm:space-y-4 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
              {/* Subject and Class Info */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
                <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-2 py-1 sm:gap-2 sm:px-3 sm:py-1.5">
                  <Users className="size-3.5 text-muted-foreground sm:size-4" />
                  <span className="font-medium">{lesson.class}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-2 py-1 sm:gap-2 sm:px-3 sm:py-1.5">
                  <FileText className="size-3.5 text-muted-foreground sm:size-4" />
                  <span className="font-medium">{lesson.subject}</span>
                </div>
              </div>

              {/* Term and Week Info */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Badge variant="outline" className="text-[10px] font-medium sm:text-xs">
                  <Calendar className="mr-1 size-3 sm:mr-1.5" />
                  {lesson.term} Term
                </Badge>
                <Badge variant="outline" className="text-[10px] font-medium sm:text-xs">
                  <Clock className="mr-1 size-3 sm:mr-1.5" />
                  Week {lesson.week}
                </Badge>
              </div>

              {/* Progress indicator for in-progress lessons */}
              {lesson.status === "in_progress" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-medium">In Progress</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              )}

              {/* Dates */}
              <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(lesson.created_at).toLocaleDateString()}
                </span>
                {lesson.updated_at !== lesson.created_at && (
                  <span className="flex items-center gap-1">
                    <Sparkles className="size-3" />
                    Updated {new Date(lesson.updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to view lesson</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function LoadingSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Card className="bg-card">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            <Skeleton className="h-4 w-3/4 sm:h-5" />
            <Skeleton className="h-3 w-1/2 sm:h-4" />
            <div className="flex gap-1.5 sm:gap-2">
              <Skeleton className="h-4 w-14 sm:h-5 sm:w-16" />
              <Skeleton className="h-4 w-14 sm:h-5 sm:w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-3 md:p-6 md:pb-4">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 sm:size-5" />
            <Skeleton className="h-4 w-14 sm:h-5 sm:w-16" />
          </div>
          <Skeleton className="h-5 w-3/4 sm:h-6" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex gap-3 sm:gap-4">
            <Skeleton className="h-3 w-16 sm:h-4 sm:w-20" />
            <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            <Skeleton className="h-5 w-16 sm:h-6 sm:w-20" />
            <Skeleton className="h-5 w-14 sm:h-6 sm:w-16" />
          </div>
          <div className="flex justify-between border-t pt-3">
            <Skeleton className="h-2.5 w-20 sm:h-3 sm:w-24" />
            <Skeleton className="h-2.5 w-20 sm:h-3 sm:w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LessonsList({
  onLessonSelect,
  showPagination = true,
  compact = false,
}: LessonsListProps) {
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

  const handleLessonSelect = useCallback((lessonId: number) => {
    // Use startTransition to avoid blocking UI
    startTransition(() => {
      onLessonSelect?.(lessonId);
    });
  }, [onLessonSelect]);

  const handlePageChange = useCallback((page: number) => {
    // Use startTransition to avoid blocking UI
    startTransition(() => {
      fetchLessons(page);
    });
  }, [fetchLessons]);

  // Show loading skeleton
  if (isLoadingLessons) {
    const skeletonCount = compact ? 4 : 6;
    return (
      <div
        className={cn(
          "grid gap-4",
          compact
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <LoadingSkeleton key={index} compact={compact} />
        ))}
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
          <Button
            variant="outline"
            size="sm"
            onClick={clearError}
            className="ml-2"
          >
            Dismiss
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show empty state
  if (!lessons || lessons.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 sm:py-16">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted sm:mb-6 sm:size-20">
            <BookOpen className="size-8 text-muted-foreground sm:size-10" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
            No lessons found
          </h3>
          <p className="max-w-md text-center text-sm text-muted-foreground sm:text-base">
            Try adjusting your filters to find lessons. Make sure you&apos;ve
            selected a class, subject, term, and week.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 sm:size-10">
            <BookOpen className="size-4 text-primary sm:size-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground sm:text-2xl">Lessons</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"} available
            </p>
          </div>
        </div>

        {showPagination && totalPages > 1 && (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
            <Badge variant="secondary" className="text-xs font-medium sm:text-sm">
              Page {currentPage} of {totalPages}
            </Badge>
          </div>
        )}
      </div>

      {/* Lessons grid */}
      <div
        className={cn(
          "grid gap-6",
          compact
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onSelect={handleLessonSelect}
            compact={compact}
          />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="default"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="font-medium sm:h-11 sm:px-8"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
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
                    <span className="px-2 text-muted-foreground">…</span>
                  )}

                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="default"
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "min-w-9 font-medium sm:h-11 sm:min-w-10",
                      currentPage === page &&
                      "bg-primary shadow-md hover:bg-primary/90",
                    )}
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))}
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="font-medium sm:h-11 sm:px-8"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
