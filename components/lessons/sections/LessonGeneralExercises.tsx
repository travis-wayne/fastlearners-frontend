import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trophy, Target, CheckCircle2, AlertCircle, Filter, SortAsc, Eye, Clock, Shuffle, RotateCcw, Share2, Zap, Award, Flame, Star, TrendingUp, BarChart3, Pause, Play } from "lucide-react";
import { LessonContent, GeneralExercise } from "@/lib/types/lessons";
import { getGeneralExerciseScore } from "@/lib/api/lessons";
import { ExerciseCard } from "../ExerciseCard";
import { useLessonsStore } from "@/lib/store/lessons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LessonGeneralExercisesProps {
  lesson: LessonContent;
  onAnswerExercise: (exerciseId: number, answer: string) => Promise<any>;
}

type FilterType = 'all' | 'completed' | 'incomplete' | 'incorrect';
type SortType = 'order' | 'status' | 'difficulty';
type ModeType = 'normal' | 'focus' | 'review_incorrect' | 'timed' | 'random';

interface BadgeData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
}

export function LessonGeneralExercises({
  lesson,
  onAnswerExercise,
}: LessonGeneralExercisesProps) {
  const { 
    exerciseProgress, 
    resetLessonProgress,
    analyticsData,
    startSectionTimer,
    endSectionTimer,
    updateAnalytics,
  } = useLessonsStore();
  
  // Memoize general_exercises to prevent unnecessary re-renders
  const general_exercises = useMemo(() => lesson.general_exercises || [], [lesson.general_exercises]);
  
  // State
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('order');
  const [mode, setMode] = useState<ModeType>('normal');
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [generalExerciseScore, setGeneralExerciseScore] = useState<{ total_score: string; weight: string } | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);

  // Timer for timed mode
  useEffect(() => {
    if (timedMode && !isPaused && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timedMode, isPaused, timeLeft]);

  // Filtered and sorted exercises
  const processedExercises = useMemo(() => {
    let exercises = [...general_exercises];

    // Filter
    if (filter === 'completed') {
      exercises = exercises.filter(ex => exerciseProgress[ex.id]?.isCompleted);
    } else if (filter === 'incomplete') {
      exercises = exercises.filter(ex => !exerciseProgress[ex.id]?.isCompleted);
    } else if (filter === 'incorrect') {
      exercises = exercises.filter(ex => exerciseProgress[ex.id]?.isCompleted && !exerciseProgress[ex.id]?.isCorrect);
    }

    // Sort
    if (sort === 'status') {
      exercises.sort((a, b) => {
        const aCompleted = exerciseProgress[a.id]?.isCompleted ? 1 : 0;
        const bCompleted = exerciseProgress[b.id]?.isCompleted ? 1 : 0;
        return bCompleted - aCompleted;
      });
    } else if (sort === 'difficulty') {
      // Assuming difficulty based on attempts or something, for now random
      exercises.sort(() => Math.random() - 0.5);
    }

    // Mode specific
    if (mode === 'random') {
      exercises = exercises.sort(() => Math.random() - 0.5);
    }

    return exercises;
  }, [general_exercises, filter, sort, mode, exerciseProgress]);

  // Start section timer when component mounts
  useEffect(() => {
    startSectionTimer('general_exercises');
    return () => {
      endSectionTimer('general_exercises');
    };
  }, [startSectionTimer, endSectionTimer]);

  // Fetch general exercise total score
  useEffect(() => {
    const fetchGeneralExerciseScore = async () => {
      // Fetch score for the first general exercise as a representative
      if (general_exercises.length === 0) return;
      
      const firstExerciseId = general_exercises[0].id;
      // Only fetch if the exercise is completed to avoid 400 errors
      if (!exerciseProgress[firstExerciseId]?.isCompleted) return;

      setIsLoadingScore(true);
      try {
        const response = await getGeneralExerciseScore(firstExerciseId);
        if (response.success && response.content) {
          setGeneralExerciseScore({
            total_score: response.content.total_score,
            weight: response.content.weight,
          });
        }
      } catch (error) {
        console.error('Failed to fetch general exercise score:', error);
      } finally {
        setIsLoadingScore(false);
      }
    };

    fetchGeneralExerciseScore();
  }, [general_exercises, exerciseProgress]);

  // Stats calculations
  const stats = useMemo(() => {
    const total = general_exercises.length;
    const completed = general_exercises.filter(ex => exerciseProgress[ex.id]?.isCompleted).length;
    const correct = general_exercises.filter(ex => exerciseProgress[ex.id]?.isCorrect).length;
    const incorrect = completed - correct;
    const unattempted = total - completed;
    const scorePercentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    // Average attempts
    const totalAttempts = general_exercises.reduce((sum, ex) => sum + (exerciseProgress[ex.id]?.attempts || 0), 0);
    const avgAttempts = completed > 0 ? (totalAttempts / completed).toFixed(1) : '0';
    
    // Get average time from analytics data
    const analytics = analyticsData[lesson.id];
    const avgTimeSeconds = analytics?.averageTimePerSection || 0;
    const avgTime = avgTimeSeconds > 0 
      ? `${Math.floor(avgTimeSeconds / 60)}:${Math.floor(avgTimeSeconds % 60).toString().padStart(2, '0')}`
      : '0:00';
    
    return { total, completed, correct, incorrect, unattempted, scorePercentage, avgAttempts, avgTime };
  }, [general_exercises, exerciseProgress, analyticsData, lesson.id]);

  // Badges
  const badges: BadgeData[] = [
    { id: 'first_correct', title: 'First Steps', description: 'Answered your first exercise correctly', icon: <Star className="size-4" />, earned: stats.correct > 0 },
    { id: 'five_streak', title: 'On Fire', description: '5 correct answers in a row', icon: <Flame className="size-4" />, earned: streak >= 5 },
    { id: 'perfect_score', title: 'Perfectionist', description: '100% correct answers', icon: <Award className="size-4" />, earned: stats.scorePercentage === 100 },
    { id: 'halfway', title: 'Halfway There', description: 'Completed 50% of exercises', icon: <Target className="size-4" />, earned: stats.completed >= stats.total / 2 },
  ];

  // Handle answer
  const handleAnswer = async (id: number, answer: string) => {
    const result = await onAnswerExercise(id, answer);
    if (result?.isCorrect) {
      setStreak(prev => prev + 1);
      setPoints(prev => prev + 10);
    } else {
      setStreak(0);
    }
    // Update analytics after answer
    updateAnalytics(lesson.id);
    return result;
  };

  // Mode handlers
  const handleFocusMode = () => {
    setMode('focus');
    setCurrentFocusIndex(0);
  };

  const nextFocus = useCallback(() => {
    setCurrentFocusIndex(prev => {
      if (prev < processedExercises.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [processedExercises.length]);

  const prevFocus = useCallback(() => {
    setCurrentFocusIndex(prev => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const handleReviewIncorrect = () => {
    setMode('review_incorrect');
    setFilter('incorrect');
  };

  const handleTimedChallenge = () => {
    setMode('timed');
    setTimedMode(true);
    setTimeLeft(300);
    setIsPaused(false);
  };

  const handleRandomPractice = useCallback(() => {
    setMode('random');
  }, []);

  // Keyboard shortcuts (moved after function declarations)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;
      if (mode === 'focus') {
        if (e.key === 'ArrowRight' || e.key === 'n') {
          nextFocus();
        } else if (e.key === 'ArrowLeft' || e.key === 'p') {
          prevFocus();
        }
      }
      if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        handleRandomPractice();
      }
      if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        setMode('focus');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentFocusIndex, nextFocus, prevFocus, handleRandomPractice]);

  const handleResetProgress = () => {
    resetLessonProgress(lesson.id);
    setStreak(0);
    setPoints(0);
    setShowResetDialog(false);
    toast.success('Progress reset successfully');
  };

  const handleShareResults = async () => {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      toast.error('Clipboard not available');
      return;
    }
    
    const text = `I scored ${stats.scorePercentage}% on ${lesson.topic} exercises! ${stats.correct}/${stats.total} correct. #FastLearner`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Results copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMotivationalMessage = () => {
    if (stats.scorePercentage >= 90) return "Outstanding! You&apos;re a master of this topic.";
    if (stats.scorePercentage >= 80) return "Great job! Keep up the excellent work.";
    if (stats.scorePercentage >= 70) return "Good progress! A bit more practice will get you there.";
    if (stats.scorePercentage >= 50) return "You&apos;re on the right track. Keep practicing!";
    return "Don't give up! Every expert was once a beginner.";
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-1">
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Trophy className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Practice Exercises</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Test your understanding with these exercises
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm font-medium">
                {stats.correct} / {stats.total} Correct
              </Badge>
              {streak > 0 && (
                <Badge variant="destructive" className="text-sm">
                  <Flame className="mr-1 size-3" />
                  {streak} Streak
                </Badge>
              )}
              <Badge variant="outline" className="text-sm">
                <Star className="mr-1 size-3" />
                {points} Points
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
              <SelectTrigger className="w-32">
                <Filter className="mr-2 size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
                <SelectItem value="incorrect">Incorrect</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(value: SortType) => setSort(value)}>
              <SelectTrigger className="w-32">
                <SortAsc className="mr-2 size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleFocusMode}>
              <Eye className="mr-2 size-4" />
              Focus Mode
            </Button>
            <Button variant="outline" size="sm" onClick={handleReviewIncorrect}>
              <RotateCcw className="mr-2 size-4" />
              Review Incorrect
            </Button>
            <Button variant="outline" size="sm" onClick={handleTimedChallenge}>
              <Clock className="mr-2 size-4" />
              Timed Challenge
            </Button>
            <Button variant="outline" size="sm" onClick={handleRandomPractice}>
              <Shuffle className="mr-2 size-4" />
              Random
            </Button>
            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <RotateCcw className="mr-2 size-4" />
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Progress</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all your progress for this lesson&apos;s exercises. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetProgress}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Timed Mode Timer */}
          {timedMode && (
            <div className="flex items-center gap-2 rounded-lg border bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <Clock className="size-5 text-yellow-600" />
              <span className="font-semibold">Time Left: {formatTime(timeLeft)}</span>
              <Button size="sm" variant="outline" onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </Button>
            </div>
          )}

          {/* Progress */}
          {stats.total > 0 && (
            <div className="space-y-4 rounded-xl border-2 bg-gradient-to-r from-purple-50/50 via-purple-50/30 to-background p-6 dark:from-purple-950/20 dark:via-purple-950/10 dark:to-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="size-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-semibold text-foreground">
                    Overall Progress
                  </span>
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.scorePercentage}%
                </span>
              </div>
              <Progress value={(stats.correct / stats.total) * 100} className="h-3" />
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span className="text-muted-foreground">
                    {stats.correct} Correct
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-red-600" />
                  <span className="text-muted-foreground">
                    {stats.incorrect} Incorrect
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {stats.unattempted} Remaining
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Average attempts: {stats.avgAttempts} | Average time: {stats.avgTime}
                {generalExerciseScore && (
                  <> | Total Score: {generalExerciseScore.total_score}/{generalExerciseScore.weight}</>
                )}
                {/* Note: General exercise total score can be fetched via getGeneralExerciseScore(generalExerciseId) 
                    if needed for individual exercise tracking */}
              </div>
              {stats.completed === stats.total && (
                <div
                  className={cn(
                    "mt-4 rounded-lg border-2 p-4",
                    stats.scorePercentage >= 80
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                      : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-medium",
                      stats.scorePercentage >= 80
                        ? "text-emerald-900 dark:text-emerald-100"
                        : "text-yellow-900 dark:text-yellow-100",
                    )}
                  >
                    {getMotivationalMessage()}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={() => setShowStats(true)}>
                      <BarChart3 className="mr-2 size-4" />
                      View Stats
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleShareResults}>
                      <Share2 className="mr-2 size-4" />
                      Share
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {badges.filter(b => b.earned).map(badge => (
              <Badge key={badge.id} variant="secondary" className="flex items-center gap-1">
                {badge.icon}
                {badge.title}
              </Badge>
            ))}
          </div>

          {/* Exercises */}
          <div className="space-y-6">
            {mode === 'focus' ? (
              processedExercises.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Exercise {currentFocusIndex + 1} of {processedExercises.length}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={prevFocus} disabled={currentFocusIndex === 0}>
                        Previous
                      </Button>
                      <Button size="sm" variant="outline" onClick={nextFocus} disabled={currentFocusIndex === processedExercises.length - 1}>
                        Next
                      </Button>
                    </div>
                  </div>
                  <ExerciseCard
                    key={processedExercises[currentFocusIndex].id}
                    exercise={processedExercises[currentFocusIndex]}
                    index={currentFocusIndex}
                    onAnswer={handleAnswer}
                  />
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                    <Eye className="size-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    No exercises to focus on with current filters.
                  </p>
                </div>
              )
            ) : processedExercises.length > 0 ? (
              processedExercises.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  onAnswer={handleAnswer}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                  <Trophy className="size-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  No exercises available for this lesson.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Dialog */}
      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Exercise Statistics</DialogTitle>
            <DialogDescription>
              Detailed breakdown of your performance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{stats.correct}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{stats.unattempted}</div>
                <div className="text-sm text-muted-foreground">Unattempted</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Score: {stats.scorePercentage}%</div>
              <div className="text-sm text-muted-foreground">Avg Attempts: {stats.avgAttempts}</div>
            </div>
            <div className="text-sm">
              <strong>Recommendation:</strong> {stats.scorePercentage < 70 ? 'Review the concepts and try again.' : 'Great job! Consider challenging yourself with harder exercises.'}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}