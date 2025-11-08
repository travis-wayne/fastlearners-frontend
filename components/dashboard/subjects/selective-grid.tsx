"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { BentoGrid } from "@/components/ui/bento-grid"; // Assuming BentoGrid is available from Aceternity UI
import SubjectCard from "./subject-card";
import type { Subject } from "@/lib/types/subjects";
import { getSelectiveSchema } from "@/lib/validations/subjects";

interface SelectiveGridProps {
  subjects: Subject[];
  selectedIds: number[];
  limit: 4 | 5;
  onSave: (ids: number[]) => Promise<void>;
  isLoading: boolean;
  classLevel: "JSS" | "SSS";
}

const SelectiveGrid: React.FC<SelectiveGridProps> = ({
  subjects,
  selectedIds: initialSelectedIds,
  limit,
  onSave,
  isLoading,
  classLevel,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedIds(initialSelectedIds);
  }, [initialSelectedIds]);

  const schema = getSelectiveSchema(limit);
  const validation = schema.safeParse({ subjects: selectedIds });
  const isValid = validation.success;

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < limit
        ? [...prev, id]
        : prev
    );
  };

  const handleSave = async () => {
    if (!isValid) return;
    try {
      await onSave(selectedIds);
      toast({
        title: "Success",
        description: "Subjects saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save subjects. Please try again.",
        variant: "destructive",
      });
    }
  };

  const headerText =
    classLevel === "JSS"
      ? "Choose your Electives (4 required)"
      : "Discipline Selective Subjects (5 required)";

  const progressValue = (selectedIds.length / limit) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl text-foreground mb-2">{headerText}</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {selectedIds.length}/{limit} Selected
          </span>
          <Progress value={progressValue} className="flex-1 max-w-xs" />
        </div>
      </div>
      <BentoGrid className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            isSelected={selectedIds.includes(subject.id)}
            onSelect={() => toggleSelection(subject.id)}
            disabled={
              isLoading || (selectedIds.length >= limit && !selectedIds.includes(subject.id))
            }
          />
        ))}
      </BentoGrid>
      <Button
        onClick={handleSave}
        disabled={!isValid || isLoading}
        className="w-full"
      >
        {isLoading ? "Saving..." : "Save Selection"}
      </Button>
    </div>
  );
};

export default SelectiveGrid;