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
import { WeekItem } from "@/lib/types/subjects";

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

  // Raw API IDs and metadata for backend service integration
  currentClassApiId: number | null;
  currentTermApiId: number | null;
  availableWeeks: WeekItem[];
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

  // Raw API state
  const [apiClasses, setApiClasses] = useState<any[]>([]);
  const [apiTerms, setApiTerms] = useState<any[]>([]);
  const [apiWeeks, setApiWeeks] = useState<WeekItem[]>([]);
  const [currentClassApiId, setCurrentClassApiId] = useState<number | null>(null);
  const [currentTermApiId, setCurrentTermApiId] = useState<number | null>(null);
  
  // Live metadata state
  const [liveClasses, setLiveClasses] = useState<ClassLevel[]>([]);
  const [liveTerms, setLiveTerms] = useState<Term[]>([]);

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

      // EXTENSION: Fetch live API data for all metadata (Step 3 of migration)
      const fetchLiveApiData = async () => {
        try {
          const { getStudentClass, getStudentClasses, getStudentTerms, getStudentWeeks } = await import("@/lib/api/student");
          
          const [classRes, classesRes, termsRes, weeksRes] = await Promise.all([
            getStudentClass(),
            getStudentClasses(),
            getStudentTerms(),
            getStudentWeeks()
          ]);

          if (classRes.success && classRes.content) {
            setCurrentClassApiId(classRes.content.class_id);
          }

          let mappedClasses: ClassLevel[] = [];
          if (classesRes.success && classesRes.content) {
            const apiClassesList = classesRes.content.classes;
            setApiClasses(apiClassesList);
            
            // Verbatim mapping logic: API ClassItem -> Context ClassLevel
            mappedClasses = apiClassesList.map(c => ({
              id: c.id.toString(),
              name: c.name,
              stage: c.name.toLowerCase().startsWith('j') ? 'jss' as const : c.name.toLowerCase().startsWith('s') ? 'sss' as const : 'primary' as const,
              level: parseInt(c.name.match(/\d+/)?.at(0) || '1'),
              description: '',
              track: null
            }));
            setLiveClasses(mappedClasses);
          }

          let mappedTerms: Term[] = [];
          if (termsRes.success && termsRes.content) {
            const apiTermsList = termsRes.content.terms;
            setApiTerms(apiTermsList);
            
            // Verbatim mapping logic: API TermItem -> Context Term
            mappedTerms = apiTermsList.map(t => ({
              id: `term${t.id}`,
              name: `${t.name} Term`,
              shortName: `${t.id}${t.id === 1 ? 'st' : t.id === 2 ? 'nd' : 'rd'} Term`,
              order: t.id,
              description: '',
              typicalDuration: ''
            }));
            setLiveTerms(mappedTerms);
            
            // Map the already resolved currentTerm (from config) to API id
            const resolvedTerm = useAuthStore.getState().user ? 
              (getTermById(localStorage.getItem("fastlearner-current-term") || defaultTermId) || defaultTerm) : defaultTerm;

            if (resolvedTerm) {
              const apiName = resolvedTerm.name.split(" ")[0]; // "First Term" -> "First"
              const apiTerm = apiTermsList.find(t => t.name === apiName);
              if (apiTerm) {
                setCurrentTermApiId(apiTerm.id);
              }
            }
          }

          if (weeksRes.success && weeksRes.content) {
            setApiWeeks(weeksRes.content.weeks);
          }

          // RESOLUTION: Sync current items with newly loaded live metadata
          if (mappedClasses.length > 0) {
            const user = useAuthStore.getState().user;
            if (user?.class) {
              const normalizedClass = normalizeClassString(user.class);
              const targetName = normalizedClass || user.class;
              const liveClass = mappedClasses.find(c => c.name === targetName);
              if (liveClass) setCurrentClassState(liveClass);
            }
          }
          
          if (mappedTerms.length > 0) {
            const savedTermId = localStorage.getItem("fastlearner-current-term");
            if (savedTermId) {
              const liveTerm = mappedTerms.find(t => t.id === savedTermId);
              if (liveTerm) setCurrentTermState(liveTerm);
            }
          }

        } catch (err) {
          console.error("Failed to fetch live academic metadata:", err);
        }
      };

      fetchLiveApiData();
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
    
    // Sync currentTermApiId
    const apiName = term.name.split(" ")[0]; // "First Term" -> "First"
    const apiTerm = apiTerms.find(t => t.name === apiName);
    if (apiTerm) {
      setCurrentTermApiId(apiTerm.id);
    } else {
      setCurrentTermApiId(null);
    }
  };

  const value: AcademicContextType = {
    currentClass,
    currentTerm,
    availableClasses: liveClasses.length > 0 ? liveClasses : classLevels,
    availableTerms: liveTerms.length > 0 ? liveTerms : terms,
    availableSubjects,
    setCurrentClass,
    setCurrentTerm,
    isLoading,
    academicYear,
    currentClassApiId,
    currentTermApiId,
    availableWeeks: apiWeeks,
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
