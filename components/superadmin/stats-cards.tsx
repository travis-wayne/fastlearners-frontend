"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Trash2,
  Loader2,
  GraduationCap,
  FileText,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLessonsMetadata, getTrashedLessons } from "@/lib/api/superadmin-lessons";

interface StatsData {
  totalClasses: number;
  totalSubjects: number;
  totalTerms: number;
  totalWeeks: number;
  trashedLessons: number;
  isLoading: boolean;
  error: string | null;
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData>({
    totalClasses: 0,
    totalSubjects: 0,
    totalTerms: 0,
    totalWeeks: 0,
    trashedLessons: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch metadata and trashed lessons count in parallel
        const [metadataResponse, trashedResponse] = await Promise.all([
          getLessonsMetadata(),
          getTrashedLessons({ page: 1 }),
        ]);

        if (metadataResponse.success && metadataResponse.content) {
          setStats({
            totalClasses: metadataResponse.content.classes?.length || 0,
            totalSubjects: metadataResponse.content.subjects?.length || 0,
            totalTerms: metadataResponse.content.terms?.length || 0,
            totalWeeks: metadataResponse.content.weeks?.length || 0,
            trashedLessons: trashedResponse.success && trashedResponse.content
              ? trashedResponse.content.meta?.total || 0
              : 0,
            isLoading: false,
            error: null,
          });
        } else {
          setStats((prev) => ({
            ...prev,
            isLoading: false,
            error: metadataResponse.message || "Failed to fetch statistics",
          }));
        }
      } catch (error: any) {
        setStats((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || "An error occurred",
        }));
      }
    }

    fetchStats();
  }, []);

  if (stats.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Classes</CardTitle>
          <GraduationCap className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalClasses}</div>
          <p className="text-xs text-muted-foreground">
            Available class levels
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subjects</CardTitle>
          <FileText className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSubjects}</div>
          <p className="text-xs text-muted-foreground">
            Subject categories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Terms</CardTitle>
          <BookOpen className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTerms}</div>
          <p className="text-xs text-muted-foreground">
            Academic terms configured
          </p>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trash</CardTitle>
          <Trash2 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{stats.trashedLessons}</span>
            {stats.trashedLessons > 0 && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Items
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Lessons in trash
          </p>
          {stats.trashedLessons > 0 && (
            <Link href="/dashboard/superadmin/manage/trash">
              <Button className="mt-3 w-full" variant="outline" size="sm">
                View Trash
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
