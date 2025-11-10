"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, BookOpen, PlayCircle } from "lucide-react";
import type { LessonContent as LessonContentType } from "@/lib/types/lessons";

interface LessonContentProps {
  content: LessonContentType;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

export function LessonContent({
  content,
  onMarkComplete,
  isCompleted = false,
}: LessonContentProps) {
  const completionPercentage = content.check_markers
    ? Math.round(
        (content.check_markers.filter((m: any) => m.completed).length /
          content.check_markers.length) *
          100
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lesson Progress</p>
              <Progress value={completionPercentage} className="h-2 w-32" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{completionPercentage}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Player */}
      {content.video_path && (
        <Card>
          <CardContent className="p-0">
            <video
              controls
              className="w-full rounded-lg"
              src={content.video_path}
            >
              Your browser does not support the video tag.
            </video>
          </CardContent>
        </Card>
      )}

      {/* Overview */}
      {content.overview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {content.overview}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Objectives */}
      {content.objectives && content.objectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 size-4 text-green-600 shrink-0" />
                  <span className="text-muted-foreground">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Key Concepts */}
      {content.key_concepts && Object.keys(content.key_concepts).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(content.key_concepts).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <h4 className="font-medium">{key}</h4>
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Concepts */}
      {content.concepts && content.concepts.length > 0 && (
        <div className="space-y-6">
          {content.concepts.map((concept) => (
            <Card key={concept.id} id={`concept-${concept.id}`}>
              <CardHeader>
                <CardTitle className="text-xl">{concept.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {concept.description}
                </p>

                {/* Examples */}
                {concept.examples && concept.examples.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Examples</h4>
                    {concept.examples.map((example, index) => (
                      <div
                        key={index}
                        className="rounded-lg border bg-muted/50 p-4"
                      >
                        <h5 className="font-medium mb-2">{example.title}</h5>
                        <p className="text-sm text-muted-foreground">
                          {example.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Exercises */}
                {concept.exercises && concept.exercises.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Exercises</h4>
                    {concept.exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className="rounded-lg border p-4 space-y-2"
                      >
                        <h5 className="font-medium">{exercise.title}</h5>
                        <p className="text-sm text-muted-foreground">
                          {exercise.content}
                        </p>
                        {exercise.check_markers &&
                          exercise.check_markers.length > 0 && (
                            <div className="flex items-center gap-2 pt-2">
                              <Badge variant="outline">
                                {exercise.check_markers.length} checkpoints
                              </Badge>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Mark Complete Button */}
      {onMarkComplete && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">
                  {isCompleted ? "Lesson Completed!" : "Complete this lesson"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isCompleted
                    ? "You've successfully completed this lesson."
                    : "Mark this lesson as complete when you're done."}
                </p>
              </div>
              <Button
                onClick={onMarkComplete}
                disabled={isCompleted}
                variant={isCompleted ? "outline" : "default"}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="mr-2 size-4" />
                    Completed
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 size-4" />
                    Mark as Complete
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

