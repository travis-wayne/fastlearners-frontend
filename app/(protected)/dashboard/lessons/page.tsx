"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCompletedLessons,
  getInProgressLessons,
  getLessonsByClassAndTerm,
  getLessonStats,
  getNotStartedLessons,
  mockLessons,
  type Lesson,
} from "@/data/mock-lessons";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Filter,
  GraduationCap,
  Pause,
  Play,
  RotateCcw,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";

import { getSubjectById, getSubjects } from "@/config/education";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademicSelector } from "@/components/dashboard/student/shared/academic-selector";
import {
  useAcademicContext,
  useAcademicDisplay,
} from "@/components/providers/academic-context";

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

function LessonCard({ lesson, onClick }: LessonCardProps) {
  const subject = getSubjectById(lesson.subjectId);
  const progressPercentage = lesson.progress.completed
    ? 100
    : lesson.duration > 0
      ? Math.round((lesson.progress.timeSpent / lesson.duration) * 100)
      : 0;

  const getStatusIcon = () => {
    if (lesson.progress.completed) {
      return <CheckCircle className="size-5 text-green-600" />;
    } else if (lesson.progress.timeSpent > 0) {
      return <Pause className="size-5 text-yellow-600" />;
    } else {
      return <Circle className="size-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    if (lesson.progress.completed) return "Completed";
    if (lesson.progress.timeSpent > 0) return "In Progress";
    return "Not Started";
  };

  const getStatusColor = () => {
    if (lesson.progress.completed) return "text-green-600";
    if (lesson.progress.timeSpent > 0) return "text-yellow-600";
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
                style={{ backgroundColor: `${subject?.color || "#6B7280"}20` }}
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
                <CardDescription className="line-clamp-2 text-sm">
                  {lesson.description}
                </CardDescription>
              </div>
            </div>
            {getStatusIcon()}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>{lesson.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="size-4" />
              <span className="capitalize">{lesson.difficulty}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className={getStatusColor()}>{getStatusText()}</span>
              <span className="text-muted-foreground">
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-1">
              {lesson.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {lesson.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{lesson.tags.length - 2}
                </Badge>
              )}
            </div>
            <Button size="sm" onClick={onClick} className="ml-2">
              {lesson.progress.completed
                ? "Review"
                : lesson.progress.timeSpent > 0
                  ? "Continue"
                  : "Start"}
              <ArrowRight className="ml-1 size-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function LessonsPage() {
  const router = useRouter();
  const { currentClass, currentTerm } = useAcademicContext();
  const className = currentClass?.name;
  const termName = currentTerm?.name;
  const { classDisplay, termDisplay } = useAcademicDisplay();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Get lessons for current class and term
  const lessons = useMemo(() => {
    return className && termName
      ? getLessonsByClassAndTerm(className, termName)
      : [];
  }, [className, termName]);

  // Get available subjects from lessons
  const availableSubjects = useMemo(() => {
    const subjectIds = Array.from(
      new Set(lessons.map((lesson) => lesson.subjectId)),
    );
    return getSubjects().filter((subject) => subjectIds.includes(subject.id));
  }, [lessons]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject =
        selectedSubject === "all" || lesson.subjectId === selectedSubject;
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        lesson.difficulty === selectedDifficulty;
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "completed" && lesson.progress.completed) ||
        (selectedStatus === "in-progress" &&
          !lesson.progress.completed &&
          lesson.progress.timeSpent > 0) ||
        (selectedStatus === "not-started" &&
          !lesson.progress.completed &&
          lesson.progress.timeSpent === 0);

      return (
        matchesSearch && matchesSubject && matchesDifficulty && matchesStatus
      );
    });
  }, [
    lessons,
    searchQuery,
    selectedSubject,
    selectedDifficulty,
    selectedStatus,
  ]);

  // Get lesson statistics
  const stats = getLessonStats();
  const completedLessons = getCompletedLessons();
  const inProgressLessons = getInProgressLessons();
  const notStartedLessons = getNotStartedLessons();

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

  if (!currentClass || !currentTerm) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Select Class and Term
            </h3>
            <p className="mb-4 text-muted-foreground">
              Please select your class and term to view available lessons.
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
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold">
              <GraduationCap className="size-8 text-primary" />
              Lessons
            </h1>
            <p className="mt-1 text-muted-foreground">
              Interactive lessons for {classDisplay} - {termDisplay}
            </p>
          </div>
          <AcademicSelector variant="compact" />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="size-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">
                  Total Lessons
                </span>
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
                <span className="text-sm text-muted-foreground">
                  In Progress
                </span>
              </div>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Circle className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Not Started
                </span>
              </div>
              <p className="text-2xl font-bold">{stats.notStarted}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search lessons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
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
                    setSelectedSubject("all");
                    setSelectedDifficulty("all");
                    setSelectedStatus("all");
                  }}
                  title="Clear filters"
                >
                  <RotateCcw className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lessons Content */}
      <motion.div variants={itemVariants}>
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
                    onClick={() =>
                      router.push(`/dashboard/lessons/${lesson.id}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <GraduationCap className="mx-auto mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No Lessons Found
                  </h3>
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
                    onClick={() =>
                      router.push(`/dashboard/lessons/${lesson.id}`)
                    }
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
                    onClick={() =>
                      router.push(`/dashboard/lessons/${lesson.id}`)
                    }
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
      </motion.div>
    </motion.div>
  );
}
