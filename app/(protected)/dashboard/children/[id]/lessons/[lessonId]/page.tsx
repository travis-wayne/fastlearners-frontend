"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, PlaySquare, CheckCircle, Brain, Target } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/header";
import { getGuardianChildLessonDetails } from "@/lib/api/guardian";
import { GuardianChildLessonDetail } from "@/lib/types/guardian";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LessonDetailPage() {
  const { id, lessonId } = useParams();
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");
  const router = useRouter();

  const [lessonDetail, setLessonDetail] = useState<GuardianChildLessonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lessonId && childId) {
      const fetchDetail = async () => {
        setIsLoading(true);
        try {
          const res = await getGuardianChildLessonDetails(Number(lessonId), Number(childId));
          if (res.success && res.content) {
            setLessonDetail(res.content);
          } else {
            setError(res.message || "Failed to load lesson details");
          }
        } catch (err: any) {
          setError(err.message || "An error occurred");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetail();
    } else {
      setIsLoading(false);
      setError("Missing required parameters (lessonId or childId)");
    }
  }, [lessonId, childId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-6 w-[300px]" />
        <Skeleton className="h-[120px] w-full" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>
      </div>
    );
  }

  if (error || !lessonDetail) {
    return (
      <div className="space-y-6 py-12 text-center">
        <h3 className="text-lg font-medium text-red-500">{error || "Lesson not found"}</h3>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 size-4" /> Go Back
        </Button>
      </div>
    );
  }

  const { lesson_summary, lesson_total } = lessonDetail;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => router.back()} variant="ghost" size="icon">
          <ArrowLeft className="size-5" />
        </Button>
        <DashboardHeader
          heading="Lesson Breakdown"
          text="Detailed view of lesson performance."
        />
      </div>

      <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Total Lesson Score</h3>
          <p className="mt-2 text-4xl font-bold text-indigo-600 dark:text-indigo-400">{lesson_total}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="size-5 text-blue-500" />
              <CardTitle className="text-lg">Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{lesson_summary.overview || "0"}</p>
            <p className="mt-1 text-sm text-muted-foreground">Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PlaySquare className="size-5 text-emerald-500" />
              <CardTitle className="text-lg">Video</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{lesson_summary.video || "0"}</p>
            <p className="mt-1 text-sm text-muted-foreground">Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-5 text-amber-500" />
              <CardTitle className="text-lg">General Exercise</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{lesson_summary.general_exercise || "0"}</p>
            <p className="mt-1 text-sm text-muted-foreground">Score</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="size-5 text-purple-500" />
            <CardTitle>Concepts Breakdown</CardTitle>
          </div>
          <CardDescription>Performance across different concepts covered in this lesson.</CardDescription>
        </CardHeader>
        <CardContent>
          {!lesson_summary.concepts || Object.keys(lesson_summary.concepts).length === 0 ? (
            <p className="text-sm text-muted-foreground">No concept breakdown available.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(lesson_summary.concepts).map(([conceptName, score], index) => (
                <div key={index} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <span className="font-medium">{conceptName}</span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold">{score as React.ReactNode}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
