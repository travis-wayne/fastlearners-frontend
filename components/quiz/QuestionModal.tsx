"use client";

import { useState } from "react";
import { X, CheckCircle2, XCircle, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Question {questionNumber} of {totalQuestions}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
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
                    const isSelected = selectedAnswer === index;
                    const isCorrectOption = question.correctAnswer === index;

                    return (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
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
                          value={String(index)}
                          id={`option-${index}`}
                          className="mt-0.5"
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer text-base"
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
                    const isSelected = selectedAnswer === option;
                    const isCorrectOption =
                      question.correctAnswer === option;

                    return (
                      <div
                        key={option}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
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
                        <RadioGroupItem value={option} id={option} />
                        <Label
                          htmlFor={option}
                          className="flex-1 cursor-pointer text-base"
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
          <div className="flex items-center justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isFirstQuestion}
            >
              <ArrowLeft className="mr-2 size-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {showExplanation && question.explanation && (
                <Button
                  variant="outline"
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  {showExplanation ? "Hide" : "Show"} Explanation
                </Button>
              )}
            </div>

            {isLastQuestion ? (
              <Button onClick={onNext} disabled={!selectedAnswer}>
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={onNext} disabled={!selectedAnswer}>
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
