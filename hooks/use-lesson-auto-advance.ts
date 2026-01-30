"use client";

import { useState, useEffect } from "react";
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

  // Reset auto-advance flag when lesson changes
  useEffect(() => {
    setHasAutoAdvanced(false);
    setCelebrationShown(false);
  }, [selectedLesson?.id, setCelebrationShown]);

  // Auto-advance logic with enhanced features
  useEffect(() => {
    if (!selectedLesson || isLoadingLessonContent || hasAutoAdvanced) return;

    if (currentStepIndex !== 0) return;

    const currentSectionId = 'overview';
    const currentProgress = sectionProgress[currentSectionId];

    if (!currentProgress?.isCompleted) return;

    const nextSectionId = getNextIncompleteSection();

    if (nextSectionId && nextSectionId !== currentSectionId) {
      toast.info('Resuming where you left off...', {
        description: 'Skipping completed sections',
      });

      const timer = setTimeout(() => {
        autoAdvanceToNextSection();
        setHasAutoAdvanced(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (!nextSectionId) {
      toast.success('Lesson completed!', {
        description: 'You\'ve finished all sections. Great work!',
      });
      setHasAutoAdvanced(true);
      setCelebrationShown(true);
    }
  }, [
    selectedLesson,
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
