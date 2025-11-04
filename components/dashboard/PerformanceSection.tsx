"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100">{title}</CardTitle>
        <CardDescription className="text-gray-500 dark:text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
        {items.map((perf, index) => (
          <div key={`${perf.subject}-${index}`} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  {perf.icon}
                </div>
                <span className="font-medium text-slate-200">{perf.subject}</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-slate-100">{perf.percentage}%</span>
            </div>
            <div className="relative">
              <Progress value={perf.percentage} className="h-2.5" />
              {typeof perf.target === "number" && (
                <div
                  className="absolute top-0 h-2.5 w-1 rounded-full bg-primary/70"
                  style={{ left: `${Math.min(Math.max(perf.target, 0), 100)}%` }}
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
