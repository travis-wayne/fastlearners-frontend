import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  getLessonsMetadata,
  getLessons,
  getLesson,
  getLessonContent,
  type ClassItem,
  type Subject,
  type Term,
  type Week,
  type Lesson,
  type LessonDetail,
  type LessonContent,
  type LessonFilters,
  type MetadataResponse,
  type LessonsListResponse,
  getErrorMessage,
} from '@/lib/api/lessons-api';

interface LessonsStore {
  // Metadata
  classes: ClassItem[];
  subjects: Subject[];
  terms: Term[];
  weeks: Week[];
  
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
  currentSection: 'overview' | 'concepts' | 'exercises';
  progress: number;
  
  // Actions
  setFilters: (filters: Partial<LessonFilters>) => void;
  clearFilters: () => void;
  
  // API actions
  fetchMetadata: () => Promise<void>;
  fetchLessons: (page?: number) => Promise<void>;
  fetchLessonById: (lessonId: number) => Promise<void>;
  fetchLessonContent: (lessonId: number) => Promise<void>;
  
  // UI actions
  setCurrentSection: (section: 'overview' | 'concepts' | 'exercises') => void;
  markSectionCompleted: (sectionId: string) => void;
  clearSelectedLesson: () => void;
  clearError: () => void;
  
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
        currentSection: 'overview',
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
            const response = await getLessonsMetadata();
            if (response.success) {
              set({
                classes: response.content.classes,
                subjects: response.content.subjects,
                terms: response.content.terms,
                weeks: response.content.weeks,
                isLoadingMetadata: false,
              });
            } else {
              throw new Error(response.message);
            }
          } catch (error) {
            console.error('Failed to fetch lessons metadata:', error);
            set({
              error: getErrorMessage(error),
              isLoadingMetadata: false,
            });
          }
        },

        fetchLessons: async (page = 1) => {
          const { filters } = get();
          
          // Check if all required filters are set
          if (!filters.class || !filters.subject || !filters.term || !filters.week) {
            set({ 
              error: 'Please select class, subject, term, and week to view lessons',
              lessons: [],
            });
            return;
          }
          
          set({ isLoadingLessons: true, error: null });
          
          try {
            const response = await getLessons(filters);
            
            if (response.success && response.content) {
              set({
                lessons: response.content.lessons,
                currentPage: response.content.meta.current_page,
                totalPages: response.content.meta.last_page,
                totalLessons: response.content.meta.total,
                isLoadingLessons: false,
              });
            } else {
              // Handle case where no lessons found
              set({
                lessons: [],
                currentPage: 1,
                totalPages: 1,
                totalLessons: 0,
                isLoadingLessons: false,
                error: response.message || 'No lessons found',
              });
            }
          } catch (error) {
            console.error('Failed to fetch lessons:', error);
            set({
              error: getErrorMessage(error),
              lessons: [],
              isLoadingLessons: false,
            });
          }
        },

        fetchLessonById: async (lessonId) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await getLesson(lessonId);
            
            if (response.success && response.content) {
              // Note: This only gets basic lesson details, not full content
              set({
                selectedLesson: { 
                  ...response.content, 
                  concepts: [], 
                  general_exercises: [], 
                  check_markers: [] 
                } as LessonContent,
                isLoading: false,
              });
            } else {
              throw new Error(response.message);
            }
          } catch (error) {
            console.error('Failed to fetch lesson:', error);
            set({
              error: getErrorMessage(error),
              isLoading: false,
            });
          }
        },

        fetchLessonContent: async (lessonId) => {
          set({ isLoadingLessonContent: true, error: null });
          
          try {
            const response = await getLessonContent(lessonId);
            
            if (response.success && response.content) {
              set({
                selectedLesson: response.content,
                isLoadingLessonContent: false,
                completedSections: [], // Reset completed sections for new lesson
                currentSection: 'overview',
              });
              
              // Calculate initial progress
              get().calculateProgress();
            } else {
              throw new Error(response.message);
            }
          } catch (error) {
            console.error('Failed to fetch lesson content:', error);
            set({
              error: getErrorMessage(error),
              isLoadingLessonContent: false,
            });
          }
        },

        // UI actions
        setCurrentSection: (section) => {
          set({ currentSection: section });
        },

        markSectionCompleted: (sectionId) => {
          set((state) => {
            const newCompletedSections = state.completedSections.includes(sectionId)
              ? state.completedSections
              : [...state.completedSections, sectionId];
            
            return { completedSections: newCompletedSections };
          });
          
          // Recalculate progress after marking completion
          get().calculateProgress();
        },

        clearSelectedLesson: () => {
          set({
            selectedLesson: null,
            completedSections: [],
            currentSection: 'overview',
            progress: 0,
          });
        },

        clearError: () => {
          set({ error: null });
        },

        calculateProgress: () => {
          const { selectedLesson, completedSections } = get();
          
          if (!selectedLesson) {
            set({ progress: 0 });
            return;
          }
          
          // Calculate total sections available
          const totalSections = [
            'overview',
            'objectives',
            ...selectedLesson.concepts.map((_, index) => `concept_${index}`),
            'general_exercises',
            'summary',
            'application',
          ];
          
          const completedCount = completedSections.length;
          const progress = totalSections.length > 0 
            ? Math.round((completedCount / totalSections.length) * 100)
            : 0;
          
          set({ progress });
        },
      }),
      {
        name: 'lessons-store',
        // Only persist certain parts of the state
        partialize: (state) => ({
          filters: state.filters,
          completedSections: state.completedSections,
          currentSection: state.currentSection,
        }),
      }
    ),
    { name: 'LessonsStore' }
  )
);

// Selectors for common use cases
export const selectFilteredSubjects = (classId: string) => (state: LessonsStore) => {
  if (!classId) return state.subjects;
  return state.subjects.filter(subject => 
    // If your API provides class_id in subjects, use it for filtering
    // Otherwise, return all subjects
    true // Placeholder - adjust based on your API structure
  );
};

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