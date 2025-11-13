"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle,
  Edit,
  FileText,
  Lightbulb,
  Target,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

// NOTE: getLessonContent and trashLesson removed from lesson-service.ts
// These functions hit non-documented superadmin endpoints and should be in admin-only client
// This teacher page should use admin-only endpoints or be moved to admin-only app
import type { Lesson } from "@/lib/api/lesson-service";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/header";

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id as string);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lesson content
  const fetchLesson = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with admin-only endpoint
      // getLessonContent removed - this teacher page needs admin-only client
      setError("Admin endpoint not implemented. getLessonContent() was removed from student app. Use slug-based endpoints for student-facing features.");
      // const response = await getLessonContent(lessonId);
      // if (response.success) {
      //   setLesson(response.content);
      // } else {
      //   setError(response.message || "Failed to fetch lesson");
      // }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch lesson",
      );
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId, fetchLesson]);

  // Handle lesson deletion
  const handleTrashLesson = async () => {
    if (!lesson) return;

    if (!confirm(`Are you sure you want to move "${lesson.topic}" to trash?`)) {
      return;
    }

    try {
      // TODO: Replace with admin-only endpoint
      // trashLesson removed - this teacher page needs admin-only client
      toast.error("Admin endpoint not implemented. trashLesson() was removed from student app.");
      // const response = await trashLesson(lesson.id);
      // if (response.success) {
      //   toast.success(response.message || "Lesson moved to trash successfully");
      //   router.push("/dashboard/teacher/lessons");
      // } else {
      //   toast.error(response.message || "Failed to move lesson to trash");
      // }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to move lesson to trash",
      );
    }
  };

  // Parse JSON fields safely
  const parseJSON = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </>
    );
  }

  if (error || !lesson) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Link href="/dashboard/teacher/lessons">
            <Button variant="outline">
              <ArrowLeft className="mr-2 size-4" />
              Back to Lessons
            </Button>
          </Link>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error || "Lesson not found"}</AlertDescription>
        </Alert>
      </>
    );
  }

  const objectives = parseJSON(lesson.objectives);
  const keyConcepts = parseJSON(lesson.key_concepts);

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/teacher/lessons">
            <Button variant="outline">
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{lesson.topic}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline">{lesson.class}</Badge>
              <Badge variant="secondary">{lesson.subject}</Badge>
              <Badge variant="outline">{lesson.term} Term</Badge>
              <Badge variant="outline">Week {lesson.week}</Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <Edit className="mr-2 size-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleTrashLesson}>
            <Trash2 className="mr-2 size-4" />
            Trash
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5" />
              Lesson Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">
              {lesson.overview}
            </p>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="objectives" className="space-y-4">
          <TabsList>
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            <TabsTrigger value="concepts">Key Concepts</TabsTrigger>
            <TabsTrigger value="content">Content Structure</TabsTrigger>
          </TabsList>

          {/* Objectives Tab */}
          <TabsContent value="objectives">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="size-5" />
                  Learning Objectives
                </CardTitle>
                <CardDescription>
                  What students should achieve by the end of this lesson
                </CardDescription>
              </CardHeader>
              <CardContent>
                {objectives && objectives.length > 0 ? (
                  <div className="space-y-4">
                    {objectives.map((objective: any, index: number) => (
                      <div key={index} className="space-y-3">
                        {objective.description && (
                          <p className="text-sm font-medium text-muted-foreground">
                            {objective.description}
                          </p>
                        )}
                        {objective.points && objective.points.length > 0 && (
                          <ul className="space-y-2">
                            {objective.points.map(
                              (point: string, pointIndex: number) => (
                                <li
                                  key={pointIndex}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-500" />
                                  <span className="text-sm">{point}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No objectives defined for this lesson.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Key Concepts Tab */}
          <TabsContent value="concepts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="size-5" />
                  Key Concepts
                </CardTitle>
                <CardDescription>
                  Important concepts and topics covered in this lesson
                </CardDescription>
              </CardHeader>
              <CardContent>
                {keyConcepts && Object.keys(keyConcepts).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(keyConcepts).map(
                      ([concept, description]: [string, any], index) => (
                        <div key={index} className="rounded-lg border p-4">
                          <h4 className="mb-2 font-medium">{concept}</h4>
                          <p className="text-sm text-muted-foreground">
                            {description as string}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No key concepts defined for this lesson.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Structure Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  Content Structure
                </CardTitle>
                <CardDescription>
                  Summary and application information for this lesson
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-medium">
                    <Calculator className="size-4" />
                    Summary
                  </h4>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm">
                      {lesson.summary || "No summary provided for this lesson."}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-medium">
                    <Target className="size-4" />
                    Application
                  </h4>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm">
                      {lesson.application ||
                        "No application information provided for this lesson."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Placeholder for Future Content */}
        <Card>
          <CardHeader>
            <CardTitle>Related Content</CardTitle>
            <CardDescription>
              Concepts, examples, exercises, and other materials for this lesson
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 size-12 text-muted-foreground" />
              <h4 className="mb-2 font-medium">Content Coming Soon</h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Detailed lesson content including concepts, examples, and
                exercises will be displayed here once the content endpoints are
                available.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">Concepts</Badge>
                <Badge variant="outline">Examples</Badge>
                <Badge variant="outline">Exercises</Badge>
                <Badge variant="outline">Check Markers</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
