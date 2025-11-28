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
} from "lucide-react";

import { LessonOverview } from "./sections/LessonOverview";
import { LessonConcept } from "./sections/LessonConcept";
import { LessonSummaryApplication } from "./sections/LessonSummaryApplication";
import { LessonGeneralExercises } from "./sections/LessonGeneralExercises";
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
  } = useLessonsStore();

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

  const handleBack = () => {
    clearSelectedLesson();
    onBack?.();
  };

  if (isLoadingLessonContent) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
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
      <Card className="border-dashed border-border bg-muted">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="mb-4 size-12 text-slate-400" />
          <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            No lesson selected
          </h3>
          <p className="mb-4 max-w-md text-center text-slate-600 dark:text-slate-400">
            Select a lesson from the list to view its content.
          </p>
          {onBack && (
            <Button variant="outline" onClick={handleBack}>
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
    <div className="space-y-6">
      {/* Progress */}
      {progress > 0 && (
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Lesson Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-[600px] flex-1">
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
      <div className="mt-8 flex justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentStepIndex === concepts.length + 2 ? "Finish Lesson" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
