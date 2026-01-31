"use client";

import { useCallback, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LessonContent, Concept } from "@/lib/types/lessons";
import { SectionProgress } from "@/lib/types/progress";
import { useLessonsStore } from "@/lib/store/lessons";

interface UseLessonNavigationParams {
  selectedLesson: LessonContent | null;
  currentStepIndex: number;
  sectionProgress: Record<string, SectionProgress>;
  concepts: Concept[];
  checkCurrentStepCompletion: () => Promise<boolean>;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  fetchCompletionData: (lessonId: number) => Promise<void>;
}

export function useLessonNavigation({
  selectedLesson,
  currentStepIndex,
  sectionProgress,
  concepts,
  checkCurrentStepCompletion,
  nextStep,
  prevStep,
  fetchCompletionData,
}: UseLessonNavigationParams) {
  const router = useRouter();
  const [celebrationShown, setCelebrationShown] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isProcessing = useRef(false);

  // Memoize validation logic
  const validSectionIds = useMemo(() => [
    'overview',
    ...concepts.map(c => `concept_${c.id}`),
    'summary_application',
    'general_exercises'
  ], [concepts]);

  const allSectionsComplete = useMemo(() => 
    validSectionIds.every(id => sectionProgress[id]?.isCompleted),
    [validSectionIds, sectionProgress]
  );

  const handleNext = useCallback(async () => {
    if (isRedirecting || isProcessing.current) return;
    isProcessing.current = true;

    if (process.env.NODE_ENV === 'development') {
      performance.mark('navigation-start');
    }

    try {
      const canProceed = await checkCurrentStepCompletion();
      
      if (canProceed) {
        const moved = await nextStep();
        const isLastStep = currentStepIndex === concepts.length + 2;

        // Use fresh state for final completion check to avoid stale closure issues
        const { sectionProgress: currentSectionProgress } = useLessonsStore.getState();
        
        // Re-validate completion with fresh state
        const isActuallyComplete = validSectionIds.every(id => 
          currentSectionProgress[id]?.isCompleted
        );

        if (!moved && isLastStep && isActuallyComplete && !celebrationShown && selectedLesson?.id) {
          try {
            setIsRedirecting(true);
            await fetchCompletionData(selectedLesson.id);
            setCelebrationShown(true);
            router.push(`/dashboard/lessons/completed/${selectedLesson.id}`);
          } catch (error) {
            setIsRedirecting(false);
            console.error('Error fetching completion data:', error);
            setCelebrationShown(false);
            toast.error('Failed to load completion summary');
          }
        }
      } else {
        toast.error('Cannot proceed', {
          description: 'Please complete the current section first.',
        });
      }
    } catch (error) {
       console.error("Navigation error:", error);
    } finally {
      isProcessing.current = false;
      if (process.env.NODE_ENV === 'development') {
        performance.mark('navigation-end');
        performance.measure('navigation', 'navigation-start', 'navigation-end');
      }
    }
  }, [
    checkCurrentStepCompletion, 
    nextStep, 
    currentStepIndex,
    concepts.length,
    validSectionIds, // Dependency for validation logic
    celebrationShown, 
    selectedLesson, 
    fetchCompletionData,
    router,
    isRedirecting
  ]);

  const handlePrev = useCallback(() => {
    prevStep();
  }, [prevStep]);

  const handleNavigateToSection = useCallback((stepIndex: number) => {
    // Preserve exact logic using store state for fresh data
    const { sectionProgress } = useLessonsStore.getState();
    const currentConcepts = selectedLesson?.concepts || [];

    let sectionId = '';
    if (stepIndex === 0) {
      sectionId = 'overview';
    } else if (stepIndex <= currentConcepts.length) {
      const concept = currentConcepts[stepIndex - 1];
      if (concept) sectionId = `concept_${concept.id}`;
    } else if (stepIndex === currentConcepts.length + 1) {
      sectionId = 'summary_application';
    } else if (stepIndex === currentConcepts.length + 2) {
      sectionId = 'general_exercises';
    }

    const sectionProgressData = sectionProgress[sectionId];
    const isCurrent = stepIndex === currentStepIndex;
    const isCompleted = sectionProgressData?.isCompleted;

    if (isCompleted || isCurrent || stepIndex === 0) {
      useLessonsStore.setState({ currentStepIndex: stepIndex });
    } else {
      toast.warning('Section not accessible', {
        description: 'Complete previous sections first.',
      });
    }
  }, [selectedLesson, currentStepIndex]);

  return {
    handleNext,
    handlePrev,
    handleNavigateToSection,
    isRedirecting,
    celebrationShown,
    setCelebrationShown // Exposed to allow LessonViewer to reset state
  };
}
