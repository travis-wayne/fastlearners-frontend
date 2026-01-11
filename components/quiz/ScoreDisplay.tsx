"use client";

import { Trophy, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  totalPoints: number;
  passingScore: number;
  className?: string;
}

export function ScoreDisplay({
  score,
  totalPoints,
  passingScore,
  className,
}: ScoreDisplayProps) {
  const percentage = Math.round((score / totalPoints) * 100);
  const passed = percentage >= passingScore;
  const pointsDifference = score - totalPoints * (passingScore / 100);

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-component-md sm:p-component-lg">
        <div className="space-y-component-sm sm:space-y-component-md">
          {/* Main Score */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full sm:size-12",
                  passed
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-600"
                )}
              >
                <Trophy className="size-5 sm:size-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">Your Score</p>
                <p className="text-xl font-bold sm:text-2xl">
                  {score} / {totalPoints}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div
                className={cn(
                  "text-2xl font-bold sm:text-3xl",
                  passed ? "text-green-600" : "text-orange-600"
                )}
              >
                {percentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {passed ? "Passed" : "Not Passed"}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-component-xs sm:space-y-component-sm">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <Progress
              value={percentage}
              className={cn(
                "h-2 sm:h-3",
                passed ? "[&>div]:bg-green-500" : "[&>div]:bg-orange-500"
              )}
            />
          </div>

          {/* Passing Score Indicator */}
          <div className="flex items-center justify-between rounded-lg bg-muted p-2 sm:p-3">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground sm:text-sm">
                Passing Score
              </span>
            </div>
            <span className="text-sm font-semibold sm:text-base">{passingScore}%</span>
          </div>

          {/* Points Difference */}
          {pointsDifference !== 0 && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg p-2 sm:p-3",
                passed
                  ? "bg-green-50 text-green-700"
                  : "bg-orange-50 text-orange-700"
              )}
            >
              <TrendingUp className="size-4" />
              <span className="text-xs font-medium sm:text-sm">
                {passed ? "+" : ""}
                {Math.round(pointsDifference)} points{" "}
                {passed ? "above" : "below"} passing score
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

