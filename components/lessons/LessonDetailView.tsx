"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Target, Lightbulb, FileText, HelpCircle, CheckCircle, Calendar, GraduationCap, User, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  LessonContent, 
  getLessonContent, 
  deleteLesson 
} from "@/lib/api/lessons";

interface LessonDetailViewProps {
  lessonId: number;
  className?: string;
  onDelete?: () => void;
}

export function LessonDetailView({ lessonId, className, onDelete }: LessonDetailViewProps) {
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessonContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const content = await getLessonContent(lessonId);
        setLessonContent(content);
      } catch (err: any) {
        setError(err.message || 'Failed to load lesson content');
        toast.error(err.message || 'Failed to load lesson content');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonContent();
  }, [lessonId]);

  const handleExport = () => {
    if (!lessonContent) return;
    
    const dataStr = JSON.stringify(lessonContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lesson-${lessonContent.lesson.id}-${lessonContent.lesson.topic.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Lesson exported successfully');
  };

  const handleDelete = async () => {
    if (!lessonContent) return;
    
    if (!confirm('Are you sure you want to delete this lesson? It will be moved to trash.')) {
      return;
    }

    try {
      await deleteLesson(lessonContent.lesson.id);
      toast.success('Lesson moved to trash successfully');
      onDelete?.();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete lesson');
    }
  };

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="space-y-2 text-center">
            <div className="mx-auto size-8 animate-spin border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading lesson content...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !lessonContent) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-8">
          <Alert variant="destructive">
            <AlertDescription>
              {error || 'Lesson content not found'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const { lesson, concepts, examples, exercises, general_exercises, check_markers } = lessonContent;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/superadmin/lessons">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Lessons
                </Button>
              </Link>
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="size-6" />
                  {lesson.topic}
                </CardTitle>
                <CardDescription className="mt-1">
                  {lesson.class} • {lesson.subject} • {lesson.term} Term • Week {lesson.week}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="mr-2 size-4" />
                Export
              </Button>
              <Button onClick={handleDelete} variant="destructive" size="sm">
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Lesson Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Overview</h4>
            <p className="leading-relaxed text-muted-foreground">{lesson.overview}</p>
          </div>
          
          <div>
            <h4 className="mb-2 font-semibold">Summary</h4>
            <p className="leading-relaxed text-muted-foreground">{lesson.summary}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                <Target className="size-4" />
                Learning Objectives
              </h4>
              <ul className="space-y-1">
                {lesson.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="mt-1 size-3 shrink-0 text-green-600" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                <Lightbulb className="size-4" />
                Key Concepts
              </h4>
              <div className="flex flex-wrap gap-2">
                {lesson.key_concepts.map((concept, index) => (
                  <Badge key={index} variant="secondary">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Applications</h4>
            <ul className="space-y-1">
              {lesson.application.map((app, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary">•</span>
                  {app}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Content Tabs */}
      <Tabs defaultValue="concepts" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="concepts" className="flex items-center gap-2">
            <Lightbulb className="size-4" />
            <span className="hidden sm:inline">Concepts ({concepts.length})</span>
            <span className="sm:hidden">Concepts</span>
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <FileText className="size-4" />
            <span className="hidden sm:inline">Examples ({examples.length})</span>
            <span className="sm:hidden">Examples</span>
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <HelpCircle className="size-4" />
            <span className="hidden sm:inline">Exercises ({exercises.length})</span>
            <span className="sm:hidden">Exercises</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <HelpCircle className="size-4" />
            <span className="hidden sm:inline">General ({general_exercises.length})</span>
            <span className="sm:hidden">General</span>
          </TabsTrigger>
          <TabsTrigger value="markers" className="flex items-center gap-2">
            <CheckCircle className="size-4" />
            <span className="hidden sm:inline">Markers ({check_markers.length})</span>
            <span className="sm:hidden">Markers</span>
          </TabsTrigger>
        </TabsList>

        {/* Concepts Tab */}
        <TabsContent value="concepts" className="space-y-4">
          {concepts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Lightbulb className="mx-auto mb-2 size-8 text-muted-foreground" />
                <p className="text-muted-foreground">No concepts available for this lesson</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {concepts.map((concept, index) => (
                <Card key={concept.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{concept.concept_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-semibold">Description</h4>
                      <p className="leading-relaxed text-muted-foreground">{concept.description}</p>
                    </div>
                    
                    {concept.examples && (
                      <div>
                        <h4 className="mb-2 font-semibold">Examples</h4>
                        <p className="leading-relaxed text-muted-foreground">{concept.examples}</p>
                      </div>
                    )}
                    
                    {concept.exercises && (
                      <div>
                        <h4 className="mb-2 font-semibold">Exercises</h4>
                        <p className="leading-relaxed text-muted-foreground">{concept.exercises}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-4">
          {examples.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <FileText className="mx-auto mb-2 size-8 text-muted-foreground" />
                <p className="text-muted-foreground">No examples available for this lesson</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {examples.map((example, index) => (
                <Card key={example.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{example.example_title}</CardTitle>
                    <CardDescription>Concept: {example.concept_name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-semibold">Content</h4>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <pre className="whitespace-pre-wrap font-mono text-sm">{example.example_content}</pre>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="mb-2 font-semibold">Explanation</h4>
                      <p className="leading-relaxed text-muted-foreground">{example.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Exercises Tab */}
        <TabsContent value="exercises" className="space-y-4">
          {exercises.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <HelpCircle className="mx-auto mb-2 size-8 text-muted-foreground" />
                <p className="text-muted-foreground">No exercises available for this lesson</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {exercises.map((exercise, index) => (
                <Card key={exercise.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">Exercise {index + 1}</CardTitle>
                    <CardDescription>Concept: {exercise.concept_name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-semibold">Question</h4>
                      <p className="leading-relaxed text-muted-foreground">{exercise.question}</p>
                    </div>
                    
                    <div>
                      <h4 className="mb-2 font-semibold">Options</h4>
                      <div className="space-y-2">
                        {exercise.options.map((option, optIndex) => (
                          <div 
                            key={optIndex} 
                            className={cn(
                              "rounded border p-2",
                              option === exercise.correct_answer 
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                                : "border-border"
                            )}
                          >
                            <span className="mr-2 font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                            {option}
                            {option === exercise.correct_answer && (
                              <Badge className="ml-2" variant="default">Correct</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="mb-2 font-semibold">Explanation</h4>
                      <p className="leading-relaxed text-muted-foreground">{exercise.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* General Exercises Tab */}
        <TabsContent value="general" className="space-y-4">
          {general_exercises.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <HelpCircle className="mx-auto mb-2 size-8 text-muted-foreground" />
                <p className="text-muted-foreground">No general exercises available for this lesson</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {general_exercises.map((exercise, index) => (
                <Card key={exercise.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      General Exercise {index + 1}
                      <Badge variant="outline">{exercise.difficulty_level}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-semibold">Question</h4>
                      <p className="leading-relaxed text-muted-foreground">{exercise.question}</p>
                    </div>
                    
                    <div>
                      <h4 className="mb-2 font-semibold">Options</h4>
                      <div className="space-y-2">
                        {exercise.options.map((option, optIndex) => (
                          <div 
                            key={optIndex} 
                            className={cn(
                              "rounded border p-2",
                              option === exercise.correct_answer 
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                                : "border-border"
                            )}
                          >
                            <span className="mr-2 font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                            {option}
                            {option === exercise.correct_answer && (
                              <Badge className="ml-2" variant="default">Correct</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="mb-2 font-semibold">Explanation</h4>
                      <p className="leading-relaxed text-muted-foreground">{exercise.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Check Markers Tab */}
        <TabsContent value="markers" className="space-y-4">
          {check_markers.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle className="mx-auto mb-2 size-8 text-muted-foreground" />
                <p className="text-muted-foreground">No check markers available for this lesson</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {check_markers.map((marker, index) => (
                <Card key={marker.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {marker.marker_type}
                      <Badge variant="outline">{marker.points} points</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-semibold">Criteria</h4>
                      <p className="leading-relaxed text-muted-foreground">{marker.criteria}</p>
                    </div>
                    
                    <div>
                      <h4 className="mb-2 font-semibold">Description</h4>
                      <p className="leading-relaxed text-muted-foreground">{marker.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span>{new Date(lesson.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Updated:</span>
              <span>{new Date(lesson.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
