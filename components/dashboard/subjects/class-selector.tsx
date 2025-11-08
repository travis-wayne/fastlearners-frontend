"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { cardVariants } from "@/lib/utils/aceternity";
import { Check, GraduationCap } from "lucide-react";
import type { Class } from "@/lib/types/subjects";

interface ClassSelectorProps {
  classes: Class[];
  selectedClassId?: number;
  onSelect: (classId: number) => void;
  isLoading?: boolean;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  selectedClassId,
  onSelect,
  isLoading = false,
}) => {
  const [selected, setSelected] = useState<number | undefined>(selectedClassId);

  const handleSelect = (classId: number) => {
    if (isLoading) return;
    setSelected(classId);
    onSelect(classId);
  };

  const getClassLevel = (className: string): 'JSS' | 'SSS' => {
    return className.startsWith('JSS') ? 'JSS' : 'SSS';
  };

  const getClassDisplay = (className: string): string => {
    return className;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-heading text-xl text-foreground mb-2">
          Select Your Class
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose your current class level to proceed with subject selection
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem) => {
          const isSelected = selected === classItem.id;
          const classLevel = getClassLevel(classItem.name);
          const displayName = getClassDisplay(classItem.name);

          return (
            <motion.div
              key={classItem.id}
              variants={cardVariants}
              initial="initial"
              whileHover={isLoading ? undefined : "hover"}
              className={cn(
                "w-full cursor-pointer transition-colors",
                isSelected && "border-primary bg-primary/5",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleSelect(classItem.id)}
              onKeyDown={(e) => {
                if (!isLoading && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  handleSelect(classItem.id);
                }
              }}
              role="button"
              tabIndex={isLoading ? -1 : 0}
              aria-label={`Select ${displayName}`}
              aria-selected={isSelected}
            >
              <Card className="h-full border-2 transition-all">
                <CardHeader className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap 
                      className={cn(
                        "h-5 w-5",
                        classLevel === 'JSS' ? "text-blue-500" : "text-purple-500"
                      )} 
                      aria-hidden="true" 
                    />
                    <span className={cn(
                      "text-xs font-semibold px-2 py-1 rounded",
                      classLevel === 'JSS' 
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    )}>
                      {classLevel}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="h-5 w-5 text-primary" aria-hidden="true" />
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <CardTitle className="text-center text-lg md:text-xl">
                    {displayName}
                  </CardTitle>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      {selected && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-semibold text-foreground">
              {classes.find(c => c.id === selected)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassSelector;

