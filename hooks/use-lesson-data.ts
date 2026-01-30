"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { useLessonsStore } from "@/lib/store/lessons";
import { getLessonScore } from "@/lib/api/lessons";
import { LessonContent } from "@/lib/types/lessons";
import { BookOpen, Wifi, WifiOff, AlertCircle } from "lucide-react";

// Enhanced error types for better error handling
export type ErrorType = 'network' | 'not_found' | 'unauthorized' | 'server' | 'unknown';

export interface EnhancedError {
  type: ErrorType;
  message: string;
  details?: string;
  canRetry: boolean;
}

interface UseLessonDataParams {
  lessonId?: number;
  subjectSlug?: string;
  topicSlug?: string;
  autoLoad?: boolean;
  selectedLesson: LessonContent | null;
  progress: number;
}

interface UseLessonDataReturn {
  lessonScore: string | null;
  enhancedError: EnhancedError | null;
  estimatedTimeRemaining: number | null;
  handleRetry: () => Promise<void>;
}

export function useLessonData({
  lessonId,
  subjectSlug,
  topicSlug,
  autoLoad = true,
  selectedLesson,
  progress,
}: UseLessonDataParams): UseLessonDataReturn {
  const {
    fetchLessonContentBySlug,
    fetchLessonContentById,
    setError,
    setIsLoadingLessonContent,
    clearError,
    error,
    isOffline,
  } = useLessonsStore();

  const [lessonScore, setLessonScore] = useState<string | null>(null);

  // Parse error into enhanced format
  const parseError = useCallback((error: string | null): EnhancedError | null => {
    if (!error) return null;

    if (error.includes('Network Error') || error.includes('offline') || error.includes('fetch')) {
      return {
        type: 'network',
        message: 'Connection Error',
        details: 'Unable to connect to the server. Please check your internet connection.',
        canRetry: true,
      };
    }
    if (error.includes('404') || error.includes('not found')) {
      return {
        type: 'not_found',
        message: 'Lesson Not Found',
        details: 'The requested lesson could not be found. It may have been moved or deleted.',
        canRetry: false,
      };
    }
    if (error.includes('401') || error.includes('unauthorized')) {
      return {
        type: 'unauthorized',
        message: 'Access Denied',
        details: 'You do not have permission to access this lesson.',
        canRetry: false,
      };
    }
    if (error.includes('500') || error.includes('server')) {
      return {
        type: 'server',
        message: 'Server Error',
        details: 'The server encountered an error. Please try again later.',
        canRetry: true,
      };
    }
    return {
      type: 'unknown',
      message: 'Unknown Error',
      details: error,
      canRetry: true,
    };
  }, []);

  const enhancedError = useMemo(() => parseError(error), [error, parseError]);

  // Calculate estimated time remaining
  const calculateEstimatedTimeRemaining = useCallback(() => {
    if (!selectedLesson || progress >= 100) return null;

    const concepts = selectedLesson.concepts || [];
    const totalSections = concepts.length + 3; // overview + concepts + summary + exercises
    const completedSectionsCount = Math.floor((progress / 100) * totalSections);
    const remainingSections = totalSections - completedSectionsCount;

    // Estimate 5 minutes per section on average
    const estimatedMinutes = remainingSections * 5;
    return estimatedMinutes;
  }, [selectedLesson, progress]);

  const estimatedTimeRemaining = useMemo(() => calculateEstimatedTimeRemaining(), [calculateEstimatedTimeRemaining]);

  // Fetch lesson score
  useEffect(() => {
    const fetchLessonScore = async () => {
      if (!selectedLesson?.id) return;
      const response = await getLessonScore(selectedLesson.id);
      if (response.success && response.content) {
        setLessonScore(response.content.lesson_total_score);
      }
    };

    fetchLessonScore();
  }, [selectedLesson?.id]);

  // Load lesson content
  useEffect(() => {
    const loadLesson = async () => {
      // Guard: Check if lesson is already loaded to prevent infinite loops
      if (selectedLesson) {
        if (subjectSlug && topicSlug && selectedLesson.slug === topicSlug) {
          // Additional check for subject if possible, but subject is just a string name in LessonContent
          // strict subject slug check is not possible without subject slug in LessonContent
          return;
        }
        if (lessonId && selectedLesson.id === lessonId) {
          return;
        }
      }

      if (subjectSlug && topicSlug && autoLoad) {
        try {
          await fetchLessonContentBySlug(subjectSlug, topicSlug);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load lesson",
          );
          setIsLoadingLessonContent(false);
        }
      } else if (lessonId && autoLoad) {
        try {
          await fetchLessonContentById(lessonId);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load lesson",
          );
          setIsLoadingLessonContent(false);
        }
      }
    };

    loadLesson();

    return () => {
      // Optional: Clear selected lesson when component unmounts
      // clearSelectedLesson();
    };
  }, [
    lessonId,
    subjectSlug,
    topicSlug,
    autoLoad,
    fetchLessonContentBySlug,
    fetchLessonContentById,
    setError,
    setIsLoadingLessonContent,
    selectedLesson, // Added dependency to allow the guard to work
  ]);

  const handleRetry = async () => {
    if (subjectSlug && topicSlug) {
      clearError();
      await fetchLessonContentBySlug(subjectSlug, topicSlug);
    } else if (lessonId) {
        clearError();
        await fetchLessonContentById(lessonId);
    }
  };

  return {
    lessonScore,
    enhancedError,
    estimatedTimeRemaining,
    handleRetry,
  };
}
