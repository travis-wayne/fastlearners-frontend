"use client";

import { useEffect } from "react";

interface UseLessonAccessibilityParams {
  progress: number;
}

export function useLessonAccessibility({ progress }: UseLessonAccessibilityParams) {
  // Screen reader announcements for progress updates
  useEffect(() => {
    if (typeof document === 'undefined' || progress <= 0 || progress >= 100) return;

    const announcement = `Lesson progress: ${progress} percent complete`;
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.style.position = 'absolute';
    ariaLive.style.left = '-10000px';
    ariaLive.style.width = '1px';
    ariaLive.style.height = '1px';
    ariaLive.style.overflow = 'hidden';
    ariaLive.textContent = announcement;
    document.body.appendChild(ariaLive);

    const timeoutId = setTimeout(() => {
      if (document.body.contains(ariaLive)) {
        document.body.removeChild(ariaLive);
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (document.body.contains(ariaLive)) {
        document.body.removeChild(ariaLive);
      }
    };
  }, [progress]);
}
