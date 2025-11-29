// lib/types/progress.ts
// Adaptive Learning Progress Tracking Types

/**
 * Section types in a lesson
 */
export type SectionType = 'overview' | 'concept' | 'summary_application' | 'general_exercises';

/**
 * Progress tracking for individual exercises
 */
export interface ExerciseProgress {
  exerciseId: number;
  isCompleted: boolean;
  isCorrect: boolean | null;
  userAnswer: string | null;
  attempts: number;
  firstAttemptAt: string | null;
  lastAttemptAt: string | null;
}

/**
 * Progress tracking for lesson sections
 */
export interface SectionProgress {
  sectionId: string;
  sectionType: SectionType;
  isCompleted: boolean;
  completedAt: string | null;
  exercisesCompleted: number;
  exercisesTotal: number;
  attempts: number;
  score?: number; // Percentage score if applicable
}

/**
 * Metadata for overall lesson progress
 */
export interface LessonMetadata {
  lessonId: number;
  totalSections: number;
  completedSections: number;
  overallProgress: number; // Percentage (0-100)
  lastAccessedAt: string;
  lastCompletedSectionId: string | null;
  startedAt: string;
}
