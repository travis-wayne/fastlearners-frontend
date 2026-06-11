"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  Download,
  Target,
  TrendingUp,
} from "lucide-react";

import { getSubjectScore, getSubjectsWithSlugs, getAllLessonsTotalScores, getAllSubjectsTotalScores } from "@/lib/api/lessons";
import { getStudentSubjects } from "@/lib/api/subjects";
import { getStudentTerms } from "@/lib/api/student";
import type { Subject as ApiSubject, TermItem } from "@/lib/types/subjects";
import { getGrade } from "@/lib/utils/grading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademicSelector } from "@/components/dashboard/student/shared/academic-selector";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RecordsSkeleton } from "./RecordsSkeleton";
import { SubjectScoreRow } from "./SubjectScoreRow";

export function StudentRecordsPage() {
  const router = useRouter();
  const { currentClass, currentTerm, currentClassApiId, currentTermApiId, availableTerms, setCurrentTerm } =
    useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();
  const user = useAuthStore((state) => state.user);

  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [subjectScores, setSubjectScores] = useState<Map<number, number>>(new Map());
  const [slugMap, setSlugMap] = useState<Map<string, ApiSubject>>(new Map());
  const [masteryLoading, setMasteryLoading] = useState(true);
  const [masteryError, setMasteryError] = useState<string | null>(null);
  const [lessonScores, setLessonScores] = useState<Map<number, Array<{ topic: string; score: number }>>>(new Map());
  const [lessonScoresLoading, setLessonScoresLoading] = useState(false);
  const [openSubjects, setOpenSubjects] = useState<Set<number>>(new Set());



  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (isMounted) {
        setSubjects([]);
        setSubjectScores(new Map());
        setSlugMap(new Map());
      }

      if (!user?.class) {
        if (isMounted) setMasteryLoading(false);
        return;
      }

      setMasteryLoading(true);
      setMasteryError(null);
      try {
        const subjectsRes = await getStudentSubjects();
        let enrolled: ApiSubject[] = [];
        if (subjectsRes.success && subjectsRes.content?.subjects) {
          enrolled = subjectsRes.content.subjects;
          if (isMounted) setSubjects(enrolled);
        }

        const slugsRes = await getSubjectsWithSlugs();
        if (slugsRes.success && slugsRes.content?.subjects) {
          const map = new Map<string, ApiSubject>();
          slugsRes.content.subjects.forEach((s) => {
            const matched = enrolled.find((e) => e.id === s.id);
            if (matched) {
              map.set(s.slug, matched);
            }
          });
          if (isMounted) setSlugMap(map);
        }

        if (currentTermApiId && enrolled.length > 0) {
          const res = await getAllSubjectsTotalScores(currentTermApiId);
          if (isMounted) {
            const newScores = new Map<number, number>();
            if (res.success && res.content?.total_scores) {
              Object.entries(res.content.total_scores).forEach(([subjectName, scoreArray]) => {
                const matchedSubject = enrolled.find((s) => s.name === subjectName);
                if (matchedSubject && scoreArray && scoreArray.length > 0) {
                  const avg =
                    scoreArray.reduce(
                      (acc, curr) => acc + parseFloat(curr.total_score || "0"),
                      0,
                    ) / scoreArray.length;
                  newScores.set(
                    matchedSubject.id,
                    Math.min(100, Math.max(0, Math.round(avg))),
                  );
                }
              });
            }
            enrolled.forEach((subj) => {
              if (!newScores.has(subj.id)) {
                newScores.set(subj.id, 0);
              }
            });
            setSubjectScores(newScores);
          }
        }
      } catch (err) {
        console.error("Failed to fetch mastery data:", err);
        if (isMounted) setMasteryError("Failed to load performance data.");
      } finally {
        if (isMounted) setMasteryLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user?.class, currentClassApiId, currentTermApiId]);

  useEffect(() => {
    async function fetchLessonScores() {
      if (subjects.length === 0 || !currentTermApiId) return;
      setLessonScoresLoading(true);
      try {
        const promises = subjects.map(async (subject) => {
          const res = await getAllLessonsTotalScores(subject.id, currentTermApiId);
          const lessonsArray: Array<{ topic: string; score: number }> = [];
          if (res.success && res.content?.total_scores) {
             Object.entries(res.content.total_scores).forEach(([topic, value]) => {
                const arr = value as Array<{ total_score: string }>;
                const score = parseFloat(arr[0]?.total_score) || 0;
                lessonsArray.push({ topic, score });
             });
          }
          return { subjectId: subject.id, lessons: lessonsArray };
        });
        const results = await Promise.all(promises);
        const map = new Map<number, Array<{ topic: string; score: number }>>();
        results.forEach(r => map.set(r.subjectId, r.lessons));
        setLessonScores(map);
      } catch (err) {
        console.error("Failed to fetch lesson scores:", err);
      } finally {
        setLessonScoresLoading(false);
      }
    }
    fetchLessonScores();
  }, [subjects, currentTermApiId]);

  const filteredSubjects = useMemo(() => subjects, [subjects]);

  const liveTotalScores = Array.from(subjectScores.values()).reduce(
    (sum, score) => sum + score,
    0,
  );
  const averageScore =
    subjectScores.size > 0
      ? Math.round(liveTotalScores / subjectScores.size)
      : 0;
  const subjectsPassing = Array.from(subjectScores.values()).filter(
    (score) => score >= 50,
  ).length;
  const subjectsCount = subjects.length;
  const aGradesCount = Array.from(subjectScores.values()).filter(
    (score) => score >= 90,
  ).length;

  const toggleSubject = (id: number) => {
    setOpenSubjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleExportCSV = () => {
    let csv = "Subject,Score,Grade\n";
    filteredSubjects.forEach((subject) => {
      const score = subjectScores.get(subject.id) ?? 0;
      const grade = score === 0 ? "Not started" : getGrade(score).letter;
      csv += `${subject.name},${score},${grade}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "academic-records.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!currentClass || !currentTerm) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Select Class and Term
            </h3>
            <p className="mb-4 text-muted-foreground">
              Your records will appear here once you select your class and term.
            </p>
            <AcademicSelector variant="default" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container space-y-6 pb-20"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <BarChart3 className="size-8 text-primary" />
            Academic Records
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your academic performance for {classDisplay}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="size-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">
                Overall Average
              </span>
            </div>
            <p className="text-2xl font-bold">{averageScore}%</p>
            <Badge variant="secondary" className="mt-2 text-xs">
              {getGrade(averageScore).letter} Grade
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="size-4 text-green-600" />
              <span className="text-sm text-muted-foreground">
                Subjects Enrolled
              </span>
            </div>
            <p className="text-2xl font-bold">{subjectsCount}</p>
            <p className="text-sm text-muted-foreground">assigned to you</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Target className="size-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">Passing</span>
            </div>
            <p className="text-2xl font-bold">{subjectsPassing}</p>
            <p className="text-sm text-muted-foreground">score ≥ 50%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Award className="size-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">A Grades</span>
            </div>
            <p className="text-2xl font-bold">{aGradesCount}</p>
            <p className="text-sm text-muted-foreground">score ≥ 90%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mastery" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="mastery">Subject Mastery</TabsTrigger>
            <TabsTrigger value="lessons">Lesson Breakdown</TabsTrigger>
            <TabsTrigger value="progress">Progress Chart</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select
              value={currentTermApiId ? String(currentTermApiId) : undefined}
              onValueChange={(val) => {
                const termId = Number(val);
                const matchedTerm = availableTerms.find((t) => t.order === termId);
                if (matchedTerm) {
                  setCurrentTerm(matchedTerm);
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent>
                {availableTerms.map((t) => (
                  <SelectItem key={t.id} value={String(t.order)}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 size-4" />
              Export Report
            </Button>
          </div>
        </div>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>
                Visual representation of your academic progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subjects.length > 0 ? (
                  subjects.map((subject) => {
                    const score = subjectScores.get(subject.id) ?? 0;
                    return (
                      <div key={subject.id}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium">{subject.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {score}%
                          </span>
                        </div>
                        <Progress value={score} className="h-3" />
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <BookOpen className="mx-auto mb-4 size-8 opacity-20" />
                    <p>No enrollment data to display performance trend.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Breakdown</CardTitle>
              <CardDescription>Detailed scores for individual lessons</CardDescription>
            </CardHeader>
            <CardContent>
              {lessonScoresLoading ? (
                <RecordsSkeleton />
              ) : filteredSubjects.length > 0 ? (
                <div className="space-y-4">
                  {filteredSubjects.map((subject) => {
                    const lessons = lessonScores.get(subject.id) || [];
                    const isOpen = openSubjects.has(subject.id);
                    return (
                      <Collapsible
                        key={subject.id}
                        open={isOpen}
                        onOpenChange={() => toggleSubject(subject.id)}
                        className="rounded-lg border p-4"
                      >
                        <CollapsibleTrigger className="flex w-full items-center justify-between font-medium">
                          {subject.name}
                          <ChevronDown
                            className={`size-4 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-4 pt-4">
                          {lessons.length > 0 ? (
                            lessons.map((lesson, idx) => (
                              <SubjectScoreRow
                                key={idx}
                                subjectName={lesson.topic}
                                score={lesson.score}
                                showProgress={true}
                                status="completed"
                              />
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No lesson scores yet
                            </p>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <BookOpen className="mx-auto mb-4 size-8 opacity-20" />
                  <p>No subjects found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mastery" className="space-y-4">
          {masteryLoading ? (
            <RecordsSkeleton />
          ) : masteryError ? (
            <div className="p-8 text-center">
              <p className="mb-4 text-destructive">{masteryError}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <>


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
                      {filteredSubjects.map((subject) => {
                        const score = subjectScores.get(subject.id) ?? 0;
                        const slug = Array.from(slugMap.entries()).find(
                          ([, s]) => s.id === subject.id,
                        )?.[0];
                        const handleClick = slug
                          ? () => router.push(`/dashboard/subjects/${slug}/performance`)
                          : undefined;

                        return (
                          <SubjectScoreRow
                            key={subject.id}
                            subjectName={subject.name}
                            score={score}
                            onClick={handleClick}
                            showProgress={true}
                            status="completed"
                          />
                        );
                      })}
                    </div>
                  ) : (
                     <div className="py-12 text-center text-muted-foreground">
                      <BookOpen className="mx-auto mb-4 size-8 opacity-20" />
                      {currentTermApiId ? (
                        <p>
                          No scores yet for this term. Start a lesson to see
                          your progress!
                        </p>
                      ) : (
                        <p>No subjects found to display mastery.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
