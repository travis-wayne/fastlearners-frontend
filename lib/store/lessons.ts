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
  type ExerciseProgress,
  type SectionProgress,
  type LessonMetadata,
  type SectionType,
} from '@/lib/types/progress';
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

  // Progress tracking (legacy)
  completedSections: string[];
  currentStepIndex: number; // 0: Overview, 1..N: Concepts, N+1: Summary, N+2: General Exercises
  progress: number;

  // Adaptive learning progress tracking
  sectionProgress: Record<string, SectionProgress>;
  exerciseProgress: Record<number, ExerciseProgress>;
  lessonMetadata: Record<number, LessonMetadata>;

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

  // Adaptive learning actions
  markSectionCompleted: (sectionId: string, sectionType: SectionType, score?: number) => void;
  markExerciseCompleted: (exerciseId: number, isCorrect: boolean, userAnswer: string) => void;
  getNextIncompleteSection: () => string | null;
  autoAdvanceToNextSection: () => Promise<boolean>;
  resetLessonProgress: (lessonId: number) => void;
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

        // Adaptive learning progress
        sectionProgress: {},
        exerciseProgress: {},
        lessonMetadata: {},

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
              const now = new Date().toISOString();
              
              // Initialize lesson metadata if not exists
              const { lessonMetadata } = get();
              if (!lessonMetadata[lesson.id]) {
                const totalSections = 3 + (lesson.concepts?.length || 0); // overview + concepts + summary + general
                set({
                  lessonMetadata: {
                    ...lessonMetadata,
                    [lesson.id]: {
                      lessonId: lesson.id,
                      totalSections,
                      completedSections: 0,
                      overallProgress: 0,
                      lastAccessedAt: now,
                      lastCompletedSectionId: null,
                      startedAt: now,
                    },
                  },
                });
              }
              
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
          let sectionType: SectionType = 'overview';
          let isConceptStep = false;

          try {
            if (currentStepIndex === 0) {
              response = await checkLessonOverview(lessonId);
              sectionId = 'overview';
              stepName = 'Overview';
              sectionType = 'overview';
            } else if (currentStepIndex <= conceptsCount) {
              const conceptIndex = currentStepIndex - 1;
              const concept = selectedLesson.concepts?.[conceptIndex];
              if (concept) {
                response = await checkLessonConcept(lessonId, concept.id);
                sectionId = `concept_${concept.id}`;
                stepName = concept.title || `Concept ${conceptIndex + 1}`;
                sectionType = 'concept';
                isConceptStep = true;
              }
            } else if (currentStepIndex === conceptsCount + 1) {
              response = await checkLessonSummaryAndApplication(lessonId);
              sectionId = 'summary_application';
              stepName = 'Summary & Application';
              sectionType = 'summary_application';
            } else if (currentStepIndex === conceptsCount + 2) {
              response = await checkLessonGeneralExercises(lessonId);
              sectionId = 'general_exercises';
              stepName = 'General Exercises';
              sectionType = 'general_exercises';
            }

            // Check if completed
            if (response && response.success && response.content?.check?.is_completed) {
              if (sectionId && !completedSections.includes(sectionId)) {
                const newCompletedSections = [...completedSections, sectionId];
                set({ completedSections: newCompletedSections, error: null });
                
                // Mark section as completed in adaptive progress
                get().markSectionCompleted(sectionId, sectionType);
                
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
                get().markSectionCompleted(sectionId, sectionType);
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
          const { exerciseProgress } = get();
          
          // Check if already answered correctly
          const existing = exerciseProgress[exerciseId];
          if (existing?.isCompleted && existing?.isCorrect) {
            toast.info('Already answered correctly', {
              description: 'Moving to next exercise...',
            });
            return {
              success: true,
              message: 'Already completed',
              isCorrect: true,
              code: 200,
            };
          }

          try {
            const response = await checkExerciseAnswer(exerciseId, answer, isGeneral);

            // Mark exercise as completed in adaptive progress
            if (response.isCorrect !== undefined) {
              get().markExerciseCompleted(exerciseId, response.isCorrect, answer);
            }

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
          } catch (error: any) {
            // Handle "already answered" error gracefully
            if (error?.code === 400 && error?.message?.includes('already answered')) {
              get().markExerciseCompleted(exerciseId, true, answer);
              return {
                success: true,
                message: 'Already answered',
                isCorrect: true,
                code: 200,
              };
            }
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

        // Adaptive learning actions
        markSectionCompleted: (sectionId, sectionType, score) => {
          const { selectedLesson, sectionProgress } = get();
          if (!selectedLesson) return;

          const now = new Date().toISOString();
          
          set({
            sectionProgress: {
              ...sectionProgress,
              [sectionId]: {
                sectionId,
                sectionType,
                isCompleted: true,
                completedAt: now,
                exercisesCompleted: 0, // Will be updated by exercise tracking
                exercisesTotal: 0,
                attempts: (sectionProgress[sectionId]?.attempts || 0) + 1,
                score,
              },
            },
          });

          // Update lesson metadata
          const lessonId = selectedLesson.id;
          const { lessonMetadata } = get();
          const currentMeta = lessonMetadata[lessonId];
          
          if (currentMeta) {
            const newCompletedCount = currentMeta.completedSections + 1;
            const newProgress = Math.round((newCompletedCount / currentMeta.totalSections) * 100);
            
            set({
              lessonMetadata: {
                ...lessonMetadata,
                [lessonId]: {
                  ...currentMeta,
                  completedSections: newCompletedCount,
                  overallProgress: newProgress,
                  lastCompletedSectionId: sectionId,
                  lastAccessedAt: now,
                },
              },
            });
          }
        },

        markExerciseCompleted: (exerciseId, isCorrect, userAnswer) => {
          const { exerciseProgress } = get();
          const now = new Date().toISOString();
          const existing = exerciseProgress[exerciseId];

          set({
            exerciseProgress: {
              ...exerciseProgress,
              [exerciseId]: {
                exerciseId,
                isCompleted: true,
                isCorrect,
                userAnswer,
                attempts: (existing?.attempts || 0) + 1,
                firstAttemptAt: existing?.firstAttemptAt || now,
                lastAttemptAt: now,
              },
            },
          });
        },

        getNextIncompleteSection: () => {
          const { selectedLesson, sectionProgress } = get();
          if (!selectedLesson) return null;

          // Define section order
          const sections = [
            { id: 'overview', type: 'overview' },
            ...(selectedLesson.concepts || []).map((c) => ({
              id: `concept_${c.id}`,
              type: 'concept',
            })),
            { id: 'summary_application', type: 'summary_application' },
            { id: 'general_exercises', type: 'general_exercises' },
          ];

          // Find first incomplete section
          for (const section of sections) {
            const progress = sectionProgress[section.id];
            if (!progress?.isCompleted) {
              return section.id;
            }
          }

          return null; // All sections completed
        },

        autoAdvanceToNextSection: async () => {
          const nextSectionId = get().getNextIncompleteSection();
          
          if (!nextSectionId) {
            toast.success('Lesson completed!', {
              description: 'Great work! You\'ve finished all sections.',
            });
            return false;
          }

          // Calculate step index for next section
          const { selectedLesson } = get();
          if (!selectedLesson) return false;

          let stepIndex = 0;
          
          if (nextSectionId === 'overview') {
            stepIndex = 0;
          } else if (nextSectionId.startsWith('concept_')) {
            const conceptId = parseInt(nextSectionId.replace('concept_', ''));
            const conceptIndex = selectedLesson.concepts?.findIndex((c) => c.id === conceptId) ?? -1;
            stepIndex = conceptIndex + 1;
          } else if (nextSectionId === 'summary_application') {
            stepIndex = (selectedLesson.concepts?.length || 0) + 1;
          } else if (nextSectionId === 'general_exercises') {
            stepIndex = (selectedLesson.concepts?.length || 0) + 2;
          }

          set({ currentStepIndex: stepIndex });
          return true;
        },

        resetLessonProgress: (lessonId) => {
          const { lessonMetadata } = get();

          set({
            sectionProgress: {},
            exerciseProgress: {},
            lessonMetadata: {
              ...lessonMetadata,
              [lessonId]: undefined as any,
            },
            completedSections: [],
            currentStepIndex: 0,
            progress: 0,
          });

          toast.info('Progress reset', {
            description: 'Lesson progress has been cleared.',
          });
        },
      }),
      {
        name: 'lessons-storage',
        partialize: (state) => ({
          // Persist progress data
          sectionProgress: state.sectionProgress,
          exerciseProgress: state.exerciseProgress,
          lessonMetadata: state.lessonMetadata,
          completedSections: state.completedSections,
          filters: state.filters,
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