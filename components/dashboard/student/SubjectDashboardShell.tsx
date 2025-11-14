"use client";

import type { SubjectsContent } from "@/lib/types/subjects";

import { SubjectDashboard } from "./SubjectDashboard";

interface SubjectDashboardShellProps {
  subjectsData?: SubjectsContent;
}

export function SubjectDashboardShell({
  subjectsData,
}: SubjectDashboardShellProps) {
  return <SubjectDashboard initialData={subjectsData} />;
}
