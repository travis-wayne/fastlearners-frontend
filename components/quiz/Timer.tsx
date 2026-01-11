"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  onTimeUp?: () => void;
  className?: string;
}

export function Timer({ timeLeft, totalTime, onTimeUp, className }: TimerProps) {
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    // Show warning when less than 25% of time remains
    if (timeLeft > 0 && timeLeft <= totalTime * 0.25) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }

    if (timeLeft === 0 && onTimeUp) {
      onTimeUp();
    }
  }, [timeLeft, totalTime, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const percentage = (timeLeft / totalTime) * 100;

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      <Clock
        className={cn(
          "size-4 transition-colors sm:size-5",
          isWarning ? "text-red-500" : "text-muted-foreground"
        )}
      />
      <div className="flex flex-col">
        <span
          className={cn(
            "font-mono text-base font-semibold transition-colors sm:text-lg",
            isWarning && "animate-pulse text-red-600"
          )}
        >
          {formatTime(timeLeft)}
        </span>
        <div className="h-1 w-20 overflow-hidden rounded-full bg-muted sm:w-24 lg:w-32">
          <div
            className={cn(
              "h-full transition-all duration-1000",
              isWarning ? "bg-red-500" : "bg-primary"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

