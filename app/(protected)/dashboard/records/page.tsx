"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Download,
  FileText,
  Target,
  TrendingUp,
} from "lucide-react";

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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademicSelector } from "@/components/dashboard/student/shared/academic-selector";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";

import { getStudentSubjects } from "@/lib/api/subjects";
import { getSubjectScore, getSubjectsWithSlugs } from "@/lib/api/lessons";
import { useAuthStore } from "@/store/authStore";
import { getGrade } from "@/lib/utils/grading";
import type { Subject as ApiSubject } from "@/lib/types/subjects";

export default function RecordsPage() {
  const { currentClass, currentTerm, currentTermApiId } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();
  const [selectedTerm, setSelectedTerm] = useState("current");
  const user = useAuthStore((state) => state.user);

  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [subjectScores, setSubjectScores] = useState<Map<number, number>>(new Map());
  const [slugMap, setSlugMap] = useState<Map<string, ApiSubject>>(new Map());
  const [masteryLoading, setMasteryLoading] = useState(true);
  const [masteryError, setMasteryError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      // Deterministically clear state before/when prerequisites are missing
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
            const matched = enrolled.find(e => e.id === s.id);
            if (matched) {
              map.set(s.slug, matched);
            }
          });
          if (isMounted) setSlugMap(map);
        }

        // 3. Fetch scores using live term ID from context
        // Ensure scores are only fetched when term ID and subjects are present
        if (currentTermApiId && enrolled.length > 0) {
          const scorePromises = enrolled.map(async (subj) => {
            const res = await getSubjectScore(subj.id, currentTermApiId);
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
        console.error("Failed to fetch mastery data:", err);
        if (isMounted) setMasteryError("Failed to load performance data.");
      } finally {
        if (isMounted) setMasteryLoading(false);
      }
    }

    fetchData();

    return () => { isMounted = false; };
  }, [user?.class, currentTermApiId]);

  const filteredSubjects = useMemo(() => subjects, [subjects]);

  // Calculate live stats
  const liveTotalScores = Array.from(subjectScores.values()).reduce((sum, score) => (sum as number) + (score as number), 0);
  const averageScore = subjectScores.size > 0 ? Math.round((liveTotalScores as number) / subjectScores.size) : 0;
  const subjectsPassing = Array.from(subjectScores.values()).filter(score => (score as number) >= 50).length;
  const subjectsCount = subjects.length;
  const aGradesCount = Array.from(subjectScores.values()).filter(score => (score as number) >= 90).length;

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
              Please select your class and term to view records.
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
        <div className="flex items-center gap-2">
          <AcademicSelector variant="compact" />
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
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
            <p className="text-sm text-muted-foreground">
              assigned to you
            </p>
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
            <p className="text-2xl font-bold">
              {aGradesCount}
            </p>
            <p className="text-sm text-muted-foreground">score ≥ 90%</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="mastery" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="mastery">Subject Mastery</TabsTrigger>
            <TabsTrigger value="progress">Progress Chart</TabsTrigger>
          </TabsList>

          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Term</SelectItem>
              <SelectItem value="1st">1st Term</SelectItem>
              <SelectItem value="2nd">2nd Term</SelectItem>
              <SelectItem value="3rd">3rd Term</SelectItem>
            </SelectContent>
          </Select>
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

        <TabsContent value="mastery" className="space-y-4">
          {masteryLoading ? (
            <div className="space-y-4">
              <div className="responsive-gap grid grid-cols-1 md:grid-cols-3">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </div>
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          ) : masteryError ? (
            <div className="p-8 text-center">
              <p className="mb-4 text-destructive">{masteryError}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="responsive-gap grid grid-cols-1 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <TrendingUp className="size-4 text-emerald-500" />
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Overall Average
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{averageScore}%</div>
                    <p className="text-xs text-muted-foreground">
                      Across all subjects
                    </p>
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
                    <div className="text-2xl font-bold">{subjectsCount}</div>
                    <p className="text-xs text-muted-foreground">
                      Assigned to you
                    </p>
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

              {/* Subject Mastery Card */}
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
                        const gradeInfo = getGrade(score);

                        return (
                          <div key={subject.id} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-base font-medium">
                                {subject.name}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">{score}%</span>
                                <Badge className={gradeInfo.colorClass}>
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
