"use client";

import React from "react";
import { motion } from "framer-motion";
import { Book, Check } from "lucide-react";

import type { Subject } from "@/lib/types/subjects";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SubjectCardProps {
  subject: Subject;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function SubjectCard({
  subject,
  isSelected,
  onSelect,
  disabled = false,
}: SubjectCardProps) {
  const handleClick = () => {
    if (!disabled) {
      onSelect();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={disabled ? undefined : { scale: 1.02, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={cn(
        "w-full cursor-pointer text-left transition-colors",
        isSelected && "border-primary bg-primary/5",
        disabled && "cursor-not-allowed opacity-50",
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      disabled={disabled}
      aria-label={`Select ${subject.name}`}
    >
      <Card className="h-full border-2 transition-all hover:shadow-md">
        <CardHeader className="flex items-center justify-between pb-2">
          <Book className="size-5 text-muted-foreground" aria-hidden="true" />
          {isSelected && (
            <Check className="size-5 text-primary" aria-hidden="true" />
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <h3 className="text-center text-sm font-medium md:text-base">
            {subject.name}
          </h3>
        </CardContent>
      </Card>
    </motion.button>
  );
}
