"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, ArrowLeft, Loader2, Target, CheckCircle2 } from "lucide-react";
import { useLessonsStore } from "@/lib/store/lessons";
import { getLessonContentById, getLessonCompletionData } from "@/lib/api/lessons";
import { cn } from "@/lib/utils";
import { LessonCompletionData } from "@/lib/types/lessons";

interface LessonCompletedPageProps {
  params: {
    lessonId: string;
  };
}

export default function LessonCompletedPage({ params }: LessonCompletedPageProps) {
  const router = useRouter();
  const lessonId = parseInt(params.lessonId);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LessonCompletionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get store data to supplement API data
  const { exerciseProgress, sectionTimeTracking } = useLessonsStore();

  useEffect(() => {
    const fetchData = async () => {
      if (isNaN(lessonId)) {
        setError("Invalid lesson ID");
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch lesson content first to get structure
        const contentRes = await getLessonContentById(lessonId);
        
        if (!contentRes.success || !contentRes.content) {
          throw new Error(contentRes.message || "Failed to load lesson content");
        }

        // 2. Fetch completion data using the helper
        // We pass local store data (time tracking, exercise progress) to help calculation
        const completionRes = await getLessonCompletionData(
          lessonId,
          contentRes.content,
          sectionTimeTracking,
          exerciseProgress
        );

        if (!completionRes.success || !completionRes.data) {
          throw new Error(completionRes.message || "Failed to load completion data");
        }

        setData(completionRes.data);
      } catch (err: any) {
        console.error("Error fetching completion data:", err);
        setError(err.message || "An error occurred while loading results");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, exerciseProgress, sectionTimeTracking]);

  const handleBackToDashboard = () => {
    router.push("/dashboard/lessons");
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading results...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-red-100 p-4 text-red-600 dark:bg-red-900/20">
          <Trophy className="size-8" />
        </div>
        <h1 className="text-2xl font-bold">Could not load results</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={handleBackToDashboard}>Back to Lessons</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="flex mx-auto size-20 items-center justify-center rounded-full bg-yellow-100 ring-8 ring-yellow-50 animate-in zoom-in duration-500 dark:bg-yellow-900/30 dark:ring-yellow-900/10">
          <Trophy className="size-10 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Lesson Complete!</h1>
        <p className="text-xl text-muted-foreground">{data.lessonTitle}</p>
        
        <div className="flex justify-center mt-6">
           <div className="relative flex size-40 items-center justify-center rounded-full border-8 border-primary/20">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="block text-4xl font-bold text-primary">{Math.round(data.lessonScore)}%</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Grand Total</span>
                </div>
             </div>
             <svg className="absolute inset-0 size-full -rotate-90 text-primary" viewBox="0 0 100 100">
               <circle
                 className="stroke-current transition-all duration-1000 ease-out"
                 strokeWidth="8"
                 fill="none"
                 cx="50"
                 cy="50"
                 r="46"
                 strokeDasharray="289.02652413" // 2 * pi * 46
                 strokeDashoffset={289.02652413 * (1 - data.lessonScore / 100)}
               />
             </svg>
           </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Concept Scores */}
        <Card className="border-2">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Target className="size-5 text-primary" />
               Concept Breakdown
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
             {data.conceptScores.map((concept) => (
               <div key={concept.conceptId} className="space-y-2">
                 <div className="flex items-center justify-between text-sm">
                   <span className="max-w-[70%] truncate font-medium">{concept.title}</span>
                   <Badge variant={concept.score >= 80 ? "default" : "secondary"}>
                     {Math.round(concept.score)}%
                   </Badge>
                 </div>
                 <Progress value={concept.score} className="h-2" />
                 <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{concept.completedExercises}/{concept.totalExercises} exercises</span>
                    <span>Weight: {concept.weight}%</span>
                 </div>
               </div>
             ))}
           </CardContent>
        </Card>

        {/* General Exercises & Summary */}
        <div className="space-y-6">
          {data.generalExercisesWeight > 0 && (
            <Card className="border-2 border-primary/10 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-primary" />
                  General Exercises
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-primary">{Math.round(data.generalExercisesScore)}%</p>
                    <p className="text-sm text-muted-foreground">Section Score</p>
                  </div>
                  <Badge variant="outline">Weight: {data.generalExercisesWeight}%</Badge>
                </div>
                <Progress value={data.generalExercisesScore} className="h-3 bg-primary/20" />
              </CardContent>
            </Card>
          )}

          <Card>
             <CardContent className="pt-6">
                <Button className="size-lg w-full text-lg" onClick={handleBackToDashboard}>
                   <ArrowLeft className="mr-2 size-5" />
                   Back to Dashboard
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
