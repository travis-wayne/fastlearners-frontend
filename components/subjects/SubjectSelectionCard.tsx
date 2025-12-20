"use client";

import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";

interface SubjectSelectionCardProps {
  id: number;
  name: string;
  isSelected: boolean;
  isDisabled?: boolean;
  selectionType: "radio" | "checkbox";
  onClick: (id: number) => void;
}

export function SubjectSelectionCard({
  id,
  name,
  isSelected,
  isDisabled = false,
  selectionType,
  onClick,
}: SubjectSelectionCardProps) {
  return (
    <button
      type="button"
      onClick={() => !isDisabled && onClick(id)}
      disabled={isDisabled}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isSelected
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border hover:border-primary/50 hover:bg-muted/50",
        isDisabled && "cursor-not-allowed opacity-50"
      )}
    >
      {/* Selection Indicator */}
      <div
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selectionType === "checkbox" && "rounded",
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 group-hover:border-primary/50"
        )}
      >
        {isSelected && <Check className="size-3" strokeWidth={3} />}
      </div>

      {/* Subject Name */}
      <span
        className={cn(
          "font-medium transition-colors",
          isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
        )}
      >
        {name}
      </span>

      {/* Selected Badge */}
      {isSelected && (
        <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
          Selected
        </span>
      )}
    </button>
  );
}
