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
        size="lg"
        onClick={handlePrevious}
        disabled={!previousUrl}
        className={cn(
          "group h-12 rounded-lg border-2 font-medium transition-all",
          previousUrl
            ? "hover:border-primary hover:shadow-md"
            : "opacity-50",
        )}
      >
        <ChevronLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
        Previous Lesson
      </Button>

      <Button
        variant="default"
        size="lg"
        onClick={handleNext}
        disabled={!nextUrl}
        className={cn(
          "group h-12 rounded-lg border-2 font-medium shadow-sm transition-all hover:shadow-md",
          !nextUrl && "opacity-50",
        )}
      >
        Next Lesson
        <ChevronRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
}
