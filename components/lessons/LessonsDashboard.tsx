"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSubjectsWithSlugs } from "@/lib/api/lessons";
import { getStudentSubjects } from "@/lib/api/subjects";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";
import { useAuthStore } from '@/store/authStore';

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
  const [error, setError] = useState<string | null>(null);
  const [availableSubjects, setAvailableSubjects] = useState<
    Array<{ id: number; name: string; slug?: string }>
  >([]);
  // Sync selectedSubjectId with URL params
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjectIdParam || "all"
  );

  // Sync state with URL params when they change (e.g., back/forward navigation)
  useEffect(() => {
    const urlSubject = searchParams.get("subject");
    const urlSubjectId = searchParams.get("subjectId");
    if (urlSubject) {
      // Find subject by slug and set selectedSubjectId to its id
      const subject = availableSubjects.find(s => s.slug === urlSubject);
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

  // Memoized callback to load available subjects
  // Include all registered subjects: compulsory_selective, subjects, and selective (if selected)
  // Also fetch subjects with slugs to merge slug information
  const loadAvailableSubjects = useMemo(() => {
    return async () => {
      try {
        const [subjectsResponse, slugsResponse] = await Promise.all([
          getStudentSubjects(),
          getSubjectsWithSlugs().catch(() => null), // Don't fail if slugs endpoint fails
        ]);
        
        if (subjectsResponse.success && subjectsResponse.content) {
          // Combine all registered subjects:
          // - compulsory_selective: religious study subject (if selected)
          // - subjects: regular registered subjects
          // - selective: elective subjects (if selected)
          const allSubjects: Array<{ id: number; name: string; slug?: string }> = [];
          
          // Add compulsory selective if selected
          if (subjectsResponse.content.compulsory_selective_status === 'selected' && subjectsResponse.content.compulsory_selective) {
            allSubjects.push(...subjectsResponse.content.compulsory_selective.map(s => ({ id: s.id, name: s.name, slug: s.slug })));
          }
          
          // Add regular subjects
          if (subjectsResponse.content.subjects) {
            allSubjects.push(...subjectsResponse.content.subjects.map(s => ({ id: s.id, name: s.name, slug: s.slug })));
          }
          
          // Add selective subjects if selected
          if (subjectsResponse.content.selective_status === 'selected' && subjectsResponse.content.selective) {
            allSubjects.push(...subjectsResponse.content.selective.map(s => ({ id: s.id, name: s.name, slug: s.slug })));
          }
          
          // Merge slugs from getSubjectsWithSlugs if available
          if (slugsResponse?.success && slugsResponse.content?.subjects) {
            const slugMap = new Map(slugsResponse.content.subjects.map(s => [s.id, s.slug]));
            allSubjects.forEach(subject => {
              if (!subject.slug && slugMap.has(subject.id)) {
                subject.slug = slugMap.get(subject.id);
              }
            });
          }
          
          // Remove duplicates by id
          const uniqueSubjects = Array.from(
            new Map(allSubjects.map(s => [s.id, s])).values()
          );
          
          setAvailableSubjects(uniqueSubjects);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch subjects";
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch subjects:", error);
        }
        setError(errorMessage);
      }
    };
  }, []); // Empty deps - function doesn't depend on any state

  // Fetch available subjects on mount
  useEffect(() => {
    loadAvailableSubjects();
  }, [loadAvailableSubjects]);

  // Refetch subjects when user's class or discipline changes
  useEffect(() => {
    loadAvailableSubjects();
  }, [user?.class, user?.discipline, loadAvailableSubjects]);

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
  const stats = { total: 0, completed: 0, inProgress: 0, notStarted: 0, completionRate: 0 };

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
  if (selectedSubjectId === "all" && availableSubjects.length === 0 && !isLoading) {
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

  const selectedSubject = availableSubjects.find(
    (s) => String(s.id) === selectedSubjectId
  );

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
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
            const subject = availableSubjects.find(s => String(s.id) === value);
            const newUrl = subject?.slug ? `/dashboard/lessons?subject=${subject.slug}` : value !== "all" ? `/dashboard/lessons?subjectId=${value}` : "/dashboard/lessons";
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

      {/* Subject Selection - navigate to topics via slug */}
      {selectedSubjectId !== "all" && selectedSubject && selectedSubject.slug && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              {selectedSubject.name} Lessons
            </h3>
            <p className="mb-4 text-muted-foreground">
              Select a subject to view available topics and lessons.
            </p>
            <Button
              onClick={() => router.push(`/dashboard/lessons?subject=${selectedSubject.slug}`)}
            >
              View Topics
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedSubjectId === "all" && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Select a Subject
            </h3>
            <p className="mb-4 text-muted-foreground">
              Choose a subject from the dropdown above to view available topics and lessons.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}