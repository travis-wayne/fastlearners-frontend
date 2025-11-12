"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

const MAX_HYDRATION_TIMEOUT = 10000; // 10 seconds max wait

export function useAuthInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isHydrated, isLoading, hydrate } = useAuthStore();

  useEffect(() => {
    // Hydrate auth store from server session (HttpOnly cookies)
    if (!isHydrated) {
      console.log("useAuthInit - Hydrating auth store...");
      hydrate();
    }

    // Mark as initialized once hydrated
    if (isHydrated) {
      const state = useAuthStore.getState();
      console.log("useAuthInit - Auth state:", {
        isHydrated: state.isHydrated,
        isAuthenticated: state.isAuthenticated,
        user: state.user ? { id: state.user.id, role: state.user.role } : null,
        isLoading: state.isLoading,
      });
      setIsInitialized(true);
    }
  }, [isHydrated, hydrate]);

  // Fallback timeout to prevent indefinite blocking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isHydrated) {
        console.warn("useAuthInit - Hydration timeout, proceeding with unauthenticated state");
        setIsInitialized(true);
      }
    }, MAX_HYDRATION_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, [isHydrated]);

  return {
    isInitialized: isInitialized && isHydrated && !isLoading,
    isLoading: !isInitialized || isLoading || !isHydrated,
  };
}
