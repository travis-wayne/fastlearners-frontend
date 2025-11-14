"use client";

import { BookOpen, CheckCircle, PlayCircle, Target } from "lucide-react";

import type { LessonContent as LessonContentType } from "@/lib/types/lessons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
          100,
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
            <p className="leading-relaxed text-muted-foreground">
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
            <div className="space-y-4">
              {content.objectives.map((objective, index) => (
                <div key={index} className="space-y-2">
                  {objective.description && (
                    <p className="text-muted-foreground">
                      {objective.description}
                    </p>
                  )}
                  {objective.points &&
                    Array.isArray(objective.points) &&
                    objective.points.length > 0 && (
                      <ul className="ml-4 space-y-2">
                        {objective.points.map((point, pointIndex) => (
                          <li
                            key={pointIndex}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-600" />
                            <span className="text-muted-foreground">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
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
                {/* Description - array of ConceptDescription objects */}
                {concept.description &&
                  Array.isArray(concept.description) &&
                  concept.description.length > 0 && (
                    <div className="space-y-4">
                      {concept.description.map((desc, index) => (
                        <div key={index} className="space-y-2">
                          {desc.heading && (
                            <h4 className="text-lg font-semibold">
                              {desc.heading}
                            </h4>
                          )}
                          {desc.description && (
                            <p className="leading-relaxed text-muted-foreground">
                              {desc.description}
                            </p>
                          )}
                          {desc.image_path && (
                            <div className="my-2">
                              <img
                                src={desc.image_path}
                                alt={desc.heading || "Concept illustration"}
                                className="h-auto max-w-full rounded-lg"
                              />
                            </div>
                          )}
                          {desc.points &&
                            Array.isArray(desc.points) &&
                            desc.points.length > 0 && (
                              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                                {desc.points.map((point, pointIndex) => (
                                  <li key={pointIndex}>{point}</li>
                                ))}
                              </ul>
                            )}
                        </div>
                      ))}
                    </div>
                  )}

                {/* Examples */}
                {concept.examples && concept.examples.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Examples</h4>
                    {concept.examples.map((example, index) => (
                      <div
                        key={example.id || index}
                        className="space-y-2 rounded-lg border bg-muted/50 p-4"
                      >
                        {example.title && (
                          <h5 className="font-medium">{example.title}</h5>
                        )}
                        {example.problem && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Problem:</strong> {example.problem}
                          </p>
                        )}
                        {example.solution_steps &&
                          example.solution_steps.length > 0 && (
                            <div className="space-y-1">
                              <strong className="text-sm">
                                Solution Steps:
                              </strong>
                              <ol className="ml-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                                {example.solution_steps.map(
                                  (step, stepIndex) => (
                                    <li key={stepIndex}>{step}</li>
                                  ),
                                )}
                              </ol>
                            </div>
                          )}
                        {example.answer && (
                          <p className="text-sm">
                            <strong>Answer:</strong>{" "}
                            <span className="text-primary">
                              {example.answer}
                            </span>
                          </p>
                        )}
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
                        key={exercise.id || index}
                        className="space-y-2 rounded-lg border p-4"
                      >
                        {exercise.title && (
                          <h5 className="font-medium">{exercise.title}</h5>
                        )}
                        {exercise.problem && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Problem:</strong> {exercise.problem}
                          </p>
                        )}
                        {exercise.solution_steps &&
                          exercise.solution_steps.length > 0 && (
                            <div className="space-y-1">
                              <strong className="text-sm">
                                Solution Steps:
                              </strong>
                              <ol className="ml-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                                {exercise.solution_steps.map(
                                  (step, stepIndex) => (
                                    <li key={stepIndex}>{step}</li>
                                  ),
                                )}
                              </ol>
                            </div>
                          )}
                        {exercise.answers && exercise.answers.length > 0 && (
                          <div className="space-y-1">
                            <strong className="text-sm">Options:</strong>
                            <ul className="ml-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                              {exercise.answers.map((answer, answerIndex) => (
                                <li key={answerIndex}>{answer}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {exercise.correct_answer && (
                          <p className="text-sm">
                            <strong>Correct Answer:</strong>{" "}
                            <span className="text-green-600">
                              {exercise.correct_answer}
                            </span>
                          </p>
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
                <h3 className="mb-1 font-semibold">
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
