"use client";

import { SubjectDashboard } from "./SubjectDashboard";
import type { SubjectsContent } from "@/lib/types/subjects";

interface SubjectDashboardShellProps {
  subjectsData?: SubjectsContent;
}

export function SubjectDashboardShell({
  subjectsData,
}: SubjectDashboardShellProps) {
  return <SubjectDashboard initialData={subjectsData} />;
}

