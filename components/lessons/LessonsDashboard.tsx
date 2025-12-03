"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  Loader2,
  GraduationCap,
  PlayCircle,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import type {
  TopicItem,
  TopicsByTerm,
} from "@/lib/types/lessons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";
import { cn } from "@/lib/utils";

export function LessonsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject");
  const subjectIdParam = searchParams.get("subjectId");

  const { currentClass, currentTerm } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableSubjects, setAvailableSubjects] = useState<
    Array<{ id: number; name: string; slug?: string }>
  >([]);
  const [selectedSubjectTopics, setSelectedSubjectTopics] =
    useState<TopicsByTerm | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjectIdParam || "all",
  );

  // Sync state with URL params when they change (e.g., back/forward navigation)
  useEffect(() => {
    const urlSubject = searchParams.get("subject");
    const urlSubjectId = searchParams.get("subjectId");
    if (urlSubject) {
      const subject = availableSubjects.find((s) => s.slug === urlSubject);
      if (subject) {
        setSelectedSubjectId(String(subject.id));
      }
    } else if (urlSubjectId && urlSubjectId !== selectedSubjectId) {
      setSelectedSubjectId(urlSubjectId);
    } else if (!urlSubject && !urlSubjectId && selectedSubjectId !== "all") {
      setSelectedSubjectId("all");
    }
  }, [searchParams, selectedSubjectId, availableSubjects]);

  // Fetch subjects from /api/lessons/ endpoint
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/lessons", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch subjects");
          setAvailableSubjects([]);
          return;
        }

        if (data.success && data.content?.subjects) {
          const subjects = data.content.subjects.map(
            (s: { id: number; name: string; slug: string }) => ({
              id: s.id,
              name: s.name,
              slug: s.slug,
            }),
          );
          setAvailableSubjects(subjects);
        } else {
          setError(data.message || "No subjects found");
          setAvailableSubjects([]);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch subjects";
        setError(errorMessage);
        setAvailableSubjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [user?.class, user?.discipline]);

  const selectedSubject = availableSubjects.find(
    (s) => String(s.id) === selectedSubjectId,
  );

  // Fetch topics when a subject is selected
  useEffect(() => {
    const loadTopics = async () => {
      if (selectedSubjectId === "all") {
        setSelectedSubjectTopics(null);
        return;
      }

      const subject = availableSubjects.find(
        (s) => String(s.id) === selectedSubjectId,
      );

      if (!subject || !subject.slug) {
        setSelectedSubjectTopics(null);
        return;
      }

      setIsLoadingTopics(true);
      setError(null);

      try {
        const response = await fetch(`/api/lessons/${subject.slug}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load topics");
          setSelectedSubjectTopics(null);
          return;
        }

        if (data.success && data.content?.topics) {
          setSelectedSubjectTopics(data.content.topics);
        } else {
          setError(data.message || "No topics found");
          setSelectedSubjectTopics(null);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load topics";
        setError(errorMessage);
        setSelectedSubjectTopics(null);
      } finally {
        setIsLoadingTopics(false);
      }
    };

    loadTopics();
  }, [selectedSubjectId, availableSubjects]);

  useEffect(() => {
    if (!currentClass || !currentTerm) {
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }, [currentClass, currentTerm]);

  // Calculate topic counts
  const totalTopics =
    (selectedSubjectTopics?.first_term?.length || 0) +
    (selectedSubjectTopics?.second_term?.length || 0) +
    (selectedSubjectTopics?.third_term?.length || 0);

  if (!currentClass || !currentTerm) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10">
              <GraduationCap className="size-10 text-primary" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Select Class and Term</h3>
            <p className="mb-6 text-muted-foreground">
              Please select your class and term to view available lessons.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/dashboard/subjects")}
              className="bg-primary hover:bg-primary/90"
            >
              Go to Subjects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (
    selectedSubjectId === "all" &&
    availableSubjects.length === 0 &&
    !isLoading
  ) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="size-10 text-primary" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">No Subjects Registered</h3>
            <p className="mb-6 text-muted-foreground">
              Please register your subjects to view available lessons.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/dashboard/subjects")}
              className="bg-primary hover:bg-primary/90"
            >
              Register Subjects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12">
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20">
              <GraduationCap className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Interactive Lessons
              </h1>
              <p className="mt-1 text-muted-foreground">
                {classDisplay} • {termDisplay}
              </p>
            </div>
          </div>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Explore engaging, interactive lessons designed to help you master
            each topic. Start learning at your own pace.
          </p>
        </div>
        <div className="absolute right-0 top-0 -z-0 size-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-2">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setError(null);
                  if (currentClass && currentTerm) {
                    setIsLoading(true);
                    setSelectedSubjectId(selectedSubjectId);
                  }
                }}
              >
                Retry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/subjects")}
              >
                Go to Subjects
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Subject Selector */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Choose Your Subject</CardTitle>
              <CardDescription className="mt-1">
                Select a subject to explore available lessons
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {availableSubjects.length} Subjects
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedSubjectId}
            onValueChange={(value) => {
              setSelectedSubjectId(value);
              const subject = availableSubjects.find(
                (s) => String(s.id) === value,
              );
              const newUrl = subject?.slug
                ? `/dashboard/lessons?subject=${subject.slug}`
                : value !== "all"
                  ? `/dashboard/lessons?subjectId=${value}`
                  : "/dashboard/lessons";
              router.push(newUrl);
            }}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {availableSubjects.map((subject) => (
                <SelectItem key={subject.id} value={String(subject.id)}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Topics Display */}
      {selectedSubjectId !== "all" &&
        selectedSubject &&
        selectedSubject.slug && (
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="size-5 text-primary" />
                    </div>
                    {selectedSubject.name} Lessons
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {totalTopics > 0
                      ? `${totalTopics} topics available across all terms`
                      : "No topics available"}
                  </CardDescription>
                </div>
                {totalTopics > 0 && (
                  <Badge variant="default" className="text-sm">
                    {totalTopics} Topics
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTopics ? (
                <div className="space-y-4 py-8">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : selectedSubjectTopics ? (
                <Tabs defaultValue="first_term" className="w-full">
                  <TabsList className="mb-6 grid w-full grid-cols-3">
                    {selectedSubjectTopics.first_term &&
                      selectedSubjectTopics.first_term.length > 0 && (
                        <TabsTrigger value="first_term" className="text-sm">
                          <span className="flex items-center gap-2">
                            <TrendingUp className="size-4" />
                            First Term
                            <Badge variant="secondary" className="ml-1">
                              {selectedSubjectTopics.first_term.length}
                            </Badge>
                          </span>
                        </TabsTrigger>
                      )}
                    {selectedSubjectTopics.second_term &&
                      selectedSubjectTopics.second_term.length > 0 && (
                        <TabsTrigger value="second_term" className="text-sm">
                          <span className="flex items-center gap-2">
                            <TrendingUp className="size-4" />
                            Second Term
                            <Badge variant="secondary" className="ml-1">
                              {selectedSubjectTopics.second_term.length}
                            </Badge>
                          </span>
                        </TabsTrigger>
                      )}
                    {selectedSubjectTopics.third_term &&
                      selectedSubjectTopics.third_term.length > 0 && (
                        <TabsTrigger value="third_term" className="text-sm">
                          <span className="flex items-center gap-2">
                            <TrendingUp className="size-4" />
                            Third Term
                            <Badge variant="secondary" className="ml-1">
                              {selectedSubjectTopics.third_term.length}
                            </Badge>
                          </span>
                        </TabsTrigger>
                      )}
                  </TabsList>

                  {/* First Term */}
                  {selectedSubjectTopics.first_term &&
                    selectedSubjectTopics.first_term.length > 0 && (
                      <TabsContent value="first_term" className="space-y-3">
                        {selectedSubjectTopics.first_term.map(
                          (topic: TopicItem, index: number) => (
                            <TooltipProvider key={topic.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Card
                                    className={cn(
                                      "group cursor-pointer border-2 bg-gradient-to-r from-background to-muted/30 transition-all duration-300 hover:border-primary hover:shadow-lg",
                                    )}
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/lessons/${selectedSubject.slug}/${topic.slug}`,
                                      )
                                    }
                                  >
                                    <CardContent className="p-6">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                                            <PlayCircle className="size-6" />
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                variant="outline"
                                                className="font-semibold"
                                              >
                                                Week {topic.week}
                                              </Badge>
                                              <span className="text-xs text-muted-foreground">
                                                Lesson {index + 1}
                                              </span>
                                            </div>
                                            <h3 className="mt-1 text-lg font-semibold transition-colors group-hover:text-primary">
                                              {topic.topic}
                                            </h3>
                                          </div>
                                        </div>
                                        <ChevronRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Click to start learning</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ),
                        )}
                      </TabsContent>
                    )}

                  {/* Second Term */}
                  {selectedSubjectTopics.second_term &&
                    selectedSubjectTopics.second_term.length > 0 && (
                      <TabsContent value="second_term" className="space-y-3">
                        {selectedSubjectTopics.second_term.map(
                          (topic: TopicItem, index: number) => (
                            <TooltipProvider key={topic.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Card
                                    className={cn(
                                      "group cursor-pointer border-2 bg-gradient-to-r from-background to-muted/30 transition-all duration-300 hover:border-primary hover:shadow-lg",
                                    )}
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/lessons/${selectedSubject.slug}/${topic.slug}`,
                                      )
                                    }
                                  >
                                    <CardContent className="p-6">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                                            <PlayCircle className="size-6" />
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                variant="outline"
                                                className="font-semibold"
                                              >
                                                Week {topic.week}
                                              </Badge>
                                              <span className="text-xs text-muted-foreground">
                                                Lesson {index + 1}
                                              </span>
                                            </div>
                                            <h3 className="mt-1 text-lg font-semibold transition-colors group-hover:text-primary">
                                              {topic.topic}
                                            </h3>
                                          </div>
                                        </div>
                                        <ChevronRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Click to start learning</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ),
                        )}
                      </TabsContent>
                    )}

                  {/* Third Term */}
                  {selectedSubjectTopics.third_term &&
                    selectedSubjectTopics.third_term.length > 0 && (
                      <TabsContent value="third_term" className="space-y-3">
                        {selectedSubjectTopics.third_term.map(
                          (topic: TopicItem, index: number) => (
                            <TooltipProvider key={topic.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Card
                                    className={cn(
                                      "group cursor-pointer border-2 bg-gradient-to-r from-background to-muted/30 transition-all duration-300 hover:border-primary hover:shadow-lg",
                                    )}
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/lessons/${selectedSubject.slug}/${topic.slug}`,
                                      )
                                    }
                                  >
                                    <CardContent className="p-6">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                                            <PlayCircle className="size-6" />
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                variant="outline"
                                                className="font-semibold"
                                              >
                                                Week {topic.week}
                                              </Badge>
                                              <span className="text-xs text-muted-foreground">
                                                Lesson {index + 1}
                                              </span>
                                            </div>
                                            <h3 className="mt-1 text-lg font-semibold transition-colors group-hover:text-primary">
                                              {topic.topic}
                                            </h3>
                                          </div>
                                        </div>
                                        <ChevronRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Click to start learning</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ),
                        )}
                      </TabsContent>
                    )}

                  {/* No topics message */}
                  {totalTopics === 0 && (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                        <BookOpen className="size-8 text-muted-foreground" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">
                        No topics available
                      </h3>
                      <p className="text-muted-foreground">
                        Topics for this subject will appear here when available.
                      </p>
                    </div>
                  )}
                </Tabs>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
            </CardContent>
          </Card>
        )}

      {selectedSubjectId === "all" && (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="size-10 text-primary" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Select a Subject</h3>
            <p className="mb-6 text-muted-foreground">
              Choose a subject from the dropdown above to view available topics
              and lessons.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
