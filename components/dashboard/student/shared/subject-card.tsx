"use client";

import Link from "next/link";
import { BookOpen, Calendar, Clock, Target, Trophy } from "lucide-react";
import * as Icons from "lucide-react";

import { Subject } from "@/config/education";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SubjectProgress {
  totalTopics: number;
  completedTopics: number;
  currentWeek: number;
  totalWeeks: number;
  upcomingAssessments: number;
  lastAccessed?: string;
  termProgress: number; // Percentage progress for current term
  grade?: string; // Current grade in subject
  caScore?: number; // Continuous Assessment score
}

interface SubjectCardProps {
  subject: Subject;
  progress: SubjectProgress;
  className?: string;
  variant?: "default" | "compact" | "detailed";
  slug?: string; // Optional slug for navigation
}

const getSubjectIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName] || BookOpen;
  return IconComponent;
};

const gradeColors: Record<string, string> = {
  A1: "bg-green-100 text-green-800",
  B2: "bg-green-100 text-green-700",
  B3: "bg-yellow-100 text-yellow-800",
  C4: "bg-orange-100 text-orange-800",
  C5: "bg-orange-100 text-orange-800",
  C6: "bg-orange-100 text-orange-800",
  D7: "bg-red-100 text-red-700",
  E8: "bg-red-100 text-red-700",
  F9: "bg-red-100 text-red-800",
};

export function SubjectCard({
  subject,
  progress,
  className = "",
  variant = "default",
  slug,
}: SubjectCardProps) {
  const IconComponent = getSubjectIcon(subject.icon);

  if (variant === "compact") {
    return (
      <article
        className={cn(
          "group relative flex flex-col space-y-2 rounded-lg border border-border bg-card p-3 transition-all duration-300 hover:shadow-md sm:p-4 md:p-5",
          className,
        )}
      >
        <div className="w-full overflow-hidden rounded-xl border border-border">
          <div
            className="flex items-center justify-center p-6 sm:p-8"
            style={{ backgroundColor: `${subject.color}10` }}
          >
            <IconComponent
              className="size-10 sm:size-12"
              style={{ color: subject.color }}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="w-full">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <h2 className="line-clamp-1 font-heading text-base sm:text-lg">
                {subject.name}
              </h2>
              {subject.compulsory && (
                <Badge variant="outline" className="text-xs">
                  Core
                </Badge>
              )}
              {progress.grade && (
                <Badge
                  className={cn(
                    "text-xs",
                    gradeColors[progress.grade] || "bg-gray-100 text-gray-800",
                  )}
                >
                  {progress.grade}
                </Badge>
              )}
            </div>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              Week {progress.currentWeek}/{progress.totalWeeks} •{" "}
              {progress.termProgress}% complete
            </p>
          </div>
        </div>
        <Link
          href={
            slug
              ? `/dashboard/subjects/${slug}`
              : `/dashboard/subjects/${subject.id}`
          }
          className="absolute inset-0"
        >
          <span className="sr-only">View {subject.name}</span>
        </Link>
      </article>
    );
  }

  if (variant === "detailed") {
    return (
      <article
        className={cn(
          "group relative flex h-full flex-col space-y-2 rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:shadow-lg sm:p-5 md:p-6",
          className,
        )}
      >
        <div className="w-full overflow-hidden rounded-xl border border-border">
          <div
            className="flex items-center justify-center p-8 sm:p-10 md:p-12"
            style={{ backgroundColor: `${subject.color}10` }}
          >
            <IconComponent
              className="size-12 sm:size-14 md:size-16"
              style={{ color: subject.color }}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="w-full">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <h2 className="line-clamp-2 font-heading text-xl sm:text-2xl">
                {subject.name}
              </h2>
              {subject.compulsory ? (
                <Badge variant="default" className="text-xs">
                  Core Subject
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  Elective
                </Badge>
              )}
              {progress.grade && (
                <Badge
                  className={cn(
                    "text-xs",
                    gradeColors[progress.grade] || "bg-gray-100 text-gray-800",
                  )}
                >
                  Grade: {progress.grade}
                </Badge>
              )}
            </div>
            {subject.description && (
              <p className="line-clamp-2 text-muted-foreground">
                {subject.description}
              </p>
            )}

            {/* Term Progress Section */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Term Progress</span>
                <span className="font-medium">{progress.termProgress}%</span>
              </div>
              <Progress value={progress.termProgress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {progress.completedTopics}/{progress.totalTopics} topics
                  completed
                </span>
                {progress.termProgress >= 90 ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Trophy className="size-3" />
                    Excellent
                  </span>
                ) : (
                  <span>
                    Week {progress.currentWeek}/{progress.totalWeeks}
                  </span>
                )}
              </div>
            </div>

            {/* Academic Stats */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Target className="size-3 text-muted-foreground sm:size-4" />
                  <span className="text-muted-foreground">CA Score</span>
                </div>
                <div className="text-base font-semibold sm:text-lg">
                  {progress.caScore ? `${progress.caScore}%` : "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Calendar className="size-3 text-muted-foreground sm:size-4" />
                  <span className="text-muted-foreground">Assessments</span>
                </div>
                <div className="text-base font-semibold sm:text-lg">
                  {progress.upcomingAssessments}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-3">
            {progress.lastAccessed && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>Last accessed: {progress.lastAccessed}</span>
              </div>
            )}
            {!progress.lastAccessed && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>
                  Week {progress.currentWeek} of {progress.totalWeeks}
                </span>
              </div>
            )}
          </div>
        </div>
        <Link
          href={
            slug
              ? `/dashboard/subjects/${slug}`
              : `/dashboard/subjects/${subject.id}`
          }
          className="absolute inset-0"
        >
          <span className="sr-only">View {subject.name}</span>
        </Link>
      </article>
    );
  }

  // Default variant
  return (
    <article
      className={cn(
        "group relative flex flex-col space-y-2 rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:shadow-lg sm:p-5 md:p-6",
        className,
      )}
    >
      <div className="w-full overflow-hidden rounded-xl border border-border">
        <div
          className="flex items-center justify-center p-8 sm:p-10"
          style={{ backgroundColor: `${subject.color}10` }}
        >
          <IconComponent
            className="size-12 sm:size-14"
            style={{ color: subject.color }}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="w-full">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <h2 className="line-clamp-2 font-heading text-xl sm:text-2xl">
              {subject.name}
            </h2>
            {subject.compulsory ? (
              <Badge variant="default" className="text-xs">
                Core
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                Elective
              </Badge>
            )}
            {progress.grade && (
              <Badge
                className={cn(
                  "text-xs",
                  gradeColors[progress.grade] || "bg-gray-100 text-gray-800",
                )}
              >
                {progress.grade}
              </Badge>
            )}
          </div>
          {subject.description && (
            <p className="line-clamp-2 text-muted-foreground">
              {subject.description}
            </p>
          )}

          {/* Progress Section */}
          <div className="mt-3 space-y-2 sm:mt-4">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Term Progress</span>
              <span className="font-medium">{progress.termProgress}%</span>
            </div>
            <Progress value={progress.termProgress} className="h-2" />
            <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Week {progress.currentWeek} of {progress.totalWeeks}
              </span>
              <span>
                {progress.completedTopics}/{progress.totalTopics} topics
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:space-x-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <Target className="size-3 sm:size-4" />
            <span>CA: {progress.caScore ? `${progress.caScore}%` : "N/A"}</span>
          </div>
          {progress.upcomingAssessments > 0 && (
            <Badge variant="outline" className="text-xs">
              {progress.upcomingAssessments} assessment
              {progress.upcomingAssessments > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>
      <Link
        href={
          slug
            ? `/dashboard/subjects/${slug}`
            : `/dashboard/subjects/${subject.id}`
        }
        className="absolute inset-0"
      >
        <span className="sr-only">View {subject.name}</span>
      </Link>
    </article>
  );
}
