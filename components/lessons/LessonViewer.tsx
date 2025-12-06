"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
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
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div>
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Breadcrumb Skeleton */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <React.Fragment key={index}>
                <Skeleton className="h-6 w-16" />
                {index < 3 && <Skeleton className="size-4" />}
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
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-32 rounded-lg" />
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
  } = useLessonsStore();

  // Enhanced state for new features
  const [hasAutoAdvanced, setHasAutoAdvanced] = useState(false);
  const [progressCardCollapsed, setProgressCardCollapsed] = useState(false);
  const [celebrationShown, setCelebrationShown] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      if (!moved && progress >= 100 && !celebrationShown) {
        setCelebrationShown(true);
        toast.success('🎉 Lesson Completed!', {
          description: 'Congratulations on finishing this lesson!',
          duration: 5000,
        });
      }
    }
  }, [checkCurrentStepCompletion, nextStep, progress, celebrationShown]);

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
  const concepts = lesson.concepts || [];
  const general_exercises = lesson.general_exercises || [];
  const key_concepts = lesson.key_concepts || {};

  return (
    <div
      ref={containerRef}
      className="space-y-8"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Enhanced Progress Card */}
      {progress > 0 && (
        <Card className={cn(
          "border-2 bg-gradient-to-r from-primary/5 via-primary/10 to-background transition-all duration-300",
          progress >= 100 && "border-green-200 bg-gradient-to-r from-green-50 via-green-100 to-background",
          progressCardCollapsed && "md:hidden"
        )}>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 transition-colors">
                    {progress >= 100 ? (
                      <Trophy className="size-5 text-green-600" />
                    ) : (
                      <Target className="size-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Lesson Progress
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {progress}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {estimatedTimeRemaining && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="mr-1 size-3" />
                      ~{estimatedTimeRemaining}min left
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-sm font-medium">
                    {currentStepIndex + 1} of {concepts.length + 3} sections
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProgressCardCollapsed(!progressCardCollapsed)}
                    className="md:hidden"
                    aria-label={progressCardCollapsed ? "Show progress" : "Hide progress"}
                  >
                    {progressCardCollapsed ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
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
      <Card className="sticky top-4 z-20 border-2 bg-background/95 backdrop-blur transition-shadow supports-[backdrop-filter]:backdrop-blur">
        <CardContent className="p-4">
          <SectionBreadcrumb
            lessonId={lesson.id}
            concepts={concepts}
            currentStepIndex={currentStepIndex}
            onNavigate={handleNavigateToSection}
          />
          <div className="mt-2 text-center text-xs text-muted-foreground">
            Use ← → arrow keys or 1-9 number keys to navigate
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="min-h-[600px] flex-1 rounded-xl">
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
              size="lg"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="min-w-[120px] font-medium"
              aria-label="Go to previous section"
            >
              <ArrowLeft className="mr-2 size-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
              <span className="font-medium">
                Section {currentStepIndex + 1} of {concepts.length + 3}
              </span>
              <span className="hidden text-xs sm:block">
                Swipe or use keyboard shortcuts
              </span>
            </div>
            <Button
              size="lg"
              onClick={handleNext}
              className={cn(
                "min-w-[120px] font-medium transition-all",
                progress >= 100 && "bg-green-600 hover:bg-green-700"
              )}
              aria-label={currentStepIndex === concepts.length + 2 ? "Finish lesson" : "Go to next section"}
            >
              {currentStepIndex === concepts.length + 2 ? (
                <>
                  <Trophy className="mr-2 size-4" />
                  <span className="hidden sm:inline">Finish Lesson</span>
                  <span className="sm:hidden">Finish</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Continue</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
