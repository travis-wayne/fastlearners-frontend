"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { LessonContent } from "@/lib/types/lessons";
import { SectionProgress } from "@/lib/types/progress";

interface UseLessonAutoAdvanceParams {
  selectedLesson: LessonContent | null;
  isLoadingLessonContent: boolean;
  currentStepIndex: number;
  sectionProgress: Record<string, SectionProgress>;
  getNextIncompleteSection: () => string | null;
  autoAdvanceToNextSection: () => void;
  setCelebrationShown: (shown: boolean) => void;
}

interface UseLessonAutoAdvanceReturn {
  hasAutoAdvanced: boolean;
  setHasAutoAdvanced: (value: boolean) => void;
}

export function useLessonAutoAdvance({
  selectedLesson,
  isLoadingLessonContent,
  currentStepIndex,
  sectionProgress,
  getNextIncompleteSection,
  autoAdvanceToNextSection,
  setCelebrationShown,
}: UseLessonAutoAdvanceParams): UseLessonAutoAdvanceReturn {
  const [hasAutoAdvanced, setHasAutoAdvanced] = useState(false);
  const advancingRef = useRef(false);
  const previousLessonIdRef = useRef<number | undefined>(undefined);

  // Reset auto-advance flag when lesson changes
  useEffect(() => {
    if (selectedLesson?.id !== previousLessonIdRef.current) {
        if (previousLessonIdRef.current !== undefined) {
             setHasAutoAdvanced(false);
             setCelebrationShown(false);
             advancingRef.current = false;
        }
        previousLessonIdRef.current = selectedLesson?.id;
    }
  }, [selectedLesson?.id, setCelebrationShown]);

  // Auto-advance logic with enhanced features
  useEffect(() => {
    // Basic guards
    if (!selectedLesson || isLoadingLessonContent || hasAutoAdvanced || advancingRef.current) return;

    // Only auto-advance from Overview (step 0)
    if (currentStepIndex !== 0) return;

    const currentSectionId = 'overview';
    const currentProgress = sectionProgress[currentSectionId];

    // Only if Overview is completed
    if (!currentProgress?.isCompleted) return;

    const nextSectionId = getNextIncompleteSection();

    if (nextSectionId && nextSectionId !== currentSectionId) {
      toast.info('Resuming where you left off...', {
        description: 'Skipping completed sections',
      });
      
      advancingRef.current = true; // Mark as advancing immediately

      const timer = setTimeout(() => {
        autoAdvanceToNextSection();
        setHasAutoAdvanced(true);
        // Do NOT reset advancingRef.current here; we want it to stay true until lesson change
        // or until we leave step 0 (which happens via autoAdvanceToNextSection)
      }, 1000);

      return () => clearTimeout(timer);
    } else if (!nextSectionId) {
      // All done
      toast.success('Lesson completed!', {
        description: 'You\'ve finished all sections. Great work!',
      });
      setHasAutoAdvanced(true);
      setCelebrationShown(true);
      advancingRef.current = true;
    }
  }, [
    selectedLesson, // Need this for freshness check
    selectedLesson?.id, // Explicit id dependency
    isLoadingLessonContent,
    sectionProgress,
    getNextIncompleteSection,
    autoAdvanceToNextSection,
    currentStepIndex,
    hasAutoAdvanced,
    setCelebrationShown,
  ]);

  return {
    hasAutoAdvanced,
    setHasAutoAdvanced,
  };
}
