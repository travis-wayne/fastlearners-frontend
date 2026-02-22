"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, AlertCircle } from "lucide-react";

import { getSubjectsWithSlugs, getSubjectScore, getTopicsBySubjectSlug, getLessonScore } from "@/lib/api/lessons";
import { useAuthStore } from "@/store/authStore";
import { getGrade } from "@/lib/utils/grading";
import type { TopicItem, TopicsByTerm } from "@/lib/types/lessons";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectPerformancePage() {
  const params = useParams();
  const router = useRouter();
  const subjectSlug = params?.slug as string;
  const user = useAuthStore((state) => state.user);

  const [subjectName, setSubjectName] = useState<string>("");
  const [subjectScore, setSubjectScore] = useState<number>(0);
  const [topics, setTopics] = useState<TopicsByTerm | null>(null);
  const [lessonScores, setLessonScores] = useState<Map<number, number>>(new Map());
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!subjectSlug || !user?.class) {
        if (isMounted) setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Get subject details from slugs
        const slugsRes = await getSubjectsWithSlugs();
        const subject = slugsRes.content?.subjects?.find(s => s.slug === subjectSlug);
        
        if (!subject) {
          throw new Error("Subject not found");
        }
        
        if (isMounted) setSubjectName(subject.name);
        const subjectId = subject.id;

        // 2. Resolve class ID
        const metaRes = await fetch('/api/lessons/meta');
        let classId: number | null = null;
        if (metaRes.ok) {
          const meta = await metaRes.json();
          const userClassObj = meta.content?.classes?.find(
            (c: any) => c.name === user.class
          );
          if (userClassObj) classId = userClassObj.id;
        }

        // 3. Overall subject score
        if (classId) {
          const scoreRes = await getSubjectScore(subjectId, classId);
          if (scoreRes.success && scoreRes.content) {
            if (isMounted) setSubjectScore(parseFloat(scoreRes.content.subject_total_score) || 0);
          }
        }

        // 4. Get topics
        const topicsRes = await getTopicsBySubjectSlug(subjectSlug);
        let allTopicsList: TopicItem[] = [];
        
        if (topicsRes.success && topicsRes.content?.topics) {
          if (isMounted) setTopics(topicsRes.content.topics);
          
          const t = topicsRes.content.topics;
          if (t.first_term) allTopicsList.push(...t.first_term);
          if (t.second_term) allTopicsList.push(...t.second_term);
          if (t.third_term) allTopicsList.push(...t.third_term);
        }

        // 5. Per-lesson scores
        if (allTopicsList.length > 0) {
          const lessonPromises = allTopicsList.map(async (topic) => {
            const res = await getLessonScore(topic.id);
            let score = 0;
            if (res.success && res.content) {
              score = parseFloat((res.content as any).lesson_total_score || "0") || 0;
            }
            return { id: topic.id, score };
          });

          const results = await Promise.all(lessonPromises);
          if (isMounted) {
            const scoresMap = new Map<number, number>();
            results.forEach(r => scoresMap.set(r.id, r.score));
            setLessonScores(scoresMap);
          }
        }

      } catch (err: any) {
        console.error("Failed to fetch subject performance:", err);
        if (isMounted) setError(err.message || "Failed to load data");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => { isMounted = false; };
  }, [subjectSlug, user?.class]);

  const renderTermSection = (title: string, termTopics?: TopicItem[]) => {
    if (!termTopics || termTopics.length === 0) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {termTopics.map((topic) => {
            const score = lessonScores.get(topic.id) ?? 0;
            const isNotStarted = score === 0; // Using score === 0 to denote "Not started"
            const gradeInfo = getGrade(score);

            return (
              <div key={topic.id} className="flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <span className="font-medium">Week {topic.week} – {topic.topic}</span>
                  <div className="flex items-center gap-2 sm:gap-4">
                    {isNotStarted ? (
                      <Badge variant="secondary" className="whitespace-nowrap bg-muted text-muted-foreground">
                        Not started
                      </Badge>
                    ) : (
                      <>
                        <span className="font-semibold">{score}%</span>
                        <Badge 
                          className={gradeInfo.colorClass}
                        >
                          {gradeInfo.letter}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                {!isNotStarted && <Progress value={score} className="h-1.5 sm:h-2" />}
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-spacing">
        <Skeleton className="mb-6 h-8 w-24" />
        <Skeleton className="mb-8 h-24 w-full rounded-xl" />
        <Skeleton className="mb-6 h-64 w-full rounded-xl" />
        <Skeleton className="mb-6 h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto mb-4 size-12 text-destructive" />
        <p className="mb-4 text-destructive">{error}</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 size-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const overallGrade = getGrade(subjectScore);

  return (
    <div className="dashboard-spacing">
      {/* Header section */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/performance")} className="shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{subjectName || "Subject Details"}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Badge 
            className={`px-3 py-1 text-sm font-semibold ${overallGrade.colorClass}`}
          >
            Grade: {overallGrade.letter}
          </Badge>
          <span className="text-lg font-bold">Score: {subjectScore}%</span>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-10 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-muted-foreground">Overall Progress</span>
          <span className="font-bold">{subjectScore}%</span>
        </div>
        <Progress value={subjectScore} className="h-3" />
      </div>

      {/* Term Sections */}
      {topics ? (
        <div className="space-y-6">
          {renderTermSection("First Term", topics.first_term)}
          {renderTermSection("Second Term", topics.second_term)}
          {renderTermSection("Third Term", topics.third_term)}
          
          {(!topics.first_term?.length && !topics.second_term?.length && !topics.third_term?.length) && (
            <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
              <BookOpen className="mx-auto mb-4 size-8 opacity-50" />
              <p>No lessons available for this subject.</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
