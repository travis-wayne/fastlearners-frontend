import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getStudentSubjects } from "@/lib/api/subjects";
import type { SubjectsResponse } from "@/lib/types/subjects";

// Module-level cache to share data between components during session
let cachedStatus: SubjectsResponse | null = null;
let cachePromise: Promise<SubjectsResponse> | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useSubjectStatus() {
  const { user, isAuthenticated } = useAuthStore();
  const [subjectStatus, setSubjectStatus] = useState<SubjectsResponse | null>(cachedStatus);

  useEffect(() => {
    // Only fetch if user is student or guardian
    if (!(user?.role?.includes("student") || user?.role?.includes("guardian")) || !isAuthenticated) {
      setSubjectStatus(null);
      return;
    }

    // Check if cache is still valid
    const now = Date.now();
    if (cachedStatus && (now - cacheTimestamp) < CACHE_DURATION) {
      setSubjectStatus(cachedStatus);
      return;
    }

    // If there's already a fetch in progress, wait for it
    if (cachePromise) {
      cachePromise
        .then((response) => {
          if (response.success) {
            cachedStatus = response;
            cacheTimestamp = now;
            setSubjectStatus(response);
          }
        })
        .catch(() => {
          // Handle error silently
        });
      return;
    }

    // Start new fetch
    cachePromise = getStudentSubjects();
    cachePromise
      .then((response) => {
        if (response.success) {
          cachedStatus = response;
          cacheTimestamp = now;
          setSubjectStatus(response);
        }
        cachePromise = null;
      })
      .catch(() => {
        // Handle error silently
        cachePromise = null;
      });
  }, [user, isAuthenticated]);

  return subjectStatus;
}

