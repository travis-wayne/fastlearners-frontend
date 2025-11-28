import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { LessonContent } from "@/lib/types/lessons";
import { ExerciseCard } from "../ExerciseCard";
import { Progress } from "@/components/ui/progress";

interface LessonGeneralExercisesProps {
  lesson: LessonContent;
  onAnswerExercise: (exerciseId: number, answer: string) => Promise<any>;
}

export function LessonGeneralExercises({ lesson, onAnswerExercise }: LessonGeneralExercisesProps) {
  const general_exercises = lesson.general_exercises || [];
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleAnswer = async (id: number, answer: string) => {
    const result = await onAnswerExercise(id, answer);
    // Track correctness for every attempt
    setResults(prev => ({ ...prev, [id]: prev[id] || !!result?.isCorrect }));
    return result;
  };

  const total = general_exercises.length;
  const attemptedCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter(Boolean).length;
  const progress = total > 0 ? (correctCount / total) * 100 : 0;

  const allAttempted = attemptedCount === total && total > 0;
  const scorePercentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-1">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-purple-600" />
              General Exercises
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              {correctCount} of {total} Correct ({scorePercentage}%)
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {total > 0 && (
            <div className="mb-6 space-y-2">
              <Progress value={progress} className="h-2" />
              {allAttempted && (
                <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                  {scorePercentage < 80
                    ? "You have completed all exercises. You may want to review the concepts before moving on."
                    : "Great job! You have mastered these exercises."}
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            {general_exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                onAnswer={handleAnswer}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
