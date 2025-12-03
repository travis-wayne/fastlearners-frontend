"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";

import { LessonOverview } from "./sections/LessonOverview";
import { LessonConcept } from "./sections/LessonConcept";
import { LessonSummaryApplication } from "./sections/LessonSummaryApplication";
import { LessonGeneralExercises } from "./sections/LessonGeneralExercises";
import { SectionBreadcrumb } from "./SectionBreadcrumb";
import { useLessonsStore } from "@/lib/store/lessons";
import { LessonContent } from "@/lib/types/lessons";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface LessonViewerProps {
  lessonId?: number;
  subjectSlug?: string;
  topicSlug?: string;
  onBack?: () => void;
  autoLoad?: boolean;
}





function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>

      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="bg-card">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
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
  const {
    selectedLesson,
    isLoadingLessonContent,
    error,
    completedSections,
    currentStepIndex,
    progress,
    fetchLessonContentBySlug,
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
  } = useLessonsStore();

  // Auto-skip logic: Navigate to next incomplete section only on initial load
  const [hasAutoAdvanced, setHasAutoAdvanced] = useState(false);
  
  // Reset auto-advance flag when lesson changes
  useEffect(() => {
    setHasAutoAdvanced(false);
  }, [selectedLesson?.id]);
  
  useEffect(() => {
    if (!selectedLesson || isLoadingLessonContent || hasAutoAdvanced) return;

    // Only auto-advance when we're on the overview section (step 0)
    // This ensures auto-advance only happens on initial load/view of overview
    if (currentStepIndex !== 0) {
      // User is not on overview - don't auto-advance, but don't mark as checked
      // This allows auto-advance to run if user returns to overview later
      return;
    }

    // Get current section ID (should be 'overview' at this point)
    const currentSectionId = 'overview';
    const currentProgress = sectionProgress[currentSectionId];

    // Only auto-advance if overview is completed
    if (!currentProgress?.isCompleted) {
      // Overview not completed yet - don't auto-advance, but don't mark as checked
      // This allows auto-advance to run when overview becomes completed
      return;
    }

    // Overview is completed - check if we should auto-advance to next incomplete section
    const nextSectionId = getNextIncompleteSection();

    if (nextSectionId && nextSectionId !== currentSectionId) {
      // Show toast notification
      const { toast } = require('sonner');
      toast.info('Resuming where you left off...', {
        description: 'Skipping completed sections',
      });

      // Auto-advance after 1 second
      const timer = setTimeout(() => {
        autoAdvanceToNextSection();
        setHasAutoAdvanced(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (!nextSectionId) {
      // All sections completed - mark as checked since no auto-advance needed
      const { toast } = require('sonner');
      toast.success('Lesson completed!', {
        description: 'You\'ve finished all sections. Great work!',
      });
      setHasAutoAdvanced(true);
    }
    // If nextSectionId === currentSectionId (shouldn't happen for overview, but handle it)
    // Don't set hasAutoAdvanced - allow re-checking if needed
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
        // NOTE: ID-based loading removed - use subjectSlug and topicSlug instead
        setError(
          "Lesson ID-based loading is no longer supported. Please provide subjectSlug and topicSlug.",
        );
        setIsLoadingLessonContent(false);
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
    setSelectedLesson,
    setError,
    setIsLoadingLessonContent,
  ]);

  const handleNext = async () => {
    // Skip completion check for Overview (step 0) since it's informational only
    if (currentStepIndex === 0) {
      await nextStep();
      return;
    }

    const canProceed = await checkCurrentStepCompletion();
    if (canProceed) {
      const moved = await nextStep();
      if (!moved) {
        // End of lesson
        // Maybe show a completion modal or redirect
      }
    }
  };

  const handlePrev = () => {
    prevStep();
  };

  const handleNavigateToSection = (stepIndex: number) => {
    // Allow navigation to completed sections or current section
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

    const progress = sectionProgress[sectionId];
    const isCurrent = stepIndex === currentStepIndex;
    const isCompleted = progress?.isCompleted;

    // Allow navigation if section is completed or is current
    if (isCompleted || isCurrent || stepIndex === 0) {
      useLessonsStore.setState({ currentStepIndex: stepIndex });
    }
  };

  const handleBack = () => {
    clearSelectedLesson();
    onBack?.();
  };

  if (isLoadingLessonContent) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="border-2">
        <AlertCircle className="size-4" />
        <AlertDescription className="flex items-center justify-between">
          <span className="font-medium">{error}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearError}>
              Dismiss
            </Button>
            {onBack && (
              <Button variant="outline" size="sm" onClick={handleBack}>
                Go Back
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
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
            <Button size="lg" variant="outline" onClick={handleBack}>
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
    <div className="space-y-8">
      {/* Progress Card */}
      {progress > 0 && (
        <Card className="border-2 bg-gradient-to-r from-primary/5 via-primary/5 to-background">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20">
                    <Target className="size-5 text-primary" />
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
                <Badge variant="secondary" className="text-sm font-medium">
                  {currentStepIndex + 1} of{" "}
                  {concepts.length + 3} sections
                </Badge>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Breadcrumb Navigation */}
      <Card className="border-2">
        <CardContent className="p-4">
          <SectionBreadcrumb
            lessonId={lesson.id}
            concepts={concepts}
            currentStepIndex={currentStepIndex}
            onNavigate={handleNavigateToSection}
          />
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

      {/* Navigation Controls */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="font-medium"
            >
              <ArrowLeft className="mr-2 size-4" />
              Previous
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Section {currentStepIndex + 1} of {concepts.length + 3}
              </span>
            </div>
            <Button
              size="lg"
              onClick={handleNext}
              className="bg-primary font-medium hover:bg-primary/90"
            >
              {currentStepIndex === concepts.length + 2 ? (
                <>
                  <Trophy className="mr-2 size-4" />
                  Finish Lesson
                </>
              ) : (
                <>
                  Continue
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
