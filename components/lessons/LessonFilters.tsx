"use client";

import React, { useEffect } from "react";
import {
  AlertCircle,
  Filter,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { selectCanFetchLessons, useLessonsStore } from "@/lib/store/lessons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LessonFiltersProps {
  onFiltersChange?: () => void;
  compact?: boolean;
  showTitle?: boolean;
  sidebar?: boolean;
}

export function LessonFilters({
  onFiltersChange,
  compact = false,
  showTitle = true,
  sidebar = false,
}: LessonFiltersProps) {
  // ... (existing hooks)

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
  const hasAnyFilter = Object.values(filters).some((value) => value !== "");

  if (compact) {
    return (
      <div className="flex flex-col flex-wrap items-center gap-2 sm:flex-row">
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
              onValueChange={(value) => handleFilterChange("class", value)}
            >
              <SelectTrigger className="h-10 w-full sm:h-11 sm:w-32">
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
              onValueChange={(value) => handleFilterChange("subject", value)}
            >
              <SelectTrigger className="h-10 w-full sm:h-11 sm:w-32">
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
              onValueChange={(value) => handleFilterChange("term", value)}
            >
              <SelectTrigger className="h-10 w-full sm:h-11 sm:w-32">
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
              onValueChange={(value) => handleFilterChange("week", value)}
            >
              <SelectTrigger className="h-10 w-full sm:h-11 sm:w-24">
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
              className="h-10 flex-1 bg-blue-600 font-semibold hover:bg-blue-700 sm:flex-none"
            >
              <Filter className="mr-2 size-4" />
              Find
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("border-2 shadow-lg", sidebar && "border-0 bg-transparent shadow-none")}>
      {showTitle && (
        <CardHeader className={cn("pb-4", sidebar && "px-0")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 sm:size-10">
                <Filter className="size-4 text-primary sm:size-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold sm:text-xl">Filter Lessons</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  Select filters to find your lessons
                </p>
              </div>
            </div>
            {isFiltersSelected && (
              <Badge variant="default" className="text-sm font-medium">
                <Sparkles className="mr-1 size-3" />
                Active
              </Badge>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent className={cn("responsive-padding space-y-6", sidebar && "px-0")}>
        {error && (
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="size-4" />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {isLoadingMetadata ? (
          <div className={cn(
            "grid grid-cols-1 gap-4",
            !sidebar && "sm:grid-cols-2 lg:grid-cols-4"
          )}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className={cn(
            "grid grid-cols-1 gap-4",
            !sidebar && "md:grid-cols-2 lg:grid-cols-4"
          )}>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span>Class</span>
                {filters.class && (
                  <Badge variant="secondary" className="text-xs">
                    Selected
                  </Badge>
                )}
              </label>
              <Select
                value={filters.class}
                onValueChange={(value) => handleFilterChange("class", value)}
              >
                <SelectTrigger className="h-10 bg-muted/50 transition-colors hover:bg-muted sm:h-11">
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
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span>Subject</span>
                {filters.subject && (
                  <Badge variant="secondary" className="text-xs">
                    Selected
                  </Badge>
                )}
              </label>
              <Select
                value={filters.subject}
                onValueChange={(value) => handleFilterChange("subject", value)}
              >
                <SelectTrigger className="h-10 bg-muted/50 transition-colors hover:bg-muted sm:h-11">
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
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span>Term</span>
                {filters.term && (
                  <Badge variant="secondary" className="text-xs">
                    Selected
                  </Badge>
                )}
              </label>
              <Select
                value={filters.term}
                onValueChange={(value) => handleFilterChange("term", value)}
              >
                <SelectTrigger className="h-10 bg-muted/50 transition-colors hover:bg-muted sm:h-11">
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
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span>Week</span>
                {filters.week && (
                  <Badge variant="secondary" className="text-xs">
                    Selected
                  </Badge>
                )}
              </label>
              <Select
                value={filters.week}
                onValueChange={(value) => handleFilterChange("week", value)}
              >
                <SelectTrigger className="h-11 bg-muted/50 transition-colors hover:bg-muted sm:h-12">
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
        <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {isFiltersSelected && (
              <Badge variant="default" className="text-xs font-medium sm:text-sm">
                <Filter className="mr-1.5 size-3" />
                All Filters Applied
              </Badge>
            )}
            {hasAnyFilter && !isFiltersSelected && (
              <Badge variant="outline" className="text-xs font-medium sm:text-sm">
                <AlertCircle className="mr-1.5 size-3" />
                Incomplete Selection
              </Badge>
            )}
            {!hasAnyFilter && (
              <p className="text-xs text-muted-foreground sm:text-sm">
                Select filters to find lessons
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            {hasAnyFilter && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                size="default"
                className="mobile-touch-target w-full font-medium sm:h-11 sm:w-auto sm:px-8"
              >
                <X className="mr-2 size-4" />
                Clear All
              </Button>
            )}

            <Button
              onClick={handleFetchLessons}
              disabled={!canFetchLessons}
              size="default"
              className="mobile-touch-target w-full bg-primary font-medium shadow-md hover:bg-primary/90 sm:h-11 sm:w-auto sm:px-8"
            >
              <Search className="mr-2 size-4" />
              Find Lessons
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
