"use client";

import React, { useCallback } from "react";
import { BookOpen, ChevronRight, GraduationCap, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Subject {
  id: number;
  name: string;
}

interface SubjectOverviewCardsProps {
  subjects: Subject[];
  isLoading?: boolean;
  onSubjectSelect?: (subjectId: number, subjectName: string) => void;
  selectedSubjectId?: number | null;
}

interface SubjectCardProps {
  subject: Subject;
  onSelect?: (subjectId: number, subjectName: string) => void;
  isSelected?: boolean;
}

// Color palette for subjects - cycles through these colors
const subjectColors = [
  { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", icon: "text-blue-600 dark:text-blue-400", hover: "hover:border-blue-400" },
  { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", icon: "text-emerald-600 dark:text-emerald-400", hover: "hover:border-emerald-400" },
  { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", icon: "text-purple-600 dark:text-purple-400", hover: "hover:border-purple-400" },
  { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", icon: "text-amber-600 dark:text-amber-400", hover: "hover:border-amber-400" },
  { bg: "bg-rose-50 dark:bg-rose-950/30", border: "border-rose-200 dark:border-rose-800", icon: "text-rose-600 dark:text-rose-400", hover: "hover:border-rose-400" },
  { bg: "bg-cyan-50 dark:bg-cyan-950/30", border: "border-cyan-200 dark:border-cyan-800", icon: "text-cyan-600 dark:text-cyan-400", hover: "hover:border-cyan-400" },
  { bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800", icon: "text-indigo-600 dark:text-indigo-400", hover: "hover:border-indigo-400" },
  { bg: "bg-teal-50 dark:bg-teal-950/30", border: "border-teal-200 dark:border-teal-800", icon: "text-teal-600 dark:text-teal-400", hover: "hover:border-teal-400" },
];

function SubjectCard({ subject, onSelect, isSelected }: SubjectCardProps) {
  const colorIndex = subject.id % subjectColors.length;
  const colors = subjectColors[colorIndex];

  const handleClick = useCallback(() => {
    onSelect?.(subject.id, subject.name);
  }, [onSelect, subject.id, subject.name]);

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "group cursor-pointer border-2 transition-all duration-200",
        colors.bg,
        colors.border,
        colors.hover,
        "hover:scale-[1.02] hover:shadow-lg",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            "bg-white/80 dark:bg-gray-900/50",
            "transition-transform group-hover:scale-110"
          )}
        >
          <BookOpen className={cn("size-6", colors.icon)} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-foreground">
            {subject.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            Click to view lessons
          </p>
        </div>
        <ChevronRight
          className={cn(
            "size-5 text-muted-foreground transition-transform",
            "group-hover:translate-x-1 group-hover:text-foreground"
          )}
        />
      </CardContent>
    </Card>
  );
}

function SubjectCardSkeleton() {
  return (
    <Card className="border-2">
      <CardContent className="flex items-center gap-4 p-4">
        <Skeleton className="size-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="size-5" />
      </CardContent>
    </Card>
  );
}

export function SubjectOverviewCards({
  subjects,
  isLoading = false,
  onSubjectSelect,
  selectedSubjectId,
}: SubjectOverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Available Subjects</h3>
            <p className="text-sm text-muted-foreground">Loading subjects...</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SubjectCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Layers className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-bold">No Subjects Available</h3>
          <p className="text-center text-sm text-muted-foreground">
            No subjects have been uploaded yet. Upload lesson files to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Available Subjects</h3>
            <p className="text-sm text-muted-foreground">
              Select a subject to view its lessons
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          {subjects.length} {subjects.length === 1 ? "subject" : "subjects"}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onSelect={onSubjectSelect}
            isSelected={selectedSubjectId === subject.id}
          />
        ))}
      </div>
    </div>
  );
}
