"use client";

import { useState, useCallback, type TouchEvent } from "react";

interface UseLessonGesturesParams {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  enabled?: boolean;
}

export function useLessonGestures({
  onSwipeLeft,
  onSwipeRight,
  enabled = true,
}: UseLessonGesturesParams) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    setTouchEndX(e.targetTouches[0].clientX);
  }, [enabled]);

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      onSwipeLeft();
    } else if (isRightSwipe) {
      onSwipeRight();
    }
  }, [touchStartX, touchEndX, onSwipeLeft, onSwipeRight, enabled]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
