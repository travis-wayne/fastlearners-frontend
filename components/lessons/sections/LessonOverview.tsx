import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Lightbulb, Sparkles, CheckCircle2 } from "lucide-react";
import { LessonContent } from "@/lib/types/lessons";
import { cn } from "@/lib/utils";

interface LessonOverviewProps {
  lesson: LessonContent;
}

export function LessonOverview({ lesson }: LessonOverviewProps) {
  const objectives = lesson.objectives || [];
  const key_concepts = lesson.key_concepts || {};

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-1">
      {/* Overview Card */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 via-background to-background shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20">
              <BookOpen className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Lesson Overview</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started with this lesson
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-foreground">
            {lesson.overview}
          </p>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      {objectives.length > 0 && (
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Target className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Learning Objectives</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  What you&apos;ll learn in this lesson
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="rounded-lg border-2 bg-muted/30 p-5 transition-all hover:border-primary/50"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="outline" className="font-medium">
                    Objective {index + 1}
                  </Badge>
                </div>
                <p className="mb-3 text-base leading-relaxed text-foreground">
                  {objective.description}
                </p>
                {objective.points.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Key Points:
                    </p>
                    <ul className="ml-4 space-y-2">
                      {objective.points.map((point, pointIndex) => (
                        <li
                          key={pointIndex}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Key Concepts */}
      {Object.keys(key_concepts).length > 0 && (
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                <Lightbulb className="size-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Key Concepts</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Important concepts to understand
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(key_concepts).map(([concept, description], index) => (
                <div
                  key={concept}
                  className={cn(
                    "group relative rounded-xl border-2 bg-gradient-to-br p-5 transition-all hover:border-primary hover:shadow-md",
                    index % 2 === 0
                      ? "from-blue-50/50 to-background dark:from-blue-950/20"
                      : "from-purple-50/50 to-background dark:from-purple-950/20",
                  )}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <h4 className="font-bold text-foreground">{concept}</h4>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description as string}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
