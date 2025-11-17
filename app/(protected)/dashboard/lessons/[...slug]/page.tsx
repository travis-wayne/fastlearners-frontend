"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle, Loader2 } from "lucide-react";

import { getSubjectById } from "@/config/education";
import {
  getLessonContentBySlug,
  getTopicsBySubjectSlug,
  markLessonComplete,
} from "@/lib/api/lessons";
import type { TableOfContents } from "@/lib/toc";
import { getTopicsForTerm } from "@/lib/types/lessons";
import type {
  LessonContent as LessonContentType,
  TopicOverview as TopicOverviewType,
} from "@/lib/types/lessons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LessonContent } from "@/components/lessons/LessonContent";
import { LessonNavigation } from "@/components/lessons/LessonNavigation";
import { TopicOverview } from "@/components/lessons/TopicOverview";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { DashboardTableOfContents } from "@/components/shared/toc";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { currentClass, currentTerm } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();

  const [lessonContent, setLessonContent] = useState<LessonContentType | null>(
    null,
  );
  const [topicOverview, setTopicOverview] = useState<TopicOverviewType | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isSlugBased, setIsSlugBased] = useState(false);
  const [subjectSlug, setSubjectSlug] = useState<string | null>(null);
  const [topicSlug, setTopicSlug] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [toc, setToc] = useState<TableOfContents>({});

  // Fetch lesson content - slug-based only
  useEffect(() => {
    const loadLesson = async () => {
      // Handle slug array: [subjectSlug, topicSlug] from catch-all route
      const slugArray = params?.slug as string[] | string;
      const slugParts = Array.isArray(slugArray)
        ? slugArray
        : slugArray
          ? [slugArray]
          : [];

      if (slugParts.length !== 2) {
        if (slugParts.length > 0) {
          toast({
            title: "Error",
            description:
              "Invalid lesson URL. Please use format: /dashboard/lessons/{subjectSlug}/{topicSlug}",
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
        if (
          overviewRes.ok &&
          overviewData.success &&
          overviewData.content?.overview
        ) {
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
  }, [params?.slug, toast, router]);

  // Fetch all lessons to determine previous/next - slug-based only
  useEffect(() => {
    const loadLessons = async () => {
      if (
        !currentClass ||
        !currentTerm ||
        !lessonContent ||
        !isSlugBased ||
        !subjectSlug ||
        !topicSlug
      )
        return;

      try {
        // For slug-based, fetch topics by subject slug
        const topicsResponse = await getTopicsBySubjectSlug(subjectSlug);
        if (topicsResponse.success && topicsResponse.content) {
          const topics = topicsResponse.content.topics;
          // Use helper to safely get topics for current term
          const termTopics = getTopicsForTerm(topics, currentTerm.id);
          const currentIndex = termTopics.findIndex(
            (t) => t.slug === topicSlug,
          );

          // Compute prev/next within current term
          let prevSlug: string | null =
            currentIndex > 0 ? termTopics[currentIndex - 1].slug : null;
          let nextSlug: string | null =
            currentIndex >= 0 && currentIndex < termTopics.length - 1
              ? termTopics[currentIndex + 1].slug
              : null;

          // If at boundaries within a term, peek into adjacent term arrays for cross-term navigation
          if (!prevSlug && currentIndex === 0) {
            // At start of current term, check previous term
            const prevTermId =
              currentTerm.id === "term2"
                ? "term1"
                : currentTerm.id === "term3"
                  ? "term2"
                  : null;
            if (prevTermId) {
              const prevTermTopics = getTopicsForTerm(topics, prevTermId);
              if (prevTermTopics.length > 0) {
                prevSlug = prevTermTopics[prevTermTopics.length - 1].slug;
              }
            }
          }

          if (!nextSlug && currentIndex === termTopics.length - 1) {
            // At end of current term, check next term
            const nextTermId =
              currentTerm.id === "term1"
                ? "term2"
                : currentTerm.id === "term2"
                  ? "term3"
                  : null;
            if (nextTermId) {
              const nextTermTopics = getTopicsForTerm(topics, nextTermId);
              if (nextTermTopics.length > 0) {
                nextSlug = nextTermTopics[0].slug;
              }
            }
          }

          setPreviousUrl(
            prevSlug ? `/dashboard/lessons/${subjectSlug}/${prevSlug}` : null,
          );
          setNextUrl(
            nextSlug ? `/dashboard/lessons/${subjectSlug}/${nextSlug}` : null,
          );
        }
      } catch (error) {
        console.error("Failed to load lessons list:", error);
      }
    };

    loadLessons();
  }, [
    currentClass,
    currentTerm,
    lessonContent,
    isSlugBased,
    subjectSlug,
    topicSlug,
  ]);

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
            check_markers:
              lessonContent.check_markers?.map((marker) => ({
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
        description:
          error instanceof Error
            ? error.message
            : "Failed to mark lesson as complete",
        variant: "destructive",
      });
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // Get subject using subject_id from lessonContent
  const subjectId = lessonContent?.subject_id
    ? String(lessonContent.subject_id)
    : null;
  const subject = subjectId ? getSubjectById(subjectId) : null;

  const isCompleted =
    lessonContent?.check_markers?.every((m: any) => m.completed) || false;
  const lessonTopics =
    lessonContent?.concepts?.filter((concept) =>
      Boolean(concept?.title?.trim()),
    ) || [];
  const shouldShowAcademicBadge = Boolean(currentClass && currentTerm);
  const classBadgeLabel =
    lessonContent?.class?.trim() ||
    currentClass?.name ||
    classDisplay.replace(" • ", " ");

  const scrollToLessonTopic = (conceptId: number) => {
    const element = document.getElementById(`concept-${conceptId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.classList.add("ring-2", "ring-primary/40", "bg-primary/5");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-primary/40", "bg-primary/5");
      }, 1200);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
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
            The lesson you&apos;re looking for doesn&apos;t exist or isn&apos;t
            available.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 size-4" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const subjectName = lessonContent.subject || subject?.name || "Subject";
  const lessonTitle = lessonContent.topic || lessonContent.title || "Lesson";
  const lessonDescription =
    lessonContent.overview || topicOverview?.introduction || "";

  return (
    <>
      <MaxWidthWrapper className="pt-6 md:pt-10">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="h-8 rounded-lg"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
            {subject && (
              <Link
                href={`/dashboard/subjects/${subjectSlug || ""}`}
                className={cn(
                  "h-8 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
                  "inline-flex items-center",
                )}
              >
                {subjectName}
              </Link>
            )}
            {shouldShowAcademicBadge && (
              <Badge variant="outline" className="h-8 rounded-lg">
                {classBadgeLabel}  • {termDisplay}
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="default" className="h-8 rounded-lg">
                <CheckCircle className="mr-1 size-3" />
                Completed
              </Badge>
            )}
          </div>
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
            {lessonTitle}
          </h1>
          {lessonDescription && (
            <p className="text-base text-muted-foreground md:text-lg">
              {lessonDescription}
            </p>
          )}
        </div>
      </MaxWidthWrapper>

      <div className="relative">
        <div className="absolute top-52 w-full border-t" />

        <MaxWidthWrapper className="grid grid-cols-4 gap-10 pt-8 max-md:px-0">
          <div className="relative col-span-4 mb-10 flex flex-col space-y-8 border-y bg-background md:rounded-xl md:border lg:col-span-3">
            <div className="px-[.8rem] pb-10 pt-8 md:px-8">
              {/* Topic Overview - Introduction to the lesson */}
              {topicOverview && subjectSlug && topicSlug && (
                <div className="mb-8 space-y-6">
                  <div className="border-b pb-2">
                    <h2 className="text-2xl font-semibold">Topic Overview</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
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
                <div className="space-y-6">
                  {topicOverview && (
                    <div className="border-b pb-2">
                      <h2 className="text-2xl font-semibold">Lesson Content</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
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

              {/* Navigation */}
              <div className="mt-12 border-t pt-8">
                <LessonNavigation previousUrl={previousUrl} nextUrl={nextUrl} />
              </div>
            </div>
          </div>

          <div className="sticky top-20 col-span-1 mt-52 hidden flex-col self-start pb-24 lg:flex">
            <div className="space-y-6">
              {toc?.items && toc.items.length > 0 ? (
                <DashboardTableOfContents toc={toc} />
              ) : (
                <div className="space-y-2">
                  <p className="text-[15px] font-medium">On This Page</p>
                  <p className="text-sm text-muted-foreground">
                    Table of contents will appear here
                  </p>
                </div>
              )}

              {lessonTopics.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[15px] font-medium">Lesson Topics</p>
                  <ul className="space-y-1">
                    {lessonTopics.map((concept) => (
                      <li key={concept.id}>
                        <button
                          type="button"
                          className="text-left text-sm text-primary transition hover:underline"
                          onClick={() => scrollToLessonTopic(concept.id)}
                        >
                          {concept.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
