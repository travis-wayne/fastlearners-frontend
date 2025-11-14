"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

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
    <div className="mt-6 flex items-center justify-between border-t pt-6">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={!previousUrl}
      >
        <ArrowLeft className="mr-2 size-4" />
        Previous Lesson
      </Button>

      <Button variant="default" onClick={handleNext} disabled={!nextUrl}>
        Next Lesson
        <ArrowRight className="ml-2 size-4" />
      </Button>
    </div>
  );
}
