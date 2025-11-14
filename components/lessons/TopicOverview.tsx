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
    <div className="space-y-6">
      {/* Introduction */}
      {overview.introduction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5" />
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-5" />
              Key Concepts
            </CardTitle>
            <CardDescription>
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
                <Badge key={conceptNum} variant="secondary" className="text-sm">
                  Concept {conceptNum}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {overview.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5" />
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5" />
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
