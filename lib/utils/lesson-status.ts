export type LessonStatus = "not_started" | "in_progress" | "completed";

export function deriveLessonStatus(hasSummaryData: boolean, isCompleted: boolean): LessonStatus {
  if (!hasSummaryData) return "not_started";
  if (isCompleted) return "completed";
  return "in_progress";
}

export function lessonStatusLabel(status: LessonStatus): string {
  switch (status) {
    case "not_started":
      return "Not started";
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
  }
}

export function lessonStatusBadgeClass(status: LessonStatus): string {
  switch (status) {
    case "not_started":
      return "bg-muted text-muted-foreground";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  }
}
