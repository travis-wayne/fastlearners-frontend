"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  HelpCircle,
  Play,
  RotateCcw,
  Search,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
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
import { CompetitorsList } from "@/components/quiz/CompetitorsList";
import { Leaderboard } from "@/components/quiz/Leaderboard";
import mockQuizData from "@/data/mock-quizzes.json";

// Types
interface Quiz {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName?: string;
  classLevel: string;
  term: string;
  difficulty: "easy" | "medium" | "hard";
  scope: "topic" | "multi-topic" | "midterm" | "final";
  timeLimit: number;
  totalQuestions: number;
  totalPoints: number;
  passingScore: number;
  maxAttempts: number;
  isAvailable: boolean;
  dueDate?: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
  questions: any[];
  attempts?: any[];
}

interface QuizCardProps {
  quiz: Quiz;
  onClick: () => void;
}

function QuizCard({ quiz, onClick }: QuizCardProps) {
  const subject = getSubjectById(quiz.subjectId);
  const isCompleted = false; // TODO: Get from user attempts
  const attemptsLeft = quiz.maxAttempts === 0 ? "Unlimited" : quiz.maxAttempts;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "hard":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case "topic":
        return "text-blue-600 bg-blue-50";
      case "multi-topic":
        return "text-purple-600 bg-purple-50";
      case "midterm":
        return "text-orange-600 bg-orange-50";
      case "final":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
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
                <HelpCircle
                  className="size-5"
                  style={{ color: subject?.color || "#6B7280" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="mb-1 text-base leading-tight">
                  {quiz.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {quiz.description}
                </CardDescription>
              </div>
            </div>
            {isCompleted ? (
              <CheckCircle className="size-5 shrink-0 text-green-600" />
            ) : (
              <Circle className="size-5 shrink-0 text-muted-foreground" />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* Quiz Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>
                {quiz.timeLimit === 0 ? "No limit" : `${quiz.timeLimit} min`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="size-4" />
              <span>{quiz.totalQuestions} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="size-4" />
              <span>{quiz.totalPoints} pts</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}
            >
              {quiz.difficulty}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${getScopeColor(quiz.scope)}`}
            >
              {quiz.scope}
            </Badge>
            {quiz.dueDate && (
              <Badge
                variant="outline"
                className="bg-red-50 text-xs text-red-600"
              >
                Due {new Date(quiz.dueDate).toLocaleDateString()}
              </Badge>
            )}
          </div>

          {/* Score/Attempts Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Passing Score</span>
              <span>{quiz.passingScore}%</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Attempts: {attemptsLeft}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              {subject?.name || quiz.subjectName}
            </div>
            <Button
              size="sm"
              onClick={onClick}
              disabled={!quiz.isAvailable}
              className="ml-2"
            >
              {!quiz.isAvailable ? (
                "Not Available"
              ) : isCompleted ? (
                <>
                  <RotateCcw className="mr-1 size-3" />
                  Retake
                </>
              ) : (
                <>
                  <Play className="mr-1 size-3" />
                  Start Quiz
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function QuizzesPage() {
  const router = useRouter();
  const { currentClass, currentTerm } = useAcademicContext();
  const className = currentClass?.name;
  const termName = currentTerm?.name;
  const { classDisplay, termDisplay } = useAcademicDisplay();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedScope, setSelectedScope] = useState<string>("all");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [competitors, setCompetitors] = useState(mockQuizData.competitors);
  const [leaderboard, setLeaderboard] = useState(mockQuizData.leaderboard);

  // Load quizzes from mock data
  useEffect(() => {
    if (className && termName) {
      const filteredQuizzes = mockQuizData.quizzes.filter(
        (quiz) => quiz.classLevel === className && quiz.term === termName
      );
      setQuizzes(filteredQuizzes as Quiz[]);
    } else {
      setQuizzes(mockQuizData.quizzes as Quiz[]);
    }
  }, [className, termName]);

  // Get available subjects from quizzes
  const availableSubjects = useMemo(() => {
    const subjectIds = Array.from(
      new Set(quizzes.map((quiz) => quiz.subjectId))
    );
    return getSubjects().filter((subject) => subjectIds.includes(subject.id));
  }, [quizzes]);

  // Filter quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject =
        selectedSubject === "all" || quiz.subjectId === selectedSubject;
      const matchesDifficulty =
        selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
      const matchesScope =
        selectedScope === "all" || quiz.scope === selectedScope;

      return (
        matchesSearch && matchesSubject && matchesDifficulty && matchesScope
      );
    });
  }, [
    quizzes,
    searchQuery,
    selectedSubject,
    selectedDifficulty,
    selectedScope,
  ]);

  // Get quiz statistics
  const stats = useMemo(() => {
    const total = quizzes.length;
    const completed = quizzes.filter((q) => false).length; // TODO: Get from user attempts
    const average = 0; // TODO: Calculate from user scores
    return { total, completed, average };
  }, [quizzes]);

  const availableQuizzes = filteredQuizzes.filter((quiz) => quiz.isAvailable);
  const completedQuizzes = filteredQuizzes.filter((q) => false); // TODO: Get from user attempts

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
      <div className="container py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              Select Class and Term
            </h3>
            <p className="mb-4 text-muted-foreground">
              Please select your class and term to view available quizzes.
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
      className="container space-y-6 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold">
              <HelpCircle className="size-8 text-primary" />
              Quizzes & Assessments
            </h1>
            <p className="mt-1 text-muted-foreground">
              Test your knowledge for {classDisplay} - {termDisplay}
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
                  Total Quizzes
                </span>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Circle className="size-4 text-orange-600" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <p className="text-2xl font-bold">{availableQuizzes.length}</p>
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
                {stats.total > 0
                  ? Math.round((stats.completed / stats.total) * 100)
                  : 0}
                % complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Award className="size-4 text-yellow-600" />
                <span className="text-sm text-muted-foreground">
                  Avg Score
                </span>
              </div>
              <p className="text-2xl font-bold">
                {stats.average > 0 ? `${stats.average}%` : "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Quizzes */}
        <div className="space-y-6 lg:col-span-2">
          {/* Filters */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Search quizzes..."
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
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedScope} onValueChange={setSelectedScope}>
                      <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="Scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Scopes</SelectItem>
                        <SelectItem value="topic">Topic</SelectItem>
                        <SelectItem value="multi-topic">Multi-topic</SelectItem>
                        <SelectItem value="midterm">Midterm</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedSubject("all");
                        setSelectedDifficulty("all");
                        setSelectedScope("all");
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

          {/* Quizzes Content */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="available" className="space-y-4">
              <TabsList>
                <TabsTrigger value="available">
                  Available ({availableQuizzes.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedQuizzes.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All Quizzes ({filteredQuizzes.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-4">
                {availableQuizzes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {availableQuizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onClick={() =>
                          router.push(`/dashboard/quizzes/${quiz.id}`)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <HelpCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">
                        No Available Quizzes
                      </h3>
                      <p className="text-muted-foreground">
                        There are no quizzes available for {classDisplay} -{" "}
                        {termDisplay} at the moment.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedQuizzes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {completedQuizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onClick={() =>
                          router.push(`/dashboard/quizzes/${quiz.id}`)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">
                        No Completed Quizzes
                      </h3>
                      <p className="text-muted-foreground">
                        Complete a quiz to see it here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {filteredQuizzes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {filteredQuizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onClick={() =>
                          router.push(`/dashboard/quizzes/${quiz.id}`)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <HelpCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">
                        No Quizzes Found
                      </h3>
                      <p className="text-muted-foreground">
                        {quizzes.length === 0
                          ? `No quizzes available for ${classDisplay} - ${termDisplay}`
                          : "Try adjusting your search or filters"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Right Column - Competitors & Leaderboard */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <CompetitorsList
              competitors={competitors}
              currentUserId="current-user"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Leaderboard
              entries={leaderboard.slice(0, 10)}
              currentUserId="current-user"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
