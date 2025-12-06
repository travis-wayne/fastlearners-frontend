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
  getCompulsorySubjectsForClass,
  getConfigSubjectIdFromApiId,
  getElectiveSubjectsForClass,
  getSubjectById,
  getSubjects,
  type Subject as ConfigSubject,
} from "@/config/education";
import { getSubjectsWithSlugs } from "@/lib/api/lessons";
import { getStudentSubjects } from "@/lib/api/subjects";
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

interface SubjectDashboardProps {
  initialData?: SubjectsContent;
}

// Mock data for subject progress - this would come from API
const mockSubjectProgress: Record<
  string,
  {
    totalTopics: number;
    completedTopics: number;
    currentWeek: number;
    totalWeeks: number;
    upcomingAssessments: number;
    lastAccessed?: string;
    termProgress: number;
    grade?: string;
    caScore?: number;
  }
> = {
  english: {
    totalTopics: 12,
    completedTopics: 8,
    currentWeek: 9,
    totalWeeks: 13,
    upcomingAssessments: 2,
    lastAccessed: "2 hours ago",
    termProgress: 67,
    grade: "B3",
    caScore: 78,
  },
  mathematics: {
    totalTopics: 15,
    completedTopics: 10,
    currentWeek: 8,
    totalWeeks: 13,
    upcomingAssessments: 1,
    lastAccessed: "Yesterday",
    termProgress: 75,
    grade: "B2",
    caScore: 82,
  },
  "basic-science": {
    totalTopics: 10,
    completedTopics: 6,
    currentWeek: 7,
    totalWeeks: 12,
    upcomingAssessments: 3,
    lastAccessed: "3 days ago",
    termProgress: 58,
    grade: "C4",
    caScore: 65,
  },
  "social-studies": {
    totalTopics: 8,
    completedTopics: 8,
    currentWeek: 10,
    totalWeeks: 11,
    upcomingAssessments: 0,
    lastAccessed: "Today",
    termProgress: 90,
    grade: "A1",
    caScore: 92,
  },
  "basic-technology": {
    totalTopics: 9,
    completedTopics: 4,
    currentWeek: 5,
    totalWeeks: 11,
    upcomingAssessments: 2,
    lastAccessed: "1 week ago",
    termProgress: 42,
    grade: "C5",
    caScore: 58,
  },
  "business-studies": {
    totalTopics: 7,
    completedTopics: 3,
    currentWeek: 4,
    totalWeeks: 10,
    upcomingAssessments: 1,
    lastAccessed: "5 days ago",
    termProgress: 35,
    caScore: 45,
  },
};

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

  const { currentClass, availableSubjects } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();

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

  // Get all subjects from API response
  const allApiSubjects = useMemo(() => {
    if (!subjectsData) return [];

    // Combine all subjects from API
    const subjects = new Map<
      number,
      ApiSubject & {
        type: "regular" | "compulsory_selective" | "selective";
      }
    >();

    // Add regular subjects
    (subjectsData.subjects || []).forEach((subject) => {
      subjects.set(subject.id, { ...subject, type: "regular" });
    });

    // Add compulsory selective subjects (for JSS)
    (subjectsData.compulsory_selective || []).forEach((subject) => {
      subjects.set(subject.id, { ...subject, type: "compulsory_selective" });
    });

    // Add selective subjects
    (subjectsData.selective || []).forEach((subject) => {
      // Only add if not already added as regular
      if (!subjects.has(subject.id)) {
        subjects.set(subject.id, { ...subject, type: "selective" });
      }
    });

    return Array.from(subjects.values());
  }, [subjectsData]);

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
          (subject.type === "regular" ||
            subject.type === "compulsory_selective")) ||
        (selectedTrack === "elective" && subject.type === "selective") ||
        (configSubject && selectedTrack === configSubject.track);

      return matchesSearch && matchesTrack;
    });
  }, [allApiSubjects, searchQuery, selectedTrack, currentClass]);

  // Separate subjects by type for display
  const regularSubjects = filteredSubjects.filter((s) => s.type === "regular");
  const compulsorySelectiveSubjects = filteredSubjects.filter(
    (s) => s.type === "compulsory_selective",
  );
  const selectiveSubjects = filteredSubjects.filter(
    (s) => s.type === "selective",
  );

  // Calculate overall stats
  const totalSubjects = allApiSubjects.length;
  const completedSubjects = allApiSubjects.filter((subject) => {
    const configSubject = mapApiSubjectToConfig(subject, currentClass?.id);
    if (!configSubject) return false;
    const progress = mockSubjectProgress[configSubject.id];
    return progress && progress.termProgress >= 90;
  }).length;

  const averageProgress =
    allApiSubjects.length > 0
      ? Math.round(
          allApiSubjects.reduce((acc, subject) => {
            const configSubject = mapApiSubjectToConfig(
              subject,
              currentClass?.id,
            );
            const progress = configSubject
              ? mockSubjectProgress[configSubject.id]
              : undefined;
            return acc + (progress?.termProgress || 0);
          }, 0) / allApiSubjects.length,
        )
      : 0;

  const upcomingAssessments = allApiSubjects.reduce((acc, subject) => {
    const configSubject = mapApiSubjectToConfig(subject, currentClass?.id);
    const progress = configSubject
      ? mockSubjectProgress[configSubject.id]
      : undefined;
    return acc + (progress?.upcomingAssessments || 0);
  }, 0);

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
      className="container mx-auto space-y-6 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          {/* <div>
            <h1 className="text-3xl font-bold">Subjects</h1>
            <p className="text-muted-foreground">
              Your subjects for {classDisplay} - {termDisplay}
            </p>
            <AcademicSelector variant="compact" />
          </div> */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard/subjects/manage">
              <Button variant="outline">
                <Settings className="mr-2 size-4" />
                Manage
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">
                  Total Subjects
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold">{totalSubjects}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{completedSubjects}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">
                  Avg Progress
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold">{averageProgress}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-orange-600" />
                <span className="text-sm text-muted-foreground">
                  Assessments
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold">{upcomingAssessments}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedTrack} onValueChange={setSelectedTrack}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
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
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All Subjects ({filteredSubjects.length})
            </TabsTrigger>
            <TabsTrigger value="compulsory">
              Core Subjects (
              {regularSubjects.length + compulsorySelectiveSubjects.length})
            </TabsTrigger>
            <TabsTrigger value="elective">
              Electives ({selectiveSubjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {regularSubjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Core Subjects</Badge>
                  <span className="text-sm text-muted-foreground">
                    Required for all students in {classDisplay}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {regularSubjects.map((apiSubject) => {
                    const configSubject = mapApiSubjectToConfig(
                      apiSubject,
                      currentClass?.id,
                    );
                    const progress = configSubject
                      ? mockSubjectProgress[configSubject.id] || {
                          totalTopics: 10,
                          completedTopics: 0,
                          currentWeek: 1,
                          totalWeeks: 12,
                          upcomingAssessments: 0,
                          termProgress: 0,
                        }
                      : {
                          totalTopics: 10,
                          completedTopics: 0,
                          currentWeek: 1,
                          totalWeeks: 12,
                          upcomingAssessments: 0,
                          termProgress: 0,
                        };

                    // Create a config subject for display if not found, using deterministic fallback
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
                      <SubjectCard
                        key={apiSubject.id}
                        subject={displaySubject}
                        progress={progress}
                        slug={subjectsWithSlugs.get(apiSubject.id)}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {compulsorySelectiveSubjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Compulsory Selective</Badge>
                  <span className="text-sm text-muted-foreground">
                    Select one religious studies subject (JSS only)
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {compulsorySelectiveSubjects.map((apiSubject) => {
                    const configSubject = mapApiSubjectToConfig(
                      apiSubject,
                      currentClass?.id,
                    );
                    const progress = configSubject
                      ? mockSubjectProgress[configSubject.id] || {
                          totalTopics: 10,
                          completedTopics: 0,
                          currentWeek: 1,
                          totalWeeks: 12,
                          upcomingAssessments: 0,
                          termProgress: 0,
                        }
                      : {
                          totalTopics: 10,
                          completedTopics: 0,
                          currentWeek: 1,
                          totalWeeks: 12,
                          upcomingAssessments: 0,
                          termProgress: 0,
                        };

                    const displaySubject: ConfigSubject = configSubject || {
                      id: String(apiSubject.id),
                      name: apiSubject.name,
                      code: apiSubject.name.substring(0, 3).toUpperCase(),
                      description: apiSubject.name,
                      icon: "BookOpen",
                      color: "#8b5cf6",
                      compulsory: true,
                      levels: [],
                    };

                    return (
                      <SubjectCard
                        key={apiSubject.id}
                        subject={displaySubject}
                        progress={progress}
                        slug={subjectsWithSlugs.get(apiSubject.id)}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {selectiveSubjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Selective Subjects</Badge>
                  <span className="text-sm text-muted-foreground">
                    Optional subjects you can choose
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {selectiveSubjects.map((apiSubject) => {
                    const configSubject = mapApiSubjectToConfig(
                      apiSubject,
                      currentClass?.id,
                    );
                    const progress = configSubject
                      ? mockSubjectProgress[configSubject.id] || {
                          totalTopics: 8,
                          completedTopics: 0,
                          currentWeek: 1,
                          totalWeeks: 10,
                          upcomingAssessments: 0,
                          termProgress: 0,
                        }
                      : {
                          totalTopics: 8,
                          completedTopics: 0,
                          currentWeek: 1,
                          totalWeeks: 10,
                          upcomingAssessments: 0,
                          termProgress: 0,
                        };

                    const displaySubject: ConfigSubject = configSubject || {
                      id: String(apiSubject.id),
                      name: apiSubject.name,
                      code: apiSubject.name.substring(0, 3).toUpperCase(),
                      description: apiSubject.name,
                      icon: "BookOpen",
                      color: "#10b981",
                      compulsory: false,
                      levels: [],
                    };

                    return (
                      <SubjectCard
                        key={apiSubject.id}
                        subject={displaySubject}
                        progress={progress}
                        slug={subjectsWithSlugs.get(apiSubject.id)}
                      />
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

          <TabsContent value="compulsory" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...regularSubjects, ...compulsorySelectiveSubjects].map(
                (apiSubject) => {
                  const configSubject = mapApiSubjectToConfig(
                    apiSubject,
                    currentClass?.id,
                  );
                  const progress = configSubject
                    ? mockSubjectProgress[configSubject.id] || {
                        totalTopics: 10,
                        completedTopics: 0,
                        currentWeek: 1,
                        totalWeeks: 12,
                        upcomingAssessments: 0,
                        termProgress: 0,
                      }
                    : {
                        totalTopics: 10,
                        completedTopics: 0,
                        currentWeek: 1,
                        totalWeeks: 12,
                        upcomingAssessments: 0,
                        termProgress: 0,
                      };

                  const displaySubject: ConfigSubject = configSubject || {
                    id: String(apiSubject.id),
                    name: apiSubject.name,
                    code: apiSubject.name.substring(0, 3).toUpperCase(),
                    description: apiSubject.name,
                    icon: "BookOpen",
                    color: "#6366f1",
                    compulsory: true,
                    levels: [],
                  };

                  return (
                    <SubjectCard
                      key={apiSubject.id}
                      subject={displaySubject}
                      progress={progress}
                    />
                  );
                },
              )}
            </div>
          </TabsContent>

          <TabsContent value="elective" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {selectiveSubjects.map((apiSubject) => {
                const configSubject = mapApiSubjectToConfig(
                  apiSubject,
                  currentClass?.id,
                );
                const progress = configSubject
                  ? mockSubjectProgress[configSubject.id] || {
                      totalTopics: 8,
                      completedTopics: 0,
                      currentWeek: 1,
                      totalWeeks: 10,
                      upcomingAssessments: 0,
                      termProgress: 0,
                    }
                  : {
                      totalTopics: 8,
                      completedTopics: 0,
                      currentWeek: 1,
                      totalWeeks: 10,
                      upcomingAssessments: 0,
                      termProgress: 0,
                    };

                const displaySubject: ConfigSubject = configSubject || {
                  id: String(apiSubject.id),
                  name: apiSubject.name,
                  code: apiSubject.name.substring(0, 3).toUpperCase(),
                  description: apiSubject.name,
                  icon: "BookOpen",
                  color: "#10b981",
                  compulsory: false,
                  levels: [],
                };

                return (
                  <SubjectCard
                    key={apiSubject.id}
                    subject={displaySubject}
                    progress={progress}
                  />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
