"use client";

import {
  BookOpen,
  CheckCircle2,
  FileText,
  Lightbulb,
  Target,
} from "lucide-react";

import type { TopicOverview as TopicOverviewType } from "@/lib/types/lessons";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TopicOverviewProps {
  overview: TopicOverviewType;
  subjectSlug: string;
  topicSlug: string;
}

export function TopicOverview({
  overview,
  subjectSlug,
  topicSlug,
}: TopicOverviewProps) {
  return (
    <div className="space-y-4">
      {/* Introduction */}
      {overview.introduction && (
        <Card className="border-2 bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="size-4.5 text-primary" />
              </div>
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {overview.introduction}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Concepts Count */}
      {overview.concepts_count > 0 && (
        <Card className="border-2 bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Lightbulb className="size-4.5 text-primary" />
              </div>
              Key Concepts
            </CardTitle>
            <CardDescription className="mt-1">
              This lesson covers {overview.concepts_count} main concept
              {overview.concepts_count !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(
                { length: overview.concepts_count },
                (_, i) => i + 1,
              ).map((conceptNum) => (
                <Badge
                  key={conceptNum}
                  variant="secondary"
                  className="border-2 text-sm font-medium shadow-sm"
                >
                  Concept {conceptNum}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {overview.summary && (
        <Card className="border-2 bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="size-4.5 text-primary" />
              </div>
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {overview.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Application */}
      {overview.application && overview.application !== "Null" && (
        <Card className="border-2 bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Target className="size-4.5 text-primary" />
              </div>
              Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {overview.application}
            </p>
          </CardContent>
        </Card>
      )}

      {/* General Exercises */}
      {overview.general_exercises && overview.general_exercises !== "Null" && (
        <Card className="border-2 bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="size-4.5 text-primary" />
              </div>
              General Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {overview.general_exercises}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
