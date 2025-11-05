"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

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

  return {
    isInitialized: isInitialized && isHydrated && !isLoading,
    isLoading: !isInitialized || isLoading || !isHydrated,
  };
}
