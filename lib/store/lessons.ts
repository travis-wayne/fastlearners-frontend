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
  getLessonContentById,
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

// Enhanced types for new features
interface UserPreferences {
  autoAdvance: boolean;
  autoAdvanceDelay: number; // seconds
  displayMode: 'compact' | 'detailed';
  showHints: boolean;
  showSolutions: boolean;
  theme: 'light' | 'dark' | 'auto';
}

interface SessionTracking {
  sessionId: string;
  lessonId: number;
  startedAt: string;
  endedAt?: string;
  sectionsAccessed: string[];
  totalTimeSpent: number; // seconds
}

interface ErrorHistory {
  timestamp: string;
  action: string;
  error: string;
  code?: number;
  retryCount: number;
}

interface AnalyticsData {
  lessonId: number;
  completionRate: number;
  averageTimePerSection: number;
  exerciseAccuracy: number;
  totalAttempts: number;
  insights: string[];
  recommendations: string[];
}

interface QueuedAction {
  id: string;
  action: string;
  params: any[];
  timestamp: string;
  retryCount: number;
}

interface SectionTimeTracking {
  sectionId: string;
  startedAt: string;
  endedAt?: string;
  timeSpent: number; // seconds
  pauses: Array<{ pausedAt: string; resumedAt?: string }>;
}

interface UserNotes {
  sectionId: string;
  notes: string;
  highlights: string[];
  timestamp: string;
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

  // New enhanced features
  userPreferences: UserPreferences;
  sessionTracking: SessionTracking[];
  currentSession: SessionTracking | null;
  errorHistory: ErrorHistory[];
  analyticsData: Record<number, AnalyticsData>;
  queuedActions: QueuedAction[];
  isOffline: boolean;
  sectionTimeTracking: Record<string, SectionTimeTracking>;
  userNotes: Record<string, UserNotes>;
  cacheTimestamps: Record<string, string>;

  // Actions
  setFilters: (filters: Partial<LessonFilters>) => void;
  clearFilters: () => void;

  // API actions
  fetchMetadata: () => Promise<void>;
  fetchLessons: (page?: number) => Promise<void>;
  fetchLessonContentBySlug: (subjectSlug: string, topicSlug: string) => Promise<void>;
  fetchLessonContentById: (lessonId: number) => Promise<void>;

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

  // New enhanced actions
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  startSession: (lessonId: number) => void;
  endSession: () => void;
  addErrorToHistory: (action: string, error: string, code?: number) => void;
  retryQueuedActions: () => Promise<void>;
  setOfflineMode: (isOffline: boolean) => void;
  queueAction: (action: string, params: any[]) => void;
  startSectionTimer: (sectionId: string) => void;
  pauseSectionTimer: (sectionId: string) => void;
  resumeSectionTimer: (sectionId: string) => void;
  endSectionTimer: (sectionId: string) => void;
  addUserNote: (sectionId: string, note: string) => void;
  addHighlight: (sectionId: string, highlight: string) => void;
  updateAnalytics: (lessonId: number) => void;
  getLearningInsights: (lessonId: number) => string[];
  getRecommendations: (lessonId: number) => string[];
  invalidateCache: (key: string) => void;
  debouncedUpdate: (fn: () => void, delay?: number) => void;
  skipToExercises: () => void;
}

const initialFilters: LessonFilters = {
  class: '',
  subject: '',
  term: '',
  week: '',
};

const initialUserPreferences: UserPreferences = {
  autoAdvance: true,
  autoAdvanceDelay: 3,
  displayMode: 'detailed',
  showHints: true,
  showSolutions: false,
  theme: 'auto',
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

        // New enhanced state
        userPreferences: initialUserPreferences,
        sessionTracking: [],
        currentSession: null,
        errorHistory: [],
        analyticsData: {},
        queuedActions: [],
        isOffline: false,
        sectionTimeTracking: {},
        userNotes: {},
        cacheTimestamps: {},

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
            get().addErrorToHistory('fetchMetadata', getErrorMessage(err));
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
          const { isOffline, queuedActions } = get();
          
          if (isOffline) {
            get().queueAction('fetchLessonContentBySlug', [subjectSlug, topicSlug]);
            toast.warning('Offline mode', {
              description: 'Action queued for when connection is restored.',
            });
            return;
          }

          set({ isLoadingLessonContent: true, error: null });
          
          const retryWithBackoff = async (attempt: number = 0): Promise<void> => {
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
                  cacheTimestamps: {
                    ...get().cacheTimestamps,
                    [`lesson_${subjectSlug}_${topicSlug}`]: now,
                  },
                });
                get().calculateProgress();
                get().startSession(lesson.id);
              } else {
                throw new Error(response.message || 'Failed to load lesson content');
              }
            } catch (err) {
              const errorMsg = getErrorMessage(err);
              get().addErrorToHistory('fetchLessonContentBySlug', errorMsg, 500);
              
              if (attempt < 3) {
                const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                setTimeout(() => retryWithBackoff(attempt + 1), delay);
              } else {
                set({
                  error: errorMsg,
                  isLoadingLessonContent: false,
                });
              }
            }
          };

          await retryWithBackoff();
        },

        fetchLessonContentById: async (lessonId: number) => {
          const { isOffline, queuedActions } = get();
          
          if (isOffline) {
            get().queueAction('fetchLessonContentById', [lessonId]);
            toast.warning('Offline mode', {
              description: 'Action queued for when connection is restored.',
            });
            return;
          }

          set({ isLoadingLessonContent: true, error: null });
          
          const retryWithBackoff = async (attempt: number = 0): Promise<void> => {
            try {
              const response = await getLessonContentById(lessonId);
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
                  cacheTimestamps: {
                    ...get().cacheTimestamps,
                    [`lesson_${lessonId}`]: now,
                  },
                });
                get().calculateProgress();
                get().startSession(lesson.id);
              } else {
                throw new Error(response.message || 'Failed to load lesson content');
              }
            } catch (err) {
              const errorMsg = getErrorMessage(err);
              get().addErrorToHistory('fetchLessonContentById', errorMsg, 500);
              
              if (attempt < 3) {
                const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                setTimeout(() => retryWithBackoff(attempt + 1), delay);
              } else {
                set({
                  error: errorMsg,
                  isLoadingLessonContent: false,
                });
              }
            }
          };

          await retryWithBackoff();
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
            get().addErrorToHistory('checkCurrentStepCompletion', getErrorMessage(error));
            if (!silent) {
              toast.error('Error checking progress', {
                description: 'An error occurred while checking your progress. Please try again.',
              });
            }
            return false;
          }
        },

        submitExerciseAnswer: async (exerciseId, answer, isGeneral = false) => {
          const { exerciseProgress, isOffline, queuedActions } = get();
          
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

          if (isOffline) {
            get().queueAction('submitExerciseAnswer', [exerciseId, answer, isGeneral]);
            toast.warning('Offline mode', {
              description: 'Answer submission queued for when connection is restored.',
            });
            return { success: false, message: 'Offline - action queued', isCorrect: false };
          }

          const retryWithBackoff = async (attempt: number = 0): Promise<any> => {
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
              const errorMsg = getErrorMessage(error);
              get().addErrorToHistory('submitExerciseAnswer', errorMsg, error?.code);
              
              if (attempt < 3) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return retryWithBackoff(attempt + 1);
              }
              
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
          };

          return await retryWithBackoff();
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
          get().endSession();
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
          
          // Ensure section ID is lesson-scoped (already in correct format: 'overview', 'concept_<id>', etc.)
          // No need to prefix with lesson ID as sections are already scoped by the selected lesson
          
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

          // End section timer
          get().endSectionTimer(sectionId);
          
          // Update analytics
          get().updateAnalytics(selectedLesson.id);
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

          // Define section order - section IDs are already in correct format
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
          const { userPreferences } = get();
          
          if (!userPreferences.autoAdvance) {
            return false;
          }

          const nextSectionId = get().getNextIncompleteSection();
          
          if (!nextSectionId) {
            toast.success('Lesson completed!', {
              description: 'Great work! You\'ve finished all sections.',
            });
            return false;
          }

          // Add delay before advancing
          if (userPreferences.autoAdvanceDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, userPreferences.autoAdvanceDelay * 1000));
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

        // New enhanced actions
        updateUserPreferences: (preferences) => {
          set((state) => ({
            userPreferences: { ...state.userPreferences, ...preferences },
          }));
        },

        startSession: (lessonId) => {
          const now = new Date().toISOString();
          const sessionId = `session_${Date.now()}`;
          
          const newSession: SessionTracking = {
            sessionId,
            lessonId,
            startedAt: now,
            sectionsAccessed: [],
            totalTimeSpent: 0,
          };

          set({
            currentSession: newSession,
            sessionTracking: [...get().sessionTracking, newSession],
          });
        },

        endSession: () => {
          const { currentSession, sessionTracking } = get();
          
          if (currentSession) {
            const now = new Date().toISOString();
            const endedSession = {
              ...currentSession,
              endedAt: now,
              totalTimeSpent: Math.floor((new Date(now).getTime() - new Date(currentSession.startedAt).getTime()) / 1000),
            };

            set({
              currentSession: null,
              sessionTracking: sessionTracking.map(s => 
                s.sessionId === currentSession.sessionId ? endedSession : s
              ),
            });
          }
        },

        addErrorToHistory: (action, error, code) => {
          const newError: ErrorHistory = {
            timestamp: new Date().toISOString(),
            action,
            error,
            code,
            retryCount: 0,
          };

          set((state) => ({
            errorHistory: [...state.errorHistory.slice(-49), newError], // Keep last 50 errors
          }));
        },

        retryQueuedActions: async () => {
          const { queuedActions } = get();
          
          for (const queuedAction of queuedActions) {
            try {
              // Execute the queued action
              const actionFn = get()[queuedAction.action as keyof LessonsStore] as any;
              if (typeof actionFn === 'function') {
                await actionFn(...queuedAction.params);
              }
              
              // Remove from queue
              set((state) => ({
                queuedActions: state.queuedActions.filter(a => a.id !== queuedAction.id),
              }));
            } catch (error) {
              // Increment retry count
              set((state) => ({
                queuedActions: state.queuedActions.map(a => 
                  a.id === queuedAction.id 
                    ? { ...a, retryCount: a.retryCount + 1 }
                    : a
                ),
              }));
              
              // Read the updated state to check the new retry count
              const updatedQueuedActions = get().queuedActions;
              const updatedAction = updatedQueuedActions.find(a => a.id === queuedAction.id);
              
              // Remove if max retries reached
              if (updatedAction && updatedAction.retryCount >= 3) {
                set((state) => ({
                  queuedActions: state.queuedActions.filter(a => a.id !== queuedAction.id),
                }));
              }
            }
          }
        },

        setOfflineMode: (isOffline) => {
          set({ isOffline });
          
          if (!isOffline) {
            // Retry queued actions when back online
            get().retryQueuedActions();
          }
        },

        queueAction: (action, params) => {
          const queuedAction: QueuedAction = {
            id: `queued_${Date.now()}_${Math.random()}`,
            action,
            params,
            timestamp: new Date().toISOString(),
            retryCount: 0,
          };

          set((state) => ({
            queuedActions: [...state.queuedActions, queuedAction],
          }));
        },

        startSectionTimer: (sectionId) => {
          const now = new Date().toISOString();
          
          set((state) => ({
            sectionTimeTracking: {
              ...state.sectionTimeTracking,
              [sectionId]: {
                sectionId,
                startedAt: now,
                timeSpent: 0,
                pauses: [],
              },
            },
          }));
        },

        pauseSectionTimer: (sectionId) => {
          const { sectionTimeTracking } = get();
          const tracking = sectionTimeTracking[sectionId];
          
          if (tracking && !tracking.endedAt) {
            const now = new Date().toISOString();
            const newPauses = [...(tracking.pauses || []), { pausedAt: now }];
            
            set((state) => ({
              sectionTimeTracking: {
                ...state.sectionTimeTracking,
                [sectionId]: {
                  ...tracking,
                  pauses: newPauses,
                },
              },
            }));
          }
        },

        resumeSectionTimer: (sectionId) => {
          const { sectionTimeTracking } = get();
          const tracking = sectionTimeTracking[sectionId];
          
          if (tracking && !tracking.endedAt) {
            const now = new Date().toISOString();
            const lastPause = tracking.pauses[tracking.pauses.length - 1];
            
            if (lastPause && !lastPause.resumedAt) {
              lastPause.resumedAt = now;
            }
          }
        },

        endSectionTimer: (sectionId) => {
          const { sectionTimeTracking } = get();
          const tracking = sectionTimeTracking[sectionId];
          
          if (tracking && !tracking.endedAt) {
            const now = new Date().toISOString();
            let totalTime = (new Date(now).getTime() - new Date(tracking.startedAt).getTime()) / 1000;
            
            // Subtract paused time
            for (const pause of tracking.pauses) {
              if (pause.resumedAt) {
                totalTime -= (new Date(pause.resumedAt).getTime() - new Date(pause.pausedAt).getTime()) / 1000;
              }
            }
            
            set((state) => ({
              sectionTimeTracking: {
                ...state.sectionTimeTracking,
                [sectionId]: {
                  ...tracking,
                  endedAt: now,
                  timeSpent: Math.max(0, totalTime),
                },
              },
            }));
          }
        },

        addUserNote: (sectionId, note) => {
          const now = new Date().toISOString();
          
          set((state) => ({
            userNotes: {
              ...state.userNotes,
              [sectionId]: {
                sectionId,
                notes: note,
                highlights: state.userNotes[sectionId]?.highlights || [],
                timestamp: now,
              },
            },
          }));
        },

        addHighlight: (sectionId, highlight) => {
          set((state) => ({
            userNotes: {
              ...state.userNotes,
              [sectionId]: {
                ...state.userNotes[sectionId],
                sectionId,
                highlights: [
                  ...(state.userNotes[sectionId]?.highlights || []),
                  highlight,
                ],
                timestamp: new Date().toISOString(),
              },
            },
          }));
        },

        updateAnalytics: (lessonId) => {
          const { sectionProgress, exerciseProgress, lessonMetadata, sectionTimeTracking, selectedLesson } = get();
          
          const lessonMeta = lessonMetadata[lessonId];
          if (!lessonMeta) return;

          // Calculate analytics - filter sections by lesson ID
          // Section IDs should be in format: 'overview', 'concept_<id>', 'summary_application', 'general_exercises'
          // For lesson-scoped sections, we need to check if they belong to the current lesson
          const sections = Object.values(sectionProgress).filter(s => {
            // Overview, summary_application, and general_exercises are lesson-specific
            if (s.sectionId === 'overview' || s.sectionId === 'summary_application' || s.sectionId === 'general_exercises') {
              return selectedLesson?.id === lessonId;
            }
            // Concept sections: concept_<conceptId> - check if concept belongs to this lesson
            if (s.sectionId.startsWith('concept_')) {
              const conceptId = parseInt(s.sectionId.replace('concept_', ''));
              return selectedLesson?.concepts?.some(c => c.id === conceptId) || false;
            }
            return false;
          });
          
          // Filter exercises by lesson - exercises belong to concepts which belong to lessons
          const exercises = Object.values(exerciseProgress).filter(e => {
            if (!selectedLesson) return false;
            // Check if exercise belongs to any concept in this lesson
            return selectedLesson.concepts?.some(concept => 
              concept.exercises?.some(ex => ex.id === e.exerciseId)
            ) || selectedLesson.general_exercises?.some(ge => ge.id === e.exerciseId) || false;
          });
          
          const completionRate = lessonMeta.overallProgress;
          const totalTime = Object.values(sectionTimeTracking).reduce((sum, t) => sum + t.timeSpent, 0);
          const averageTimePerSection = sections.length > 0 ? totalTime / sections.length : 0;
          
          const correctExercises = exercises.filter(e => e.isCorrect).length;
          const exerciseAccuracy = exercises.length > 0 ? (correctExercises / exercises.length) * 100 : 0;
          const totalAttempts = exercises.reduce((sum, e) => sum + e.attempts, 0);
          
          // Generate insights
          const insights: string[] = [];
          if (exerciseAccuracy < 70) {
            insights.push('Consider reviewing fundamental concepts before proceeding.');
          }
          if (averageTimePerSection > 300) { // 5 minutes
            insights.push('You might benefit from breaking study sessions into shorter intervals.');
          }
          
          // Generate recommendations
          const recommendations: string[] = [];
          if (completionRate < 50) {
            recommendations.push('Focus on completing the overview and basic concepts first.');
          }
          if (totalAttempts > exercises.length * 2) {
            recommendations.push('Try reviewing solutions after incorrect attempts to understand mistakes.');
          }

          set((state) => ({
            analyticsData: {
              ...state.analyticsData,
              [lessonId]: {
                lessonId,
                completionRate,
                averageTimePerSection,
                exerciseAccuracy,
                totalAttempts,
                insights,
                recommendations,
              },
            },
          }));
        },

        getLearningInsights: (lessonId) => {
          return get().analyticsData[lessonId]?.insights || [];
        },

        getRecommendations: (lessonId) => {
          return get().analyticsData[lessonId]?.recommendations || [];
        },

        invalidateCache: (key) => {
          set((state) => ({
            cacheTimestamps: {
              ...state.cacheTimestamps,
              [key]: undefined as any,
            },
          }));
        },

        debouncedUpdate: (() => {
          let timeoutId: NodeJS.Timeout;
          return (fn: () => void, delay = 300) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(fn, delay);
          };
        })(),

        skipToExercises: () => {
          const { selectedLesson } = get();
          if (!selectedLesson) return;

          const stepIndex = (selectedLesson.concepts?.length || 0) + 2;
          set({ currentStepIndex: stepIndex });
          
          toast.info('Skipped to exercises', {
            description: 'Jumped directly to the practice exercises.',
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
          // New persistable data
          userPreferences: state.userPreferences,
          sessionTracking: state.sessionTracking.slice(-10), // Keep last 10 sessions
          errorHistory: state.errorHistory.slice(-20), // Keep last 20 errors
          analyticsData: state.analyticsData,
          userNotes: state.userNotes,
          cacheTimestamps: state.cacheTimestamps,
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