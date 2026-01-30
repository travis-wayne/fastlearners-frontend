"use client";

import { useCallback, useState } from "react";
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

  const handleNext = useCallback(async () => {
    if (isRedirecting) return;

    console.log('[handleNext] Starting...');
    const canProceed = await checkCurrentStepCompletion();
    console.log('[handleNext] canProceed:', canProceed);
    
    if (canProceed) {
      const moved = await nextStep();
      console.log('[handleNext] moved:', moved, 'currentStepIndex:', currentStepIndex);
      
      // Verify we're at the last step, lesson is complete, and all sections are done
      const isLastStep = currentStepIndex === concepts.length + 2;
      
      // Build list of valid section IDs for the current lesson
      const validSectionIds = [
        'overview',
        ...concepts.map(c => `concept_${c.id}`),
        'summary_application',
        'general_exercises'
      ];
      
      // Check only sections that belong to the current lesson
      // This is the TRUE indicator of lesson completion
      const allSectionsComplete = validSectionIds.every(
        sectionId => sectionProgress[sectionId]?.isCompleted
      );
      
      console.log('[handleNext] Section Status Check:', {
        validSectionIds,
        sectionProgressStatus: validSectionIds.map(id => ({
          id,
          isCompleted: sectionProgress[id]?.isCompleted ?? false
        }))
      });
      
      console.log('[handleNext] Conditions:', {
        moved,
        isLastStep,
        allSectionsComplete,
        celebrationShown,
        hasLessonId: !!selectedLesson?.id,
        progress: 0, // Not available in params, but used for logging in original? 
                     // Original used 'progress' from scope. 
                     // Plan didn't include 'progress' in params. 
                     // I will omit it or use 0/undefined to avoid error if not critical. 
                     // The logic checks 'allSectionsComplete' instead of progress.
        currentStepIndex,
        conceptsLength: concepts.length
      });
      
      // Use allSectionsComplete as the completion indicator (not progress >= 100)
      // because progress state updates asynchronously
      if (!moved && isLastStep && allSectionsComplete && !celebrationShown && selectedLesson?.id) {
        console.log('[handleNext] ✅ All conditions met! Fetching completion data...');
        try {
          // Set local loading state to show spinner on button
          setIsRedirecting(true);
          await fetchCompletionData(selectedLesson.id);
          setCelebrationShown(true);
          // Redirect to the dedicated completion page
          console.log('[handleNext] ✅ Completion confirmed! Redirecting to completion page...');
          router.push(`/dashboard/lessons/completed/${selectedLesson.id}`);
        } catch (error) {
          setIsRedirecting(false); // Reset on error
          console.error('[handleNext] ❌ Error fetching completion data:', error);
          // Reset celebration flag on failure so user can retry
          setCelebrationShown(false);
          toast.error('Failed to load completion summary', {
            description: 'Please try finishing the lesson again.',
          });
        }
      } else {
        console.log('[handleNext] ❌ Conditions not met');
      }
    } else {
      console.error('[handleNext] ❌ canProceed is FALSE - current step not completed');
      console.log('[handleNext] Current step index:', currentStepIndex);
      console.log('[handleNext] Section progress:', sectionProgress);
      toast.error('Cannot proceed', {
        description: 'Please complete the current section first.',
      });
    }
  }, [
    checkCurrentStepCompletion, 
    nextStep, 
    // progress, // REMOVED as per plan params
    currentStepIndex,
    concepts,
    sectionProgress,
    celebrationShown, 
    selectedLesson, 
    fetchCompletionData,
    router
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
