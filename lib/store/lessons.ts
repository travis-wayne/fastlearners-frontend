import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  type ClassItem,
  type Subject,
  type Term,
  type Week,
  type Lesson,
  type LessonDetail,
  type LessonContent,
  type LessonFilters,
  getErrorMessage,
} from '@/lib/api/lessons-api';
import {
  getSubjectsWithSlugs,
  getTopicsBySubjectSlug,
  getLessonContentBySlug,
} from '@/lib/api/lessons';

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
  fetchLessonContentBySlug: (subjectSlug: string, topicSlug: string) => Promise<void>;
  
  // UI actions
  setCurrentSection: (section: 'overview' | 'concepts' | 'exercises') => void;
  markSectionCompleted: (sectionId: string) => void;
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
            // Use getProfileData from lib/api/profile.ts instead of removed getLessonsMetadata
            const { getProfileData } = await import('@/lib/api/profile');
            const profileData = await getProfileData();
            
            // Map profile data to metadata format
            set({
              classes: profileData.classes || [],
              subjects: [], // Subjects should come from getSubjectsWithSlugs()
              terms: [], // Terms should come from academic context
              weeks: [], // Weeks should come from academic context
              isLoadingMetadata: false,
            });
          } catch (error) {
            console.error('Failed to fetch lessons metadata:', error);
            set({
              error: getErrorMessage(error),
              isLoadingMetadata: false,
            });
          }
        },

        fetchLessons: async (page = 1) => {
          // fetchLessons removed - use slug-based navigation instead
          // Use getSubjectsWithSlugs() and getTopicsBySubjectSlug() from lib/api/lessons.ts
          set({ 
            error: 'Please use slug-based navigation to view lessons. Use getSubjectsWithSlugs() and getTopicsBySubjectSlug()',
            lessons: [],
            isLoadingLessons: false,
          });
        },

        fetchLessonContentBySlug: async (subjectSlug, topicSlug) => {
          set({ isLoadingLessonContent: true, error: null });
          
          try {
            const response = await getLessonContentBySlug(subjectSlug, topicSlug);
            
            if (response.success && response.content) {
              // Map the slug-based response to LessonContent format
              const lessonContent = response.content;
              set({
                selectedLesson: lessonContent as LessonContent,
                isLoadingLessonContent: false,
                completedSections: [], // Reset completed sections for new lesson
                currentSection: 'overview',
              });
              
              // Calculate initial progress
              get().calculateProgress();
            } else {
              throw new Error(response.message || 'Failed to fetch lesson content');
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

        setSelectedLesson: (lesson) => {
          set({
            selectedLesson: lesson,
            isLoadingLessonContent: false,
            completedSections: [],
            currentSection: 'overview',
            error: null,
          });
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