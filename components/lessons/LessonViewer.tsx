"use client";

import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Lightbulb,
  PenTool,
  Play,
  Target,
  Trophy,
  ChevronRight,
  RefreshCw,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
} from "lucide-react";

import { LessonOverview } from "./sections/LessonOverview";
import { LessonConcept } from "./sections/LessonConcept";
import { LessonSummaryApplication } from "./sections/LessonSummaryApplication";
import { LessonGeneralExercises } from "./sections/LessonGeneralExercises";
import { LessonCompletionSummary } from "./LessonCompletionSummary";
import { SectionBreadcrumb } from "./SectionBreadcrumb";
import { useLessonsStore } from "@/lib/store/lessons";
import { LessonContent } from "@/lib/types/lessons";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getLessonScore } from "@/lib/api/lessons";

interface LessonViewerProps {
  lessonId?: number;
  subjectSlug?: string;
  topicSlug?: string;
  onBack?: () => void;
  autoLoad?: boolean;
}

// Enhanced error types for better error handling
type ErrorType = 'network' | 'not_found' | 'unauthorized' | 'server' | 'unknown';

interface EnhancedError {
  type: ErrorType;
  message: string;
  details?: string;
  canRetry: boolean;
}





function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Progress Card Skeleton */}
      <Card className="border-2 bg-gradient-to-r from-primary/5 via-primary/5 to-background">
        <CardContent className="responsive-padding">
          <div className="space-y-3">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-lg sm:size-10" />
                <div>
                  <Skeleton className="mb-1 h-3 w-20 sm:h-4 sm:w-24" />
                  <Skeleton className="h-6 w-12 sm:h-8 sm:w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full sm:h-6 sm:w-20" />
            </div>
            <Skeleton className="h-2 w-full rounded-full sm:h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Breadcrumb Skeleton */}
      <Card className="border-2">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, index) => (
              <React.Fragment key={index}>
                <Skeleton className="h-5 w-12 shrink-0 sm:h-6 sm:w-16" />
                {index < 3 && <Skeleton className="size-3 shrink-0 sm:size-4" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Skeleton */}
      <Card className="bg-card">
        <CardHeader>
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Content Skeletons */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-28 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Navigation Skeleton */}
      <Card className="border-2">
        <CardContent className="responsive-padding">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Skeleton className="h-10 w-full rounded-lg sm:h-12 sm:w-32" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="h-10 w-full rounded-lg sm:h-12 sm:w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LessonViewer({
  lessonId,
  subjectSlug,
  topicSlug,
  onBack,
  autoLoad = true,
}: LessonViewerProps) {
  const router = useRouter();
  const {
    selectedLesson,
    isLoadingLessonContent,
    error,
    completedSections,
    currentStepIndex,
    progress,
    fetchLessonContentBySlug,
    fetchLessonContentById,
    setSelectedLesson,
    nextStep,
    prevStep,
    checkCurrentStepCompletion,
    submitExerciseAnswer,
    clearSelectedLesson,
    clearError,
    setError,
    setIsLoadingLessonContent,
    // Adaptive learning actions
    sectionProgress,
    getNextIncompleteSection,
    autoAdvanceToNextSection,
    isOffline,
    userPreferences,
    sectionTimeTracking,
    updateAnalytics,
    // Completion summary
    showCompletionSummary,
    completionData,
    isLoadingCompletionData,
    setShowCompletionSummary,
    fetchCompletionData,
    clearCompletionData,
    exerciseProgress,
    analyticsData,
  } = useLessonsStore();

  // Enhanced state for new features
  const [hasAutoAdvanced, setHasAutoAdvanced] = useState(false);
  const [progressCardCollapsed, setProgressCardCollapsed] = useState(false);
  const [celebrationShown, setCelebrationShown] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [lessonScore, setLessonScore] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize concepts to avoid re-defining in multiple places
  const concepts = useMemo(() => selectedLesson?.concepts || [], [selectedLesson?.concepts]);

  // Parse error into enhanced format
  const parseError = useCallback((error: string | null): EnhancedError | null => {
    if (!error) return null;

    if (error.includes('network') || error.includes('fetch')) {
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

  const enhancedError = parseError(error);

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

  const estimatedTimeRemaining = calculateEstimatedTimeRemaining();

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

  // Reset auto-advance flag when lesson changes
  useEffect(() => {
    setHasAutoAdvanced(false);
    setCelebrationShown(false);
  }, [selectedLesson?.id]);

  // Touch/swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Auto-advance logic with enhanced features
  useEffect(() => {
    if (!selectedLesson || isLoadingLessonContent || hasAutoAdvanced) return;

    if (currentStepIndex !== 0) return;

    const currentSectionId = 'overview';
    const currentProgress = sectionProgress[currentSectionId];

    if (!currentProgress?.isCompleted) return;

    const nextSectionId = getNextIncompleteSection();

    if (nextSectionId && nextSectionId !== currentSectionId) {
      toast.info('Resuming where you left off...', {
        description: 'Skipping completed sections',
      });

      const timer = setTimeout(() => {
        autoAdvanceToNextSection();
        setHasAutoAdvanced(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (!nextSectionId) {
      toast.success('Lesson completed!', {
        description: 'You\'ve finished all sections. Great work!',
      });
      setHasAutoAdvanced(true);
      setCelebrationShown(true);
    }
  }, [selectedLesson, isLoadingLessonContent, sectionProgress, getNextIncompleteSection, autoAdvanceToNextSection, currentStepIndex, hasAutoAdvanced]);

  useEffect(() => {
    // Debugging or side effects if needed
  }, [selectedLesson]);

  useEffect(() => {
    const loadLesson = async () => {
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
    setSelectedLesson,
    setError,
    setIsLoadingLessonContent,
  ]);

  // Screen reader announcements for progress updates
  useEffect(() => {
    if (typeof document === 'undefined' || progress <= 0 || progress >= 100) return;

    const announcement = `Lesson progress: ${progress} percent complete`;
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.style.position = 'absolute';
    ariaLive.style.left = '-10000px';
    ariaLive.style.width = '1px';
    ariaLive.style.height = '1px';
    ariaLive.style.overflow = 'hidden';
    ariaLive.textContent = announcement;
    document.body.appendChild(ariaLive);

    const timeoutId = setTimeout(() => {
      if (document.body.contains(ariaLive)) {
        document.body.removeChild(ariaLive);
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (document.body.contains(ariaLive)) {
        document.body.removeChild(ariaLive);
      }
    };
  }, [progress]);

  const handleNext = useCallback(async () => {
    const canProceed = await checkCurrentStepCompletion();
    
    if (canProceed) {
      const moved = await nextStep();
      
      // Verify we're at the last step, lesson is complete, and all sections are done
      const isLastStep = currentStepIndex === concepts.length + 2;
      const isComplete = progress >= 100;
      
      // Build list of valid section IDs for the current lesson
      const validSectionIds = [
        'overview',
        ...concepts.map(c => `concept_${c.id}`),
        'summary_application',
        'general_exercises'
      ];
      
      // Check only sections that belong to the current lesson
      const allSectionsComplete = validSectionIds.every(
        sectionId => sectionProgress[sectionId]?.isCompleted
      );
      
      if (!moved && isLastStep && isComplete && allSectionsComplete && !celebrationShown && selectedLesson?.id) {
        try {
          await fetchCompletionData(selectedLesson.id);
          // Only set celebration flag after successful fetch
          setCelebrationShown(true);
          setShowCompletionSummary(true);
        } catch (error) {
          // Reset celebration flag on failure so user can retry
          setCelebrationShown(false);
          toast.error('Failed to load completion summary', {
            description: 'Please try finishing the lesson again.',
          });
        }
      }
    }
  }, [
    checkCurrentStepCompletion, 
    nextStep, 
    progress, 
    currentStepIndex,
    concepts,
    sectionProgress,
    celebrationShown, 
    selectedLesson, 
    fetchCompletionData, 
    setShowCompletionSummary
  ]);

  const handlePrev = useCallback(() => {
    prevStep();
  }, [prevStep]);

  const handleNavigateToSection = useCallback((stepIndex: number) => {
    const { sectionProgress } = useLessonsStore.getState();
    const concepts = selectedLesson?.concepts || [];

    let sectionId = '';
    if (stepIndex === 0) {
      sectionId = 'overview';
    } else if (stepIndex <= concepts.length) {
      const concept = concepts[stepIndex - 1];
      if (concept) sectionId = `concept_${concept.id}`;
    } else if (stepIndex === concepts.length + 1) {
      sectionId = 'summary_application';
    } else if (stepIndex === concepts.length + 2) {
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

  // Keyboard shortcuts (placed after navigation handlers to avoid TDZ issues)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedLesson) return;

      const concepts = selectedLesson.concepts || [];
      const maxStep = concepts.length + 2;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentStepIndex > 0) {
            handlePrev();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentStepIndex < maxStep) {
            handleNext();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          const num = parseInt(event.key) - 1;
          if (num >= 0 && num <= maxStep) {
            event.preventDefault();
            handleNavigateToSection(num);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLesson, currentStepIndex, handlePrev, handleNext, handleNavigateToSection]);

  const handleRetry = async () => {
    if (subjectSlug && topicSlug) {
      clearError();
      await fetchLessonContentBySlug(subjectSlug, topicSlug);
    }
  };

  const handleBack = () => {
    clearSelectedLesson();
    if (onBack) {
      onBack();
    } else {
      router.push('/dashboard/lessons');
    }
  };

  // Completion summary action handlers
  const handleReviewMistakes = useCallback(() => {
    setShowCompletionSummary(false);
    setCelebrationShown(false);
    
    // Find first incorrect exercise
    const incorrectExerciseSection = Object.entries(exerciseProgress).find(
      ([_, progress]) => progress.isCompleted && !progress.isCorrect
    );
    
    if (incorrectExerciseSection) {
      // Navigate to the section containing the incorrect exercise
      const concepts = selectedLesson?.concepts || [];
      const conceptIndex = concepts.findIndex(concept => 
        concept.exercises?.some(ex => ex.id === parseInt(incorrectExerciseSection[0]))
      );
      
      if (conceptIndex !== -1) {
        useLessonsStore.setState({ currentStepIndex: conceptIndex + 1 });
      }
    }
    
    toast.info('Review mode', {
      description: 'Navigate through sections to review your answers',
    });
  }, [exerciseProgress, selectedLesson, setShowCompletionSummary]);

  const handleContinueNext = useCallback(() => {
    setShowCompletionSummary(false);
    clearCompletionData();
    setCelebrationShown(false);
    
    // Navigate to next lesson (if available)
    toast.info('Next lesson', {
      description: 'Feature coming soon - navigate to the next lesson',
    });
    
    // Future: Implement navigation to next lesson in sequence
    router.push('/dashboard/lessons');
  }, [setShowCompletionSummary, clearCompletionData, router]);

  const handleBackToDashboard = useCallback(() => {
    setShowCompletionSummary(false);
    clearCompletionData();
    clearSelectedLesson();
    setCelebrationShown(false);
    router.push('/dashboard/lessons');
  }, [setShowCompletionSummary, clearCompletionData, clearSelectedLesson, router]);

  const handleCloseCompletionSummary = useCallback(() => {
    setShowCompletionSummary(false);
    setCelebrationShown(false);
  }, [setShowCompletionSummary]);

  if (isLoadingLessonContent) {
    return <LoadingSkeleton />;
  }

  if (enhancedError) {
    const getErrorIcon = () => {
      switch (enhancedError.type) {
        case 'network':
          return isOffline ? <WifiOff className="size-6" /> : <Wifi className="size-6" />;
        case 'not_found':
          return <BookOpen className="size-6" />;
        case 'unauthorized':
          return <AlertCircle className="size-6" />;
        default:
          return <AlertCircle className="size-6" />;
      }
    };

    return (
      <Card className="border-2 border-destructive/20 bg-destructive/5">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-destructive/10">
            {getErrorIcon()}
          </div>
          <AlertTitle className="mb-2 text-2xl font-bold text-destructive">
            {enhancedError.message}
          </AlertTitle>
          <p className="mb-6 max-w-md text-center text-muted-foreground">
            {enhancedError.details}
          </p>
          <div className="flex gap-3">
            {enhancedError.canRetry && (
              <Button
                variant="outline"
                onClick={handleRetry}
                className="gap-2"
                disabled={isLoadingLessonContent}
              >
                <RefreshCw className={cn("size-4", isLoadingLessonContent && "animate-spin")} />
                Try Again
              </Button>
            )}
            <Button variant="outline" onClick={clearError}>
              Dismiss
            </Button>
            {onBack && (
              <Button variant="outline" onClick={handleBack}>
                Go Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedLesson) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
            <BookOpen className="size-10 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-foreground">
            No lesson selected
          </h3>
          <p className="mb-6 max-w-md text-center text-muted-foreground">
            Select a lesson from the list to view its content.
          </p>
          {onBack && (
            <Button
              size="lg"
              variant="outline"
              onClick={handleBack}
              aria-label="Go back to lessons list"
            >
              <ArrowLeft className="mr-2 size-4" />
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const lesson = selectedLesson;

  // Default optional fields to prevent runtime errors
  const objectives = lesson.objectives || [];
  // concepts is already defined via useMemo above
  const general_exercises = lesson.general_exercises || [];
  const key_concepts = lesson.key_concepts || {};

  return (
    <div
      ref={containerRef}
      className="dashboard-spacing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Enhanced Progress Card */}
      {progress > 0 && (
        <Card className={cn(
          "border-2 bg-gradient-to-r from-primary/5 via-primary/10 to-background transition-all duration-300",
          progress >= 100 && "border-green-200 bg-gradient-to-r from-green-50 via-green-100 to-background",
          progressCardCollapsed && "lg:hidden"
        )}>
          <CardContent className="responsive-padding">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="responsive-gap flex flex-col items-start justify-between sm:flex-row sm:items-center">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 transition-colors sm:size-10">
                    {progress >= 100 ? (
                      <Trophy className="size-4 text-green-600 sm:size-5" />
                    ) : (
                      <Target className="size-4 text-primary sm:size-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                      Lesson Progress
                    </p>
                    <p className="text-xl font-bold text-foreground sm:text-2xl">
                      {progress}%
                    </p>
                    {lessonScore && (
                      <p className="text-xs text-muted-foreground">
                        Total Score: {lessonScore}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {estimatedTimeRemaining && (
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      <Clock className="mr-1 size-3" />
                      ~{estimatedTimeRemaining}min left
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-[10px] font-medium sm:text-xs">
                    {currentStepIndex + 1} of {concepts.length + 3} sections
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProgressCardCollapsed(!progressCardCollapsed)}
                    className="size-8 p-0 lg:hidden"
                    aria-label={progressCardCollapsed ? "Show progress" : "Hide progress"}
                  >
                    {progressCardCollapsed ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Progress
                  value={progress}
                  className={cn(
                    "h-3 transition-all duration-500",
                    progress >= 100 && "bg-green-100"
                  )}
                />
                {progress >= 100 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-bounce text-sm font-bold text-green-600">
                      🎉 Complete!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Section Breadcrumb Navigation */}
      <Card className="sticky top-16 z-20 border-2 bg-background/95 backdrop-blur transition-shadow supports-[backdrop-filter]:backdrop-blur sm:top-20">
        <CardContent className="p-3 sm:p-4">
          <div className="custom-scrollbar -mx-1 overflow-x-auto px-1 pb-1">
            <SectionBreadcrumb
              lessonId={lesson.id}
              concepts={concepts}
              currentStepIndex={currentStepIndex}
              onNavigate={handleNavigateToSection}
              className="text-xs sm:text-sm"
            />
          </div>
          <div className="mt-2 hidden text-center text-[10px] text-muted-foreground sm:block sm:text-xs">
            Use ← → arrow keys or 1-9 number keys to navigate
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="min-h-[400px] flex-1 rounded-xl sm:min-h-[500px] md:min-h-[600px]">
        {/* Overview Step */}
        {currentStepIndex === 0 && (
          <LessonOverview lesson={lesson} />
        )}

        {/* Concepts Steps */}
        {currentStepIndex > 0 && currentStepIndex <= concepts.length && (
          concepts[currentStepIndex - 1] && (
            <LessonConcept
              concept={concepts[currentStepIndex - 1]}
              onAnswerExercise={(id, answer) => submitExerciseAnswer(id, answer, false)}
            />
          )
        )}

        {/* Summary & Application Step */}
        {currentStepIndex === concepts.length + 1 && (
          <LessonSummaryApplication lesson={lesson} />
        )}

        {/* General Exercises Step */}
        {currentStepIndex === concepts.length + 2 && (
          <LessonGeneralExercises
            lesson={lesson}
            onAnswerExercise={(id, answer) => submitExerciseAnswer(id, answer, true)}
          />
        )}
      </div>

      {/* Enhanced Navigation Controls */}
      <Card className="border-2">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="default"
              className="mobile-touch-target font-medium sm:h-11 sm:min-w-[120px] sm:px-8"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              aria-label="Go to previous section"
            >
              <ArrowLeft className="size-4 sm:mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <div className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-muted-foreground sm:text-xs">
              <span className="text-xs font-semibold text-foreground sm:text-sm">
                {currentStepIndex + 1} / {concepts.length + 3}
              </span>
              <span className="hidden sm:block">
                Swipe or use keys
              </span>
            </div>
            <Button
              size="default"
              className={cn(
                "mobile-touch-target font-medium shadow-sm transition-all sm:h-11 sm:min-w-[120px] sm:px-8",
                progress >= 100 && "bg-green-600 hover:bg-green-700"
              )}
              onClick={handleNext}
              disabled={isLoadingCompletionData}
              aria-label={currentStepIndex === concepts.length + 2 ? "Finish lesson" : "Go to next section"}
            >
              {isLoadingCompletionData ? (
                <>
                  <RefreshCw className="size-4 animate-spin sm:mr-2" />
                  <span className="hidden sm:inline">Loading...</span>
                </>
              ) : currentStepIndex === concepts.length + 2 ? (
                <>
                  <Trophy className="size-4 sm:mr-2" />
                  <span className="hidden sm:inline">Finish Lesson</span>
                  <span className="sm:hidden">Finish</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Continue</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="size-4 sm:ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Lesson Completion Summary Dialog */}
      {completionData && selectedLesson && (
        <LessonCompletionSummary
          lessonId={completionData.lessonId}
          lessonTitle={completionData.lessonTitle}
          overallScore={completionData.lessonScore}
          conceptScores={completionData.conceptScores}
          generalExercisesScore={completionData.generalExercisesScore}
          generalExercisesWeight={completionData.generalExercisesWeight}
          timeSpent={completionData.timeSpent}
          accuracyRate={completionData.accuracyRate}
          exerciseProgress={(() => {
            // Filter exerciseProgress to only include exercises from the current lesson
            const filteredProgress: Record<number, any> = {};
            
            // Get all exercise IDs from the current lesson (concepts + general exercises)
            const lessonExerciseIds = new Set<number>();
            
            // Add concept exercise IDs
            selectedLesson.concepts?.forEach(concept => {
              concept.exercises?.forEach(ex => {
                lessonExerciseIds.add(ex.id);
              });
            });
            
            // Add general exercise IDs
            selectedLesson.general_exercises?.forEach(ge => {
              lessonExerciseIds.add(ge.id);
            });
            
            // Filter exerciseProgress to only include current lesson's exercises
            Object.entries(exerciseProgress).forEach(([exerciseId, progress]) => {
              const id = parseInt(exerciseId);
              if (lessonExerciseIds.has(id)) {
                filteredProgress[id] = progress;
              }
            });
            
            return filteredProgress;
          })()}
          historicalAverages={(() => {
            // Calculate historicalAverages from analyticsData using totalTime
            const allAnalytics = Object.values(analyticsData);
            if (allAnalytics.length === 0) return undefined;
            
            return {
              score: allAnalytics.reduce((sum, a) => sum + a.exerciseAccuracy, 0) / allAnalytics.length,
              time: allAnalytics.reduce((sum, a) => sum + a.totalTime, 0) / allAnalytics.length, // Use totalTime for consistent comparison
              accuracy: allAnalytics.reduce((sum, a) => sum + a.exerciseAccuracy, 0) / allAnalytics.length,
            };
          })()}
          onReviewMistakes={handleReviewMistakes}
          onContinueNext={handleContinueNext}
          onBackToDashboard={handleBackToDashboard}
          isOpen={showCompletionSummary}
          onClose={handleCloseCompletionSummary}
        />
      )}
    </div>
  );
}
