"use client";

import { useState } from "react";
import { X, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "fill-blank";
  options?: string[];
  correctAnswer: string | number;
  points: number;
  explanation?: string;
  feedback?: {
    positive: string;
    negative: string;
  };
}

export type QuestionContestant = {
  userId: string;
  username: string;
  avatar?: string;
};

interface QuestionModalProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | number | null;
  onAnswerSelect: (answer: string | number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  showFeedback?: boolean;
  isOpen: boolean;
  timeLeft?: number;
  totalTime?: number;
  showTimer?: boolean;
  contestants?: QuestionContestant[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function QuestionModal({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  showFeedback = false,
  isOpen,
  onClose,
  timeLeft,
  totalTime,
  showTimer = false,
  contestants,
}: QuestionModalProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const isCorrect =
    selectedAnswer !== null &&
    String(selectedAnswer).toLowerCase() ===
    String(question.correctAnswer).toLowerCase();

  const progress = (questionNumber / totalQuestions) * 100;
  const isFirstQuestion = questionNumber === 1;
  const isLastQuestion = questionNumber === totalQuestions;

  const handleAnswerChange = (value: string) => {
    if (question.type === "multiple-choice") {
      onAnswerSelect(parseInt(value));
    } else if (question.type === "true-false") {
      onAnswerSelect(value);
    } else {
      onAnswerSelect(value);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const showTimerBlock =
    showTimer && typeof timeLeft === "number" && typeof totalTime === "number";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto p-component-sm sm:max-w-2xl sm:p-component-md lg:max-w-3xl lg:p-component-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <DialogTitle className="text-lg sm:text-xl">
              Question {questionNumber} of {totalQuestions}
            </DialogTitle>
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
              {contestants?.length ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex -space-x-2">
                    {contestants.slice(0, 5).map((contestant) => (
                      <Avatar
                        key={contestant.userId}
                        className="size-8 border-2 border-background shadow-sm"
                      >
                        <AvatarImage
                          src={contestant.avatar}
                          alt={contestant.username}
                        />
                        <AvatarFallback>
                          {getInitials(contestant.username)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {contestants.length > 5 && (
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      +{contestants.length - 5} more
                    </span>
                  )}
                </div>
              ) : null}
              {showTimerBlock && (
                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 font-mono text-xs sm:text-sm">
                  <Clock className="size-4 text-muted-foreground" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="size-8"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-component-sm sm:space-y-component-md">
          {/* Progress Bar */}
          <div className="space-y-component-xs sm:space-y-component-sm">
            <div className="responsive-text flex items-center justify-between">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {questionNumber}/{totalQuestions}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                {question.points} pts
              </Badge>
              <h2 className="flex-1 text-lg font-semibold leading-relaxed">
                {question.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {question.type === "multiple-choice" && question.options && (
                <RadioGroup
                  value={
                    selectedAnswer !== null ? String(selectedAnswer) : ""
                  }
                  onValueChange={handleAnswerChange}
                  disabled={showFeedback}
                >
                  {question.options.map((option, index) => {
                    const optionValue = String(index);
                    const optionId = `${question.id}-option-${index}`;
                    const isSelected =
                      selectedAnswer !== null &&
                      String(selectedAnswer) === optionValue;
                    const isCorrectOption =
                      String(question.correctAnswer).toLowerCase() ===
                      optionValue.toLowerCase();

                    return (
                      <div
                        key={optionId}
                        className={cn(
                          "flex min-h-[44px] items-center space-x-3 rounded-lg border p-3 transition-colors sm:p-4",
                          showFeedback &&
                          isCorrectOption &&
                          "border-green-500 bg-green-50",
                          showFeedback &&
                          isSelected &&
                          !isCorrectOption &&
                          "border-red-500 bg-red-50",
                          !showFeedback &&
                          isSelected &&
                          "border-primary bg-primary/5",
                          !showFeedback && "hover:bg-muted/50"
                        )}
                      >
                        <RadioGroupItem
                          value={optionValue}
                          id={optionId}
                          className="mt-0.5"
                        />
                        <Label
                          htmlFor={optionId}
                          className="flex-1 cursor-pointer text-sm sm:text-base"
                        >
                          {option}
                        </Label>
                        {showFeedback && isCorrectOption && (
                          <CheckCircle2 className="size-5 text-green-600" />
                        )}
                        {showFeedback &&
                          isSelected &&
                          !isCorrectOption && (
                            <XCircle className="size-5 text-red-600" />
                          )}
                      </div>
                    );
                  })}
                </RadioGroup>
              )}

              {question.type === "true-false" && (
                <RadioGroup
                  value={
                    selectedAnswer !== null ? String(selectedAnswer) : ""
                  }
                  onValueChange={handleAnswerChange}
                  disabled={showFeedback}
                >
                  {["True", "False"].map((option) => {
                    const optionId = `${question.id}-${option.toLowerCase()}`;
                    const isSelected =
                      selectedAnswer !== null &&
                      String(selectedAnswer).toLowerCase() ===
                      option.toLowerCase();
                    const isCorrectOption =
                      String(question.correctAnswer).toLowerCase() ===
                      option.toLowerCase();

                    return (
                      <div
                        key={option}
                        className={cn(
                          "flex min-h-[44px] items-center space-x-3 rounded-lg border p-3 transition-colors sm:p-4",
                          showFeedback &&
                          isCorrectOption &&
                          "border-green-500 bg-green-50",
                          showFeedback &&
                          isSelected &&
                          !isCorrectOption &&
                          "border-red-500 bg-red-50",
                          !showFeedback &&
                          isSelected &&
                          "border-primary bg-primary/5",
                          !showFeedback && "hover:bg-muted/50"
                        )}
                      >
                        <RadioGroupItem value={option} id={optionId} />
                        <Label
                          htmlFor={optionId}
                          className="flex-1 cursor-pointer text-sm sm:text-base"
                        >
                          {option}
                        </Label>
                        {showFeedback && isCorrectOption && (
                          <CheckCircle2 className="size-5 text-green-600" />
                        )}
                        {showFeedback &&
                          isSelected &&
                          !isCorrectOption && (
                            <XCircle className="size-5 text-red-600" />
                          )}
                      </div>
                    );
                  })}
                </RadioGroup>
              )}

              {question.type === "fill-blank" && (
                <Input
                  placeholder="Enter your answer..."
                  value={selectedAnswer !== null ? String(selectedAnswer) : ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  disabled={showFeedback}
                  className={cn(
                    "text-base",
                    showFeedback &&
                    isCorrect &&
                    "border-green-500 bg-green-50",
                    showFeedback &&
                    !isCorrect &&
                    "border-red-500 bg-red-50"
                  )}
                />
              )}
            </div>

            {/* Feedback */}
            {showFeedback && question.feedback && (
              <div
                className={cn(
                  "rounded-lg border p-4",
                  isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                )}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 size-5 text-green-600" />
                  ) : (
                    <XCircle className="mt-0.5 size-5 text-red-600" />
                  )}
                  <div className="flex-1">
                    <p
                      className={cn(
                        "font-medium",
                        isCorrect ? "text-green-800" : "text-red-800"
                      )}
                    >
                      {isCorrect
                        ? question.feedback.positive
                        : question.feedback.negative}
                    </p>
                    {question.explanation && (
                      <p
                        className={cn(
                          "mt-2 text-sm",
                          isCorrect ? "text-green-700" : "text-red-700"
                        )}
                      >
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 lg:gap-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isFirstQuestion}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 size-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {question.explanation && (
                <Button
                  variant="outline"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full sm:w-auto"
                >
                  {showExplanation ? "Hide" : "Show"} Explanation
                </Button>
              )}
            </div>

            {isLastQuestion ? (
              <Button onClick={onNext} disabled={!selectedAnswer} className="w-full sm:w-auto">
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={onNext} disabled={!selectedAnswer} className="w-full sm:w-auto">
                Next
                <ArrowRight className="ml-2 size-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
