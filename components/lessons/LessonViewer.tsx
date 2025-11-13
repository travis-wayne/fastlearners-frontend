'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen,
  Target,
  Lightbulb,
  PenTool,
  CheckCircle2,
  Circle,
  Play,
  ArrowLeft,
  AlertCircle,
  FileText,
  Brain,
  Trophy,
  Clock,
} from 'lucide-react';
import { useLessonsStore } from '@/lib/store/lessons';
import { LessonContent, Concept, Example, Exercise, GeneralExercise } from '@/lib/types/lessons';
import { cn } from '@/lib/utils';
import { getLessonContentBySlug } from '@/lib/api/lessons';

interface LessonViewerProps {
  lessonId?: number;
  subjectSlug?: string;
  topicSlug?: string;
  onBack?: () => void;
  autoLoad?: boolean;
}

interface ConceptSectionProps {
  concept: Concept;
  isCompleted: boolean;
  onMarkCompleted: (sectionId: string) => void;
}

interface ExampleCardProps {
  example: Example;
  index: number;
}

interface ExerciseCardProps {
  exercise: Exercise | GeneralExercise;
  index: number;
  onAnswer?: (exerciseId: number, answer: string) => void;
}

function ConceptSection({ concept, isCompleted, onMarkCompleted }: ConceptSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
<Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="size-5 text-purple-600" />
              <Badge variant="outline" className="text-xs">
                Concept {concept.order_index}
              </Badge>
              {isCompleted && (
                <CheckCircle2 className="size-4 text-emerald-600" />
              )}
            </div>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
              {concept.title}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-600 dark:text-slate-400"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            {/* Concept Description */}
            {concept.description.map((desc, index) => (
              <div key={index} className="space-y-3">
                {desc.heading && (
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {desc.heading}
                  </h4>
                )}
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  {desc.description}
                </p>
                {desc.points.length > 0 && (
                  <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-400">
                    {desc.points.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                )}
                {desc.image_path && (
<div className="rounded-lg bg-muted p-4 text-center">
                    <FileText className="mx-auto mb-2 size-8 text-slate-400" />
                    <p className="text-sm text-slate-500">Image: {desc.image_path}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Examples */}
            {concept.examples.length > 0 && (
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <Lightbulb className="size-4 text-yellow-600" />
                  Examples
                </h4>
                {concept.examples.map((example, index) => (
                  <ExampleCard key={example.id} example={example} index={index} />
                ))}
              </div>
            )}

            {/* Exercises */}
            {concept.exercises.length > 0 && (
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <PenTool className="size-4 text-blue-600" />
                  Practice Exercises
                </h4>
                {concept.exercises.map((exercise, index) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
                ))}
              </div>
            )}

            {/* Mark as completed button */}
<div className="border-t border-border pt-4">
              <Button
                onClick={() => onMarkCompleted(`concept_${concept.order_index - 1}`)}
                disabled={isCompleted}
                className={cn(
                  'w-full',
                  isCompleted 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                )}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="mr-2 size-4" />
                    Completed
                  </>
                ) : (
                  <>
                    <Circle className="mr-2 size-4" />
                    Mark as Completed
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function ExampleCard({ example, index }: ExampleCardProps) {
  return (
    <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800/30 dark:bg-yellow-900/10">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-yellow-600" />
            <span className="font-medium text-yellow-800 dark:text-yellow-200">
              {example.title}
            </span>
          </div>
          
          <div className="rounded-lg border border-yellow-200 bg-white p-3 dark:border-yellow-800/30 dark:bg-slate-900">
            <p className="mb-2 font-medium text-slate-900 dark:text-slate-100">
              Problem:
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              {example.problem}
            </p>
          </div>

          {example.solution_steps.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-slate-900 dark:text-slate-100">
                Solution Steps:
              </p>
              <ol className="list-inside list-decimal space-y-1 text-slate-700 dark:text-slate-300">
                {example.solution_steps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800/30 dark:bg-emerald-900/10">
            <p className="mb-1 font-medium text-emerald-800 dark:text-emerald-200">
              Answer:
            </p>
            <p className="text-emerald-700 dark:text-emerald-300">
              {example.answer}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExerciseCard({ exercise, index, onAnswer }: ExerciseCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState(false);

  const handleSubmit = () => {
    setIsRevealed(true);
    onAnswer?.(exercise.id, selectedAnswer);
  };

  const isCorrect = selectedAnswer === exercise.correct_answer;

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800/30 dark:bg-blue-900/10">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PenTool className="size-4 text-blue-600" />
            <span className="font-medium text-blue-800 dark:text-blue-200">
              {'title' in exercise ? exercise.title : `Exercise ${index + 1}`}
            </span>
          </div>
          
          <div className="rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-800/30 dark:bg-slate-900">
            <p className="mb-3 text-slate-900 dark:text-slate-100">
              {exercise.problem}
            </p>

            <div className="space-y-2">
              {exercise.answers.map((answer, answerIndex) => (
                <label
                  key={answerIndex}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-colors',
                    selectedAnswer === answer
                      ? 'border-blue-300 bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700',
                    isRevealed && answer === exercise.correct_answer && 'border-emerald-300 bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/20',
                    isRevealed && selectedAnswer === answer && answer !== exercise.correct_answer && 'border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-900/20'
                  )}
                >
                  <input
                    type="radio"
                    name={`exercise-${exercise.id}`}
                    value={answer}
                    checked={selectedAnswer === answer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    disabled={isRevealed}
                    className="text-blue-600"
                  />
                  <span className="text-slate-900 dark:text-slate-100">
                    {answer}
                  </span>
                  {isRevealed && answer === exercise.correct_answer && (
                    <CheckCircle2 className="ml-auto size-4 text-emerald-600" />
                  )}
                </label>
              ))}
            </div>

            {!isRevealed && selectedAnswer && (
              <Button
                onClick={handleSubmit}
                className="mt-3 bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                Submit Answer
              </Button>
            )}

            {isRevealed && (
              <div className={cn(
                'mt-3 rounded-lg p-3',
                isCorrect 
                  ? 'border border-emerald-200 bg-emerald-50 dark:border-emerald-800/30 dark:bg-emerald-900/10'
                  : 'border border-red-200 bg-red-50 dark:border-red-800/30 dark:bg-red-900/10'
              )}>
                <p className={cn(
                  'mb-1 font-medium',
                  isCorrect ? 'text-emerald-800 dark:text-emerald-200' : 'text-red-800 dark:text-red-200'
                )}>
                  {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  The correct answer is: <strong>{exercise.correct_answer}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
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

export function LessonViewer({ lessonId, subjectSlug, topicSlug, onBack, autoLoad = true }: LessonViewerProps) {
  const {
    selectedLesson,
    isLoadingLessonContent,
    error,
    completedSections,
    currentSection,
    progress,
    fetchLessonContentBySlug,
    setSelectedLesson,
    markSectionCompleted,
    setCurrentSection,
    clearSelectedLesson,
    clearError,
    setError,
    setIsLoadingLessonContent,
  } = useLessonsStore();

  useEffect(() => {
    const loadLesson = async () => {
      if (subjectSlug && topicSlug && autoLoad) {
        try {
          await fetchLessonContentBySlug(subjectSlug, topicSlug);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load lesson');
          setIsLoadingLessonContent(false);
        }
      } else if (lessonId && autoLoad) {
        // NOTE: ID-based loading removed - use subjectSlug and topicSlug instead
        setError('Lesson ID-based loading is no longer supported. Please provide subjectSlug and topicSlug.');
        setIsLoadingLessonContent(false);
      }
    };

    loadLesson();

    return () => {
      // Optional: Clear selected lesson when component unmounts
      // clearSelectedLesson();
    };
  }, [lessonId, subjectSlug, topicSlug, autoLoad, fetchLessonContentBySlug, setSelectedLesson, setError, setIsLoadingLessonContent]);

  const handleMarkCompleted = (sectionId: string) => {
    markSectionCompleted(sectionId);
  };

  const handleSectionChange = (section: 'overview' | 'concepts' | 'exercises') => {
    setCurrentSection(section);
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
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="mb-3 px-0 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Back to lessons
                </Button>
              )}
              
              <h1 className="mb-2 text-2xl font-bold">{lesson.topic}</h1>
              
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="secondary" className="border-white/30 bg-white/20 text-white">
                  {lesson.class}
                </Badge>
                <Badge variant="secondary" className="border-white/30 bg-white/20 text-white">
                  {lesson.subject}
                </Badge>
                <Badge variant="secondary" className="border-white/30 bg-white/20 text-white">
                  {lesson.term} Term
                </Badge>
                <Badge variant="secondary" className="border-white/30 bg-white/20 text-white">
                  Week {lesson.week}
                </Badge>
              </div>
            </div>
            
            {lesson.video_path && (
              <Button
                variant="secondary"
                className="border-white/30 bg-white/20 text-white hover:bg-white/30"
              >
                <Play className="mr-2 size-4" />
                Watch Video
              </Button>
            )}
          </div>

          {/* Progress */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{progress}% complete</span>
              </div>
              <Progress value={progress} className="bg-white/20" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={currentSection} onValueChange={handleSectionChange}>
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="size-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="concepts" className="flex items-center gap-2">
            <Brain className="size-4" />
            Concepts ({concepts.length})
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Trophy className="size-4" />
            Exercises ({general_exercises.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview */}
<Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5 text-blue-600" />
                Lesson Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                {lesson.overview}
              </p>
              <Button
                onClick={() => handleMarkCompleted('overview')}
                disabled={completedSections.includes('overview')}
                className="mt-4"
                size="sm"
              >
                {completedSections.includes('overview') ? (
                  <>
                    <CheckCircle2 className="mr-2 size-4" />
                    Completed
                  </>
                ) : (
                  <>
                    <Circle className="mr-2 size-4" />
                    Mark as Read
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Objectives */}
          {objectives.length > 0 && (
<Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="size-5 text-emerald-600" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                {objectives.map((objective, index) => (
                  <div key={index} className="space-y-3">
                    <p className="text-slate-700 dark:text-slate-300">
                      {objective.description}
                    </p>
                    {objective.points.length > 0 && (
                      <ul className="ml-4 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-400">
                        {objective.points.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => handleMarkCompleted('objectives')}
                  disabled={completedSections.includes('objectives')}
                  className="mt-4"
                  size="sm"
                >
                  {completedSections.includes('objectives') ? (
                    <>
                      <CheckCircle2 className="mr-2 size-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="mr-2 size-4" />
                      Mark as Read
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Key Concepts Summary */}
          {Object.keys(key_concepts).length > 0 && (
<Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="size-5 text-yellow-600" />
                  Key Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(key_concepts).map(([concept, description]) => (
                    <div key={concept} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">
                        {concept}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary and Application */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
<Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {lesson.summary}
                </p>
                <Button
                  onClick={() => handleMarkCompleted('summary')}
                  disabled={completedSections.includes('summary')}
                  className="mt-3"
                  size="sm"
                  variant="outline"
                >
                  {completedSections.includes('summary') ? 'Completed' : 'Mark as Read'}
                </Button>
              </CardContent>
            </Card>

<Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-base">Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {lesson.application}
                </p>
                <Button
                  onClick={() => handleMarkCompleted('application')}
                  disabled={completedSections.includes('application')}
                  className="mt-3"
                  size="sm"
                  variant="outline"
                >
                  {completedSections.includes('application') ? 'Completed' : 'Mark as Read'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="concepts" className="space-y-6">
          {concepts.length > 0 ? (
            concepts.map((concept) => (
              <ConceptSection
                key={concept.id}
                concept={concept}
                isCompleted={completedSections.includes(`concept_${concept.order_index - 1}`)}
                onMarkCompleted={handleMarkCompleted}
              />
            ))
          ) : (
<Card className="border-dashed bg-muted">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="mb-4 size-12 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400">
                  No concepts available for this lesson.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          {general_exercises.length > 0 ? (
            <>
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="size-5 text-orange-600" />
                    General Exercises
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-slate-600 dark:text-slate-400">
                    Test your understanding with these practice exercises.
                  </p>
                  
                  <div className="space-y-4">
                    {general_exercises.map((exercise, index) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        index={index}
                      />
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => handleMarkCompleted('general_exercises')}
                    disabled={completedSections.includes('general_exercises')}
                    className="mt-6 w-full bg-orange-600 hover:bg-orange-700"
                  >
                    {completedSections.includes('general_exercises') ? (
                      <>
                        <CheckCircle2 className="mr-2 size-4" />
                        Exercises Completed
                      </>
                    ) : (
                      <>
                        <Circle className="mr-2 size-4" />
                        Mark Exercises as Completed
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
<Card className="border-dashed bg-muted">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="mb-4 size-12 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400">
                  No exercises available for this lesson.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}