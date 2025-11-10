"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLessonContent, fetchLessons, markLessonComplete } from "@/lib/api/lessons";
import { getSubjectById } from "@/config/education";
import { LessonLayout } from "@/components/lessons/LessonLayout";
import { LessonConceptsSidebar } from "@/components/lessons/LessonConceptsSidebar";
import { LessonContent } from "@/components/lessons/LessonContent";
import { LessonTocSidebar } from "@/components/lessons/LessonTocSidebar";
import { LessonNavigation } from "@/components/lessons/LessonNavigation";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";
import { useToast } from "@/components/ui/use-toast";
import type { LessonContent as LessonContentType } from "@/lib/types/lessons";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const lessonId = params?.id as string;
  

  const { currentClass, currentTerm } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();

  const [lessonContent, setLessonContent] =
    useState<LessonContentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);

  // Fetch lesson content
  useEffect(() => {
    const loadLesson = async () => {
      if (!lessonId) return;

      setIsLoading(true);
      try {
        const response = await getLessonContent(Number(lessonId));
        if (response.success && response.content) {
          setLessonContent(response.content);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to load lesson",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load lesson content",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, toast]);

  // Fetch all lessons to determine previous/next
  useEffect(() => {
    const loadLessons = async () => {
      if (!currentClass || !currentTerm || !lessonContent) return;

      try {
        // Use subject_id from lessonContent, or fallback to searchParams, or derive from allLessons
        let subjectId: string;
        if (lessonContent.subject_id) {
          subjectId = String(lessonContent.subject_id);
        } else if (searchParams.get("subjectId")) {
          subjectId = searchParams.get("subjectId")!;
        } else {
          // Try to find subject_id from the lesson in allLessons if available
          const currentLesson = allLessons.find((l) => l.id === Number(lessonId));
          subjectId = currentLesson?.subject_id ? String(currentLesson.subject_id) : "";
        }

        if (!subjectId) {
          console.error("Cannot determine subject_id for lesson");
          return;
        }

        const response = await fetchLessons({
          class: currentClass.id,
          subject: subjectId,
          term: currentTerm.id,
          week: "all",
        });

        if (response.success && response.content?.data) {
          const lessons = response.content.data;
          setAllLessons(lessons);
          const index = lessons.findIndex((l) => l.id === Number(lessonId));
          setCurrentLessonIndex(index);
        }
      } catch (error) {
        console.error("Failed to load lessons list:", error);
      }
    };

    loadLessons();
  }, [currentClass, currentTerm, lessonContent, lessonId, searchParams, allLessons]);

  const handleMarkComplete = async () => {
    setIsMarkingComplete(true);
    try {
      const result = await markLessonComplete(Number(lessonId));
      
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message || "Lesson marked as complete",
        });
        
        // Optimistically update check markers
        if (lessonContent) {
          setLessonContent({
            ...lessonContent,
            check_markers: lessonContent.check_markers?.map(marker => ({
              ...marker,
              completed: true,
            })) || [],
          });
        }
        
        // Refresh lesson content to get latest state
        const response = await getLessonContent(Number(lessonId));
        if (response.success && response.content) {
          setLessonContent(response.content);
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mark lesson as complete",
        variant: "destructive",
      });
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // Get subject using subject_id from lessonContent or from allLessons
  const subjectId = lessonContent?.subject_id 
    ? String(lessonContent.subject_id)
    : allLessons.find((l) => l.id === Number(lessonId))?.subject_id
    ? String(allLessons.find((l) => l.id === Number(lessonId))!.subject_id)
    : null;
  
  const subject = subjectId ? getSubjectById(subjectId) : null;

  const previousLessonId =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1]?.id : null;
  const nextLessonId =
    currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]?.id
      : null;

  const isCompleted =
    lessonContent?.check_markers?.every((m: any) => m.completed) || false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lessonContent) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Lesson Not Found</h3>
          <p className="mb-4 text-muted-foreground">
            The lesson you&apos;re looking for doesn&apos;t exist or
            isn&apos;t available.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 size-4" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{lessonContent.title}</h1>
            {subject && (
              <p className="text-muted-foreground">
                {subject.name} • {classDisplay} • {termDisplay}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3-Column Layout */}
      <LessonLayout
        leftSidebar={
          <LessonConceptsSidebar
            concepts={lessonContent.concepts}
            checkMarkers={lessonContent.check_markers}
          />
        }
        mainContent={
          <div className="space-y-6 pr-4">
            <LessonContent
              content={lessonContent}
              onMarkComplete={handleMarkComplete}
              isCompleted={isCompleted}
            />
            <LessonNavigation
              previousLessonId={previousLessonId}
              nextLessonId={nextLessonId}
            />
          </div>
        }
        rightSidebar={
          <LessonTocSidebar
            content={
              lessonContent.content ||
              lessonContent.concepts
                ?.map((c) => c.description)
                .join("\n\n")
            }
          />
        }
      />
    </div>
  );
}
