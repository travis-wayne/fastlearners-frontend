'use client';

import React, { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Filter, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLessonsStore, selectCanFetchLessons } from '@/lib/store/lessons';

interface LessonFiltersProps {
  onFiltersChange?: () => void;
  compact?: boolean;
  showTitle?: boolean;
}

export function LessonFilters({ 
  onFiltersChange, 
  compact = false,
  showTitle = true 
}: LessonFiltersProps) {
  const {
    classes,
    subjects,
    terms,
    weeks,
    filters,
    isLoadingMetadata,
    error,
    setFilters,
    clearFilters,
    fetchMetadata,
    fetchLessons,
    clearError,
  } = useLessonsStore();

  const canFetchLessons = useLessonsStore(selectCanFetchLessons);

  // Fetch metadata on mount
  useEffect(() => {
    if (classes.length === 0 && !isLoadingMetadata) {
      fetchMetadata();
    }
  }, [classes.length, isLoadingMetadata, fetchMetadata]);

  // Call onFiltersChange when filters change
  useEffect(() => {
    onFiltersChange?.();
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({ [key]: value });
    
    // Clear error when user changes filters
    if (error) {
      clearError();
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    clearError();
  };

  const handleFetchLessons = () => {
    if (canFetchLessons) {
      fetchLessons();
    }
  };

  const isFiltersSelected = canFetchLessons;
  const hasAnyFilter = Object.values(filters).some(value => value !== '');

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {isLoadingMetadata ? (
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        ) : (
          <>
            <Select 
              value={filters.class} 
              onValueChange={(value) => handleFilterChange('class', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.subject} 
              onValueChange={(value) => handleFilterChange('subject', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.term} 
              onValueChange={(value) => handleFilterChange('term', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Term" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term.id} value={term.id.toString()}>
                    {term.name} Term
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.week} 
              onValueChange={(value) => handleFilterChange('week', value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Week" />
              </SelectTrigger>
              <SelectContent>
                {weeks.map((week) => (
                  <SelectItem key={week.id} value={week.id.toString()}>
                    Week {week.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasAnyFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="text-sm"
              >
                Clear
              </Button>
            )}

            <Button
              onClick={handleFetchLessons}
              disabled={!canFetchLessons}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
            <Filter className="mr-2 size-4" />
              Find Lessons
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <Card className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      {showTitle && (
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            <Filter className="size-5" />
            Filter Lessons
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoadingMetadata ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Class
              </label>
              <Select 
                value={filters.class} 
                onValueChange={(value) => handleFilterChange('class', value)}
              >
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <Select 
                value={filters.subject} 
                onValueChange={(value) => handleFilterChange('subject', value)}
              >
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Term
              </label>
              <Select 
                value={filters.term} 
                onValueChange={(value) => handleFilterChange('term', value)}
              >
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((term) => (
                    <SelectItem key={term.id} value={term.id.toString()}>
                      {term.name} Term
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Week
              </label>
              <Select 
                value={filters.week} 
                onValueChange={(value) => handleFilterChange('week', value)}
              >
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  {weeks.map((week) => (
                    <SelectItem key={week.id} value={week.id.toString()}>
                      Week {week.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Filter status and actions */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            {isFiltersSelected && (
              <Badge variant="secondary" className="text-sm">
                Filters Applied
              </Badge>
            )}
            {hasAnyFilter && !isFiltersSelected && (
              <Badge variant="outline" className="text-sm">
                Partial Selection
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            {hasAnyFilter && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                size="sm"
              >
                <RefreshCw className="mr-2 size-4" />
                Clear Filters
              </Button>
            )}
            
            <Button
              onClick={handleFetchLessons}
              disabled={!canFetchLessons}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Filter className="mr-2 size-4" />
              Find Lessons
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}