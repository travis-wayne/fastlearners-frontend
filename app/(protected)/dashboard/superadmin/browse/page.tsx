"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Trash2, RefreshCw, LayoutGrid, Table as TableIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LessonFilters } from "@/components/lessons/LessonFilters";
import { LessonViewer } from "@/components/lessons/LessonViewer";
import { useLessonsStore } from "@/lib/store/lessons";
import { getTrashedLessons } from "@/lib/api/superadmin-lessons";
import { SubjectOverviewCards } from "@/components/superadmin/subject-overview-cards";
import { LessonsTable } from "@/components/superadmin/lessons-table";

type ViewMode = "subjects" | "filtered";

export default function BrowsePage() {
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [trashedCount, setTrashedCount] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>("subjects");
  const [selectedSubject, setSelectedSubject] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const {
    fetchLessons,
    fetchMetadata,
    setSuperadminMode,
    subjects,
    isLoadingMetadata,
    setFilters,
    filters,
  } = useLessonsStore();

  // Fetch trashed lessons count
  const fetchTrashedCount = useCallback(async () => {
    try {
      const response = await getTrashedLessons({ page: 1 });
      if (response.success && response.content) {
        setTrashedCount(response.content.meta?.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch trashed count:", error);
    }
  }, []);

  useEffect(() => {
    // Enable superadmin mode for this view
    setSuperadminMode(true);
    fetchMetadata();
    fetchTrashedCount();
    // Note: Don't auto-fetch lessons on mount - user must select filters first
    // and click "Find Lessons" button to avoid 422 validation errors

    // Cleanup: disable superadmin mode when leaving
    return () => {
      setSuperadminMode(false);
    };
  }, [setSuperadminMode, fetchMetadata, fetchTrashedCount]);

  const handleTrashSuccess = useCallback(
    (lessonId: number) => {
      // Refresh the lessons list and trash count
      fetchLessons();
      fetchTrashedCount();
    },
    [fetchLessons, fetchTrashedCount]
  );

  const handleRefresh = useCallback(() => {
    fetchLessons();
    fetchTrashedCount();
    toast.success("Lessons refreshed");
  }, [fetchLessons, fetchTrashedCount]);

  const handleSubjectSelect = useCallback(
    (subjectId: number, subjectName: string) => {
      setSelectedSubject({ id: subjectId, name: subjectName });
      // Auto-set the subject filter
      setFilters({ subject: subjectId.toString() });
      setViewMode("filtered");
    },
    [setFilters]
  );

  const handleBackToSubjects = useCallback(() => {
    setSelectedSubject(null);
    setViewMode("subjects");
  }, []);

  // Render lesson viewer when a lesson is selected
  if (selectedLessonId) {
    return (
      <div className="space-y-4 pb-20 duration-500 animate-in slide-in-from-right-4">
        <Button
          variant="outline"
          onClick={() => setSelectedLessonId(null)}
          className="mb-4 gap-2"
        >
          <span>←</span> Back to Lessons List
        </Button>
        <LessonViewer
          lessonId={selectedLessonId}
          onBack={() => setSelectedLessonId(null)}
          autoLoad={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 duration-500 animate-in slide-in-from-right-4">
      {/* Header with actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Browse Lessons</h2>
          <p className="text-muted-foreground">
            View, manage, and organize lesson content
          </p>
        </div>
        <div className="flex items-center gap-2">
          {viewMode === "filtered" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="size-4" />
              Refresh
            </Button>
          )}
          <Link href="/dashboard/superadmin/manage/trash">
            <Button variant="outline" size="sm" className="gap-2">
              <Trash2 className="size-4" />
              View Trash
              {trashedCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-amber-100 text-amber-800"
                >
                  {trashedCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* View Mode Tabs */}
      <Tabs
        value={viewMode}
        onValueChange={(value) => setViewMode(value as ViewMode)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="subjects" className="gap-2">
            <LayoutGrid className="size-4" />
            By Subject
          </TabsTrigger>
          <TabsTrigger value="filtered" className="gap-2">
            <TableIcon className="size-4" />
            Filter & Search
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content based on view mode */}
      {viewMode === "subjects" ? (
        <SubjectOverviewCards
          subjects={subjects || []}
          isLoading={isLoadingMetadata}
          onSubjectSelect={handleSubjectSelect}
          selectedSubjectId={selectedSubject?.id}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <LessonFilters
            variant="horizontal-bar"
            sidebar={false}
            showTitle={true}
          />
          <LessonsTable
            onLessonSelect={(id) => setSelectedLessonId(id)}
            onTrashSuccess={handleTrashSuccess}
            showPagination={true}
            selectedSubject={selectedSubject?.name}
            onBackToSubjects={handleBackToSubjects}
          />
        </div>
      )}
    </div>
  );
}
