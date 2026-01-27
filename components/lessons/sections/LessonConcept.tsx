import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Lightbulb, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { Concept } from "@/lib/types/lessons";
import { getConceptScore } from "@/lib/api/lessons";
import { ExerciseCard } from "../ExerciseCard";
import { cn } from "@/lib/utils";

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
    <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-emerald-50/30 to-background shadow-md dark:border-emerald-800/30 dark:from-emerald-900/20 dark:via-emerald-900/10 dark:to-background">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
            <Sparkles className="size-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-lg text-emerald-900 dark:text-emerald-100">
            Example {index + 1}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border-2 bg-background p-4 shadow-sm">
          <p className="font-semibold text-foreground">
            {example.problem}
          </p>
        </div>
            <div className="space-y-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-50/50 py-3 pl-4 pr-2 dark:bg-emerald-900/10">
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
            Solution:
          </p>
          {example.solution_steps && example.solution_steps.length > 0 ? (
            <ol className="ml-2 space-y-2">
              {example.solution_steps.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-xs font-bold text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No solution steps provided
            </p>
          )}
          <div className="mt-3 rounded-lg bg-emerald-200 px-4 py-3 dark:bg-emerald-800/50">
            <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
              <span className="mr-2">✓</span>Answer: {example.answer}
            </p>
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
  const [conceptScore, setConceptScore] = useState<{ total_score: string; weight: string } | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);

  useEffect(() => {
    const fetchConceptScore = async () => {
      setIsLoadingScore(true);
      const response = await getConceptScore(concept.id);
      if (response.success && response.content) {
        setConceptScore({
          total_score: response.content.total_score,
          weight: response.content.weight,
        });
      }
      setIsLoadingScore(false);
    };

    fetchConceptScore();
  }, [concept.id]);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-1">
      <Card className="border-2 shadow-lg">
        <CardHeader
          className={cn(
            "cursor-pointer transition-colors",
            isExpanded
              ? "bg-gradient-to-r from-primary/10 via-primary/5 to-background"
              : "bg-muted/50 hover:bg-muted/80",
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                <Lightbulb className="size-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground">
                  {concept.title}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {concept.examples.length > 0 && `${concept.examples.length} example${concept.examples.length > 1 ? 's' : ''}`}
                  {concept.examples.length > 0 && concept.exercises.length > 0 && " • "}
                  {concept.exercises.length > 0 && `${concept.exercises.length} exercise${concept.exercises.length > 1 ? 's' : ''}`}
                  {conceptScore && (
                    <>
                      {" • "}
                      <span className="font-medium text-primary">
                        Score: {conceptScore.total_score}/{conceptScore.weight}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="size-10 p-0">
              {isExpanded ? (
                <ChevronUp className="size-5" />
              ) : (
                <ChevronDown className="size-5" />
              )}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-8 p-6">
            {/* Description */}
            <div className="space-y-6">
              {concept.description.map((desc, i) => (
                <div key={i} className="space-y-3">
                  {desc.heading && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-5 text-primary" />
                      <h4 className="text-xl font-bold text-foreground">
                        {desc.heading}
                      </h4>
                    </div>
                  )}
                  {desc.description && (
                    <p className="text-base leading-relaxed text-foreground">
                      {desc.description}
                    </p>
                  )}
                  {desc.points && desc.points.length > 0 && (
                    <ul className="ml-6 space-y-2">
                      {desc.points.map((point, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>
                            {typeof point === "string"
                              ? point
                              : JSON.stringify(point)}
                          </span>
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
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-emerald-600" />
                  <h4 className="text-xl font-bold text-foreground">
                    Examples
                  </h4>
                  <Badge variant="secondary" className="ml-2">
                    {concept.examples.length}
                  </Badge>
                </div>
                <div className="space-y-4">
                  {concept.examples.map((example, index) => (
                    <ExampleCard
                      key={example.id || index}
                      example={example}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Exercises */}
            {concept.exercises.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle2 className="size-4 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    Concept Exercises
                  </h4>
                  <Badge variant="secondary" className="ml-2">
                    {concept.exercises.length}
                  </Badge>
                </div>
                <div className="space-y-4">
                  {concept.exercises.map((exercise, index) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      index={index}
                      onAnswer={onAnswerExercise}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle2 className="size-4 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">
                    Concept Exercises
                  </h4>
                </div>
                <div className="rounded-lg border-2 border-dashed border-muted bg-muted/30 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No exercises available for this concept. You can proceed to the next section.
                  </p>
                </div>
              </div>
            )}

            {/* Concept Score Summary */}
            {conceptScore && concept.exercises.length > 0 && (
              <Card className="via-primary/3 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background shadow-lg">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                        <CheckCircle2 className="size-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground">
                          Concept Score
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Total score for this concept
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {conceptScore.total_score}
                        <span className="text-xl text-muted-foreground">
                          /{conceptScore.weight}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {parseFloat(conceptScore.weight) > 0
                          ? ((parseFloat(conceptScore.total_score) / parseFloat(conceptScore.weight)) * 100).toFixed(1)
                          : "0.0"}% Complete
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                        style={{
                          width: `${(parseFloat(conceptScore.total_score) / parseFloat(conceptScore.weight)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State for Score */}
            {isLoadingScore && concept.exercises.length > 0 && (
              <Card className="border-2 border-muted bg-muted/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="size-12 animate-pulse rounded-xl bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
