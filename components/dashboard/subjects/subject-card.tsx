import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { cardVariants } from "@/lib/utils/aceternity";
import { Check, Book } from "lucide-react";

interface Subject {
  id: number;
  name: string;
}

interface SubjectCardProps {
  subject: Subject;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  isSelected,
  onSelect,
  disabled = false,
}) => {
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
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover={disabled ? undefined : "hover"}
      className={cn(
        "w-full cursor-pointer transition-colors",
        isSelected && "border-primary bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-selected={isSelected}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Select ${subject.name}`}
    >
      <Card className="h-full border-2">
        <CardHeader className="flex items-center justify-between pb-2">
          <Book className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          {isSelected && (
            <Check className="h-5 w-5 text-primary" aria-hidden="true" />
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <CardTitle className="text-center text-sm md:text-base">
            {subject.name}
          </CardTitle>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubjectCard;