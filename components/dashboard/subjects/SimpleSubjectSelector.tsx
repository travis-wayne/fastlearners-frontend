"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { AlertCircle, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getStudentSubjects } from "@/lib/api/subjects";
import type { SubjectsContent } from "@/lib/types/subjects";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SimpleSubjectSelector() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectsData, setSubjectsData] = useState<SubjectsContent | null>(
    null,
  );

  // Selection state
  const [selectedCompulsory, setSelectedCompulsory] = useState<number | null>(
    null,
  );
  const [selectedSelective, setSelectedSelective] = useState<number[]>([]);

  // Check if user is in JSS class
  const isJSS = user?.class?.toUpperCase().startsWith("JSS") ?? false;
  const requiredSelectiveCount = 4; // Always 4 according to docs

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      // Fetch subjects from API endpoint: GET /api/v1/subjects
      // Returns: subjects, compulsory_selective, selective, and their statuses
      const response = await getStudentSubjects();
      if (response.success && response.content) {
        setSubjectsData(response.content);

        // If compulsory selective is already selected, we can't determine which one
        // So we leave it as null and let the user see the status
        setSelectedCompulsory(null);
        setSelectedSelective([]);
      } else {
        toast.error(response.message || "Failed to fetch subjects");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load subjects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompulsorySelect = (subjectId: number) => {
    if (subjectsData?.compulsory_selective_status === "selected") {
      toast.info("Compulsory selective subject has already been selected");
      return;
    }
    setSelectedCompulsory(subjectId);
  };

  const handleSelectiveToggle = (subjectId: number) => {
    if (subjectsData?.selective_status === "selected") {
      toast.info("Selective subjects have already been selected");
      return;
    }

    setSelectedSelective((prev) => {
      if (prev.includes(subjectId)) {
        // Deselect
        return prev.filter((id) => id !== subjectId);
      } else {
        // Select (max 4)
        if (prev.length >= requiredSelectiveCount) {
          toast.warning(
            `You can only select ${requiredSelectiveCount} subjects`,
          );
          return prev;
        }
        return [...prev, subjectId];
      }
    });
  };

  const handleSubmitCompulsory = async () => {
    if (!selectedCompulsory) {
      toast.error("Please select a religious study subject");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "/api/subjects/update-compulsory-selective",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ subject: selectedCompulsory }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update compulsory selective subject",
        );
      }

      toast.success("Compulsory selective subject saved successfully!");
      await fetchSubjects(); // Refresh to get updated status
    } catch (error: any) {
      toast.error(error.message || "Failed to save selection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSelective = async () => {
    if (selectedSelective.length !== requiredSelectiveCount) {
      toast.error(`Please select exactly ${requiredSelectiveCount} subjects`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/subjects/update-selective", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ subjects: selectedSelective }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update selective subjects");
      }

      toast.success("Selective subjects saved successfully!");
      await fetchSubjects(); // Refresh to get updated status
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save selection");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="mr-2 size-6 animate-spin text-primary" />
          <span>Loading subjects...</span>
        </CardContent>
      </Card>
    );
  }

  if (!subjectsData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>
          Failed to load subjects. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const compulsoryComplete =
    subjectsData.compulsory_selective_status === "selected";
  const selectiveComplete = subjectsData.selective_status === "selected";

  return (
    <div className="space-y-6">
      {/* Compulsory Selective Section - Only for JSS */}
      {isJSS && subjectsData.compulsory_selective.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Compulsory Selective Subject</CardTitle>
                <CardDescription>
                  Select ONE religious study subject (Required for JSS classes)
                </CardDescription>
              </div>
              {compulsoryComplete && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="mr-1 size-4" />
                  Completed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {compulsoryComplete ? (
              <Alert>
                <CheckCircle2 className="size-4" />
                <AlertDescription>
                  Your compulsory selective subject has been selected and cannot
                  be changed.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  {subjectsData.compulsory_selective.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => handleCompulsorySelect(subject.id)}
                      className={`rounded-lg border-2 p-4 text-left transition-all ${
                        selectedCompulsory === subject.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      } `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subject.name}</span>
                        {selectedCompulsory === subject.id && (
                          <CheckCircle2 className="size-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleSubmitCompulsory}
                  disabled={!selectedCompulsory || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Compulsory Selective Subject"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selective Subjects Section */}
      {subjectsData.selective.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Selective Subjects</CardTitle>
                <CardDescription>
                  Select exactly {requiredSelectiveCount} subjects from the list
                  below
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {selectiveComplete && (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="mr-1 size-4" />
                    Completed
                  </Badge>
                )}
                {!selectiveComplete && (
                  <Badge variant="secondary" className="px-3 py-1 text-lg">
                    {selectedSelective.length}/{requiredSelectiveCount}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectiveComplete ? (
              <Alert>
                <CheckCircle2 className="size-4" />
                <AlertDescription>
                  Your selective subjects have been selected and cannot be
                  changed.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {selectedSelective.length < requiredSelectiveCount && (
                  <Alert>
                    <AlertCircle className="size-4" />
                    <AlertDescription>
                      Please select{" "}
                      {requiredSelectiveCount - selectedSelective.length} more
                      subject(s)
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {subjectsData.selective.map((subject) => {
                    const isSelected = selectedSelective.includes(subject.id);
                    const isDisabled =
                      !isSelected &&
                      selectedSelective.length >= requiredSelectiveCount;

                    return (
                      <button
                        key={subject.id}
                        onClick={() => handleSelectiveToggle(subject.id)}
                        disabled={isDisabled}
                        className={`rounded-lg border-2 p-4 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : isDisabled
                              ? "cursor-not-allowed border-border opacity-50"
                              : "border-border hover:border-primary/50"
                        } `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{subject.name}</span>
                          {isSelected ? (
                            <CheckCircle2 className="size-5 text-primary" />
                          ) : (
                            <Circle className="size-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button
                  onClick={handleSubmitSelective}
                  disabled={
                    selectedSelective.length !== requiredSelectiveCount ||
                    isSubmitting
                  }
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 size-4" />
                      Save Selective Subjects ({selectedSelective.length}/
                      {requiredSelectiveCount})
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {(compulsoryComplete || selectiveComplete) && (
        <Alert>
          <CheckCircle2 className="size-4" />
          <AlertDescription>
            {compulsoryComplete && selectiveComplete
              ? "All subject selections are complete!"
              : compulsoryComplete
                ? "Compulsory selective subject is complete. Please select your selective subjects."
                : "Selective subjects are complete. Please select your compulsory selective subject if applicable."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
