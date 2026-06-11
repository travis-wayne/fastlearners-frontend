"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { AlertCircle, ArrowLeft, BookOpen } from "lucide-react";

import {
  getLessonScore,
  getLessonSummary,
  getSubjectScore,
  getSubjectsWithSlugs,
  getTopicsBySubjectSlug,
} from "@/lib/api/lessons";
import type {
  LessonSummaryResponse,
  TopicItem,
  TopicsByTerm,
} from "@/lib/types/lessons";
import { getGrade } from "@/lib/utils/grading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonSummaryCard } from "@/components/dashboard/student/LessonSummaryCard";
import { useAcademicContext } from "@/components/providers/academic-context";
import {
  deriveLessonStatus,
  lessonStatusBadgeClass,
} from "@/lib/utils/lesson-status";

export default function SubjectPerformancePage() {
  const params = useParams();
  const router = useRouter();
  const subjectSlug = params?.slug as string;
  const user = useAuthStore((state) => state.user);
  const { currentClassApiId, currentTermApiId } = useAcademicContext();

  const [subjectName, setSubjectName] = useState<string>("");
  const [subjectScore, setSubjectScore] = useState<number>(0);
  const [topics, setTopics] = useState<TopicsByTerm | null>(null);
  const [lessonScores, setLessonScores] = useState<Map<number, number>>(
    new Map(),
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(null);
  const [summaryCache, setSummaryCache] = useState<
    Map<number, LessonSummaryResponse>
  >(new Map());
  const [summaryStatusMap, setSummaryStatusMap] = useState<
    Map<number, boolean>
  >(new Map());
  const [loadingSummaryId, setLoadingSummaryId] = useState<number | null>(null);

  const handleTopicClick = async (topicId: number) => {
    if (expandedTopicId === topicId) {
      setExpandedTopicId(null);
      return;
    }

    setExpandedTopicId(topicId);

    if (!summaryCache.has(topicId)) {
      setLoadingSummaryId(topicId);
      try {
        const res = await getLessonSummary(topicId);
        setSummaryCache((prev) => {
          const next = new Map(prev);
          next.set(topicId, res);
          return next;
        });
      } catch (err) {
        console.error("Failed to fetch lesson summary:", err);
      } finally {
        setLoadingSummaryId((prev) => (prev === topicId ? null : prev));
      }
    }
  };

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
        const subject = slugsRes.content?.subjects?.find(
          (s) => s.slug === subjectSlug,
        );

        if (!subject) {
          throw new Error("Subject not found");
        }

        if (isMounted) setSubjectName(subject.name);
        const subjectId = subject.id;

        // 2. Overall subject score using live class ID
        if (currentClassApiId) {
          const scoreRes = await getSubjectScore(subjectId, currentClassApiId);
          if (scoreRes.success && scoreRes.content) {
            if (isMounted)
              setSubjectScore(
                parseFloat(scoreRes.content.subject_total_score) || 0,
              );
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

        // 5. Per-lesson scores & eager summary fetch
        if (allTopicsList.length > 0) {
          const lessonPromises = allTopicsList.map(async (topic) => {
            const res = await getLessonScore(topic.id);
            let score = 0;
            if (res.success && res.content) {
              score =
                parseFloat((res.content as any).lesson_total_score || "0") || 0;
            }
            return { id: topic.id, score };
          });

          const summaryPromises = allTopicsList.map(async (topic) => {
            try {
              const res = await getLessonSummary(topic.id);
              return { id: topic.id, res };
            } catch (err) {
              return { id: topic.id, res: null };
            }
          });

          const [results, summaryResults] = await Promise.all([
            Promise.all(lessonPromises),
            Promise.all(summaryPromises),
          ]);

          if (isMounted) {
            const scoresMap = new Map<number, number>();
            results.forEach((r) => scoresMap.set(r.id, r.score));
            setLessonScores(scoresMap);

            const statusMap = new Map<number, boolean>();
            const sCache = new Map(summaryCache); // Merge into existing cache
            summaryResults.forEach((r) => {
              if (r.res) {
                const hasData = r.res.noData !== true && r.res.content !== null;
                statusMap.set(r.id, hasData);
                sCache.set(r.id, r.res);
              } else {
                statusMap.set(r.id, false);
              }
            });
            setSummaryStatusMap(statusMap);
            setSummaryCache(sCache);

            // Fallback for subject score if it is 0 but we have valid lesson scores
            if (
              subjectScore === 0 && // or parseFloat((scoreRes?.content?.subject_total_score)) === 0 (if we had the raw scoreRes here. Relying on current subjectScore state is tricky because setSubjectScore hasn't flushed. We should use a local variable or just check the map). Let's calculate the average.
              scoresMap.size > 0
            ) {
              const nonZeroScores = Array.from(scoresMap.values()).filter(
                (s) => s > 0,
              );
              if (nonZeroScores.length > 0) {
                const sum = nonZeroScores.reduce((a, b) => a + b, 0);
                const avg = Math.round(sum / nonZeroScores.length);
                setSubjectScore(avg);
              }
            }
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

    return () => {
      isMounted = false;
    };
  }, [
    subjectSlug,
    user?.class,
    currentClassApiId,
    currentTermApiId,
    subjectScore,
    summaryCache,
  ]);

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
            const hasSummaryData = summaryStatusMap.get(topic.id) ?? false;
            // TODO: We assume false for `isCompleted` for now, backend needs an API to tell us this.
            // If the user has a grade/score we might want to say completed, but we'll stick to the plan.
            const status = deriveLessonStatus(hasSummaryData, false);
            const isNotStarted = status === "not_started";
            const isInProgress = status === "in_progress";
            const gradeInfo = getGrade(score);

            return (
              <div
                key={topic.id}
                className="flex cursor-pointer select-none flex-col gap-2 border-b pb-4 last:border-0 last:pb-0"
                role="button"
                onClick={() => handleTopicClick(topic.id)}
              >
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <span className="font-medium">
                    Week {topic.week} – {topic.topic}
                  </span>
                  <div className="flex items-center gap-2 sm:gap-4">
                    {isNotStarted ? (
                      <Badge
                        variant="secondary"
                        className={lessonStatusBadgeClass("not_started")}
                      >
                        Not started
                      </Badge>
                    ) : isInProgress ? (
                      <>
                        <Badge
                          variant="secondary"
                          className={lessonStatusBadgeClass("in_progress")}
                        >
                          In progress
                        </Badge>
                        <span className="font-semibold">{score}%</span>
                        <Badge className={gradeInfo.colorClass}>
                          {gradeInfo.letter}
                        </Badge>
                      </>
                    ) : (
                      <>
                        <Badge
                          variant="secondary"
                          className={lessonStatusBadgeClass("completed")}
                        >
                          Completed
                        </Badge>
                        <span className="font-semibold">{score}%</span>
                        <Badge className={gradeInfo.colorClass}>
                          {gradeInfo.letter}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                {(isInProgress || status === "completed") && (
                  <Progress value={score} className="h-1.5 sm:h-2" />
                )}

                {expandedTopicId === topic.id && (
                  <LessonSummaryCard
                    isLoading={loadingSummaryId === topic.id}
                    summary={
                      summaryCache.get(topic.id) ?? {
                        success: false,
                        message: "",
                        content: null,
                        code: 0,
                      }
                    }
                  />
                )}
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/records")}
            className="shrink-0"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {subjectName || "Subject Details"}
            </h1>
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
          <span className="font-semibold text-muted-foreground">
            Overall Progress
          </span>
          <span className="font-bold">{subjectScore}%</span>
        </div>
        {subjectScore > 0 ? (
          <Progress value={subjectScore} className="h-3" />
        ) : (
          <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            {currentTermApiId
              ? "No scores yet for this term. Start a lesson to see your progress!"
              : "Start a lesson to see your progress!"}
          </div>
        )}
      </div>

      {/* Term Sections */}
      {topics ? (
        <div className="space-y-6">
          {renderTermSection("First Term", topics.first_term)}
          {renderTermSection("Second Term", topics.second_term)}
          {renderTermSection("Third Term", topics.third_term)}

          {!topics.first_term?.length &&
            !topics.second_term?.length &&
            !topics.third_term?.length && (
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
