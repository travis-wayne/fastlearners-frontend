"use client";

import { useEffect } from "react";

interface UseLessonAccessibilityParams {
  progress: number;
}

export function useLessonAccessibility({ progress }: UseLessonAccessibilityParams) {
  // Screen reader announcements for progress updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mounted = true;
    let cleanupTimeout: NodeJS.Timeout;

    // Defer DOM manipulation to avoid hydration mismatches
    requestAnimationFrame(() => {
      if (!mounted) return;
      
      // Don't announce initial load or invalid values
      if (progress <= 0 || progress >= 100) return;

      const announcement = `Lesson progress: ${progress} percent complete`;
      
      // Try to reuse existing aria-live region
      let ariaLive = document.getElementById('lesson-accessibility-announcer');
      
      if (!ariaLive) {
        ariaLive = document.createElement('div');
        ariaLive.id = 'lesson-accessibility-announcer';
        ariaLive.setAttribute('aria-live', 'polite');
        ariaLive.setAttribute('aria-atomic', 'true');
        ariaLive.style.position = 'absolute';
        ariaLive.style.left = '-10000px';
        ariaLive.style.width = '1px';
        ariaLive.style.height = '1px';
        ariaLive.style.overflow = 'hidden';
        document.body.appendChild(ariaLive);
      }

      ariaLive.textContent = announcement;

      // Clear text after delay, but keep the element
      cleanupTimeout = setTimeout(() => {
        if (mounted && ariaLive) {
            ariaLive.textContent = '';
        }
      }, 3000);
    });

    return () => {
      mounted = false;
      if (cleanupTimeout) clearTimeout(cleanupTimeout);
    };
  }, [progress]);
}
