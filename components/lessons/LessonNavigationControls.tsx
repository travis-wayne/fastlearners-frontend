import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronRight,
  Trophy,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonNavigationControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  progress: number;
  isRedirecting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
}

export function LessonNavigationControls({
  currentStepIndex,
  totalSteps,
  progress,
  isRedirecting,
  onPrevious,
  onNext,
  disablePrevious,
  disableNext,
}: LessonNavigationControlsProps) {
  // Determine if previous should be disabled (either via prop or derived from state)
  const isPreviousDisabled = disablePrevious ?? currentStepIndex === 0;
  // Determine if next is the "Finish" action
  const isLastStep = currentStepIndex === totalSteps - 1; // Assuming totalSteps = concepts.length + 3, last index is totalSteps - 1?
  // Wait, in LessonViewer: currentStepIndex === concepts.length + 2
  // And totalSteps passed is concepts.length + 3
  // So indices are 0 to concepts.length + 2
  // So last index IS totalSteps - 1.
  // Correct.

  return (
    <Card className="border-2">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="default"
            className="mobile-touch-target font-medium sm:h-11 sm:min-w-[120px] sm:px-8"
            onClick={onPrevious}
            disabled={isPreviousDisabled}
            aria-label="Go to previous section"
          >
            <ArrowLeft className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <div className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-muted-foreground sm:text-xs">
            <span className="text-xs font-semibold text-foreground sm:text-sm">
              {currentStepIndex + 1} / {totalSteps}
            </span>
            <span className="hidden sm:block">
              Swipe or use keys
            </span>
          </div>
          <Button
            size="default"
            className={cn(
              "mobile-touch-target font-medium shadow-sm transition-all sm:h-11 sm:min-w-[120px] sm:px-8",
              progress >= 100 && "bg-green-600 hover:bg-green-700"
            )}
            onClick={onNext}
            disabled={disableNext ?? isRedirecting}
            aria-label={isLastStep ? "Finish lesson" : "Go to next section"}
          >
            {isRedirecting ? (
              <>
                <RefreshCw className="size-4 animate-spin sm:mr-2" />
                <span className="hidden sm:inline">Loading...</span>
              </>
            ) : isLastStep ? (
              <>
                <Trophy className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Finish Lesson</span>
                <span className="sm:hidden">Finish</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Continue</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="size-4 sm:ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
