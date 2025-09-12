"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

import { getAuthCookies } from "@/lib/auth-cookies";

export function useAuthInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isHydrated, isLoading } = useAuthStore();

  useEffect(() => {
    const checkAuthState = async () => {
      // Since we're using cookies, the auth store should already be initialized
      // with the cookie data on mount. Just verify the state.
      const state = useAuthStore.getState();
      const cookieData = getAuthCookies();

      console.log("useAuthInit - Auth state check:", {
        isHydrated: state.isHydrated,
        isAuthenticated: state.isAuthenticated,
        user: state.user ? { id: state.user.id, role: state.user.role } : null,
        isLoading: state.isLoading,
        cookieData: cookieData
          ? { hasUser: !!cookieData.user, hasToken: !!cookieData.token }
          : null,
      });

      // Ensure the store state matches cookie data
      if (cookieData && (!state.isAuthenticated || !state.user)) {
        console.log("useAuthInit - Syncing store with cookie data");
        useAuthStore.setState({
          user: cookieData.user,
          isAuthenticated: true,
          isHydrated: true,
          isLoading: false,
        });
      } else if (!cookieData && state.isAuthenticated) {
        console.log("useAuthInit - Clearing store state (no valid cookies)");
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          isHydrated: true,
          isLoading: false,
        });
      }

      setIsInitialized(true);
    };

    checkAuthState();
  }, []);

  return {
    isInitialized: isInitialized && isHydrated && !isLoading,
    isLoading: !isInitialized || isLoading || !isHydrated,
  };
}
