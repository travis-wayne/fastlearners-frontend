"use client";

import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { LessonSummaryResponse } from "@/lib/types/lessons";

interface LessonSummaryCardProps {
  summary: LessonSummaryResponse;
  isLoading: boolean;
}

export function LessonSummaryCard({ summary, isLoading }: LessonSummaryCardProps) {
  if (isLoading) {
    return (
      <div className="mt-3 space-y-3 rounded-lg border border-border bg-muted/40 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (summary.noData === true) {
    return (
      <div className="mt-3 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-muted-foreground">
        <BookOpen className="mb-2 size-6 opacity-40" />
        <p className="text-sm">Start your first lesson to see your score!</p>
      </div>
    );
  }

  if (!summary.content) {
    return (
      <div className="mt-3 rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
        {summary.message || "Failed to load summary."}
      </div>
    );
  }

  const { lesson_summary, lesson_total } = summary.content;

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-border bg-muted/40 p-4 text-sm">
      {/* Overview row */}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Overview</span>
        <span className="text-right">{lesson_summary.overview}</span>
      </div>

      {/* Video row */}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Video</span>
        <span className="text-right">{lesson_summary.video}</span>
      </div>

      {/* Concepts section */}
      {Object.entries(lesson_summary.concepts).map(([conceptName, score]) => (
        <div key={conceptName} className="flex justify-between">
          <span className="text-muted-foreground">{conceptName}</span>
          <span className="text-right">{score}</span>
        </div>
      ))}

      {/* General Exercise row */}
      <div className="flex justify-between">
        <span className="text-muted-foreground">General Exercise</span>
        <span className="text-right">{lesson_summary.general_exercise}</span>
      </div>

      {/* Divider + Total row */}
      <div className="my-2 border-t border-border" />
      <div className="flex justify-between font-bold">
        <span>Total Score</span>
        <span className="text-right">{lesson_total}</span>
      </div>
    </div>
  );
}
