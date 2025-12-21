"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonNavigationProps {
  previousUrl?: string | null;
  nextUrl?: string | null;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function LessonNavigation({
  previousUrl,
  nextUrl,
  onPrevious,
  onNext,
}: LessonNavigationProps) {
  const router = useRouter();

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (previousUrl) {
      router.push(previousUrl);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextUrl) {
      router.push(nextUrl);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        size="default"
        onClick={handlePrevious}
        disabled={!previousUrl}
        className={cn(
          "group h-10 rounded-lg border-2 px-3 font-medium transition-all sm:h-12 sm:px-6",
          previousUrl
            ? "hover:border-primary hover:shadow-md"
            : "opacity-50",
        )}
      >
        <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1 sm:mr-2" />
        <span className="hidden sm:inline">Previous Lesson</span>
      </Button>

      <Button
        variant="default"
        size="default"
        onClick={handleNext}
        disabled={!nextUrl}
        className={cn(
          "group h-10 rounded-lg border-2 px-3 font-medium shadow-sm transition-all hover:shadow-md sm:h-12 sm:px-6",
          !nextUrl && "opacity-50",
        )}
      >
        <span className="hidden sm:inline">Next Lesson</span>
        <ChevronRight className="size-4 transition-transform group-hover:translate-x-1 sm:ml-2" />
      </Button>
    </div>
  );
}
