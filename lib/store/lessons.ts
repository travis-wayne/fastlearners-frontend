import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  type ClassItem,
  type Subject,
  type Term,
} from '@/lib/api/lessons-api';
import {
  getLessonsMetadata as getSuperadminMetadata,
  getLessons as getSuperadminLessons,
  getLessonContent as getSuperadminLessonContent,
  getLessonById as getSuperadminLessonById,
} from '@/lib/api/superadmin-lessons';

import {
  type Lesson,
  type LessonContent,
  type LessonFilters,
  type Concept,
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
  getConceptScore,
  getGeneralExerciseScore,
} from '@/lib/api/lessons';
import { toast } from 'sonner';

// --- Pure Helper Functions ---

// 1. Determine Section Context
function getSectionContext(currentStepIndex: number, selectedLesson: LessonContent) {
  const conceptsCount = selectedLesson.concepts?.length || 0;
  
  if (currentStepIndex === 0) {
    return {
      sectionId: 'overview',
      stepName: 'Overview',
      sectionType: 'overview' as SectionType,
      isConceptStep: false,
      hasExercises: false,
      concept: null
    };
  } 
  
  if (currentStepIndex <= conceptsCount) {
    const conceptIndex = currentStepIndex - 1;
    const concept = selectedLesson.concepts?.[conceptIndex];
    if (concept) {
      return {
        sectionId: `concept_${concept.id}`,
        stepName: concept.title || `Concept ${conceptIndex + 1}`,
        sectionType: 'concept' as SectionType,
        isConceptStep: true,
        hasExercises: !!(concept.exercises && concept.exercises.length > 0),
        concept
      };
    }
  } 
  
  if (currentStepIndex === conceptsCount + 1) {
    return {
      sectionId: 'summary_application',
      stepName: 'Summary & Application',
      sectionType: 'summary_application' as SectionType,
      isConceptStep: false,
      hasExercises: false,
      concept: null
    };
  } 
  
  if (currentStepIndex === conceptsCount + 2) {
    return {
      sectionId: 'general_exercises',
      stepName: 'General Exercises',
      sectionType: 'general_exercises' as SectionType,
      isConceptStep: false,
      hasExercises: true,
      concept: null
    };
  }

  return null;
}

// 2. Determine Check Promise based on context and local state
function getCheckPromise(
  context: NonNullable<ReturnType<typeof getSectionContext>>,
  lessonId: number,
  selectedLesson: LessonContent,
  exerciseProgress: Record<number, ExerciseProgress>
): Promise<any> {
    const { sectionType, concept } = context;

    if (sectionType === 'overview') {
        return checkLessonOverview(lessonId);
    }
    
    if (sectionType === 'concept' && concept) {
        if (concept.exercises && concept.exercises.length > 0) {
            // Check local state first
            const allExercisesDone = concept.exercises.every(ex => 
                exerciseProgress[ex.id]?.isCompleted && exerciseProgress[ex.id]?.isCorrect
            );
            if (allExercisesDone) {
                if (process.env.NODE_ENV === 'development') {
                    console.debug('Concept exercises locally complete');
                }
                // We still verify with API to be safe, but we know it's likely done.
                // Or we could return minimal success object if we trust local state 100%.
                // The verification comment implies we should just do the check.
            }
            return checkLessonConcept(lessonId, concept.id);
        } else {
            // No exercises, instant success
            return Promise.resolve({ success: true, content: { check: { is_completed: true } } });
        }
    }

    if (sectionType === 'summary_application') {
        return checkLessonSummaryAndApplication(lessonId);
    }

    if (sectionType === 'general_exercises') {
        const generalExercises = selectedLesson.general_exercises || [];
        const allExercisesDone = generalExercises.every(ex => 
            exerciseProgress[ex.id]?.isCompleted
        );
        
        if (allExercisesDone) {
             return Promise.resolve({ success: true, content: { check: { is_completed: true } } });
        }
        return checkLessonGeneralExercises(lessonId);
    }

    return Promise.resolve({ success: false });
}

// 3. Validate API Response
function validateCompletionResponse(response: any, sectionType: SectionType) {
    let isVerified = false;
    let isAllowedWithWarning = false;

    if (response && response.success && response.content?.check?.is_completed) {
        isVerified = true;
    } else if (response?.code === 400) {
        // Handle 400 (flaky API / missing check markers)
        const isContentSection = sectionType === 'overview' || sectionType === 'summary_application';
        const isCheckMarkerError = response.message?.includes('check marker');
        
        if (isContentSection || isCheckMarkerError) {
             isAllowedWithWarning = true;
        } else if (sectionType === 'general_exercises' && (response.message?.includes('already answered') || response.message?.includes('Already answered'))) {
             isAllowedWithWarning = true;
        }
    }
    
    return { isVerified, isAllowedWithWarning };
}

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
  totalTime: number; // Total lesson time in seconds
  exerciseAccuracy: number;
  totalAttempts: number;
  insights: string[];
  recommendations: string[];
  // Enhanced analytics fields
  timeEfficiency?: number;
  firstAttemptAccuracy?: number;
  retryRate?: number;
  detailedInsights?: import("@/lib/utils/lesson-analytics").PerformanceInsights;
  personalizedRecommendations?: import("@/lib/utils/lesson-analytics").PersonalizedRecommendations;
  comparisonWithAverage?: { score: number; time: number; accuracy: number };
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
  // Superadmin Mode
  isSuperadminMode: boolean;
  setSuperadminMode: (isSuperadmin: boolean) => void;

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

  // Lesson completion summary
  showCompletionSummary: boolean;
  completionData: import('@/lib/types/lessons').LessonCompletionData | null;
  isLoadingCompletionData: boolean;

  // Score Caching
  conceptScores: Record<number, { total_score: string; weight: string; timestamp: string }>;
  generalExerciseScores: Record<number, { total_score: string; weight: string; timestamp: string }>;
  isLoadingConceptScore: Record<number, boolean>;
  isLoadingGeneralExerciseScore: Record<number, boolean>;

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
  markExerciseCompleted: (exerciseId: number, isCorrect: boolean, userAnswer: string, scoreData?: any) => void;
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
  setShowCompletionSummary: (show: boolean) => void;
  fetchCompletionData: (lessonId: number) => Promise<void>;
  clearCompletionData: () => void;
  
  // Score actions
  fetchConceptScore: (conceptId: number) => Promise<void>;
  fetchGeneralExerciseScore: (exerciseId: number) => Promise<void>;
  getConceptScoreFromCache: (conceptId: number) => { total_score: string; weight: string } | null;
  getGeneralExerciseScoreFromCache: (exerciseId: number) => { total_score: string; weight: string } | null;
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
        isSuperadminMode: false,
        setSuperadminMode: (mode) => set({ isSuperadminMode: mode }),

        // Initial state
        classes: [],
        subjects: [],
        terms: [],
        weeks: [],
        lessons: [],
        selectedLesson: null,
        filters: {
          class: "",
          subject: "",
          term: "",
          week: "",
        },
        isLoading: false,
        isLoadingMetadata: false,
        isLoadingLessons: false,
        isLoadingLessonContent: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalLessons: 0,
        completedSections: [],
        currentStepIndex: 0,
        unlockedSteps: [0],
        progress: 0,

        // Adaptive learning progress
        sectionProgress: {},
        exerciseProgress: {},
        lessonMetadata: {},
        exerciseAnswers: {},
        isSubmittingExercise: false,

        // New enhanced state
        userPreferences: {
            autoAdvance: true,
            autoAdvanceDelay: 5,
            displayMode: 'detailed',
            showHints: true,
            showSolutions: false,
            theme: 'auto'
        },
        sessionTracking: [],
        currentSession: null,
        errorHistory: [],
        analyticsData: {
            averageTimePerSection: {},
            commonErrors: {},
            preferredLearningTime: null,
            completionRates: {}
        },
        queuedActions: [],
        isOffline: false,
        sectionTimeTracking: {},
        userNotes: {},
        cacheTimestamps: {},
        lastSyncedAt: null,

        // Lesson completion summary
        showCompletionSummary: false,
        completionData: null,
        isLoadingCompletionData: false,

        // Score Caching
        conceptScores: {},
        generalExerciseScores: {},
        isLoadingConceptScore: {},
        isLoadingGeneralExerciseScore: {},
        adaptiveRecommendations: [],
        


        // Filter actions
        setFilters: (newFilters) => {
          set((state) => ({ filters: { ...state.filters, ...newFilters }, currentPage: 1 }));
        },

        clearFilters: () => {
          set({ filters: { class: "", subject: "", term: "", week: "" }, currentPage: 1 });
        },

        // API actions
        fetchMetadata: async () => {
          set({ isLoadingMetadata: true, error: null });

          try {
            if (get().isSuperadminMode) {
              const response = await getSuperadminMetadata();
              const data = response.content; // Access content from ApiResponse

              if (response.success && data) {
                 set({
                  classes: (data.classes || []).map((c) => ({ id: c.id, name: c.name })),
                  subjects: (data.subjects || []).map((s) => ({ id: s.id, name: s.name, slug: '' })), // Subject from superadmin might usually not have slug?
                  terms: (data.terms || []).map((t) => ({ id: t.id, name: t.name })),
                  weeks: (data.weeks || []).map((w) => ({ id: w.id, name: w.name })),
                  isLoadingMetadata: false,
                });
              } else {
                 throw new Error(response.message || 'Failed to fetch metadata');
              }
            } else {
               const { getProfileData } = await import('@/lib/api/profile');
               const profileData = await getProfileData();
               set({
                  classes: (profileData.classes || []).map((cls, index) => ({
                    id: index + 1,
                    name: cls.name,
                  })),
                  subjects: [], // Profile data might not match exactly, keeping legacy behavior
                  terms: [
                    { id: 1, name: 'First' },
                    { id: 2, name: 'Second' },
                    { id: 3, name: 'Third' },
                  ],
                  weeks: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: i + 1 })),
                  isLoadingMetadata: false,
                });
            }
          } catch (err) {
             set({
              error: getErrorMessage(err),
              isLoadingMetadata: false,
             });
          }
        },

        fetchLessons: async (page = 1) => {
           const filters = get().filters;

           // Check if all required filters are set before making API call
           if (!filters.class || !filters.subject || !filters.term || !filters.week) {
             // Don't show error, just clear lessons and return - user needs to select filters first
             set({
               lessons: [],
               isLoadingLessons: false,
               totalLessons: 0,
               totalPages: 1,
               currentPage: 1
             });
             return;
           }

           set({ isLoadingLessons: true, error: null });
           try {
             if (get().isSuperadminMode) {
                const requestPayload = {
                    ...filters,
                    page,
                    limit: 12
                };
                const response = await getSuperadminLessons(requestPayload);

                if (response.success && response.content) {
                    // response.content is LessonsListResponse from superadmin-lessons.ts
                    // which has 'lessons', 'links', 'meta'.
                    const content = response.content as any; // Cast if type mismatch exists between definition files

                    set({
                        lessons: content.lessons || [],
                        currentPage: content.meta?.current_page || 1,
                        totalPages: content.meta?.last_page || 1,
                        totalLessons: content.meta?.total || 0,
                        isLoadingLessons: false
                    });
                } else {
                    throw new Error(response.message || "Failed to fetch lessons");
                }
             } else {
               // Student fetch logic placeholder
               set({ isLoadingLessons: false });
             }
           } catch (error) {
               set({ isLoadingLessons: false, error: getErrorMessage(error) });
           }
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
              let response;
              if (get().isSuperadminMode) {
                response = await getSuperadminLessonContent(Number(lessonId));
              } else {
                response = await getLessonContentById(lessonId);
              }
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
          const { selectedLesson, currentStepIndex, completedSections, exerciseProgress } = get();
          if (!selectedLesson) return false;
          
          const lessonId = selectedLesson.id;

          // 1. Determine Context (Pure)
          const context = getSectionContext(currentStepIndex, selectedLesson);
          if (!context) return false;

          const { sectionId, sectionType, stepName, isConceptStep, hasExercises } = context;

          try {
            // 2. Execute Check with Performance Instrumention
            if (process.env.NODE_ENV === 'development') {
                performance.mark('check-step-start');
            }

            const checkPromise = getCheckPromise(context, lessonId, selectedLesson, exerciseProgress);
            const response = await checkPromise;

            if (process.env.NODE_ENV === 'development') {
                performance.mark('check-step-end');
                performance.measure('check-step-duration', 'check-step-start', 'check-step-end');
            }

            // 3. Validate Response (Pure)
            const { isVerified, isAllowedWithWarning } = validateCompletionResponse(response, sectionType);

            // 4. Batch Updates (Effect)
            if (isVerified || isAllowedWithWarning) {
              if (sectionId && !completedSections.includes(sectionId)) {
                
                // --- Batch State Calculation ---
                const { sectionProgress, lessonMetadata } = get();
                const now = new Date().toISOString(); 
                
                const newCompletedSections = [...completedSections, sectionId];
                
                const newSectionProgress = {
                    ...sectionProgress,
                    [sectionId]: {
                        sectionId,
                        sectionType,
                        isCompleted: true,
                        completedAt: now,
                        exercisesCompleted: sectionProgress[sectionId]?.exercisesCompleted || 0,
                        exercisesTotal: sectionProgress[sectionId]?.exercisesTotal || 0,
                        attempts: (sectionProgress[sectionId]?.attempts || 0) + 1,
                    }
                };
                
                let newMetadata = lessonMetadata;
                const currentMeta = lessonMetadata[lessonId];
                if (currentMeta) {
                    const newCompletedCount = currentMeta.completedSections + 1;
                    const newProgress = Math.round((newCompletedCount / currentMeta.totalSections) * 100);
                    newMetadata = {
                        ...lessonMetadata,
                        [lessonId]: {
                            ...currentMeta,
                            completedSections: newCompletedCount,
                            overallProgress: newProgress,
                            lastCompletedSectionId: sectionId,
                            lastAccessedAt: now,
                        }
                    };
                }

                // --- Single State Update ---
                set({ 
                    completedSections: newCompletedSections, 
                    error: null,
                    sectionProgress: newSectionProgress,
                    lessonMetadata: newMetadata
                });
                
                // --- Post-Update Effects (Calls) ---
                get().calculateProgress(); 
                get().endSectionTimer(sectionId);
                
                // Debounced analytics
                get().debouncedUpdate(() => get().updateAnalytics(lessonId), 2000);

                if (!silent) {
                    const title = isAllowedWithWarning ? 'Completion verified' : `${stepName} completed!`;
                    const desc = isAllowedWithWarning 
                        ? "Proceeding despite server verification issue." 
                        : "Great job! You can now proceed.";
                    
                   isAllowedWithWarning 
                    ? toast.warning(title, { description: desc })
                    : toast.success(title, { description: desc });
                }
              }
              return true;
            }

            // 5. Handle Failure
            if (!silent) {
               const msg = (isConceptStep && hasExercises)
                 ? `Please complete all exercises in "${stepName}" first.`
                 : `Please complete "${stepName}" before proceeding.`;
               
               toast.error('Partially completed', { description: msg });
            }
            return false;

          } catch (error) {
            console.error("Completion check failed:", error);
            if (!silent) toast.error('Check failed', { description: 'Could not verify progress. Try again.' });
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

              // Debug response structure
              console.log('[submitExerciseAnswer] checkExerciseAnswer response:', response);
              
              const responseMsg = response.message?.toLowerCase() || '';

              // Check if response indicates "already answered" - treat as correct
              // "Exercise already answered, continue learning!" is the standard message
              // Also check for "success: false" but with "already answered" message (API quirk)
              const isAlreadyAnswered = responseMsg.includes('already answered');
              
              const isAnswerCorrect = response.isCorrect === true || 
                                     (response.success === true && response.code === 200) ||
                                     isAlreadyAnswered;

              // Mark exercise as completed in adaptive progress - ONLY if answer is correct
              if (isAnswerCorrect) {
                get().markExerciseCompleted(exerciseId, true, answer, response.content);
              }

              if (response.success && isAnswerCorrect) {
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

              // Invalidate score cache if answer is correct to update UI immediately
              if (response.success && isAnswerCorrect) {
                const { selectedLesson, currentStepIndex } = get();
                if (selectedLesson) {
                   const conceptsCount = selectedLesson.concepts?.length || 0;
                   if (currentStepIndex <= conceptsCount && currentStepIndex > 0) {
                      // Concept exercise
                      const conceptIndex = currentStepIndex - 1;
                      const concept = selectedLesson.concepts?.[conceptIndex];
                      if (concept) {
                        const conceptId = concept.id;
                        // Clear cache entry
                        set((state) => {
                          const newScores = { ...state.conceptScores };
                          delete newScores[conceptId];
                          return { conceptScores: newScores };
                        });
                        // Refetch immediately
                        get().fetchConceptScore(conceptId);
                      }
                   } else if (currentStepIndex === conceptsCount + 2) {
                      // General exercise - exerciseId is the general exercise ID
                      // Clear cache entry
                      set((state) => {
                        const newScores = { ...state.generalExerciseScores };
                         // We track general exercise SCORES by exercise ID in the cache
                         // But note: we might have been caching by the specific exercise ID
                        delete newScores[exerciseId];
                        return { generalExerciseScores: newScores };
                      });
                       // Refetch immediately
                      get().fetchGeneralExerciseScore(exerciseId);
                   }
                }
              }

              return {
                success: response.success || isAnswerCorrect,
                message: response.message,
                isCorrect: isAnswerCorrect,
                code: response.code || 200
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

        markExerciseCompleted: (exerciseId, isCorrect, userAnswer, scoreData) => {
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
                scoreData: scoreData || existing?.scoreData, // Persist scoreData
                cachedResponse: scoreData ? { success: true, content: scoreData } : existing?.cachedResponse // Update cachedResponse too if provided
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
            // Clear score caches
            conceptScores: {},
            generalExerciseScores: {},
            isLoadingConceptScore: {},
            isLoadingGeneralExerciseScore: {},
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
          const { sectionProgress, exerciseProgress, lessonMetadata, sectionTimeTracking, selectedLesson, analyticsData: currentAnalyticsData } = get();
          
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
          
          // Generate basic insights
          const insights: string[] = [];
          if (exerciseAccuracy < 70) {
            insights.push('Consider reviewing fundamental concepts before proceeding.');
          }
          if (averageTimePerSection > 300) { // 5 minutes
            insights.push('You might benefit from breaking study sessions into shorter intervals.');
          }
          
          // Generate basic recommendations
          const recommendations: string[] = [];
          if (completionRate < 50) {
            recommendations.push('Focus on completing the overview and basic concepts first.');
          }
          if (totalAttempts > exercises.length * 2) {
            recommendations.push('Try reviewing solutions after incorrect attempts to understand mistakes.');
          }

          // Calculate comprehensive analytics using lesson-analytics utility
          let comprehensiveAnalytics = null;
          try {
            // Import analytics utility dynamically
            import('@/lib/utils/lesson-analytics').then(({ calculatePerformanceInsights }) => {
              // Calculate historical averages for comparison
              const allLessonAnalytics = Object.values(currentAnalyticsData);
              // Filter out null/undefined analytics entries before calculating
              const validAnalytics = allLessonAnalytics.filter((a): a is NonNullable<typeof a> => a != null);
              const historicalAverages = validAnalytics.length > 0 ? {
                score: validAnalytics.reduce((sum, a) => sum + (a.exerciseAccuracy ?? 0), 0) / validAnalytics.length,
                time: validAnalytics.reduce((sum, a) => sum + (a.totalTime ?? 0), 0) / validAnalytics.length, // Use totalTime for consistent comparison
                accuracy: validAnalytics.reduce((sum, a) => sum + (a.exerciseAccuracy ?? 0), 0) / validAnalytics.length,
              } : undefined;

              // Create exercise progress map
              const exerciseProgressMap: Record<number, any> = {};
              exercises.forEach(ex => {
                exerciseProgressMap[ex.exerciseId] = ex;
              });

              // Calculate comprehensive insights
              const analytics = calculatePerformanceInsights(
                {
                  lessonId,
                  lessonTitle: selectedLesson?.title || '',
                  lessonScore: exerciseAccuracy,
                  conceptScores: [],
                  generalExercisesScore: exerciseAccuracy,
                  generalExercisesWeight: 100,
                  totalExercises: exercises.length,
                  completedExercises: exercises.filter(e => e.isCompleted).length,
                  timeSpent: totalTime,
                  accuracyRate: exerciseAccuracy,
                },
                exerciseProgressMap,
                historicalAverages
              );

              // Update state with comprehensive analytics
              set((state) => ({
                analyticsData: {
                  ...state.analyticsData,
                  [lessonId]: {
                    ...state.analyticsData[lessonId],
                    timeEfficiency: analytics.metrics.timeEfficiency,
                    firstAttemptAccuracy: analytics.metrics.firstAttemptAccuracy,
                    retryRate: analytics.metrics.retryRate,
                    detailedInsights: analytics.insights,
                    personalizedRecommendations: analytics.recommendations,
                    comparisonWithAverage: historicalAverages ? {
                      score: exerciseAccuracy - historicalAverages.score,
                      time: totalTime - historicalAverages.time,
                      accuracy: exerciseAccuracy - historicalAverages.accuracy,
                    } : undefined,
                  },
                },
              }));
            }).catch(error => {
              console.error('Failed to calculate comprehensive analytics:', error);
            });
          } catch (error) {
            console.error('Error importing analytics utility:', error);
          }

          set((state) => ({
            analyticsData: {
              ...state.analyticsData,
              [lessonId]: {
                lessonId,
                completionRate,
                averageTimePerSection,
                totalTime, // Store total lesson time for consistent comparisons
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

        // Lesson completion summary actions
        setShowCompletionSummary: (show) => {
          set({ showCompletionSummary: show });
        },

        fetchCompletionData: async (lessonId) => {
          const state = get();
          if (!state.selectedLesson) return;
          
          set({ isLoadingCompletionData: true, error: null });
          
          try {
            const { getLessonCompletionData } = await import('@/lib/api/lessons');
            const result = await getLessonCompletionData(
              lessonId,
              state.selectedLesson,
              state.sectionTimeTracking,
              state.exerciseProgress
            );
            
            if (result.success && result.data) {
              set({ 
                completionData: result.data,
                isLoadingCompletionData: false 
              });
            } else {
              throw new Error(result.message);
            }
          } catch (err) {
            const errorMsg = getErrorMessage(err);
            set({ 
              error: errorMsg,
              isLoadingCompletionData: false 
            });
            get().addErrorToHistory('fetchCompletionData', errorMsg);
          }
        },

        clearCompletionData: () => {
          set({ 
            completionData: null,
            showCompletionSummary: false 
          });
        },

        // Score Caching Actions
        fetchConceptScore: async (conceptId: number) => {
          const { conceptScores, isLoadingConceptScore } = get();
          
          // Check if score exists and is fresh (less than 5 minutes old)
          const cachedScore = conceptScores[conceptId];
          const now = new Date();
          if (cachedScore) {
            const timestamp = new Date(cachedScore.timestamp);
            const diffMinutes = (now.getTime() - timestamp.getTime()) / (1000 * 60);
            if (diffMinutes < 5) return; // Return if cache is fresh
          }

          if (isLoadingConceptScore[conceptId]) return;

          set({ isLoadingConceptScore: { ...isLoadingConceptScore, [conceptId]: true } });

          try {
            const response = await getConceptScore(conceptId);
            if (response.success && response.content) {
              const { total_score, weight } = response.content;
              const { conceptScores: currentScores, isLoadingConceptScore: currentLoading } = get();
              set({
                conceptScores: {
                  ...currentScores,
                  [conceptId]: {
                    total_score: total_score?.toString() || "0",
                    weight: weight?.toString() || "0",
                    timestamp: now.toISOString(),
                  }
                },
                isLoadingConceptScore: { ...currentLoading, [conceptId]: false }
              });
            } else {
              // Handle error: stop loading but don't cache bad data
               const { isLoadingConceptScore: currentLoading } = get();
               set({ isLoadingConceptScore: { ...currentLoading, [conceptId]: false } });
            }
          } catch (error) {
             const { isLoadingConceptScore: currentLoading } = get();
             set({ isLoadingConceptScore: { ...currentLoading, [conceptId]: false } });
             console.error("Failed to fetch concept score", error);
          }
        },

        fetchGeneralExerciseScore: async (exerciseId: number) => {
          const { generalExerciseScores, isLoadingGeneralExerciseScore } = get();
          
          // Check if score exists and is fresh (less than 5 minutes old)
          const cachedScore = generalExerciseScores[exerciseId];
          const now = new Date();
          if (cachedScore) {
            const timestamp = new Date(cachedScore.timestamp);
            const diffMinutes = (now.getTime() - timestamp.getTime()) / (1000 * 60);
            if (diffMinutes < 5) return; // Return if cache is fresh
          }
          
          if (isLoadingGeneralExerciseScore[exerciseId]) return;

          set({ isLoadingGeneralExerciseScore: { ...isLoadingGeneralExerciseScore, [exerciseId]: true } });

          try {
            const response = await getGeneralExerciseScore(exerciseId);
            if (response.success && response.content) {
              const { total_score, weight } = response.content;
              const { generalExerciseScores: currentScores, isLoadingGeneralExerciseScore: currentLoading } = get();
              
              set({
                generalExerciseScores: {
                  ...currentScores,
                  [exerciseId]: {
                    total_score: total_score?.toString() || "0",
                    weight: weight?.toString() || "0",
                    timestamp: now.toISOString(),
                  }
                },
                isLoadingGeneralExerciseScore: { ...currentLoading, [exerciseId]: false }
              });
            } else {
               const { isLoadingGeneralExerciseScore: currentLoading } = get();
               set({ isLoadingGeneralExerciseScore: { ...currentLoading, [exerciseId]: false } });
            }
          } catch (error) {
             const { isLoadingGeneralExerciseScore: currentLoading } = get();
             set({ isLoadingGeneralExerciseScore: { ...currentLoading, [exerciseId]: false } });
             console.error("Failed to fetch general exercise score", error);
          }
        },

        getConceptScoreFromCache: (conceptId: number) => {
          const { conceptScores } = get();
          const score = conceptScores[conceptId];
          return score ? { total_score: score.total_score, weight: score.weight } : null;
        },

        getGeneralExerciseScoreFromCache: (exerciseId: number) => {
           const { generalExerciseScores } = get();
           const score = generalExerciseScores[exerciseId];
           return score ? { total_score: score.total_score, weight: score.weight } : null;
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
          conceptScores: state.conceptScores,
          generalExerciseScores: state.generalExerciseScores,
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

// Score Selectors
export const selectConceptScore = (conceptId: number) => (state: LessonsStore) => ({
  score: state.conceptScores[conceptId] || null,
  isLoading: state.isLoadingConceptScore[conceptId] || false,
});

export const selectGeneralExerciseScore = (exerciseId: number) => (state: LessonsStore) => ({
  score: state.generalExerciseScores[exerciseId] || null,
  isLoading: state.isLoadingGeneralExerciseScore[exerciseId] || false,
});

export const selectNavigationState = (state: LessonsStore) => ({
  currentStepIndex: state.currentStepIndex,
  sectionProgress: state.sectionProgress,
  isLoadingLessonContent: state.isLoadingLessonContent,
});

export const selectProgressData = (state: LessonsStore) => ({
  progress: state.progress,
  completedSections: state.completedSections,
});