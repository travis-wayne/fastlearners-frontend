import { Suspense } from "react";
import { SubjectSetupShell } from "@/components/dashboard/student/SubjectSetupShell";
import { SubjectDashboardShell } from "@/components/dashboard/student/SubjectDashboardShell";
import { CardSkeleton } from "@/components/shared/card-skeleton";

async function getSubjectStatus() {
  try {
    // Call internal API route (server-side)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/subjects`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { needsSetup: true };
    }

    const data = await res.json();

    if (!data.success || !data.content) {
      return { needsSetup: true };
    }

    // Derive class level explicitly from API response
    // The API should include stage (jss/sss) in the response
    // If not available, check for compulsory_selective list as fallback
    const { compulsory_selective_status, selective_status, stage } = data.content;
    
    // Prefer explicit stage from API, fallback to compulsory_selective list
    let isJSS: boolean;
    if (stage) {
      isJSS = stage.toLowerCase() === "jss";
    } else {
      // Fallback: Check if compulsory_selective list exists (indicates JSS)
      const hasCompulsorySelectiveList = 
        data.content.compulsory_selective && 
        data.content.compulsory_selective.length > 0;
      isJSS = hasCompulsorySelectiveList;
    }
    
    const needsSetup =
      (isJSS && compulsory_selective_status === "pending") ||
      selective_status === "pending";

    return {
      needsSetup,
      subjectsData: data.content,
      stage: stage || (isJSS ? "jss" : "sss"),
    };
  } catch (error) {
    // On error, assume setup is needed
    return { needsSetup: true };
  }
}

export default async function SubjectsPage() {
  const status = await getSubjectStatus();

  return (
    <Suspense
      fallback={
        <div className="grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      }
    >
      {status.needsSetup ? (
        <SubjectSetupShell />
      ) : (
        <SubjectDashboardShell subjectsData={status.subjectsData} />
      )}
    </Suspense>
  );
}
