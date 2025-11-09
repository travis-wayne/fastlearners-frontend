"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  Circle,
  Clock,
  Pause,
  ArrowRight,
  Search,
  Filter,
  RotateCcw,
  PlayCircle,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchLessons, getLessonMeta } from "@/lib/api/lessons";
import { getStudentSubjects } from "@/lib/api/subjects";
import { getSubjectById } from "@/config/education";
import type { Lesson } from "@/lib/types/lessons";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

function LessonCard({ lesson, onClick }: LessonCardProps) {
  const subject = getSubjectById(String(lesson.subject_id));
  const progressPercentage = lesson.progress || 0;

  const getStatusIcon = () => {
    if (progressPercentage >= 100) {
      return <CheckCircle className="size-5 text-green-600" />;
    } else if (progressPercentage > 0) {
      return <Pause className="size-5 text-yellow-600" />;
    } else {
      return <Circle className="size-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    if (progressPercentage >= 100) return "Completed";
    if (progressPercentage > 0) return "In Progress";
    return "Not Started";
  };

  const getStatusColor = () => {
    if (progressPercentage >= 100) return "text-green-600";
    if (progressPercentage > 0) return "text-yellow-600";
    return "text-muted-foreground";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div
                className="flex shrink-0 items-center justify-center rounded-lg p-2"
                style={{
                  backgroundColor: subject?.color ? `${subject.color}20` : "#6B728020",
                }}
              >
                <BookOpen
                  className="size-4"
                  style={{ color: subject?.color || "#6B7280" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="mb-1 text-base leading-tight">
                  {lesson.title}
                </CardTitle>
                {lesson.description && (
                  <CardDescription className="line-clamp-2 text-sm">
                    {lesson.description}
                  </CardDescription>
                )}
              </div>
            </div>
            {getStatusIcon()}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>Week {lesson.week_id}</span>
            </div>
            {subject && (
              <Badge variant="outline" className="text-xs">
                {subject.name}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className={getStatusColor()}>{getStatusText()}</span>
              <span className="text-muted-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Button size="sm" onClick={onClick} className="w-full">
            {progressPercentage >= 100
              ? "Review"
              : progressPercentage > 0
                ? "Continue"
                : "Start"}
            <ArrowRight className="ml-1 size-3" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LessonsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectIdParam = searchParams.get("subjectId");

  const { currentClass, currentTerm } = useAcademicContext();
  const { classDisplay, termDisplay } = useAcademicDisplay();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjectIdParam || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [availableSubjects, setAvailableSubjects] = useState<
    Array<{ id: number; name: string }>
  >([]);

  // Fetch available subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getStudentSubjects();
        if (response.success && response.content) {
          const allSubjects = [
            ...(response.content.compulsory_selective || []),
            ...(response.content.subjects || []),
          ];
          setAvailableSubjects(allSubjects);
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch lessons
  useEffect(() => {
    const loadLessons = async () => {
      if (!currentClass || !currentTerm) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Get class ID and term ID - adjust based on your API structure
        const classId = currentClass.id;
        const termId = currentTerm.id;

        // Fetch lessons for all subjects or specific subject
        if (selectedSubjectId === "all") {
          // Fetch lessons for all registered subjects
          const response = await getStudentSubjects();
          if (response.success && response.content) {
            const allSubjects = [
              ...(response.content.compulsory_selective || []),
              ...(response.content.subjects || []),
            ];

            // Fetch lessons for each subject
            const allLessons: Lesson[] = [];
            for (const subject of allSubjects) {
              try {
                const lessonsResponse = await fetchLessons({
                  class: classId,
                  subject: String(subject.id),
                  term: termId,
                  week: "all", // or fetch all weeks
                });

                if (lessonsResponse.success && lessonsResponse.content?.data) {
                  allLessons.push(...lessonsResponse.content.data);
                }
              } catch (error) {
                console.error(`Failed to fetch lessons for subject ${subject.id}:`, error);
              }
            }
            setLessons(allLessons);
          }
        } else {
          // Fetch lessons for specific subject
          const lessonsResponse = await fetchLessons({
            class: classId,
            subject: selectedSubjectId,
            term: termId,
            week: "all",
          });

          if (lessonsResponse.success && lessonsResponse.content?.data) {
            setLessons(lessonsResponse.content.data);
          } else {
            setLessons([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        setLessons([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLessons();
  }, [currentClass, currentTerm, selectedSubjectId]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lesson.description &&
          lesson.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "completed" && (lesson.progress || 0) >= 100) ||
        (selectedStatus === "in-progress" &&
          (lesson.progress || 0) > 0 &&
          (lesson.progress || 0) < 100) ||
        (selectedStatus === "not-started" && (lesson.progress || 0) === 0);

      return matchesSearch && matchesStatus;
    });
  }, [lessons, searchQuery, selectedStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = lessons.length;
    const completed = lessons.filter((l) => (l.progress || 0) >= 100).length;
    const inProgress = lessons.filter(
      (l) => (l.progress || 0) > 0 && (l.progress || 0) < 100
    ).length;
    const notStarted = lessons.filter((l) => (l.progress || 0) === 0).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, notStarted, completionRate };
  }, [lessons]);

  const completedLessons = useMemo(
    () => filteredLessons.filter((l) => (l.progress || 0) >= 100),
    [filteredLessons]
  );

  const inProgressLessons = useMemo(
    () =>
      filteredLessons.filter(
        (l) => (l.progress || 0) > 0 && (l.progress || 0) < 100
      ),
    [filteredLessons]
  );

  if (!currentClass || !currentTerm) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Select Class and Term
            </h3>
            <p className="mb-4 text-muted-foreground">
              Please select your class and term to view available lessons.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedSubject = availableSubjects.find(
    (s) => String(s.id) === selectedSubjectId
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lessons</h1>
          <p className="text-muted-foreground">
            {selectedSubject
              ? `Lessons for ${selectedSubject.name} - ${classDisplay} - ${termDisplay}`
              : `All lessons for ${classDisplay} - ${termDisplay}`}
          </p>
        </div>
        <Select
          value={selectedSubjectId}
          onValueChange={(value) => {
            setSelectedSubjectId(value);
            router.push(`/dashboard/lessons${value !== "all" ? `?subjectId=${value}` : ""}`);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {availableSubjects.map((subject) => (
              <SelectItem key={subject.id} value={String(subject.id)}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="size-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Total Lessons</span>
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle className="size-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">
              {stats.completionRate}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Pause className="size-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <p className="text-2xl font-bold">{stats.inProgress}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Circle className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Not Started</span>
            </div>
            <p className="text-2xl font-bold">{stats.notStarted}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("all");
              }}
              title="Clear filters"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All Lessons ({filteredLessons.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              Continue ({inProgressLessons.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedLessons.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredLessons.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onClick={() => router.push(`/dashboard/lessons/${lesson.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No Lessons Found</h3>
                  <p className="text-muted-foreground">
                    {lessons.length === 0
                      ? `No lessons available for ${classDisplay} - ${termDisplay}`
                      : "Try adjusting your search or filters"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {inProgressLessons.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inProgressLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onClick={() => router.push(`/dashboard/lessons/${lesson.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Pause className="mx-auto mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No Lessons in Progress
                  </h3>
                  <p className="text-muted-foreground">
                    Start a lesson to see it here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedLessons.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onClick={() => router.push(`/dashboard/lessons/${lesson.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No Completed Lessons
                  </h3>
                  <p className="text-muted-foreground">
                    Complete a lesson to see it here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

