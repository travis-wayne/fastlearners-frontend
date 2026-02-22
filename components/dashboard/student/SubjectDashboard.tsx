"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Filter,
  Search,
  Settings,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  getConfigSubjectIdFromApiId,
  getElectiveSubjectsForClass,
  getSubjectById,
  getSubjects,
  type Subject as ConfigSubject,
} from "@/config/education";
import { getGrade } from "@/lib/utils/grading";
import { getSubjectsWithSlugs, getSubjectScore } from "@/lib/api/lessons";
import { getStudentSubjects } from "@/lib/api/subjects";
import { useAuthStore } from "@/store/authStore";
import type {
  Subject as ApiSubject,
  SubjectsContent,
} from "@/lib/types/subjects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademicSelector } from "@/components/dashboard/student/shared/academic-selector";
import { SubjectCard } from "@/components/dashboard/student/shared/subject-card";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";
import { Skeleton } from "@/components/ui/skeleton";

interface SubjectDashboardProps {
  initialData?: SubjectsContent;
}

// Mock data removed - using real API data instead

// Helper function to generate deterministic hash from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Predefined colors and icons for fallback
const FALLBACK_COLORS = [
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#6366F1",
  "#DC2626",
  "#059669",
  "#16A34A",
  "#7C3AED",
  "#B91C1C",
  "#92400E",
  "#0F766E",
  "#0D9488",
];
const FALLBACK_ICONS = [
  "bookOpen",
  "calculator",
  "flask",
  "users",
  "wrench",
  "briefcase",
  "monitor",
  "zap",
  "leaf",
  "landmark",
  "scroll",
  "store",
  "tractor",
  "flag",
  "cross",
];

// Helper function to get fallback color/icon based on subject id/name
function getFallbackSubjectDisplay(apiSubject: ApiSubject): {
  color: string;
  icon: string;
} {
  const hash = hashString(`${apiSubject.id}-${apiSubject.name}`);
  const colorIndex = hash % FALLBACK_COLORS.length;
  const iconIndex = hash % FALLBACK_ICONS.length;

  return {
    color: FALLBACK_COLORS[colorIndex],
    icon: FALLBACK_ICONS[iconIndex],
  };
}

// Helper function to map API subject to config subject
// Uses ID-based mapping first, then exact name match, with deterministic fallback
function mapApiSubjectToConfig(
  apiSubject: ApiSubject,
  classLevelId?: string,
): ConfigSubject | null {
  // First, try ID-based mapping
  const configSubjectId = getConfigSubjectIdFromApiId(apiSubject.id);
  if (configSubjectId) {
    const configSubject = getSubjectById(configSubjectId);
    if (configSubject) {
      return configSubject;
    }
  }

  // Fall back to exact name match (case-insensitive)
  const allSubjects = getSubjects();
  const configSubject = allSubjects.find(
    (s: ConfigSubject) =>
      s.name.toLowerCase() === apiSubject.name.toLowerCase(),
  );

  if (configSubject) {
    return configSubject;
  }

  // Log unmapped subjects and capture in telemetry
  const fallback = getFallbackSubjectDisplay(apiSubject);

  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[SubjectDashboard] Unmapped API subject: ID=${apiSubject.id}, Name="${apiSubject.name}". ` +
      `Add mapping to apiSubjectIdToConfigIdMap in config/education.ts`,
    );
  }

  // Optional: Send telemetry in production (lightweight POST)
  if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
    // Lightweight telemetry - could be sent to analytics endpoint
    // For now, just log to console in dev
  }

  // Return null to indicate unmapped, caller will use fallback
  return null;
}

export function SubjectDashboard({ initialData }: SubjectDashboardProps) {
  const [subjectsData, setSubjectsData] = useState<SubjectsContent | null>(
    initialData || null,
  );
  const [subjectsWithSlugs, setSubjectsWithSlugs] = useState<
    Map<number, string>
  >(new Map());
  const [isLoading, setIsLoading] = useState(!initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");

  const [numericClassId, setNumericClassId] = useState<number | null>(null);
  const [subjectScores, setSubjectScores] = useState<Map<number, number>>(new Map());
  const [scoresLoading, setScoresLoading] = useState(true);

  const { currentClass, availableSubjects } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch subjects data
        const response = await getStudentSubjects();
        if (response.success && response.content) {
          setSubjectsData(response.content);
        }

        // Fetch subjects with slugs for navigation
        const slugsResponse = await getSubjectsWithSlugs();
        if (slugsResponse.success && slugsResponse.content?.subjects) {
          const slugMap = new Map<number, string>();
          slugsResponse.content.subjects.forEach((s) => {
            slugMap.set(s.id, s.slug);
          });
          setSubjectsWithSlugs(slugMap);

          // Development-only check: log subject IDs without matching slugs
          if (
            (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true" ||
              process.env.NODE_ENV === "development") &&
            response.success &&
            response.content
          ) {
            const allApiSubjects = new Set<number>();
            // Collect all subject IDs from student's subjects
            (response.content.subjects || []).forEach((subject) => {
              allApiSubjects.add(subject.id);
            });
            (response.content.compulsory_selective || []).forEach((subject) => {
              allApiSubjects.add(subject.id);
            });
            (response.content.selective || []).forEach((subject) => {
              allApiSubjects.add(subject.id);
            });

            // Find subject IDs without matching slug entry
            const missingSlugs = Array.from(allApiSubjects).filter(
              (subjectId) => !slugMap.has(subjectId),
            );

            if (missingSlugs.length > 0) {
              console.warn(
                "[SubjectDashboard] Subject IDs without matching slug entry:",
                missingSlugs,
              );
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialData) {
      fetchData();
    } else {
      // Still fetch slugs even if we have initial data
      const fetchSlugs = async () => {
        try {
          const slugsResponse = await getSubjectsWithSlugs();
          if (slugsResponse.success && slugsResponse.content?.subjects) {
            const slugMap = new Map<number, string>();
            slugsResponse.content.subjects.forEach((s) => {
              slugMap.set(s.id, s.slug);
            });
            setSubjectsWithSlugs(slugMap);

            // Development-only check: log subject IDs without matching slugs
            if (
              (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true" ||
                process.env.NODE_ENV === "development") &&
              initialData
            ) {
              const allApiSubjects = new Set<number>();
              // Collect all subject IDs from student's subjects
              (initialData.subjects || []).forEach((subject) => {
                allApiSubjects.add(subject.id);
              });
              (initialData.compulsory_selective || []).forEach((subject) => {
                allApiSubjects.add(subject.id);
              });
              (initialData.selective || []).forEach((subject) => {
                allApiSubjects.add(subject.id);
              });

              // Find subject IDs without matching slug entry
              const missingSlugs = Array.from(allApiSubjects).filter(
                (subjectId) => !slugMap.has(subjectId),
              );

              if (missingSlugs.length > 0) {
                console.warn(
                  "[SubjectDashboard] Subject IDs without matching slug entry:",
                  missingSlugs,
                );
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch subject slugs:", error);
        }
      };
      fetchSlugs();
    }
  }, [initialData]);

  // Get user's ASSIGNED subjects only (from subjects array)
  // Categorize them based on whether they appear in compulsory_selective or selective lists
  const allApiSubjects = useMemo(() => {
    if (!subjectsData) return [];

    // Create sets for quick lookup to determine subject type
    const compulsorySelectiveIds = new Set(
      (subjectsData.compulsory_selective || []).map(s => s.id)
    );
    const selectiveIds = new Set(
      (subjectsData.selective || []).map(s => s.id)
    );

    // Only show user's ASSIGNED subjects (from subjects array)
    // Categorize them based on whether their ID appears in compulsory_selective or selective
    return (subjectsData.subjects || []).map((subject) => {
      let type: "core" | "compulsory_selective" | "selective" = "core";

      if (compulsorySelectiveIds.has(subject.id)) {
        type = "compulsory_selective";
      } else if (selectiveIds.has(subject.id)) {
        type = "selective";
      }

      return { ...subject, type };
    });
  }, [subjectsData]);

  // Fetch numeric class ID and then subject scores
  useEffect(() => {
    let isMounted = true;
    const fetchScores = async () => {
      if (!currentClass?.name || allApiSubjects.length === 0) {
        setScoresLoading(false);
        return;
      }

      setScoresLoading(true);
      try {
        const metaResponse = await fetch('/api/lessons/meta', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        
        let classId: number | null = null;
        if (metaResponse.ok) {
          const meta = await metaResponse.json();
          if (meta.success && meta.content?.classes) {
            const userClassObj = meta.content.classes.find(
              (c: { name: string; id: number }) => c.name === currentClass.name || String(c.id) === currentClass.id
            );
            if (userClassObj) {
              classId = userClassObj.id;
              if (isMounted) setNumericClassId(classId);
            }
          }
        }

        if (classId) {
          const scorePromises = allApiSubjects.map(async (subject) => {
            const res = await getSubjectScore(subject.id, classId!);
            let score = 0;
            if (res.success && res.content) {
              score = parseFloat(res.content.subject_total_score) || 0;
            }
            return { id: subject.id, score };
          });

          const results = await Promise.all(scorePromises);
          
          if (isMounted) {
            const newScores = new Map<number, number>();
            results.forEach((r) => newScores.set(r.id, r.score));
            setSubjectScores(newScores);
          }
        }
      } catch (error) {
        console.error("Failed to fetch subject scores:", error);
      } finally {
        if (isMounted) setScoresLoading(false);
      }
    };

    fetchScores();

    return () => {
      isMounted = false;
    };
  }, [allApiSubjects, currentClass]);

  // Filter subjects based on search and track
  const filteredSubjects = useMemo(() => {
    return allApiSubjects.filter((subject) => {
      const matchesSearch = subject.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Try to get config subject for additional filtering
      const configSubject = mapApiSubjectToConfig(subject, currentClass?.id);

      const matchesTrack =
        selectedTrack === "all" ||
        (selectedTrack === "core" &&
          (subject.type === "core" ||
            subject.type === "compulsory_selective")) ||
        (selectedTrack === "elective" && subject.type === "selective") ||
        (configSubject && selectedTrack === configSubject.track);

      return matchesSearch && matchesTrack;
    });
  }, [allApiSubjects, searchQuery, selectedTrack, currentClass]);

  // Separate subjects by type for display
  // Core subjects = compulsory subjects + compulsory selective (religious study)
  const coreSubjects = filteredSubjects.filter(
    (s) => s.type === "core" || s.type === "compulsory_selective"
  );
  // Elective subjects = selective subjects chosen by user
  const electiveSubjects = filteredSubjects.filter(
    (s) => s.type === "selective",
  );

  // Calculate overall stats
  const totalSubjects = allApiSubjects.length;
  const completedSubjects = allApiSubjects.filter((subject) => {
    const score = subjectScores.get(subject.id) || 0;
    return score >= 90;
  }).length;

  const averageProgress =
    allApiSubjects.length > 0
      ? Math.round(
          allApiSubjects.reduce((acc, subject) => {
            const score = subjectScores.get(subject.id) || 0;
            return acc + score;
          }, 0) / allApiSubjects.length,
        )
      : 0;

  const upcomingAssessments = 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!subjectsData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No subjects data available. Please contact support.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!currentClass) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Select Your Class</h3>
            <p className="mb-4 text-muted-foreground">
              Please select your class and term to view your subjects.
            </p>
            <AcademicSelector variant="default" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto space-y-6 px-4 pb-20 sm:space-y-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col items-center justify-between gap-4 transition-all sm:flex-row">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Subjects</h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Your subjects for <span className="font-medium text-primary">{classDisplay}</span> • <span className="font-medium text-primary">{termDisplay}</span>
            </p>
          </div>
          <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
            <Link href="/dashboard/subjects/manage" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="h-9 w-full px-4 font-semibold shadow-sm transition-all hover:shadow-md">
                <Settings className="mr-2 size-3.5" />
                Manage
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4">
          <Card className="overflow-hidden border-2 bg-blue-50/30 shadow-sm transition-all hover:shadow-md dark:bg-blue-900/10">
            <CardContent className="responsive-padding">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-blue-100 p-1.5 dark:bg-blue-900/30">
                  <BookOpen className="size-3 text-blue-600 dark:text-blue-400 sm:size-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                  Total
                </span>
              </div>
              <p className="mt-1 text-xl font-black text-blue-900 dark:text-blue-100 sm:mt-2 sm:text-2xl">
                {isLoading || scoresLoading ? <Skeleton className="h-8 w-12" /> : totalSubjects}
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 bg-emerald-50/30 shadow-sm transition-all hover:shadow-md dark:bg-emerald-900/10">
            <CardContent className="responsive-padding">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-emerald-100 p-1.5 dark:bg-emerald-900/30">
                  <Target className="size-3 text-emerald-600 dark:text-emerald-400 sm:size-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                  Done
                </span>
              </div>
              <p className="mt-1 text-xl font-black text-emerald-900 dark:text-emerald-100 sm:mt-2 sm:text-2xl">
                {isLoading || scoresLoading ? <Skeleton className="h-8 w-12" /> : completedSubjects}
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 bg-purple-50/30 shadow-sm transition-all hover:shadow-md dark:bg-purple-900/10">
            <CardContent className="responsive-padding">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-purple-100 p-1.5 dark:bg-purple-900/30">
                  <TrendingUp className="size-3 text-purple-600 dark:text-purple-400 sm:size-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                  Avg
                </span>
              </div>
              <p className="mt-1 text-xl font-black text-purple-900 dark:text-purple-100 sm:mt-2 sm:text-2xl">
                {isLoading || scoresLoading ? <Skeleton className="h-8 w-12" /> : `${averageProgress}%`}
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 bg-orange-50/30 shadow-sm transition-all hover:shadow-md dark:bg-orange-900/10">
            <CardContent className="responsive-padding">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-orange-100 p-1.5 dark:bg-orange-900/30">
                  <Users className="size-3 text-orange-600 dark:text-orange-400 sm:size-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                  Tests
                </span>
              </div>
              <p className="mt-1 text-xl font-black text-orange-900 dark:text-orange-100 sm:mt-2 sm:text-2xl">
                {isLoading || scoresLoading ? <Skeleton className="h-8 w-12" /> : upcomingAssessments}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 sm:h-11"
            />
          </div>
          <Select value={selectedTrack} onValueChange={setSelectedTrack}>
            <SelectTrigger className="h-10 w-full font-medium shadow-sm sm:h-11 sm:w-[180px]">
              <Filter className="mr-2 size-4 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tracks</SelectItem>
              <SelectItem value="core">Core Subjects</SelectItem>
              <SelectItem value="elective">Elective Subjects</SelectItem>
              {currentClass.track && (
                <SelectItem value={currentClass.track}>
                  {currentClass.track.charAt(0).toUpperCase() +
                    currentClass.track.slice(1)}{" "}
                  Track
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Subjects Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="no-scrollbar flex h-auto w-full overflow-x-auto rounded-lg bg-muted/50 p-1">
            <TabsTrigger value="all" className="flex-1 rounded-md px-3 py-2 text-xs font-bold transition-all sm:py-2.5 sm:text-sm">
              All <span className="ml-1 hidden sm:inline">Subjects</span> ({filteredSubjects.length})
            </TabsTrigger>
            <TabsTrigger value="core" className="flex-1 rounded-md px-3 py-2 text-xs font-bold transition-all sm:py-2.5 sm:text-sm">
              Core <span className="ml-1 hidden sm:inline">Subjects</span> ({coreSubjects.length})
            </TabsTrigger>
            <TabsTrigger value="elective" className="flex-1 rounded-md px-3 py-2 text-xs font-bold transition-all sm:py-2.5 sm:text-sm">
              <span className="hidden sm:inline">Electives</span><span className="sm:hidden">Elect.</span> ({electiveSubjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {coreSubjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Core Subjects</Badge>
                  <span className="text-sm text-muted-foreground">
                    Compulsory subjects for {classDisplay}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {coreSubjects.map((apiSubject) => {
                    const configSubject = mapApiSubjectToConfig(
                      apiSubject,
                      currentClass?.id,
                    );
                    const score = subjectScores.get(apiSubject.id) ?? 0;
                    const progress = {
                      termProgress: score,
                      caScore: score,
                      grade: score > 0 ? getGrade(score).letter : "N/A",
                      totalTopics: 10,
                      completedTopics: Math.round(score / 10),
                      currentWeek: Math.max(1, Math.round(score / 8)),
                      totalWeeks: 13,
                      upcomingAssessments: 0,
                    };

                    const fallback = !configSubject
                      ? getFallbackSubjectDisplay(apiSubject)
                      : null;
                    const displaySubject: ConfigSubject = configSubject || {
                      id: String(apiSubject.id),
                      name: apiSubject.name,
                      code: apiSubject.name.substring(0, 3).toUpperCase(),
                      description: apiSubject.name,
                      icon: fallback?.icon || "BookOpen",
                      color: fallback?.color || "#6366f1",
                      compulsory: true,
                      levels: [],
                    };

                    return (
                      <div key={apiSubject.id} className="flex flex-col gap-2">
                        <SubjectCard
                          subject={displaySubject}
                          progress={progress}
                          slug={subjectsWithSlugs.get(apiSubject.id)}
                          isLoading={scoresLoading}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {electiveSubjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Elective Subjects</Badge>
                  <span className="text-sm text-muted-foreground">
                    Your selected elective subjects
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {electiveSubjects.map((apiSubject) => {
                    const configSubject = mapApiSubjectToConfig(
                      apiSubject,
                      currentClass?.id,
                    );
                    const score = subjectScores.get(apiSubject.id) ?? 0;
                    const progress = {
                      termProgress: score,
                      caScore: score,
                      grade: score > 0 ? getGrade(score).letter : "N/A",
                      totalTopics: 10,
                      completedTopics: Math.round(score / 10),
                      currentWeek: Math.max(1, Math.round(score / 8)),
                      totalWeeks: 13,
                      upcomingAssessments: 0,
                    };

                    const fallback = !configSubject
                      ? getFallbackSubjectDisplay(apiSubject)
                      : null;
                    const displaySubject: ConfigSubject = configSubject || {
                      id: String(apiSubject.id),
                      name: apiSubject.name,
                      code: apiSubject.name.substring(0, 3).toUpperCase(),
                      description: apiSubject.name,
                      icon: fallback?.icon || "BookOpen",
                      color: fallback?.color || "#10b981",
                      compulsory: false,
                      levels: [],
                    };

                    return (
                      <div key={apiSubject.id} className="flex flex-col gap-2">
                        <SubjectCard
                          subject={displaySubject}
                          progress={progress}
                          slug={subjectsWithSlugs.get(apiSubject.id)}
                          isLoading={scoresLoading}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredSubjects.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No Subjects Found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "No subjects match your search."
                      : "No subjects available."}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery("")}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="core" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {coreSubjects.map((apiSubject) => {
                const configSubject = mapApiSubjectToConfig(
                  apiSubject,
                  currentClass?.id,
                );
                const score = subjectScores.get(apiSubject.id) ?? 0;
                const progress = {
                  termProgress: score,
                  caScore: score,
                  grade: score > 0 ? getGrade(score).letter : "N/A",
                  totalTopics: 10,
                  completedTopics: Math.round(score / 10),
                  currentWeek: Math.max(1, Math.round(score / 8)),
                  totalWeeks: 13,
                  upcomingAssessments: 0,
                };

                const fallback = !configSubject
                  ? getFallbackSubjectDisplay(apiSubject)
                  : null;
                const displaySubject: ConfigSubject = configSubject || {
                  id: String(apiSubject.id),
                  name: apiSubject.name,
                  code: apiSubject.name.substring(0, 3).toUpperCase(),
                  description: apiSubject.name,
                  icon: fallback?.icon || "BookOpen",
                  color: fallback?.color || "#6366f1",
                  compulsory: true,
                  levels: [],
                };

                return (
                  <div key={apiSubject.id} className="flex flex-col gap-2">
                    <SubjectCard
                      subject={displaySubject}
                      progress={progress}
                      slug={subjectsWithSlugs.get(apiSubject.id)}
                      isLoading={scoresLoading}
                    />
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="elective" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {electiveSubjects.map((apiSubject) => {
                const configSubject = mapApiSubjectToConfig(
                  apiSubject,
                  currentClass?.id,
                );
                const score = subjectScores.get(apiSubject.id) ?? 0;
                const progress = {
                  termProgress: score,
                  caScore: score,
                  grade: score > 0 ? getGrade(score).letter : "N/A",
                  totalTopics: 10,
                  completedTopics: Math.round(score / 10),
                  currentWeek: Math.max(1, Math.round(score / 8)),
                  totalWeeks: 13,
                  upcomingAssessments: 0,
                };

                const fallback = !configSubject
                  ? getFallbackSubjectDisplay(apiSubject)
                  : null;
                const displaySubject: ConfigSubject = configSubject || {
                  id: String(apiSubject.id),
                  name: apiSubject.name,
                  code: apiSubject.name.substring(0, 3).toUpperCase(),
                  description: apiSubject.name,
                  icon: fallback?.icon || "BookOpen",
                  color: fallback?.color || "#10b981",
                  compulsory: false,
                  levels: [],
                };

                return (
                  <div key={apiSubject.id} className="flex flex-col gap-2">
                    <SubjectCard
                      subject={displaySubject}
                      progress={progress}
                      slug={subjectsWithSlugs.get(apiSubject.id)}
                      isLoading={scoresLoading}
                    />
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
