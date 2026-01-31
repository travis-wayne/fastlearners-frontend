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

        if (!moved && isLastStep && selectedLesson?.id && !celebrationShown) {
          // Self-healing: Check if we can verify missing sections on the fly
          const missing = validSectionIds.filter(id => !currentSectionProgress[id]?.isCompleted);
          let healedCount = 0;

          if (missing.length > 0) {
            const { markSectionCompleted } = useLessonsStore.getState();
            
            // Try to heal missing "passive" sections (Overview, Summary) that might have been skipped or failed to sync
            for (const sectionId of missing) {
               try {
                 let verified = false;
                 if (sectionId === 'summary_application') {
                    const { checkLessonSummaryAndApplication } = await import("@/lib/api/lessons");
                    const res = await checkLessonSummaryAndApplication(selectedLesson.id);
                    if (res?.success && res?.content?.check?.is_completed) verified = true;
                 } else if (sectionId === 'overview') {
                    const { checkLessonOverview } = await import("@/lib/api/lessons");
                    const res = await checkLessonOverview(selectedLesson.id);
                    if (res?.success && res?.content?.check?.is_completed) verified = true;
                 }

                 if (verified) {
                   const sectionType = sectionId === 'overview' ? 'overview' : 'summary_application';
                   markSectionCompleted(sectionId, sectionType);
                   healedCount++;
                 }
               } catch (err) {
                 console.error(`Failed to self-heal section ${sectionId}`, err);
               }
            }
          }

          // Re-evaluate completion after attempted healing
          const { sectionProgress: updatedProgress } = useLessonsStore.getState();
          const isNowComplete = validSectionIds.every(id => updatedProgress[id]?.isCompleted);

          if (isNowComplete) {
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
          } else {
             const remainingMissing = validSectionIds.filter(id => !updatedProgress[id]?.isCompleted);
             console.warn('Cannot finish lesson. Missing sections:', remainingMissing);
             toast.warning('Lesson Incomplete', {
               description: `Please complete all sections first. Missing: ${remainingMissing.length}. Try going back.`,
             });
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
