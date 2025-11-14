"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  academicTerms,
  disciplines,
  getClassCategory,
} from "@/data/subjects-metadata";
import { ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateProfile } from "@/lib/api/subjects";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const classes = [
  { value: "JSS1", label: "JSS 1", category: "jss" },
  { value: "JSS2", label: "JSS 2", category: "jss" },
  { value: "JSS3", label: "JSS 3", category: "jss" },
  { value: "SSS1", label: "SSS 1", category: "sss" },
  { value: "SSS2", label: "SSS 2", category: "sss" },
  { value: "SSS3", label: "SSS 3", category: "sss" },
];

interface AcademicSetupFormProps {
  token?: string; // Optional token for direct API calls (server-side)
  onComplete: () => void;
}

export function AcademicSetupForm({
  token,
  onComplete,
}: AcademicSetupFormProps) {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const category = getClassCategory(selectedClass);
  const isSSS = category === "sss";
  const canSubmit =
    selectedClass && selectedTerm && (!isSSS || selectedDiscipline);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    // Validate discipline if SSS class
    if (isSSS && selectedDiscipline) {
      const validDisciplines = ["Art", "Commercial", "Science"];
      if (!validDisciplines.includes(selectedDiscipline)) {
        toast.error(
          `Invalid discipline. Must be one of: ${validDisciplines.join(", ")}`,
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // If token is provided, use direct API call
      if (token) {
        await updateProfile(token, {
          class: selectedClass,
          discipline: isSSS ? selectedDiscipline : undefined,
        });
      } else {
        // Otherwise use internal API route
        const response = await fetch("/api/profile/edit", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            class: selectedClass,
            discipline: isSSS ? selectedDiscipline : undefined,
          }),
        });

        if (!response.ok) {
          const error = await response.json();

          // Extract validation errors if present
          if (error.errors) {
            const errorMessages = Object.entries(error.errors)
              .map(([field, messages]) => {
                const msgArray = Array.isArray(messages)
                  ? messages
                  : [messages];
                return `${field}: ${msgArray.join(", ")}`;
              })
              .join("; ");
            throw new Error(
              errorMessages || error.message || "Validation failed",
            );
          }

          throw new Error(error.message || "Failed to update profile");
        }
      }

      // Store term in localStorage (not sent to backend)
      // Use the same key as AcademicProvider expects: 'fastlearner-current-term'
      if (selectedTerm) {
        localStorage.setItem("fastlearner-current-term", selectedTerm);
      }

      toast.success("Academic profile updated!");

      // Reload page to show next step
      if (onComplete) {
        onComplete();
      } else {
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Setup</CardTitle>
        <CardDescription>
          Set up your class, term, and discipline to begin subject registration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Class Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Select Your Class</Label>
          <RadioGroup value={selectedClass} onValueChange={setSelectedClass}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {classes.map((cls) => (
                <div key={cls.value}>
                  <RadioGroupItem
                    value={cls.value}
                    id={cls.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={cls.value}
                    className="flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-all hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <span className="font-semibold">{cls.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Discipline Selection (SSS Only) */}
        {isSSS && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Select Your Discipline
            </Label>
            <RadioGroup
              value={selectedDiscipline}
              onValueChange={setSelectedDiscipline}
            >
              <div className="space-y-3">
                {disciplines.map((disc) => (
                  <div key={disc.value}>
                    <RadioGroupItem
                      value={disc.value}
                      id={disc.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={disc.value}
                      className="flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <span className="text-3xl">{disc.icon}</span>
                      <div>
                        <div className="font-semibold">{disc.label}</div>
                        <p className="text-sm text-muted-foreground">
                          {disc.description}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Term Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Select Current Term</Label>
          <RadioGroup value={selectedTerm} onValueChange={setSelectedTerm}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {academicTerms.map((term) => (
                <div key={term.id}>
                  <RadioGroupItem
                    value={term.id}
                    id={`term-${term.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`term-${term.id}`}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-4 transition-all hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <span className="font-semibold">{term.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {term.description}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          size="lg"
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Continue to Subject Selection
              <ChevronRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
