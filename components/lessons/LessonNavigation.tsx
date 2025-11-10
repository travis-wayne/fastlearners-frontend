"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface LessonNavigationProps {
  previousLessonId?: number | null;
  nextLessonId?: number | null;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function LessonNavigation({
  previousLessonId,
  nextLessonId,
  onPrevious,
  onNext,
}: LessonNavigationProps) {
  const router = useRouter();

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (previousLessonId) {
      router.push(`/dashboard/lessons/${previousLessonId}`);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextLessonId) {
      router.push(`/dashboard/lessons/${nextLessonId}`);
    }
  };

  return (
    <div className="flex items-center justify-between border-t pt-6 mt-6">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={!previousLessonId}
      >
        <ArrowLeft className="mr-2 size-4" />
        Previous Lesson
      </Button>

      <Button
        variant="default"
        onClick={handleNext}
        disabled={!nextLessonId}
      >
        Next Lesson
        <ArrowRight className="ml-2 size-4" />
      </Button>
    </div>
  );
}

