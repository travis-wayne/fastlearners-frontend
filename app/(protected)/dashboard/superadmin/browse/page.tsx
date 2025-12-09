"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LessonsList } from "@/components/lessons/LessonsList";
import { LessonFilters } from "@/components/lessons/LessonFilters";
import { LessonViewer } from "@/components/lessons/LessonViewer";
import { useLessonsStore } from "@/lib/store/lessons";

export default function BrowsePage() {
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  
  const { 
    fetchLessons, 
    fetchMetadata,
    setSuperadminMode 
  } = useLessonsStore();

  useEffect(() => {
    // Enable superadmin mode for this view
    setSuperadminMode(true);
    fetchMetadata();
    fetchLessons();

    // Cleanup: disable superadmin mode when leaving
    return () => {
      setSuperadminMode(false);
    };
  }, [setSuperadminMode, fetchMetadata, fetchLessons]);

  return (
    <div className="space-y-6 pb-20 duration-500 animate-in slide-in-from-right-4">
      {!selectedLessonId ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <LessonFilters compact={false} sidebar={true} />
          </div>
          <div className="lg:col-span-3">
            <LessonsList 
              onLessonSelect={(id) => setSelectedLessonId(id)}
              showPagination={true}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
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
      )}
    </div>
  );
}
