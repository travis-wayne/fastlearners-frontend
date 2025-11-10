"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Circle, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

import {
  classLevels,
  academicTerms,
  getCoreSubjects,
  getElectiveSubjects,
  getRequirements,
  validateSubjectSelection,
  type Subject,
} from "@/data/subjects";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  classLevel: string;
  term: string;
  selectedSubjects: string[];
}

export function SubjectSetupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    classLevel: "",
    term: "",
    selectedSubjects: [],
  });

  // Get category based on selected class
  const category = formData.classLevel
    ? classLevels.find((c) => c.id === formData.classLevel)?.category
    : null;

  // Get subjects based on category
  const coreSubjects = category ? getCoreSubjects(category) : [];
  const electiveSubjects = category ? getElectiveSubjects(category) : [];
  const requirements = category ? getRequirements(category) : null;

  // Calculate progress
  const coreSelectedCount = formData.selectedSubjects.filter((id) =>
    coreSubjects.some((s) => s.id === id)
  ).length;
  const electiveSelectedCount = formData.selectedSubjects.length - coreSelectedCount;
  const totalProgress = requirements
    ? (formData.selectedSubjects.length / requirements.total) * 100
    : 0;

  // Step 1: Class & Term Selection
  const handleStep1 = () => {
    if (!formData.classLevel || !formData.term) {
      toast.error("Please select both class and term");
      return;
    }
    setCurrentStep(2);
  };

  // Step 2: Core Subjects Selection
  const handleStep2 = () => {
    if (!requirements) return;

    const selectedCore = formData.selectedSubjects.filter((id) =>
      coreSubjects.some((s) => s.id === id)
    );

    if (selectedCore.length !== requirements.core) {
      toast.error(`Please select all ${requirements.core} core subjects`);
      return;
    }

    setCurrentStep(3);
  };

  // Step 3: Elective Subjects Selection
  const handleStep3 = () => {
    if (!requirements) return;

    const validation = validateSubjectSelection(category!, formData.selectedSubjects);
    
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setCurrentStep(4);
  };

  // Step 4: Review & Submit
  const handleSubmit = async () => {
    if (!requirements) return;

    const validation = validateSubjectSelection(category!, formData.selectedSubjects);
    
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setIsSubmitting(true);

    try {
      // API call to backend
      // Note: Actual implementation uses two separate endpoints:
      // 1. POST /api/subjects/update-compulsory-selective (for JSS)
      // 2. POST /api/subjects/update-selective (for all selective subjects)
      // This is a simplified example - see SubjectSetupForm.tsx for the actual implementation
      const response = await fetch("/api/subjects/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class: formData.classLevel,
          term: formData.term,
          subjects: formData.selectedSubjects,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register subjects");
      }

      toast.success("Subjects registered successfully!");
      router.push("/dashboard/subjects");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register subjects. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle subject selection
  const toggleSubject = (subjectId: string, isCore: boolean) => {
    setFormData((prev) => {
      const isSelected = prev.selectedSubjects.includes(subjectId);

      if (isSelected) {
        // Don't allow deselecting core subjects in step 2
        if (isCore && currentStep === 2) {
          toast.warning("Core subjects are mandatory");
          return prev;
        }
        return {
          ...prev,
          selectedSubjects: prev.selectedSubjects.filter((id) => id !== subjectId),
        };
      } else {
        // Check if max subjects reached
        if (requirements && prev.selectedSubjects.length >= requirements.total) {
          toast.warning(`Maximum ${requirements.total} subjects allowed`);
          return prev;
        }
        return {
          ...prev,
          selectedSubjects: [...prev.selectedSubjects, subjectId],
        };
      }
    });
  };

  // Auto-select all core subjects when moving to step 2
  const autoSelectCoreSubjects = () => {
    const coreIds = coreSubjects.map((s) => s.id);
    setFormData((prev) => ({
      ...prev,
      selectedSubjects: [...new Set([...prev.selectedSubjects, ...coreIds])],
    }));
  };

  // Effect to auto-select core subjects
  useEffect(() => {
    if (currentStep === 2 && coreSubjects.length > 0) {
      autoSelectCoreSubjects();
    }
  }, [currentStep, coreSubjects]);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Subject Registration</h1>
            <p className="text-muted-foreground mt-1">
              Step {currentStep} of 4: {getStepTitle(currentStep)}
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {formData.selectedSubjects.length}/{requirements?.total || 0} Subjects
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={totalProgress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Core: {coreSelectedCount}/{requirements?.core || 0}
            </span>
            <span>
              Electives: {electiveSelectedCount}/{requirements?.elective || 0}
            </span>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 mt-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : step === currentStep
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground"
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{step}</span>
                )}
              </div>
              {step < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{getStepTitle(currentStep)}</CardTitle>
          <CardDescription>{getStepDescription(currentStep)}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Class & Term */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="class" className="text-base font-semibold">
                  Select Your Current Class
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {classLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          classLevel: level.id,
                          selectedSubjects: [], // Reset subjects on class change
                        }))
                      }
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.classLevel === level.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">{level.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {level.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="term" className="text-base font-semibold">
                  Select Current Term
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {academicTerms.map((term) => (
                    <button
                      key={term.id}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, term: term.id }))
                      }
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.term === term.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">{term.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {term.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Core Subjects */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  📚 Core subjects are mandatory for all students. These subjects have been
                  automatically selected for you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {coreSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    isSelected={formData.selectedSubjects.includes(subject.id)}
                    isDisabled={false}
                    onToggle={() => toggleSubject(subject.id, true)}
                    showCorebadge
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Elective Subjects */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  ✨ Select {requirements?.elective} elective subjects to complete your
                  registration. Core subjects are shown below but cannot be deselected.
                </p>
              </div>

              <div className="space-y-6">
                {/* Show selected core subjects (disabled) */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                    Your Core Subjects (Selected)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {coreSubjects
                      .filter((s) => formData.selectedSubjects.includes(s.id))
                      .map((subject) => (
                        <SubjectCard
                          key={subject.id}
                          subject={subject}
                          isSelected={true}
                          isDisabled={true}
                          onToggle={() => {}}
                          showCoreBadge
                        />
                      ))}
                  </div>
                </div>

                {/* Elective subjects */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Choose Your Electives ({electiveSelectedCount}/
                    {requirements?.elective})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {electiveSubjects.map((subject) => (
                      <SubjectCard
                        key={subject.id}
                        subject={subject}
                        isSelected={formData.selectedSubjects.includes(subject.id)}
                        isDisabled={false}
                        onToggle={() => toggleSubject(subject.id, false)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  ✅ Review your selections carefully. You can change these later from your
                  subject dashboard.
                </p>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Class</div>
                  <div className="font-semibold">
                    {classLevels.find((c) => c.id === formData.classLevel)?.displayName}
                  </div>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Term</div>
                  <div className="font-semibold">
                    {academicTerms.find((t) => t.id === formData.term)?.name}
                  </div>
                </div>
              </div>

              {/* Core Subjects */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Core Subjects
                  <Badge variant="secondary">{coreSelectedCount}</Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {coreSubjects
                    .filter((s) => formData.selectedSubjects.includes(s.id))
                    .map((subject) => (
                      <div
                        key={subject.id}
                        className="p-3 rounded-lg border bg-card flex items-center gap-3"
                      >
                        <span className="text-2xl">{subject.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{subject.name}</div>
                          <Badge variant="secondary" className="mt-1">
                            Core
                          </Badge>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                </div>
              </div>

              {/* Elective Subjects */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Elective Subjects
                  <Badge variant="secondary">{electiveSelectedCount}</Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {electiveSubjects
                    .filter((s) => formData.selectedSubjects.includes(s.id))
                    .map((subject) => (
                      <div
                        key={subject.id}
                        className="p-3 rounded-lg border bg-card flex items-center gap-3"
                      >
                        <span className="text-2xl">{subject.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{subject.name}</div>
                          <Badge variant="outline" className="mt-1">
                            Elective
                          </Badge>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as Step)}
          disabled={currentStep === 1 || isSubmitting}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep < 4 ? (
            <Button
              onClick={() => {
                if (currentStep === 1) handleStep1();
                else if (currentStep === 2) handleStep2();
                else if (currentStep === 3) handleStep3();
              }}
              disabled={isSubmitting}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm & Submit
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Subject Card Component
interface SubjectCardProps {
  subject: Subject;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
  showCoreBadge?: boolean;
}

function SubjectCard({
  subject,
  isSelected,
  isDisabled,
  onToggle,
  showCoreTag,
}: SubjectCardProps) {
  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={`p-4 rounded-lg border-2 text-left transition-all ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-muted hover:border-primary/50"
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{subject.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-semibold truncate">{subject.name}</h4>
            {isSelected ? (
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {subject.description}
          </p>
          {showCoreTag && (
            <Badge variant="secondary" className="mt-2">
              Core Subject
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

// Helper functions
function getStepTitle(step: Step): string {
  const titles = {
    1: "Academic Information",
    2: "Core Subjects",
    3: "Elective Subjects",
    4: "Review & Confirm",
  };
  return titles[step];
}

function getStepDescription(step: Step): string {
  const descriptions = {
    1: "Select your current class and academic term",
    2: "These are mandatory subjects for all students",
    3: "Choose additional subjects based on your interests",
    4: "Review your selections before submitting",
  };
  return descriptions[step];
}
