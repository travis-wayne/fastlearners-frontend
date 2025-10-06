"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  ClassLevel,
  classLevels,
  getClassLevelById,
  getSubjectsForClass,
  getTermById,
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

  // Initialize with defaults
  useEffect(() => {
    const initializeDefaults = () => {
      const defaultClass = getClassLevelById(defaultClassId);
      const defaultTerm = getTermById(defaultTermId);

      if (defaultClass) {
        setCurrentClassState(defaultClass);
      }

      if (defaultTerm) {
        setCurrentTermState(defaultTerm);
      }

      setIsLoading(false);
    };

    initializeDefaults();
  }, [defaultClassId, defaultTermId]);

  // Load from localStorage if available
  useEffect(() => {
    const savedClassId = localStorage.getItem("fastlearner-current-class");
    const savedTermId = localStorage.getItem("fastlearner-current-term");

    if (savedClassId) {
      const savedClass = getClassLevelById(savedClassId);
      if (savedClass) {
        setCurrentClassState(savedClass);
      }
    }

    if (savedTermId) {
      const savedTerm = getTermById(savedTermId);
      if (savedTerm) {
        setCurrentTermState(savedTerm);
      }
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (currentClass) {
      localStorage.setItem("fastlearner-current-class", currentClass.id);
    }
  }, [currentClass]);

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
