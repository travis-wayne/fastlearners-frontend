import { useState, useEffect } from "react";

interface SharingPreferences {
  allowSharing: boolean;
  includePersonalInfo: boolean;
  includeDetailedStats: boolean;
}

const DEFAULT_PREFERENCES: SharingPreferences = {
  allowSharing: true,
  includePersonalInfo: true,
  includeDetailedStats: true,
};

const STORAGE_KEY = "lesson-sharing-preferences";

/**
 * Hook for managing user sharing preferences
 * Stores preferences in localStorage
 */
export function useSharingPreferences() {
  const [preferences, setPreferencesState] = useState<SharingPreferences>(
    DEFAULT_PREFERENCES
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferencesState({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.error("Error loading sharing preferences:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage
  const setPreferences = (newPreferences: Partial<SharingPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferencesState(updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving sharing preferences:", error);
      }
    }
  };

  // Update individual preference
  const updatePreference = <K extends keyof SharingPreferences>(
    key: K,
    value: SharingPreferences[K]
  ) => {
    setPreferences({ [key]: value });
  };

  // Reset to defaults
  const resetPreferences = () => {
    setPreferencesState(DEFAULT_PREFERENCES);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Error resetting sharing preferences:", error);
      }
    }
  };

  return {
    preferences,
    setPreferences,
    updatePreference,
    resetPreferences,
    isLoaded,
  };
}
