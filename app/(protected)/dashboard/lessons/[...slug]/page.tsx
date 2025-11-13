"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { markLessonComplete, getTopicsBySubjectSlug } from "@/lib/api/lessons";
import { getSubjectById } from "@/config/education";
import { getTopicsForTerm } from "@/lib/types/lessons";
import { LessonLayout } from "@/components/lessons/LessonLayout";
import { LessonConceptsSidebar } from "@/components/lessons/LessonConceptsSidebar";
import { LessonContent } from "@/components/lessons/LessonContent";
import { LessonTocSidebar } from "@/components/lessons/LessonTocSidebar";
import { LessonNavigation } from "@/components/lessons/LessonNavigation";
import { TopicOverview } from "@/components/lessons/TopicOverview";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";
import { useToast } from "@/components/ui/use-toast";
import type { LessonContent as LessonContentType, TopicOverview as TopicOverviewType } from "@/lib/types/lessons";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  // Handle slug array: [subjectSlug, topicSlug] from catch-all route
  const slugArray = params?.slug as string[] | string;
  const slugParts = Array.isArray(slugArray) ? slugArray : (slugArray ? [slugArray] : []);
  

  const { currentClass, currentTerm } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();

  const [lessonContent, setLessonContent] =
    useState<LessonContentType | null>(null);
  const [topicOverview, setTopicOverview] = useState<TopicOverviewType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isSlugBased, setIsSlugBased] = useState(false);
  const [subjectSlug, setSubjectSlug] = useState<string | null>(null);
  const [topicSlug, setTopicSlug] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  // Fetch lesson content - slug-based only
  useEffect(() => {
    const loadLesson = async () => {
      if (slugParts.length !== 2) {
        if (slugParts.length > 0) {
          toast({
            title: "Error",
            description: "Invalid lesson URL. Please use format: /dashboard/lessons/{subjectSlug}/{topicSlug}",
            variant: "destructive",
          });
        }
        setIsLoading(false);
        if (slugParts.length > 0) {
          router.push("/dashboard/lessons");
        }
        return;
      }

      setIsLoading(true);
      setIsLoadingOverview(true);
      const [subjSlug, topSlug] = slugParts;
      setIsSlugBased(true);
      setSubjectSlug(subjSlug);
      setTopicSlug(topSlug);
      
      try {
        // Fetch both topic overview and lesson content in parallel using direct API calls
        const [overviewRes, contentRes] = await Promise.all([
          fetch(`/api/lessons/${subjSlug}/${topSlug}/overview`, {
            method: "GET",
            headers: { Accept: "application/json" },
            credentials: "include",
            cache: "no-store",
          }),
          fetch(`/api/lessons/${subjSlug}/${topSlug}/content`, {
            method: "GET",
            headers: { Accept: "application/json" },
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        // Parse responses
        const overviewData = await overviewRes.json();
        const contentData = await contentRes.json();

        // Set topic overview
        if (overviewRes.ok && overviewData.success && overviewData.content?.overview) {
          setTopicOverview(overviewData.content.overview);
        } else {
          console.warn("Failed to load topic overview:", overviewData.message);
        }

        // Set lesson content
        if (contentRes.ok && contentData.success && contentData.content) {
          // Handle both content.lesson and content formats
          const lesson = contentData.content.lesson || contentData.content;
          setLessonContent(lesson);
        } else {
          toast({
            title: "Error",
            description: contentData.message || "Failed to load lesson",
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
        setIsLoadingOverview(false);
      }
    };

    loadLesson();
  }, [slugParts, toast, router]);

  // Fetch all lessons to determine previous/next - slug-based only
  useEffect(() => {
    const loadLessons = async () => {
      if (!currentClass || !currentTerm || !lessonContent || !isSlugBased || !subjectSlug || !topicSlug) return;

      try {
        // For slug-based, fetch topics by subject slug
        const topicsResponse = await getTopicsBySubjectSlug(subjectSlug);
        if (topicsResponse.success && topicsResponse.content) {
          const topics = topicsResponse.content.topics;
          // Use helper to safely get topics for current term
          const termTopics = getTopicsForTerm(topics, currentTerm.id);
          const currentIndex = termTopics.findIndex(t => t.slug === topicSlug);
          
          // Compute prev/next within current term
          let prevSlug: string | null = currentIndex > 0 ? termTopics[currentIndex - 1].slug : null;
          let nextSlug: string | null = currentIndex >= 0 && currentIndex < termTopics.length - 1 ? termTopics[currentIndex + 1].slug : null;
          
          // If at boundaries within a term, peek into adjacent term arrays for cross-term navigation
          if (!prevSlug && currentIndex === 0) {
            // At start of current term, check previous term
            const prevTermId = currentTerm.id === 'term2' ? 'term1' : currentTerm.id === 'term3' ? 'term2' : null;
            if (prevTermId) {
              const prevTermTopics = getTopicsForTerm(topics, prevTermId);
              if (prevTermTopics.length > 0) {
                prevSlug = prevTermTopics[prevTermTopics.length - 1].slug;
              }
            }
          }
          
          if (!nextSlug && currentIndex === termTopics.length - 1) {
            // At end of current term, check next term
            const nextTermId = currentTerm.id === 'term1' ? 'term2' : currentTerm.id === 'term2' ? 'term3' : null;
            if (nextTermId) {
              const nextTermTopics = getTopicsForTerm(topics, nextTermId);
              if (nextTermTopics.length > 0) {
                nextSlug = nextTermTopics[0].slug;
              }
            }
          }
          
          setPreviousUrl(prevSlug ? `/dashboard/lessons/${subjectSlug}/${prevSlug}` : null);
          setNextUrl(nextSlug ? `/dashboard/lessons/${subjectSlug}/${nextSlug}` : null);
        }
      } catch (error) {
        console.error("Failed to load lessons list:", error);
      }
    };

    loadLessons();
  }, [currentClass, currentTerm, lessonContent, isSlugBased, subjectSlug, topicSlug]);

  const handleMarkComplete = async () => {
    if (!lessonContent) return;
    setIsMarkingComplete(true);
    try {
      const result = await markLessonComplete(lessonContent.id);
      
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
        if (isSlugBased && subjectSlug && topicSlug) {
          const response = await getLessonContentBySlug(subjectSlug, topicSlug);
          if (response.success && response.content) {
            setLessonContent(response.content);
          }
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

  // Get subject using subject_id from lessonContent
  const subjectId = lessonContent?.subject_id ? String(lessonContent.subject_id) : null;
  const subject = subjectId ? getSubjectById(subjectId) : null;

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
            <h1 className="text-3xl font-bold">
              {lessonContent.topic || lessonContent.title || "Lesson"}
            </h1>
            {subject && (
              <p className="text-muted-foreground">
                {lessonContent.subject || subject.name} • {lessonContent.class || classDisplay} • {lessonContent.term || termDisplay}
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
            {/* Topic Overview - Introduction to the lesson */}
            {topicOverview && subjectSlug && topicSlug && (
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h2 className="text-xl font-semibold">Topic Overview</h2>
                  <p className="text-sm text-muted-foreground">
                    Introduction to this lesson topic
                  </p>
                </div>
                <TopicOverview 
                  overview={topicOverview} 
                  subjectSlug={subjectSlug}
                  topicSlug={topicSlug}
                />
              </div>
            )}

            {/* Lesson Content */}
            {lessonContent && (
              <div className="space-y-4">
                {topicOverview && (
                  <div className="border-b pb-2">
                    <h2 className="text-xl font-semibold">Lesson Content</h2>
                    <p className="text-sm text-muted-foreground">
                      Detailed lesson materials and concepts
                    </p>
                  </div>
                )}
                <LessonContent
                  content={lessonContent}
                  onMarkComplete={handleMarkComplete}
                  isCompleted={isCompleted}
                />
              </div>
            )}

            <LessonNavigation
              previousUrl={previousUrl}
              nextUrl={nextUrl}
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