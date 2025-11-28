import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  type ClassItem,
  type Subject,
  type Term,
} from '@/lib/api/lessons-api';
import {
  type Lesson,
  type LessonContent,
  type LessonFilters,
} from '@/lib/types/lessons';
import {
  getLessonContentBySlug,
  checkLessonOverview,
  checkLessonConcept,
  checkLessonSummaryAndApplication,
  checkLessonGeneralExercises,
  checkExerciseAnswer,
} from '@/lib/api/lessons';
import { toast } from 'sonner';

// Helper function to get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

interface LessonsStore {
  // Metadata
  classes: ClassItem[];
  subjects: Subject[];
  terms: Term[];
  weeks: { id: number; name: number }[];

  // Lessons data
  lessons: Lesson[];
  selectedLesson: LessonContent | null;

  // Filters
  filters: LessonFilters;

  // UI state
  isLoading: boolean;
  isLoadingMetadata: boolean;
  isLoadingLessons: boolean;
  isLoadingLessonContent: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalLessons: number;

  // Progress tracking
  completedSections: string[];
  currentStepIndex: number; // 0: Overview, 1..N: Concepts, N+1: Summary, N+2: General Exercises
  progress: number;

  // Actions
  setFilters: (filters: Partial<LessonFilters>) => void;
  clearFilters: () => void;

  // API actions
  fetchMetadata: () => Promise<void>;
  fetchLessons: (page?: number) => Promise<void>;
  fetchLessonContentBySlug: (subjectSlug: string, topicSlug: string) => Promise<void>;

  // Flow actions
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  checkCurrentStepCompletion: (silent?: boolean) => Promise<boolean>;
  submitExerciseAnswer: (exerciseId: number, answer: string, isGeneral?: boolean) => Promise<{ success: boolean; message: string; isCorrect?: boolean; code?: number }>;

  // UI actions
  setSelectedLesson: (lesson: LessonContent) => void;
  clearSelectedLesson: () => void;
  clearError: () => void;
  setError: (error: string | null) => void;
  setIsLoadingLessonContent: (isLoading: boolean) => void;

  // Progress calculation
  calculateProgress: () => void;
}

const initialFilters: LessonFilters = {
  class: '',
  subject: '',
  term: '',
  week: '',
};

export const useLessonsStore = create<LessonsStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        classes: [],
        subjects: [],
        terms: [],
        weeks: [],
        lessons: [],
        selectedLesson: null,
        filters: initialFilters,
        isLoading: false,
        isLoadingMetadata: false,
        isLoadingLessons: false,
        isLoadingLessonContent: false,
        error: null,
        currentPage: 1,
        totalPages: 0,
        totalLessons: 0,
        completedSections: [],
        currentStepIndex: 0,
        progress: 0,

        // Filter actions
        setFilters: (newFilters) => {
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
            currentPage: 1, // Reset pagination when filters change
          }));
        },

        clearFilters: () => {
          set({ filters: initialFilters, currentPage: 1 });
        },

        // API actions
        fetchMetadata: async () => {
          set({ isLoadingMetadata: true, error: null });

          try {
            const { getProfileData } = await import('@/lib/api/profile');
            const profileData = await getProfileData();

            set({
              classes: (profileData.classes || []).map((cls, index) => ({
                id: index + 1,
                name: cls.name,
              })),
              subjects: [],
              terms: [
                { id: 1, name: 'First' },
                { id: 2, name: 'Second' },
                { id: 3, name: 'Third' },
              ],
              weeks: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: i + 1 })),
              isLoadingMetadata: false,
            });
          } catch (err) {
            set({
              error: getErrorMessage(err),
              isLoadingMetadata: false,
            });
          }
        },

        fetchLessons: async (page = 1) => {
          set({ isLoadingLessons: false });
        },

        fetchLessonContentBySlug: async (subjectSlug: string, topicSlug: string) => {
          set({ isLoadingLessonContent: true, error: null });
          try {
            const response = await getLessonContentBySlug(subjectSlug, topicSlug);
            if (response.success && response.content) {
              const lesson = response.content;
              set({
                selectedLesson: lesson,
                isLoadingLessonContent: false,
                completedSections: [],
                currentStepIndex: 0,
                progress: 0,
                error: null,
              });
              get().calculateProgress();
            } else {
              set({
                error: response.message || 'Failed to load lesson content',
                isLoadingLessonContent: false,
              });
            }
          } catch (err) {
            set({
              error: getErrorMessage(err),
              isLoadingLessonContent: false,
            });
          }
        },

        // Flow actions
        nextStep: async () => {
          const { selectedLesson, currentStepIndex } = get();
          if (!selectedLesson) return false;

          const conceptsCount = selectedLesson.concepts?.length || 0;
          const maxIndex = conceptsCount + 2;

          if (currentStepIndex < maxIndex) {
            set({ currentStepIndex: currentStepIndex + 1 });
            return true;
          }
          return false;
        },

        prevStep: () => {
          const { currentStepIndex } = get();
          if (currentStepIndex > 0) {
            set({ currentStepIndex: currentStepIndex - 1 });
          }
        },

        checkCurrentStepCompletion: async (silent = false) => {
          const { selectedLesson, currentStepIndex, completedSections } = get();
          if (!selectedLesson) return false;

          const lessonId = selectedLesson.id;
          const conceptsCount = selectedLesson.concepts?.length || 0;
          let response;
          let sectionId = '';
          let stepName = '';
          let isConceptStep = false;

          try {
            if (currentStepIndex === 0) {
              response = await checkLessonOverview(lessonId);
              sectionId = 'overview';
              stepName = 'Overview';
            } else if (currentStepIndex <= conceptsCount) {
              const conceptIndex = currentStepIndex - 1;
              const concept = selectedLesson.concepts?.[conceptIndex];
              if (concept) {
                response = await checkLessonConcept(lessonId, concept.id);
                sectionId = `concept_${concept.id}`;
                stepName = concept.title || `Concept ${conceptIndex + 1}`;
                isConceptStep = true;
              }
            } else if (currentStepIndex === conceptsCount + 1) {
              response = await checkLessonSummaryAndApplication(lessonId);
              sectionId = 'summary_application';
              stepName = 'Summary & Application';
            } else if (currentStepIndex === conceptsCount + 2) {
              response = await checkLessonGeneralExercises(lessonId);
              sectionId = 'general_exercises';
              stepName = 'General Exercises';
            }

            // Check if completed
            if (response && response.success && response.content?.check?.is_completed) {
              if (sectionId && !completedSections.includes(sectionId)) {
                const newCompletedSections = [...completedSections, sectionId];
                set({ completedSections: newCompletedSections, error: null });
                get().calculateProgress();
                
                // Show success toast
                if (!silent) {
                  toast.success(`${stepName} completed!`, {
                    description: 'Great job! You can now proceed to the next section.',
                  });
                }
              }
              return true;
            }
            
            // Handle 400 error (missing check marker) - allow progression with warning
            if (response && response.code === 400 && response.message?.includes('No lesson check marker found')) {
              if (!silent) {
                toast.warning('Check marker not found', {
                  description: `The system couldn't verify completion for "${stepName}". You can proceed, but please contact support if this persists.`,
                });
              }
              // Mark as completed to allow progression
              if (sectionId && !completedSections.includes(sectionId)) {
                const newCompletedSections = [...completedSections, sectionId];
                set({ completedSections: newCompletedSections, error: null });
                get().calculateProgress();
              }
              return true;
            }
            
            // Show error toast if not silent
            if (!silent) {
              const errorMessage = isConceptStep
                ? `Please complete all exercises in the "${stepName}" section before proceeding.`
                : `Please complete the "${stepName}" section before proceeding.`;
              
              toast.error('Section not completed', {
                description: errorMessage,
              });
            }
            return false;
          } catch (error) {
            console.error("Failed to check completion:", error);
            if (!silent) {
              toast.error('Error checking progress', {
                description: 'An error occurred while checking your progress. Please try again.',
              });
            }
            return false;
          }
        },

        submitExerciseAnswer: async (exerciseId, answer, isGeneral = false) => {
          try {
            const response = await checkExerciseAnswer(exerciseId, answer, isGeneral);

            if (response.success && response.isCorrect) {
              const { selectedLesson, currentStepIndex, completedSections } = get();
              if (selectedLesson) {
                let sectionId = '';
                const conceptsCount = selectedLesson.concepts?.length || 0;

                if (currentStepIndex <= conceptsCount && currentStepIndex > 0) {
                  const conceptIndex = currentStepIndex - 1;
                  const concept = selectedLesson.concepts?.[conceptIndex];
                  if (concept) sectionId = `concept_${concept.id}`;
                } else if (currentStepIndex === conceptsCount + 2) {
                  sectionId = 'general_exercises';
                }

                if (sectionId && !completedSections.includes(sectionId)) {
                  // Call silently to avoid showing error toasts during exercise submission
                  await get().checkCurrentStepCompletion(true);
                }
              }
            }

            return {
              success: response.success,
              message: response.message,
              isCorrect: response.isCorrect,
              code: response.code
            };
          } catch (error) {
            return { success: false, message: "Failed to submit answer", isCorrect: false };
          }
        },

        // UI actions
        setSelectedLesson: (lesson) => {
          set({
            selectedLesson: lesson,
            isLoadingLessonContent: false,
            completedSections: [],
            currentStepIndex: 0,
            error: null,
          });
          get().calculateProgress();
        },

        clearSelectedLesson: () => {
          set({
            selectedLesson: null,
            completedSections: [],
            currentStepIndex: 0,
            progress: 0,
          });
        },

        clearError: () => {
          set({ error: null });
        },

        setError: (error) => {
          set({ error });
        },

        setIsLoadingLessonContent: (isLoading) => {
          set({ isLoadingLessonContent: isLoading });
        },

        calculateProgress: () => {
          const { selectedLesson, completedSections } = get();

          if (!selectedLesson) {
            set({ progress: 0 });
            return;
          }

          const totalSections = [
            'overview',
            ...selectedLesson.concepts?.map(c => `concept_${c.id}`) || [],
            'summary_application',
            'general_exercises',
          ];

          const completedCount = totalSections.filter(section => completedSections.includes(section)).length;

          const progress = totalSections.length > 0
            ? Math.round((completedCount / totalSections.length) * 100)
            : 0;

          set({ progress });
        },
      }),
      {
        name: 'lessons-store',
        partialize: (state) => ({
          filters: state.filters,
          completedSections: state.completedSections,
          currentStepIndex: state.currentStepIndex,
          progress: state.progress,
        }),
      }
    ),
    { name: 'LessonsStore' }
  )
);

export const selectCanFetchLessons = (state: LessonsStore) => {
  return state.filters.class &&
    state.filters.subject &&
    state.filters.term &&
    state.filters.week;
};

export const selectIsAnyLoading = (state: LessonsStore) => {
  return state.isLoading ||
    state.isLoadingMetadata ||
    state.isLoadingLessons ||
    state.isLoadingLessonContent;
};