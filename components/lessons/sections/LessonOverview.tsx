import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Lightbulb } from "lucide-react";
import { LessonContent } from "@/lib/types/lessons";

interface LessonOverviewProps {
  lesson: LessonContent;
}

export function LessonOverview({ lesson }: LessonOverviewProps) {
  const objectives = lesson.objectives || [];
  const key_concepts = lesson.key_concepts || {};

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-1">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-5 text-blue-600" />
            Lesson Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            {lesson.overview}
          </p>
        </CardContent>
      </Card>

      {objectives.length > 0 && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5 text-emerald-600" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            {objectives.map((objective, index) => (
              <div key={index} className="space-y-3">
                <p className="text-slate-700 dark:text-slate-300">
                  {objective.description}
                </p>
                {objective.points.length > 0 && (
                  <ul className="ml-4 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-400">
                    {objective.points.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {Object.keys(key_concepts).length > 0 && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-5 text-yellow-600" />
              Key Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(key_concepts).map(([concept, description]) => (
                <div key={concept} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">
                    {concept}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
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
