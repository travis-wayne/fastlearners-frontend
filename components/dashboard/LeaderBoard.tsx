"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface LeaderboardEntryItem {
  rank: number;
  name: string;
  avatar?: string;
  score: number;
  isCurrentUser?: boolean;
}

interface LeaderBoardProps {
  entries: LeaderboardEntryItem[];
  title?: string;
  subtitle?: string;
  onViewAll?: () => void;
}

export function LeaderBoard({
  entries,
  title = "Leader's Board",
  subtitle = "Top performers this week",
  onViewAll,
}: LeaderBoardProps) {
  return (
    <Card className="border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              {title}
            </CardTitle>
            {subtitle ? (
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{subtitle}</p>
            ) : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((student) => (
            <div
              key={student.rank}
              className={`flex items-center gap-3 rounded-lg border p-2 transition-colors ${
                student.isCurrentUser
                  ? "border-primary/30 bg-primary/10"
                  : "hover:bg-muted"
              }`}
            >
              <div className="w-6 text-sm font-bold">#{student.rank}</div>
              <Avatar className="size-8">
                {student.avatar ? (
                  <AvatarImage src={student.avatar} alt={student.name} />
                ) : null}
                <AvatarFallback>
                  {student.name?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-slate-200">
                  {student.name}
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                {student.score.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
