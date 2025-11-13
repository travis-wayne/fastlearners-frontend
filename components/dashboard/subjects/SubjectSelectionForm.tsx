'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getSubjectIcon, getSelectiveRequirement } from '@/data/subjects-metadata';
import { getSubjects, updateCompulsorySelective, updateSelectiveSubjects } from '@/lib/api/subjects';
import type { SubjectItem } from '@/lib/types/subjects';
import { useAuthStore } from '@/store/authStore';

interface SubjectSelectionFormProps {
  token?: string; // Optional token for direct API calls (server-side)
  classLevel: string;
}

export function SubjectSelectionForm({ token, classLevel }: SubjectSelectionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectsData, setSubjectsData] = useState<{
    subjects: SubjectItem[];
    compulsory_selective_status: 'not_selected' | 'selected';
    compulsory_selective: SubjectItem[];
    selective_status: 'not_selected' | 'selected';
    selective: SubjectItem[];
  } | null>(null);
  
  const [selectedCompulsory, setSelectedCompulsory] = useState<number | null>(null);
  const [selectedElectives, setSelectedElectives] = useState<number[]>([]);

  const isJSS = classLevel.startsWith('JSS');
  const requiredElectives = getSelectiveRequirement(classLevel);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    // Refetch subjects when user's class changes
    if (user?.class !== classLevel) {
      fetchSubjects();
    }
  }, [user?.class]);

  const fetchSubjects = async () => {
    try {
      let data;
      
      if (token) {
        // Use direct API call with token
        data = await getSubjects(token);
      } else {
        // Use internal API route
        const response = await fetch('/api/subjects', {
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch subjects');
        const result = await response.json();
        data = result.content;
      }

      setSubjectsData(data);
      
      // Pre-select compulsory selective if already selected
      // Only preselect if backend supplies a dedicated field for chosen IDs
      // The compulsory_selective array contains available options, not selected items
      // We should only preselect if there's a dedicated selected field
      // For now, initialize as empty - actual selections should come from a dedicated endpoint
      setSelectedCompulsory(null);
      setSelectedElectives([]);
      
      // TODO: If backend provides a dedicated field for selected IDs, use it here
      // Example: if (data.selected_compulsory_id) setSelectedCompulsory(data.selected_compulsory_id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch subjects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCompulsory = async () => {
    if (!selectedCompulsory) {
      toast.error('Please select a religious study subject');
      return;
    }

    setIsSubmitting(true);
    try {
      if (token) {
        await updateCompulsorySelective(token, selectedCompulsory);
      } else {
        const response = await fetch('/api/subjects/update-compulsory-selective', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ subject: selectedCompulsory }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to update compulsory subject');
        }
      }

      toast.success('Core subject saved!');
      // Refresh auth store and subjects
      useAuthStore.getState().hydrate();
      await fetchSubjects(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || 'Failed to update compulsory subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitElectives = async () => {
    if (selectedElectives.length !== requiredElectives) {
      toast.error(`Please select exactly ${requiredElectives} elective subjects`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (token) {
        await updateSelectiveSubjects(token, selectedElectives);
      } else {
        // Use JSON format for internal route (consistent with API route)
        const response = await fetch('/api/subjects/update-selective', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ subjects: selectedElectives }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to update elective subjects');
        }
      }

      toast.success('All subjects registered successfully!');
      // Refresh auth store to get latest subject selections
      await useAuthStore.getState().hydrate();
      // Refresh subjects data
      await fetchSubjects();
      router.push('/dashboard/subjects');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update elective subjects');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleElective = (id: number) => {
    setSelectedElectives(prev => {
      if (prev.includes(id)) {
        return prev.filter(sid => sid !== id);
      } else if (prev.length < requiredElectives) {
        return [...prev, id];
      }
      return prev;
    });
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading subjects...</span>
        </div>
      </Card>
    );
  }

  if (!subjectsData) return null;

  const compulsoryComplete = subjectsData.compulsory_selective_status === 'selected';
  const showElectives = compulsoryComplete;

  return (
    <div className="space-y-6">
      {/* Compulsory Selective Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Core Subject (Religious Studies)</CardTitle>
              <CardDescription>Select ONE religious study subject</CardDescription>
            </div>
            {compulsoryComplete && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Complete
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {subjectsData.compulsory_selective.map((subject) => (
              <button
                key={subject.id}
                onClick={() => !compulsoryComplete && setSelectedCompulsory(subject.id)}
                disabled={compulsoryComplete}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  ${selectedCompulsory === subject.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }
                  ${compulsoryComplete ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getSubjectIcon(subject.name)}</span>
                    <span className="font-semibold">{subject.name}</span>
                  </div>
                  {selectedCompulsory === subject.id && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {!compulsoryComplete && (
            <Button
              onClick={handleSubmitCompulsory}
              disabled={!selectedCompulsory || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Core Subject'
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Elective Subjects Section */}
      {showElectives && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Elective Subjects</CardTitle>
                <CardDescription>
                  Select {requiredElectives} subjects from the list
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {selectedElectives.length}/{requiredElectives}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={(selectedElectives.length / requiredElectives) * 100} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subjectsData.selective.map((subject) => {
                const isSelected = selectedElectives.includes(subject.id);
                const isDisabled = !isSelected && selectedElectives.length >= requiredElectives;

                return (
                  <button
                    key={subject.id}
                    onClick={() => !isDisabled && toggleElective(subject.id)}
                    disabled={isDisabled}
                    className={`
                      p-4 rounded-lg border-2 text-left transition-all
                      ${isSelected
                        ? 'border-primary bg-primary/5'
                        : isDisabled
                        ? 'border-border opacity-50 cursor-not-allowed'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getSubjectIcon(subject.name)}</span>
                        <span className="font-semibold">{subject.name}</span>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleSubmitElectives}
              disabled={selectedElectives.length !== requiredElectives || isSubmitting}
              size="lg"
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete Registration ({selectedElectives.length}/{requiredElectives})
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}