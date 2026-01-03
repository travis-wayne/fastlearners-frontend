"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface SubjectPerformanceItem {
  subject: string;
  percentage: number; // 0-100
  colorClass?: string; // Tailwind bg color for indicator
  icon?: React.ReactNode;
  target?: number; // optional target marker 0-100
}

interface PerformanceSectionProps {
  items: SubjectPerformanceItem[];
  title?: string;
  description?: string;
}

export function PerformanceSection({
  items,
  title = "Performance",
  description = "Your progress across all subjects",
}: PerformanceSectionProps) {
  return (
    <Card className="h-full border bg-card">
      <CardHeader className="responsive-padding pb-component-sm">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-slate-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="responsive-padding space-y-component-md sm:space-y-component-lg">
        <div className="space-y-component-sm sm:space-y-component-md">
          {items.map((perf, index) => (
            <div key={`${perf.subject}-${index}`} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-component-md">
                  <div className="rounded-lg bg-muted p-component-xs sm:p-component-sm">{perf.icon}</div>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {perf.subject}
                  </span>
                </div>
                <span className="text-base font-semibold text-gray-900 dark:text-slate-100 sm:text-lg">
                  {perf.percentage}%
                </span>
              </div>
              <div className="relative">
                <Progress value={perf.percentage} className="h-2 sm:h-2.5" />
                {typeof perf.target === "number" && (
                  <div
                    className="absolute top-0 h-2 w-1 rounded-full bg-primary/70 sm:h-2.5"
                    style={{
                      left: `${Math.min(Math.max(perf.target, 0), 100)}%`,
                    }}
                    aria-hidden
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
