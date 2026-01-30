import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Progress Card Skeleton */}
      <Card className="border-2 bg-gradient-to-r from-primary/5 via-primary/5 to-background">
        <CardContent className="responsive-padding">
          <div className="space-y-3">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-lg sm:size-10" />
                <div>
                  <Skeleton className="mb-1 h-3 w-20 sm:h-4 sm:w-24" />
                  <Skeleton className="h-6 w-12 sm:h-8 sm:w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full sm:h-6 sm:w-20" />
            </div>
            <Skeleton className="h-2 w-full rounded-full sm:h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Breadcrumb Skeleton */}
      <Card className="border-2">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, index) => (
              <React.Fragment key={index}>
                <Skeleton className="h-5 w-12 shrink-0 sm:h-6 sm:w-16" />
                {index < 3 && <Skeleton className="size-3 shrink-0 sm:size-4" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Skeleton */}
      <Card className="bg-card">
        <CardHeader>
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Content Skeletons */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-28 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Navigation Skeleton */}
      <Card className="border-2">
        <CardContent className="responsive-padding">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Skeleton className="h-10 w-full rounded-lg sm:h-12 sm:w-32" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="h-10 w-full rounded-lg sm:h-12 sm:w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
