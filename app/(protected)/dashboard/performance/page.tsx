"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useMemo } from "react";
import { BarChart3, TrendingUp, BookOpen, Target, ArrowLeft } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { getStudentSubjects } from "@/lib/api/subjects";
import { getSubjectScore, getSubjectsWithSlugs } from "@/lib/api/lessons";
import { useAuthStore } from "@/store/authStore";
import { getGrade } from "@/lib/utils/grading";
import type { Subject as ApiSubject } from "@/lib/types/subjects";

function PerformanceContent() {
  const searchParams = useSearchParams();
  const subjectSlug = searchParams.get("subject");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [subjectScores, setSubjectScores] = useState<Map<number, number>>(new Map());
  const [slugMap, setSlugMap] = useState<Map<string, ApiSubject>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!user?.class) {
        if (isMounted) setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // 1. Get enrolled subjects
        const subjectsRes = await getStudentSubjects();
        let enrolled: ApiSubject[] = [];
        if (subjectsRes.success && subjectsRes.content?.subjects) {
          enrolled = subjectsRes.content.subjects;
          if (isMounted) setSubjects(enrolled);
        }

        // 2. Get slugs map
        const slugsRes = await getSubjectsWithSlugs();
        if (slugsRes.success && slugsRes.content?.subjects) {
          const map = new Map<string, ApiSubject>();
          slugsRes.content.subjects.forEach(s => {
            // Find the matching enrolled subject to store
            const matched = enrolled.find(e => e.id === s.id);
            if (matched) {
              map.set(s.slug, matched);
            }
          });
          if (isMounted) setSlugMap(map);
        }

        // 3. Get class ID from meta
        const metaRes = await fetch('/api/lessons/meta');
        let classId: number | null = null;
        if (metaRes.ok) {
          const meta = await metaRes.json();
          const userClassObj = meta.content?.classes?.find(
            (c: any) => c.name === user.class
          );
          if (userClassObj) classId = userClassObj.id;
        }

        // 4. Fetch scores
        if (classId && enrolled.length > 0) {
          const scorePromises = enrolled.map(async (subj) => {
            const res = await getSubjectScore(subj.id, classId!);
            let score = 0;
            if (res.success && res.content) {
              score = parseFloat(res.content.subject_total_score) || 0;
            }
            return { id: subj.id, score };
          });
          
          const results = await Promise.all(scorePromises);
          if (isMounted) {
            const newScores = new Map<number, number>();
            results.forEach(r => newScores.set(r.id, r.score));
            setSubjectScores(newScores);
          }
        }
      } catch (err) {
        console.error("Failed to fetch performance data:", err);
        if (isMounted) setError("Failed to load performance data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => { isMounted = false; };
  }, [user?.class]);

  const filteredSubjects = useMemo(() => {
    if (!subjectSlug) return subjects;
    const targetSubject = slugMap.get(subjectSlug);
    return targetSubject ? [targetSubject] : [];
  }, [subjects, subjectSlug, slugMap]);

  if (loading) {
    return (
      <div className="dashboard-spacing">
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="responsive-gap grid grid-cols-1 md:grid-cols-3 mb-8">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Calculate stats
  const totalScores = Array.from(subjectScores.values()).reduce((sum, score) => sum + score, 0);
  const averageScore = subjectScores.size > 0 ? Math.round(totalScores / subjectScores.size) : 0;
  const subjectsPassing = Array.from(subjectScores.values()).filter(score => score >= 50).length;

  const subjectName = subjectSlug ? slugMap.get(subjectSlug)?.name : null;

  return (
    <div className="dashboard-spacing">
      <div className="mb-8">
        {subjectSlug && (
          <Button variant="ghost" size="sm" className="mb-4 pl-0" onClick={() => router.push("/dashboard/performance")}>
            <ArrowLeft className="mr-2 size-4" />
            Back to all subjects
          </Button>
        )}
        <h1 className="text-3xl font-bold tracking-tight">
          {subjectName ? `Performance: ${subjectName}` : "My Performance"}
        </h1>
        <p className="text-muted-foreground">
          Detailed overview of your academic progress and achievements.
        </p>
      </div>

      {!subjectSlug && (
        <div className="responsive-gap grid grid-cols-1 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <TrendingUp className="size-4 text-emerald-500" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <BookOpen className="size-4 text-blue-500" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Subjects Enrolled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
              <p className="text-xs text-muted-foreground">Assigned to you</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Target className="size-4 text-purple-500" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Subjects Passing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjectsPassing}</div>
              <p className="text-xs text-muted-foreground">Score ≥ 50%</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Subject Mastery</CardTitle>
            <CardDescription>
              Your competency levels across enrolled subjects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSubjects.length > 0 ? (
              <div className="space-y-6">
                {filteredSubjects.map(subject => {
                  const score = subjectScores.get(subject.id) ?? 0;
                  const gradeInfo = getGrade(score);
                  
                  return (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-base">{subject.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{score}%</span>
                          <Badge 
                            className={gradeInfo.colorClass}
                          >
                            {gradeInfo.letter}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No subjects found to display mastery.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function StudentPerformancePage() {
  return (
    <Suspense fallback={<div>Loading performance data...</div>}>
      <PerformanceContent />
    </Suspense>
  );
}
