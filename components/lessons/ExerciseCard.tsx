import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Exercise, GeneralExercise } from "@/lib/types/lessons";
import { useLessonsStore } from "@/lib/store/lessons";

interface ExerciseCardProps {
  exercise: Exercise | GeneralExercise;
  index: number;
  onAnswer?: (exerciseId: number, answer: string) => Promise<any>;
}

export function ExerciseCard({ exercise, index, onAnswer }: ExerciseCardProps) {
  const { exerciseProgress } = useLessonsStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Check if exercise is already completed
  const exerciseData = exerciseProgress[exercise.id];
  const isAlreadyCompleted = exerciseData?.isCompleted && exerciseData?.isCorrect;

  // Auto-populate if already answered correctly
  useEffect(() => {
    if (isAlreadyCompleted && exerciseData?.userAnswer) {
      setSelectedAnswer(exerciseData.userAnswer);
      setIsRevealed(true);
      setIsCorrect(true);
      setFeedbackMessage("Already answered correctly!");
    }
  }, [isAlreadyCompleted, exerciseData]);

  const handleSubmit = async () => {
    if (!onAnswer) return;

    setIsSubmitting(true);
    try {
      const result = await onAnswer(exercise.id, selectedAnswer);
      setIsRevealed(true);

      if (result && typeof result === 'object') {
        setIsCorrect(result.isCorrect);

        let message = result.message;
        const code = result.code;

        if (code === 400) {
          if (result.isCorrect) {
            // Already answered correctly or just correct
            message = message || "Correct!";
          } else {
            // Incorrect or already answered incorrectly
            // If the message implies "already answered", we might want to show it.
            // But usually 400 + isCorrect=false means just wrong or bad request.
            // We'll stick to the message from backend.
          }
        } else if (code === 422) {
          message = `Validation Error: ${message}`;
        } else if (code >= 500) {
          message = "We could not check your answer. Please try again.";
        }

        setFeedbackMessage(message);
      } else {
        // Fallback
        setIsCorrect(selectedAnswer === exercise.correct_answer);
        setFeedbackMessage(selectedAnswer === exercise.correct_answer ? "Correct!" : "Incorrect. Try again.");
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setFeedbackMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setIsRevealed(false);
    setShowSolution(false);
    setSelectedAnswer("");
    setFeedbackMessage("");
  };

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800/30 dark:bg-blue-900/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-blue-900 dark:text-blue-100">
          Exercise {index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-white p-4 shadow-sm dark:bg-slate-950">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            {exercise.problem}
          </p>
        </div>

        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          disabled={isRevealed || isSubmitting}
          className="space-y-2"
        >
          {exercise.answers.map((answer, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center space-x-2 rounded-md border p-3 transition-colors",
                selectedAnswer === answer
                  ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                  : "border-transparent bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900",
                isRevealed &&
                answer === exercise.correct_answer &&
                "border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20",
                isRevealed &&
                selectedAnswer === answer &&
                answer !== exercise.correct_answer &&
                "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/20",
              )}
            >
              <RadioGroupItem value={answer} id={`ex-${exercise.id}-opt-${i}`} />
              <Label
                htmlFor={`ex-${exercise.id}-opt-${i}`}
                className="flex-1 cursor-pointer"
              >
                {answer}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="pt-2">
          {!isRevealed ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer || isSubmitting}
              className="mt-3 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              {isSubmitting ? "Checking..." : "Submit Answer"}
            </Button>
          ) : (
            <div
              className={cn(
                "rounded-md p-4",
                isCorrect
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
              )}
            >
              <p className="font-bold">
                {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {feedbackMessage || (isCorrect ? "Great job!" : "Try again!")}
              </p>
              {!isCorrect && (
                <div className="mt-3 space-y-2">
                  {!showSolution ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowSolution(true)}
                        className="h-8 text-xs"
                      >
                        Show Solution
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleTryAgain}
                        className="h-8 bg-blue-600 text-xs hover:bg-blue-700"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        The correct answer is: <strong>{exercise.correct_answer}</strong>
                      </p>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleTryAgain}
                        className="h-8 bg-blue-600 text-xs hover:bg-blue-700"
                      >
                        Try Again
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
