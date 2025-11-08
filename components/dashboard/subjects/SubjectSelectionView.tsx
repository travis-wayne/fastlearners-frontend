"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getStudentSubjects, updateCompulsorySelective, updateSelectiveSubjects } from "@/lib/api/subjects";
import CompulsorySelector from "@/components/dashboard/subjects/compulsory-selector";
import SelectiveGrid from "@/components/dashboard/subjects/selective-grid";
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/shared/card-skeleton";
import type { SubjectsResponse, Class } from "@/lib/types/subjects";

interface SubjectSelectionViewProps {
  selectedClass?: Class | null;
  onComplete?: () => void;
}

export const SubjectSelectionView: React.FC<SubjectSelectionViewProps> = ({
  selectedClass,
  onComplete,
}) => {
  const { user } = useAuthStore();
  const [data, setData] = useState<SubjectsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classLevel, setClassLevel] = useState<'JSS' | 'SSS'>('SSS');
  const [savingCompulsory, setSavingCompulsory] = useState(false);
  const [savingSelective, setSavingSelective] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getStudentSubjects();
      if (result.success) {
        setData(result);
        
        // Determine classLevel: prioritize selectedClass, then user.class, then infer from content
        if (selectedClass) {
          setClassLevel(selectedClass.name.startsWith('JSS') ? 'JSS' : 'SSS');
        } else if (user?.class) {
          setClassLevel(user.class.startsWith('JSS') ? 'JSS' : 'SSS');
        } else if (result.content?.compulsory_selective && result.content.compulsory_selective.length > 0) {
          setClassLevel('JSS');
        } else {
          setClassLevel('SSS');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass]);

  // Removed redirect to /dashboard/subjects - users stay on subject selection page

  const handleCompulsorySave = async (id: number) => {
    setSavingCompulsory(true);
    try {
      const result = await updateCompulsorySelective(id);
      if (result.success) {
        await fetchData();
        // Check if both selections are complete
        const newData = await getStudentSubjects();
        if (newData.success && newData.content) {
          const { compulsory_selective_status, selective_status } = newData.content;
          const isSSS = selectedClass?.name.startsWith('SSS') || 
            (!selectedClass && user?.class?.startsWith('SSS')) ||
            (!selectedClass && !user?.class && (!newData.content.compulsory_selective || newData.content.compulsory_selective.length === 0));
          const isComplete = isSSS
            ? selective_status === 'selected'
            : compulsory_selective_status === 'selected' && selective_status === 'selected';
          if (isComplete && onComplete) {
            onComplete();
          }
        }
      }
    } finally {
      setSavingCompulsory(false);
    }
  };

  const handleSelectiveSave = async (ids: number[]) => {
    setSavingSelective(true);
    try {
      const result = await updateSelectiveSubjects(ids);
      if (result.success) {
        await fetchData();
        // Check if selection is complete
        const newData = await getStudentSubjects();
        if (newData.success && newData.content) {
          const { compulsory_selective_status, selective_status } = newData.content;
          const isSSS = selectedClass?.name.startsWith('SSS') || 
            (!selectedClass && user?.class?.startsWith('SSS')) ||
            (!selectedClass && !user?.class && (!newData.content.compulsory_selective || newData.content.compulsory_selective.length === 0));
          const isComplete = isSSS
            ? selective_status === 'selected'
            : compulsory_selective_status === 'selected' && selective_status === 'selected';
          if (isComplete && onComplete) {
            onComplete();
          }
        }
      }
    } finally {
      setSavingSelective(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Subject Selection</h1>
        </div>
        <div className="grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Subject Selection</h1>
        </div>
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">{error || 'An error occurred'}</p>
          <Button onClick={fetchData} variant="default">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { content } = data;

  // Guard all content field accesses with null/undefined checks
  if (!content) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Subject Selection</h1>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">No content available</p>
        </div>
      </div>
    );
  }

  // Pre-populate selected IDs from content.subjects to support resume flow
  // Build a Set of selectable option IDs from content.selective
  const selectiveOptionIds = new Set(
    content.selective ? content.selective.map(subject => subject.id) : []
  );
  // Filter content.subjects to those IDs, then map to IDs
  const selectedSelectiveIds = content.subjects
    ? content.subjects
        .filter(subject => selectiveOptionIds.has(subject.id))
        .map(subject => subject.id)
    : [];

  return (
    <div className="space-y-6">
      {classLevel === 'JSS' && content.compulsory_selective_status === 'pending' && content.compulsory_selective ? (
        <CompulsorySelector
          subjects={content.compulsory_selective}
          onSave={handleCompulsorySave}
          isLoading={savingCompulsory}
        />
      ) : content.selective ? (
        <SelectiveGrid
          subjects={content.selective}
          selectedIds={selectedSelectiveIds}
          limit={classLevel === 'JSS' ? 4 : 5}
          onSave={handleSelectiveSave}
          isLoading={savingSelective}
          classLevel={classLevel}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No subjects available for selection.</p>
        </div>
      )}
    </div>
  );
};


