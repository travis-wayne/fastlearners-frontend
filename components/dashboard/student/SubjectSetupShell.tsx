"use client";

import { useState } from "react";
import { SubjectSetupForm } from "./SubjectSetupForm";
import { SubjectDashboardShell } from "./SubjectDashboardShell";
import type { SubjectsContent } from "@/lib/types/subjects";

export function SubjectSetupShell() {
  const [subjectsData, setSubjectsData] = useState<SubjectsContent | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = (updatedData?: SubjectsContent) => {
    if (updatedData) {
      setSubjectsData(updatedData);
      setIsComplete(true);
    } else {
      // Fallback: reload page to show dashboard
      window.location.href = "/dashboard/subjects";
    }
  };

  if (isComplete && subjectsData) {
    return <SubjectDashboardShell subjectsData={subjectsData} />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl text-foreground">
          Subject Registration
        </h2>
        <p className="text-muted-foreground">
          Complete your subject selection to get started with lessons.
        </p>
      </div>
      <SubjectSetupForm onComplete={handleComplete} />
    </div>
  );
}

