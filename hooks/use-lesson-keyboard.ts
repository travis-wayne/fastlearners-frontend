"use client";

import { useEffect, useCallback } from "react";
import { LessonContent } from "@/lib/types/lessons";

interface UseLessonKeyboardParams {
  selectedLesson: LessonContent | null;
  currentStepIndex: number;
  maxStepIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onNavigateToSection: (stepIndex: number) => void;
  enabled?: boolean;
}

export function useLessonKeyboard({
  selectedLesson,
  currentStepIndex,
  maxStepIndex,
  onPrevious,
  onNext,
  onNavigateToSection,
  enabled = true,
}: UseLessonKeyboardParams) {
  
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!selectedLesson) return;

      switch (event.key) {
        case 'ArrowLeft':
          if (currentStepIndex > 0) {
              event.preventDefault();
              onPrevious();
          }
          break;
        case 'ArrowRight':
          if (currentStepIndex < maxStepIndex) {
              event.preventDefault();
              onNext();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          const num = parseInt(event.key) - 1;
          if (num >= 0 && num <= maxStepIndex) {
            event.preventDefault();
            onNavigateToSection(num);
          }
          break;
      }
    },
    [selectedLesson, currentStepIndex, maxStepIndex, onPrevious, onNext, onNavigateToSection]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
