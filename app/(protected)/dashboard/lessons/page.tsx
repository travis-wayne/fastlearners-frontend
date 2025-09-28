"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Search,
  Filter,
  Clock,
  Play,
  CheckCircle,
  Circle,
  BookOpen,
  Calendar,
  Target,
  ArrowRight,
  TrendingUp,
  Pause,
  RotateCcw
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { AcademicSelector } from "@/components/dashboard/student/shared/academic-selector";
import { useAcademicContext, useAcademicDisplay } from "@/components/providers/academic-context";
import { getSubjects, getSubjectById } from "@/config/education";
import { mockLessons, getLessonsByClassAndTerm, getLessonStats, getCompletedLessons, getInProgressLessons, getNotStartedLessons, type Lesson } from "@/data/mock-lessons";

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

function LessonCard({ lesson, onClick }: LessonCardProps) {
  const subject = getSubjectById(lesson.subjectId);
  const progressPercentage = lesson.progress.completed ? 100 : 
    lesson.duration > 0 ? Math.round((lesson.progress.timeSpent / lesson.duration) * 100) : 0;

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
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div 
                className="p-2 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${subject?.color || '#6B7280'}20` }}
              >
                <BookOpen className="size-4" style={{ color: subject?.color || '#6B7280' }} />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base leading-tight mb-1">{lesson.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {lesson.description}
                </CardDescription>
              </div>
            </div>
            {getStatusIcon()}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
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
              <span className="text-muted-foreground">{progressPercentage}%</span>
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
              {lesson.progress.completed ? "Review" : 
               lesson.progress.timeSpent > 0 ? "Continue" : "Start"}
              <ArrowRight className="size-3 ml-1" />
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
  const { classDisplay, termDisplay } = useAcademicDisplay();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Get lessons for current class and term
  const lessons = currentClass && currentTerm ? 
    getLessonsByClassAndTerm(currentClass.name, currentTerm.name) : [];

  // Get available subjects from lessons
  const availableSubjects = useMemo(() => {
    const subjectIds = Array.from(new Set(lessons.map(lesson => lesson.subjectId)));
    return getSubjects().filter(subject => subjectIds.includes(subject.id));
  }, [lessons]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "all" || lesson.subjectId === selectedSubject;
      const matchesDifficulty = selectedDifficulty === "all" || lesson.difficulty === selectedDifficulty;
      const matchesStatus = selectedStatus === "all" || 
        (selectedStatus === "completed" && lesson.progress.completed) ||
        (selectedStatus === "in-progress" && !lesson.progress.completed && lesson.progress.timeSpent > 0) ||
        (selectedStatus === "not-started" && !lesson.progress.completed && lesson.progress.timeSpent === 0);

      return matchesSearch && matchesSubject && matchesDifficulty && matchesStatus;
    });
  }, [lessons, searchQuery, selectedSubject, selectedDifficulty, selectedStatus]);

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
            <Calendar className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select Class and Term</h3>
            <p className="text-muted-foreground mb-4">
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
      className="container mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <GraduationCap className="size-8 text-primary" />
              Lessons
            </h1>
            <p className="text-muted-foreground mt-1">
              Interactive lessons for {classDisplay} - {termDisplay}
            </p>
          </div>
          <AcademicSelector variant="compact" />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Total Lessons</span>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="size-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">{stats.completionRate}% complete</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Pause className="size-4 text-yellow-600" />
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Circle className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Not Started</span>
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="size-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search lessons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
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

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
            <TabsTrigger value="all">All Lessons ({filteredLessons.length})</TabsTrigger>
            <TabsTrigger value="in-progress">Continue ({inProgressLessons.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedLessons.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredLessons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <GraduationCap className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Lessons Found</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Pause className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Lessons in Progress</h3>
                  <p className="text-muted-foreground">
                    Start a lesson to see it here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedLessons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <CheckCircle className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Lessons</h3>
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