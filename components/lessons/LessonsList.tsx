"use client";

import React from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Users,
} from "lucide-react";

import { useLessonsStore } from "@/lib/store/lessons";
import { Lesson } from "@/lib/api/lessons-api";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
  const handleClick = () => {
    onSelect?.(lesson.id);
  };

  const statusColor =
    lesson.status === "active"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      : "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400";

  if (compact) {
    return (
      <Card
        className="group cursor-pointer border-border bg-card transition-all duration-200 hover:shadow-md"
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100">
                {lesson.topic}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {lesson.class} • {lesson.subject}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {lesson.term} Term
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Week {lesson.week}
                </Badge>
              </div>
            </div>
            <ChevronRight className="size-5 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="group cursor-pointer border-border bg-card transition-all duration-200 hover:shadow-lg"
      onClick={handleClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="size-5 text-blue-600" />
              <Badge className={cn("text-xs", statusColor)}>
                {lesson.status}
              </Badge>
            </div>
            <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100">
              {lesson.topic}
            </h3>
          </div>
          <ChevronRight className="mt-1 size-5 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Subject and Class Info */}
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>{lesson.class}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="size-4" />
              <span>{lesson.subject}</span>
            </div>
          </div>

          {/* Term and Week Info */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Calendar className="mr-1 size-3" />
              {lesson.term} Term
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Clock className="mr-1 size-3" />
              Week {lesson.week}
            </Badge>
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-500">
            <span>
              Created: {new Date(lesson.created_at).toLocaleDateString()}
            </span>
            {lesson.updated_at !== lesson.created_at && (
              <span>
                Updated: {new Date(lesson.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-6 w-3/4" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
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

  const handleLessonSelect = (lessonId: number) => {
    onLessonSelect?.(lessonId);
  };

  const handlePageChange = (page: number) => {
    fetchLessons(page);
  };

  // Show loading skeleton
  if (isLoadingLessons) {
    const skeletonCount = compact ? 4 : 6;
    return (
      <div
        className={cn(
          "grid gap-4",
          compact
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
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
      <Card className="border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="mb-4 size-12 text-slate-400" />
          <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            No lessons found
          </h3>
          <p className="max-w-md text-center text-slate-600 dark:text-slate-400">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Lessons
          </h3>
          <Badge variant="secondary" className="text-sm">
            {totalLessons} total
          </Badge>
        </div>

        {showPagination && totalPages > 1 && (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Lessons grid */}
      <div
        className={cn(
          "grid gap-4",
          compact
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
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
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Show first, last, current, and adjacent pages
              return (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              );
            })
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {/* Add ellipsis if there's a gap */}
                {index > 0 && array[index - 1] + 1 < page && (
                  <span className="px-2 text-slate-400">…</span>
                )}

                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "min-w-8",
                    currentPage === page && "bg-blue-600 hover:bg-blue-700",
                  )}
                >
                  {page}
                </Button>
              </React.Fragment>
            ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
