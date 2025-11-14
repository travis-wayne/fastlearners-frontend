"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthStore } from "@/store/authStore";

import {
  ClassLevel,
  classLevels,
  getClassLevelById,
  getSubjectsForClass,
  getTermById,
  normalizeClassString,
  Subject,
  Term,
  terms,
} from "@/config/education";

interface AcademicContextType {
  // Current selections
  currentClass: ClassLevel | null;
  currentTerm: Term | null;

  // Available options
  availableClasses: ClassLevel[];
  availableTerms: Term[];
  availableSubjects: Subject[];

  // Actions
  setCurrentClass: (classLevel: ClassLevel) => void;
  setCurrentTerm: (term: Term) => void;

  // Computed values
  isLoading: boolean;
  academicYear: string;
}

const AcademicContext = createContext<AcademicContextType | undefined>(
  undefined,
);

interface AcademicProviderProps {
  children: ReactNode;
  defaultClassId?: string;
  defaultTermId?: string;
}

export function AcademicProvider({
  children,
  defaultClassId = "jss1", // Default to JSS 1 for demo
  defaultTermId = "term1", // Default to First Term
}: AcademicProviderProps) {
  const [currentClass, setCurrentClassState] = useState<ClassLevel | null>(
    null,
  );
  const [currentTerm, setCurrentTermState] = useState<Term | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hoist useAuthStore hook call to top level
  const userClass = useAuthStore((state) => state.user?.class);

  // Initialize with defaults and auth store
  useEffect(() => {
    const initializeDefaults = () => {
      const user = useAuthStore.getState().user;
      const defaultTerm = getTermById(defaultTermId);

      // Read class from user profile, fallback to default
      if (user?.class) {
        // Normalize class string from API (SS1 → SSS1, etc.)
        const normalizedClass = normalizeClassString(user.class);
        const classLevel = normalizedClass
          ? getClassLevelById(normalizedClass.toLowerCase().replace(" ", ""))
          : null;
        if (classLevel) {
          setCurrentClassState(classLevel);
        } else {
          // Fallback to default if mapping fails
          const defaultClass = getClassLevelById(defaultClassId);
          if (defaultClass) {
            setCurrentClassState(defaultClass);
          }
        }
      } else {
        // No user class, use default
        const defaultClass = getClassLevelById(defaultClassId);
        if (defaultClass) {
          setCurrentClassState(defaultClass);
        }
      }

      // Read term from localStorage (session-based)
      const savedTermId = localStorage.getItem("fastlearner-current-term");
      if (savedTermId) {
        const savedTerm = getTermById(savedTermId);
        if (savedTerm) {
          setCurrentTermState(savedTerm);
        } else if (defaultTerm) {
          setCurrentTermState(defaultTerm);
        }
      } else if (defaultTerm) {
        setCurrentTermState(defaultTerm);
      }

      setIsLoading(false);
    };

    initializeDefaults();
  }, [defaultClassId, defaultTermId]);

  // Sync with profile changes
  useEffect(() => {
    if (userClass) {
      // Normalize class string from API (SS1 → SSS1, etc.)
      const normalizedClass = normalizeClassString(userClass);
      const classLevel = normalizedClass
        ? getClassLevelById(normalizedClass.toLowerCase().replace(" ", ""))
        : null;
      if (classLevel) {
        setCurrentClassState(classLevel);
      }
    }
  }, [userClass]);

  // Save term to localStorage when changed
  useEffect(() => {
    if (currentTerm) {
      localStorage.setItem("fastlearner-current-term", currentTerm.id);
    }
  }, [currentTerm]);

  // Get available subjects based on current class
  const availableSubjects = currentClass
    ? getSubjectsForClass(currentClass.id)
    : [];

  // Get current academic year (simplified logic)
  const academicYear = "2024/2025"; // This could be computed based on current date

  const setCurrentClass = (classLevel: ClassLevel) => {
    setCurrentClassState(classLevel);
    // Update auth store profile to keep in sync
    useAuthStore.getState().updateUserProfile({ class: classLevel.name });
  };

  const setCurrentTerm = (term: Term) => {
    setCurrentTermState(term);
  };

  const value: AcademicContextType = {
    currentClass,
    currentTerm,
    availableClasses: classLevels,
    availableTerms: terms,
    availableSubjects,
    setCurrentClass,
    setCurrentTerm,
    isLoading,
    academicYear,
  };

  return (
    <AcademicContext.Provider value={value}>
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademicContext() {
  const context = useContext(AcademicContext);
  if (context === undefined) {
    throw new Error(
      "useAcademicContext must be used within an AcademicProvider",
    );
  }
  return context;
}

// Hook for getting subjects filtered by current class
export function useCurrentSubjects() {
  const { currentClass, availableSubjects, isLoading } = useAcademicContext();

  return {
    subjects: availableSubjects,
    classLevel: currentClass,
    isLoading,
  };
}

// Hook for academic context display
export function useAcademicDisplay() {
  const { currentClass, currentTerm, academicYear } = useAcademicContext();

  return {
    classDisplay: currentClass?.name || "No Class Selected",
    termDisplay: currentTerm?.shortName || "No Term Selected",
    fullDisplay:
      currentClass && currentTerm
        ? `${currentClass.name} - ${currentTerm.shortName} (${academicYear})`
        : "Select Class and Term",
    academicYear,
  };
}
