"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  getLessonContent,
  getErrorMessage,
  type LessonContent,
} from "@/lib/api/superadmin-lessons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard/header";

export default function LessonContentPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<LessonContent | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id || Number.isNaN(id)) {
        setError("Invalid lesson id");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await getLessonContent(id);
        if (mounted) {
          if (res.success && res.content) {
            setContent(res.content);
          } else {
            setError(res.message || "Failed to load content");
          }
        }
      } catch (e: any) {
        if (mounted) setError(getErrorMessage(e));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <DashboardHeader
          heading="Lesson Content"
          text={content ? content.topic : "Loading lesson content..."}
        />
        <div className="flex gap-2">
          {id ? (
            <Link href={`/dashboard/superadmin/lessons/${id}`}>
              <Button variant="secondary">Back to Details</Button>
            </Link>
          ) : null}
          <Link href="/dashboard/superadmin/lessons">
            <Button variant="outline">Back to Lessons</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Fetched from /api/v1/superadmin/lessons/lesson/{id}/content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading…</p>}
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-800">
              {error}
            </div>
          )}
          {!loading && !error && content && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-medium">{content.topic}</h2>
                <p className="text-sm text-muted-foreground">
                  {content.class} • {content.subject} • {content.term} • Week{" "}
                  {content.week}
                </p>
              </div>

              <Separator />

              {/* Concepts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Concepts</h3>
                <div className="space-y-6">
                  {content.concepts?.map((c: any) => (
                    <div key={c.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">
                          {c.order_index}. {c.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {c.lesson_topic}
                        </div>
                      </div>
                      {c.description?.map((d: any, idx: number) => (
                        <div key={idx} className="space-y-1">
                          {d.heading ? (
                            <div className="text-sm font-medium">
                              {d.heading}
                            </div>
                          ) : null}
                          <p className="text-sm leading-relaxed">
                            {d.description}
                          </p>
                          {Array.isArray(d.points) && d.points.length > 0 ? (
                            <ul className="list-disc pl-5 text-sm">
                              {d.points.map((p: string, i: number) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}

                      {/* Examples */}
                      {Array.isArray(c.examples) && c.examples.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <div className="text-sm font-medium">Examples</div>
                          <div className="space-y-3">
                            {c.examples.map((ex: any) => (
                              <div
                                key={ex.id}
                                className="rounded-md bg-muted p-3 text-sm"
                              >
                                <div className="font-medium">{ex.title}</div>
                                <div className="text-muted-foreground">
                                  {ex.problem}
                                </div>
                                <ul className="mt-2 list-decimal pl-5">
                                  {ex.solution_steps?.map(
                                    (s: string, i: number) => (
                                      <li key={i}>{s}</li>
                                    ),
                                  )}
                                </ul>
                                <div className="mt-2 font-medium">
                                  Answer: {ex.answer}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Exercises */}
                      {Array.isArray(c.exercises) && c.exercises.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <div className="text-sm font-medium">Exercises</div>
                          <div className="space-y-3">
                            {c.exercises.map((ex: any) => (
                              <div
                                key={ex.id}
                                className="rounded-md bg-muted p-3 text-sm"
                              >
                                <div className="font-medium">{ex.title}</div>
                                <div className="text-muted-foreground">
                                  {ex.problem}
                                </div>
                                <ul className="mt-2 list-decimal pl-5">
                                  {ex.solution_steps?.map(
                                    (s: string, i: number) => (
                                      <li key={i}>{s}</li>
                                    ),
                                  )}
                                </ul>
                                <div className="mt-2">
                                  Options: {ex.answers?.join(", ")}
                                </div>
                                <div className="mt-1 font-medium">
                                  Correct: {ex.correct_answer}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* General Exercises */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">General Exercises</h3>
                <div className="space-y-3">
                  {content.general_exercises?.map((g: any) => (
                    <div key={g.id} className="rounded-lg border p-4 text-sm">
                      <div className="font-medium">
                        {g.order_index}. {g.lesson_topic}
                      </div>
                      <div className="text-muted-foreground">{g.problem}</div>
                      <ul className="mt-2 list-decimal pl-5">
                        {g.solution_steps?.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                      <div className="mt-2">
                        Options: {g.answers?.join(", ")}
                      </div>
                      <div className="mt-1 font-medium">
                        Correct: {g.correct_answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Check Markers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Check Markers</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {content.check_markers?.map((c: any) => (
                    <div key={c.id} className="rounded-lg border p-4 text-sm">
                      <div className="font-medium">{c.lesson_topic}</div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>Overview: {c.overview}</div>
                        <div>Video: {c.lesson_video}</div>
                        <div>Concept 1: {c.concept_one}</div>
                        <div>Concept 2: {c.concept_two}</div>
                        <div>Concept 3: {c.concept_three}</div>
                        <div>General Ex.: {c.general_exercises}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
