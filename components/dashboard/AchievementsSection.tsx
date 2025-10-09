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
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-slate-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((a, i) => (
          <div
            key={`${a.title}-${i}`}
            className="rounded-xl border bg-card p-4 text-center shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">{a.icon}</div>
            <div className="mt-1 text-sm font-medium text-gray-900 dark:text-slate-100">
              {a.title}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
