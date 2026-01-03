"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface SimpleAchievement {
  title: string;
  icon: React.ReactNode;
}

interface AchievementsSectionProps {
  items: SimpleAchievement[];
  title?: string;
  description?: string;
}

export function AchievementsSection({
  items,
  title = "Achievements",
  description = "Your recent milestones",
}: AchievementsSectionProps) {
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
      <CardContent className="responsive-padding grid grid-cols-2 gap-component-sm sm:grid-cols-3 sm:gap-component-md">
        {items.map((a, i) => (
          <div
            key={`${a.title}-${i}`}
            className="rounded-xl border bg-card p-component-sm text-center shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-component-md"
          >
            <div className="text-xl sm:text-2xl">{a.icon}</div>
            <div className="mt-1 text-xs font-medium text-gray-900 dark:text-slate-100 sm:text-sm">
              {a.title}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
