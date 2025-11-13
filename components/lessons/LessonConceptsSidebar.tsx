"use client";

import { CheckCircle, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { LessonContent } from "@/lib/types/lessons";

interface LessonConceptsSidebarProps {
  concepts?: LessonContent["concepts"];
  checkMarkers?: any[];
}

export function LessonConceptsSidebar({
  concepts = [],
  checkMarkers = [],
}: LessonConceptsSidebarProps) {
  if (!concepts || concepts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Concepts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No concepts available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Concepts</CardTitle>
        <p className="text-sm text-muted-foreground">
          {concepts.length} concept{concepts.length !== 1 ? "s" : ""}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {concepts.map((concept, index) => {
          // Check completion by verifying marker exists AND completed flag is true
          const isCompleted = checkMarkers?.some(
            (marker) => marker.concept_id === concept.id && marker.completed === true
          );
          const progress = isCompleted ? 100 : 0;

          return (
            <div
              key={concept.id}
              className="space-y-2 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  {isCompleted ? (
                    <CheckCircle className="mt-0.5 size-4 text-green-600 shrink-0" />
                  ) : (
                    <Circle className="mt-0.5 size-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium leading-tight">
                      {concept.title}
                    </h4>
                    {concept.description && Array.isArray(concept.description) && concept.description.length > 0 ? (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {concept.description[0]?.description || concept.description[0]?.heading || "No description available"}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        No description available
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
              {concept.examples && concept.examples.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {concept.examples.length} example
                  {concept.examples.length !== 1 ? "s" : ""}
                </Badge>
              )}
              {concept.exercises && concept.exercises.length > 0 && (
                <Badge variant="secondary" className="text-xs ml-1">
                  {concept.exercises.length} exercise
                  {concept.exercises.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

