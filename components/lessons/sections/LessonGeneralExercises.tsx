import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, CheckCircle2, AlertCircle } from "lucide-react";
import { LessonContent } from "@/lib/types/lessons";
import { ExerciseCard } from "../ExerciseCard";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LessonGeneralExercisesProps {
  lesson: LessonContent;
  onAnswerExercise: (exerciseId: number, answer: string) => Promise<any>;
}

export function LessonGeneralExercises({
  lesson,
  onAnswerExercise,
}: LessonGeneralExercisesProps) {
  const general_exercises = lesson.general_exercises || [];
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleAnswer = async (id: number, answer: string) => {
    const result = await onAnswerExercise(id, answer);
    setResults((prev) => ({
      ...prev,
      [id]: prev[id] || !!result?.isCorrect,
    }));
    return result;
  };

  const total = general_exercises.length;
  const attemptedCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter(Boolean).length;
  const progress = total > 0 ? (correctCount / total) * 100 : 0;

  const allAttempted = attemptedCount === total && total > 0;
  const scorePercentage =
    total > 0 ? Math.round((correctCount / total) * 100) : 0;

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
            {total > 0 && (
              <Badge variant="secondary" className="text-sm font-medium">
                {correctCount} / {total} Correct
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {total > 0 && (
            <div className="space-y-4 rounded-xl border-2 bg-gradient-to-r from-purple-50/50 via-purple-50/30 to-background p-6 dark:from-purple-950/20 dark:via-purple-950/10 dark:to-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="size-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-semibold text-foreground">
                    Overall Progress
                  </span>
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {scorePercentage}%
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span className="text-muted-foreground">
                    {correctCount} Correct
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-red-600" />
                  <span className="text-muted-foreground">
                    {attemptedCount - correctCount} Incorrect
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {total - attemptedCount} Remaining
                  </span>
                </div>
              </div>
              {allAttempted && (
                <div
                  className={cn(
                    "mt-4 rounded-lg border-2 p-4",
                    scorePercentage >= 80
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                      : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-medium",
                      scorePercentage >= 80
                        ? "text-emerald-900 dark:text-emerald-100"
                        : "text-yellow-900 dark:text-yellow-100",
                    )}
                  >
                    {scorePercentage >= 80
                      ? "🎉 Excellent work! You have mastered these exercises."
                      : "📚 You have completed all exercises. Consider reviewing the concepts to improve your score."}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            {general_exercises.length > 0 ? (
              general_exercises.map((exercise, index) => (
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
    </div>
  );
}
