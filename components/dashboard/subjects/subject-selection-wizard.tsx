"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import ClassSelector from "./class-selector";
import { SubjectSelectionView } from "./SubjectSelectionView";
import StepIndicator from "./step-indicator";
import { CardSkeleton } from "@/components/shared/card-skeleton";
import { getAvailableClasses, getStudentSubjects } from "@/lib/api/subjects";
import type { Class } from "@/lib/types/subjects";

interface SubjectSelectionWizardProps {
  onComplete?: () => void;
  initialStep?: number;
}

const steps = [
  { id: 1, title: "Class Selection", description: "Select your class" },
  { id: 2, title: "Subject Selection", description: "Choose your subjects" },
];

export const SubjectSelectionWizard: React.FC<SubjectSelectionWizardProps> = ({
  onComplete,
  initialStep = 1,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classesError, setClassesError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Fetch available classes - try from subjects API first, then fallback to lessons
  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      setClassesError(null);
      try {
        // First try to get classes from subjects API (if available)
        // For now, we'll infer classes from user data or use a default set
        // If the API doesn't provide classes, we can infer from the user's class
        const subjectsResult = await getStudentSubjects();
        
        // If we can't get classes from API, create a default set based on common classes
        const defaultClasses: Class[] = [
          { id: 1, name: 'JSS1' },
          { id: 2, name: 'JSS2' },
          { id: 3, name: 'JSS3' },
          { id: 4, name: 'SSS1' },
          { id: 5, name: 'SSS2' },
          { id: 6, name: 'SSS3' },
        ];

        // Try to get classes from lessons API
        try {
          const classesResult = await getAvailableClasses();
          if (classesResult.success && classesResult.content?.classes.length > 0) {
            setClasses(classesResult.content.classes);
          } else {
            setClasses(defaultClasses);
          }
        } catch {
          // Fallback to default classes if lessons API fails
          setClasses(defaultClasses);
        }
      } catch (err) {
        // Even if everything fails, provide default classes
        setClasses([
          { id: 1, name: 'JSS1' },
          { id: 2, name: 'JSS2' },
          { id: 3, name: 'JSS3' },
          { id: 4, name: 'SSS1' },
          { id: 5, name: 'SSS2' },
          { id: 6, name: 'SSS3' },
        ]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassSelect = (classId: number) => {
    const selected = classes.find(c => c.id === classId);
    if (selected) {
      setSelectedClass(selected);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedClass) {
      setCompletedSteps([...completedSteps, 1]);
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setCompletedSteps(completedSteps.filter(s => s !== 2));
    }
  };

  const handleSubjectComplete = () => {
    setCompletedSteps([...completedSteps, 2]);
    if (onComplete) {
      onComplete();
    }
  };

  if (loadingClasses) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
            Subject Selection
          </h1>
        </div>
        <div className="grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (classesError) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
            Subject Selection
          </h1>
        </div>
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">{classesError}</p>
          <Button onClick={() => window.location.reload()} variant="default">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
            Subject Selection
          </h1>
          <p className="text-muted-foreground">
            Follow the steps below to complete your subject selection
          </p>
        </div>
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-6">
            <ClassSelector
              classes={classes}
              selectedClassId={selectedClass?.id}
              onSelect={handleClassSelect}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!selectedClass}
                className="min-w-[120px]"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            {selectedClass && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  Selected Class: <span className="font-semibold text-foreground">
                    {selectedClass.name}
                  </span>
                </p>
              </div>
            )}
            <SubjectSelectionView 
              selectedClass={selectedClass}
              onComplete={handleSubjectComplete}
            />
            <div className="flex justify-between">
              <Button
                onClick={handleBack}
                variant="outline"
                className="min-w-[120px]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

