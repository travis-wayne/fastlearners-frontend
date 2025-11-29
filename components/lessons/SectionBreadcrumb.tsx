import { CheckCircle2, Circle, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLessonsStore } from "@/lib/store/lessons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SectionBreadcrumbProps {
  lessonId: number;
  concepts: any[];
  currentStepIndex: number;
  onNavigate: (stepIndex: number) => void;
}

export function SectionBreadcrumb({
  lessonId,
  concepts,
  currentStepIndex,
  onNavigate,
}: SectionBreadcrumbProps) {
  const { sectionProgress } = useLessonsStore();

  // Define all sections
  const sections = [
    { id: 'overview', title: 'Overview', stepIndex: 0 },
    ...concepts.map((concept, index) => ({
      id: `concept_${concept.id}`,
      title: concept.title || `Concept ${index + 1}`,
      stepIndex: index + 1,
    })),
    { id: 'summary_application', title: 'Summary', stepIndex: concepts.length + 1 },
    { id: 'general_exercises', title: 'Practice', stepIndex: concepts.length + 2 },
  ];

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex items-center gap-2 pb-2">
        {sections.map((section, index) => {
          const progress = sectionProgress[section.id];
          const isCompleted = progress?.isCompleted;
          const isCurrent = section.stepIndex === currentStepIndex;
          const isAccessible = isCompleted || isCurrent || index === 0;

          return (
            <div key={section.id} className="flex items-center gap-2">
              <button
                onClick={() => isAccessible && onNavigate(section.stepIndex)}
                disabled={!isAccessible}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isCurrent && "bg-primary text-primary-foreground shadow-sm",
                  isCompleted && !isCurrent && "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300",
                  !isCompleted && !isCurrent && isAccessible && "bg-muted text-muted-foreground hover:bg-muted/80",
                  !isAccessible && "cursor-not-allowed bg-muted text-muted-foreground opacity-50"
                )}
              >
                {isCompleted && <CheckCircle2 className="size-4" />}
                {isCurrent && !isCompleted && <Circle className="size-4" />}
                {!isCompleted && !isCurrent && !isAccessible && <Lock className="size-4" />}
                {!isCompleted && !isCurrent && isAccessible && <Circle className="size-4 opacity-50" />}
                <span>{section.title}</span>
                {isCompleted && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {progress.score ? `${progress.score}%` : '✓'}
                  </Badge>
                )}
              </button>

              {index < sections.length - 1 && (
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
