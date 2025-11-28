import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Concept } from "@/lib/types/lessons";
import { ExerciseCard } from "../ExerciseCard";

interface LessonConceptProps {
  concept: Concept;
  onAnswerExercise?: (exerciseId: number, answer: string) => Promise<any>;
}

interface ExampleCardProps {
  example: any;
  index: number;
}

function ExampleCard({ example, index }: ExampleCardProps) {
  return (
    <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800/30 dark:bg-emerald-900/10">
      <CardContent className="pt-6">
        <div className="mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <span className="font-bold">Example {index + 1}</span>
        </div>
        <div className="space-y-4">
          <div className="rounded-md bg-white p-4 shadow-sm dark:bg-slate-950">
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {example.problem}
            </p>
          </div>
          <div className="space-y-2 border-l-2 border-emerald-200 pl-4 dark:border-emerald-800">
            <p className="text-sm font-semibold text-slate-500">Solution:</p>
            {example.solution_steps && example.solution_steps.map((step: string, i: number) => (
              <p key={i} className="text-slate-700 dark:text-slate-300">
                {step}
              </p>
            ))}
            {!example.solution_steps && (
              <p className="italic text-slate-500">No solution steps provided</p>
            )}
            <div className="mt-2 rounded-md bg-emerald-100 px-3 py-2 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              <strong>Answer:</strong> {example.answer}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LessonConcept({
  concept,
  onAnswerExercise,
}: LessonConceptProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-1">
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div
            className="flex cursor-pointer items-center justify-between bg-muted/50 p-4 hover:bg-muted/80"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Lightbulb className="size-5 text-yellow-500" />
              {concept.title}
            </h3>
            <Button variant="ghost" size="sm" className="size-8 p-0">
              {isExpanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </div>

          {isExpanded && (
            <div className="space-y-6 p-6">
              {/* Description */}
              <div className="prose prose-slate max-w-none dark:prose-invert">
                {concept.description.map((desc, i) => (
                  <div key={i} className="mb-4">
                    {desc.heading && <h4 className="text-md font-bold">{desc.heading}</h4>}
                    <p>{desc.description}</p>
                    {desc.points.length > 0 && (
                      <ul className="list-disc pl-5">
                        {desc.points.map((point, j) => (
                          <li key={j}>
                            {typeof point === 'string' ? point : JSON.stringify(point)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Examples */}
              {concept.examples.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Examples
                  </h4>
                  {concept.examples.map((example, index) => (
                    <ExampleCard key={example.id} example={example} index={index} />
                  ))}
                </div>
              )}

              {/* Exercises */}
              {concept.exercises.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Concept Exercises
                  </h4>
                  {concept.exercises.map((exercise, index) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      index={index}
                      onAnswer={onAnswerExercise}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
