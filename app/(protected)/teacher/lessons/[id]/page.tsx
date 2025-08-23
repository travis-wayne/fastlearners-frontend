"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  Lightbulb, 
  FileText, 
  Calculator, 
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit
} from "lucide-react";
import { 
  getLessonContent, 
  trashLesson,
  type Lesson 
} from "@/lib/api/lesson-service";

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id as string);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lesson content
  const fetchLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getLessonContent(lessonId);
      
      if (response.success) {
        setLesson(response.content);
      } else {
        setError(response.message || "Failed to fetch lesson");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch lesson");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  // Handle lesson deletion
  const handleTrashLesson = async () => {
    if (!lesson) return;
    
    if (!confirm(`Are you sure you want to move "${lesson.topic}" to trash?`)) {
      return;
    }

    try {
      const response = await trashLesson(lesson.id);
      
      if (response.success) {
        toast.success(response.message || "Lesson moved to trash successfully");
        router.push('/admin/lessons');
      } else {
        toast.error(response.message || "Failed to move lesson to trash");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to move lesson to trash");
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
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-24" />
          <div className="space-y-2 flex-1">
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
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/lessons">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lessons
            </Button>
          </Link>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Lesson not found"}
          </AlertDescription>
        </Alert>
      </>
    );
  }

  const objectives = parseJSON(lesson.objectives);
  const keyConcepts = parseJSON(lesson.key_concepts);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/lessons">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{lesson.topic}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{lesson.class}</Badge>
              <Badge variant="secondary">{lesson.subject}</Badge>
              <Badge variant="outline">{lesson.term} Term</Badge>
              <Badge variant="outline">Week {lesson.week}</Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleTrashLesson}>
            <Trash2 className="h-4 w-4 mr-2" />
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
              <BookOpen className="h-5 w-5" />
              Lesson Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
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
                  <Target className="h-5 w-5" />
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
                          <p className="text-sm text-muted-foreground font-medium">
                            {objective.description}
                          </p>
                        )}
                        {objective.points && objective.points.length > 0 && (
                          <ul className="space-y-2">
                            {objective.points.map((point: string, pointIndex: number) => (
                              <li key={pointIndex} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No objectives defined for this lesson.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Key Concepts Tab */}
          <TabsContent value="concepts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Key Concepts
                </CardTitle>
                <CardDescription>
                  Important concepts and topics covered in this lesson
                </CardDescription>
              </CardHeader>
              <CardContent>
                {keyConcepts && Object.keys(keyConcepts).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(keyConcepts).map(([concept, description]: [string, any], index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">{concept}</h4>
                        <p className="text-sm text-muted-foreground">{description as string}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No key concepts defined for this lesson.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Structure Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Content Structure
                </CardTitle>
                <CardDescription>
                  Summary and application information for this lesson
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Summary
                  </h4>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      {lesson.summary || "No summary provided for this lesson."}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Application
                  </h4>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      {lesson.application || "No application information provided for this lesson."}
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
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h4 className="font-medium mb-2">Content Coming Soon</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed lesson content including concepts, examples, and exercises will be displayed here 
                once the content endpoints are available.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
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
