"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SubjectCard from "./subject-card";
import { Subject } from "@/lib/types/subjects";
import { compulsorySchema } from "@/lib/validations/subjects";
import type { z } from "zod";

type CompulsoryFormData = z.infer<typeof compulsorySchema>;

interface CompulsorySelectorProps {
  subjects: Subject[];
  selectedId?: number;
  onSave: (id: number) => Promise<void>;
  isLoading: boolean;
}

const CompulsorySelector: React.FC<CompulsorySelectorProps> = ({
  subjects,
  selectedId,
  onSave,
  isLoading,
}) => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<string>(selectedId?.toString() || "");

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CompulsoryFormData>({
    resolver: zodResolver(compulsorySchema),
    defaultValues: { subject: selectedId || 0 },
  });

  const handleSelect = (id: string) => {
    setSelected(id);
    setValue("subject", parseInt(id));
  };

  const onSubmit = async (data: CompulsoryFormData) => {
    try {
      await onSave(data.subject);
      toast({
        title: "Success",
        description: "Compulsory subject selected successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save selection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectedCount = selected ? 1 : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-heading text-xl text-foreground">Select your Religious Study (1 required)</h2>
        <p className="text-sm text-muted-foreground">{selectedCount}/1 Selected</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <RadioGroup
          value={selected}
          onValueChange={handleSelect}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {subjects.map((subject) => (
            <div key={subject.id} className="relative">
              <RadioGroupItem
                value={subject.id.toString()}
                id={`subject-${subject.id}`}
                className="sr-only"
              />
              <label htmlFor={`subject-${subject.id}`} className="block">
                <SubjectCard
                  subject={subject}
                  isSelected={selected === subject.id.toString()}
                  onSelect={() => handleSelect(subject.id.toString())}
                  disabled={isLoading}
                />
              </label>
            </div>
          ))}
        </RadioGroup>
        {errors.subject && (
          <p className="text-sm text-destructive">{errors.subject.message}</p>
        )}
        <Button
          type="submit"
          variant="default"
          disabled={!selected || isLoading}
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save Selection"}
        </Button>
      </form>
    </div>
  );
};

export default CompulsorySelector;