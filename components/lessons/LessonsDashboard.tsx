"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { AlertCircle, BookOpen, ChevronRight, Loader2 } from "lucide-react";

import type {
  TopicItem,
  TopicItem,
  TopicsByTerm,
  TopicsByTerm,
} from "@/lib/types/lessons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";

// LessonCard removed - lessons are accessed via subject/topic slugs only

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
  // Sync selectedSubjectId with URL params
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjectIdParam || "all",
  );

  // Sync state with URL params when they change (e.g., back/forward navigation)
  useEffect(() => {
    const urlSubject = searchParams.get("subject");
    const urlSubjectId = searchParams.get("subjectId");
    if (urlSubject) {
      // Find subject by slug and set selectedSubjectId to its id
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Fetch subjects from /api/lessons/ endpoint
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Direct API call to /api/lessons/ endpoint
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

        // API returns: { success: true, content: { subjects: [...] } }
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
  }, [user?.class, user?.discipline]); // Refetch when class/discipline changes

  // Get selected subject
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
        // Direct API call to /api/lessons/{subjectSlug} endpoint
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

        // API returns: { success: true, content: { topics: { first_term: [], second_term: [], third_term: [] } } }
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

  // LessonsDashboard uses slug-based navigation only
  // Lessons are accessed via subject/topic slugs, not from a list
  useEffect(() => {
    if (!currentClass || !currentTerm) {
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }, [currentClass, currentTerm]);

  // Stats removed - lessons are accessed via subject/topic slugs only
  const stats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    completionRate: 0,
  };

  if (!currentClass || !currentTerm) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Select Class and Term
            </h3>
            <p className="mb-4 text-muted-foreground">
              Please select your class and term to view available lessons.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/subjects")}
            >
              Go to Subjects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show call-to-action if no subjects registered and "all" is selected
  if (
    selectedSubjectId === "all" &&
    availableSubjects.length === 0 &&
    !isLoading
  ) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              No Subjects Registered
            </h3>
            <p className="mb-4 text-muted-foreground">
              Please register your subjects to view available lessons.
            </p>
            <Button onClick={() => router.push("/dashboard/subjects")}>
              Register Subjects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
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
                  // Retry fetching
                  if (currentClass && currentTerm) {
                    setIsLoading(true);
                    // Trigger re-fetch by updating a dependency
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

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* <div>
          <h1 className="text-3xl font-bold">Lessons</h1>
          <p className="text-muted-foreground">
            {selectedSubject
              ? `Lessons for ${selectedSubject.name} - ${classDisplay} - ${termDisplay}`
              : `All lessons for ${classDisplay} - ${termDisplay}`}
          </p>
        </div> */}
        <Select
          value={selectedSubjectId}
          onValueChange={(value) => {
            setSelectedSubjectId(value);
            // Update URL without causing full page reload
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
          <SelectTrigger className="w-[200px]">
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
      </div>

      {/* Subject Selection - Show topics in accordion */}
      {selectedSubjectId !== "all" &&
        selectedSubject &&
        selectedSubject.slug && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedSubject.name} Topics</CardTitle>
              <CardDescription>
                Select a topic to view the lesson overview and content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTopics ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="mr-2 size-6 animate-spin text-primary" />
                  <span className="text-muted-foreground">
                    Loading topics...
                  </span>
                </div>
              ) : selectedSubjectTopics ? (
                <Accordion type="single" collapsible className="w-full">
                  {/* First Term */}
                  {selectedSubjectTopics.first_term &&
                    selectedSubjectTopics.first_term.length > 0 && (
                      <AccordionItem value="first_term">
                        <AccordionTrigger>
                          First Term ({selectedSubjectTopics.first_term.length}{" "}
                          topics)
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {selectedSubjectTopics.first_term.map(
                              (topic: TopicItem) => (
                                <Button
                                  key={topic.id}
                                  variant="ghost"
                                  className="w-full justify-between"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/lessons/${selectedSubject.slug}/${topic.slug}`,
                                    )
                                  }
                                >
                                  <span className="text-left">
                                    <span className="font-medium">
                                      Week {topic.week}
                                    </span>{" "}
                                    - {topic.topic}
                                  </span>
                                  <ChevronRight className="size-4" />
                                </Button>
                              ),
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                  {/* Second Term */}
                  {selectedSubjectTopics.second_term &&
                    selectedSubjectTopics.second_term.length > 0 && (
                      <AccordionItem value="second_term">
                        <AccordionTrigger>
                          Second Term (
                          {selectedSubjectTopics.second_term.length} topics)
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {selectedSubjectTopics.second_term.map(
                              (topic: TopicItem) => (
                                <Button
                                  key={topic.id}
                                  variant="ghost"
                                  className="w-full justify-between"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/lessons/${selectedSubject.slug}/${topic.slug}`,
                                    )
                                  }
                                >
                                  <span className="text-left">
                                    <span className="font-medium">
                                      Week {topic.week}
                                    </span>{" "}
                                    - {topic.topic}
                                  </span>
                                  <ChevronRight className="size-4" />
                                </Button>
                              ),
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                  {/* Third Term */}
                  {selectedSubjectTopics.third_term &&
                    selectedSubjectTopics.third_term.length > 0 && (
                      <AccordionItem value="third_term">
                        <AccordionTrigger>
                          Third Term ({selectedSubjectTopics.third_term.length}{" "}
                          topics)
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {selectedSubjectTopics.third_term.map(
                              (topic: TopicItem) => (
                                <Button
                                  key={topic.id}
                                  variant="ghost"
                                  className="w-full justify-between"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/lessons/${selectedSubject.slug}/${topic.slug}`,
                                    )
                                  }
                                >
                                  <span className="text-left">
                                    <span className="font-medium">
                                      Week {topic.week}
                                    </span>{" "}
                                    - {topic.topic}
                                  </span>
                                  <ChevronRight className="size-4" />
                                </Button>
                              ),
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                  {/* No topics message */}
                  {(!selectedSubjectTopics.first_term ||
                    selectedSubjectTopics.first_term.length === 0) &&
                    (!selectedSubjectTopics.second_term ||
                      selectedSubjectTopics.second_term.length === 0) &&
                    (!selectedSubjectTopics.third_term ||
                      selectedSubjectTopics.third_term.length === 0) && (
                      <div className="py-8 text-center text-muted-foreground">
                        No topics available for this subject.
                      </div>
                    )}
                </Accordion>
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
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Select a Subject</h3>
            <p className="mb-4 text-muted-foreground">
              Choose a subject from the dropdown above to view available topics
              and lessons.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
