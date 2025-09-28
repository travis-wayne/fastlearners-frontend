"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  HelpCircle,
  Search,
  Clock,
  Users,
  CheckCircle,
  Circle,
  Trophy,
  Target,
  AlertCircle,
  Calendar,
  TrendingUp,
  Award,
  Play,
  RotateCcw,
  Star,
  BookOpen
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
import { 
  getQuizzesByClassAndTerm, 
  getQuizStats, 
  getAvailableQuizzes,
  getCompletedQuizzes,
  getPendingQuizzes,
  getBestScore,
  getLatestAttempt,
  type Quiz 
} from "@/data/mock-quizzes";

interface QuizCardProps {
  quiz: Quiz;
  onClick: () => void;
}

function QuizCard({ quiz, onClick }: QuizCardProps) {
  const subject = getSubjectById(quiz.subjectId);
  const bestScore = getBestScore(quiz.id);
  const latestAttempt = getLatestAttempt(quiz.id);
  const isCompleted = quiz.attempts.some(attempt => attempt.completedAt);
  const attemptsLeft = quiz.maxAttempts === 0 ? "Unlimited" : 
    Math.max(0, quiz.maxAttempts - quiz.attempts.length);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'topic': return 'text-blue-600 bg-blue-50';
      case 'multi-topic': return 'text-purple-600 bg-purple-50';
      case 'midterm': return 'text-orange-600 bg-orange-50';
      case 'final': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
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
                <HelpCircle className="size-5" style={{ color: subject?.color || '#6B7280' }} />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base leading-tight mb-1">{quiz.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {quiz.description}
                </CardDescription>
              </div>
            </div>
            {isCompleted ? (
              <CheckCircle className="size-5 text-green-600 shrink-0" />
            ) : (
              <Circle className="size-5 text-muted-foreground shrink-0" />
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          {/* Quiz Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>{quiz.timeLimit === 0 ? "No limit" : `${quiz.timeLimit} min`}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="size-4" />
              <span>{quiz.totalQuestions} questions</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            <Badge variant="outline" className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
              {quiz.difficulty}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getScopeColor(quiz.scope)}`}>
              {quiz.scope}
            </Badge>
            {quiz.dueDate && (
              <Badge variant="outline" className="text-xs text-red-600 bg-red-50">
                Due {new Date(quiz.dueDate).toLocaleDateString()}
              </Badge>
            )}
          </div>

          {/* Score/Attempts Info */}
          {isCompleted && bestScore ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Best Score</span>
                <div className="flex items-center gap-2">
                  {bestScore.passed && <Trophy className="size-4 text-yellow-500" />}
                  <span className={bestScore.passed ? "text-green-600 font-medium" : "text-gray-600"}>
                    {Math.round((bestScore.score / bestScore.totalPoints) * 100)}%
                  </span>
                </div>
              </div>
              <Progress 
                value={Math.round((bestScore.score / bestScore.totalPoints) * 100)} 
                className="h-2" 
              />
              <div className="text-xs text-muted-foreground">
                Attempts: {quiz.attempts.length}/{quiz.maxAttempts === 0 ? "∞" : quiz.maxAttempts}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Passing Score</span>
                <span>{quiz.passingScore}%</span>
              </div>
              {quiz.attempts.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Previous attempts: {quiz.attempts.length}
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              {subject?.name}
            </div>
            <Button 
              size="sm" 
              onClick={onClick}
              disabled={!quiz.isAvailable || (quiz.maxAttempts > 0 && quiz.attempts.length >= quiz.maxAttempts)}
              className="ml-2"
            >
              {!quiz.isAvailable ? (
                "Not Available"
              ) : quiz.maxAttempts > 0 && quiz.attempts.length >= quiz.maxAttempts ? (
                "Max Attempts"
              ) : isCompleted ? (
                <>
                  <RotateCcw className="size-3 mr-1" />
                  Retake
                </>
              ) : (
                <>
                  <Play className="size-3 mr-1" />
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
  const { classDisplay, termDisplay } = useAcademicDisplay();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedScope, setSelectedScope] = useState<string>("all");

  // Get quizzes for current class and term
  const quizzes = currentClass && currentTerm ? 
    getQuizzesByClassAndTerm(currentClass.name, currentTerm.name) : [];

  // Get available subjects from quizzes
  const availableSubjects = useMemo(() => {
    const subjectIds = Array.from(new Set(quizzes.map(quiz => quiz.subjectId)));
    return getSubjects().filter(subject => subjectIds.includes(subject.id));
  }, [quizzes]);

  // Filter quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "all" || quiz.subjectId === selectedSubject;
      const matchesDifficulty = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
      const matchesScope = selectedScope === "all" || quiz.scope === selectedScope;

      return matchesSearch && matchesSubject && matchesDifficulty && matchesScope;
    });
  }, [quizzes, searchQuery, selectedSubject, selectedDifficulty, selectedScope]);

  // Get quiz statistics
  const stats = getQuizStats();
  const availableQuizzes = getAvailableQuizzes().filter(quiz => 
    currentClass && currentTerm && 
    quiz.classLevel === currentClass.name && 
    quiz.term === currentTerm.name
  );
  const completedQuizzes = getCompletedQuizzes().filter(quiz => 
    currentClass && currentTerm && 
    quiz.classLevel === currentClass.name && 
    quiz.term === currentTerm.name
  );
  const pendingQuizzes = getPendingQuizzes().filter(quiz => 
    currentClass && currentTerm && 
    quiz.classLevel === currentClass.name && 
    quiz.term === currentTerm.name
  );

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
      className="container mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <HelpCircle className="size-8 text-primary" />
              Quizzes & Assessments
            </h1>
            <p className="text-muted-foreground mt-1">
              Test your knowledge for {classDisplay} - {termDisplay}
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
                <span className="text-sm text-muted-foreground">Total Quizzes</span>
              </div>
              <p className="text-2xl font-bold">{quizzes.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Circle className="size-4 text-orange-600" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <p className="text-2xl font-bold">{availableQuizzes.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="size-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="text-2xl font-bold">{completedQuizzes.length}</p>
              <p className="text-sm text-muted-foreground">
                {quizzes.length > 0 ? Math.round((completedQuizzes.length / quizzes.length) * 100) : 0}% complete
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="size-4 text-yellow-600" />
                <span className="text-sm text-muted-foreground">Passed</span>
              </div>
              <p className="text-2xl font-bold">
                {quizzes.filter(q => q.attempts.some(a => a.passed)).length}
              </p>
              <p className="text-sm text-muted-foreground">
                {completedQuizzes.length > 0 ? 
                  Math.round((quizzes.filter(q => q.attempts.some(a => a.passed)).length / completedQuizzes.length) * 100) : 0}% pass rate
              </p>
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
                    placeholder="Search quizzes..."
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
            <TabsTrigger value="available">Available ({availableQuizzes.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedQuizzes.length})</TabsTrigger>
            <TabsTrigger value="all">All Quizzes ({filteredQuizzes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {availableQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableQuizzes
                  .filter(quiz => {
                    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                         quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesSubject = selectedSubject === "all" || quiz.subjectId === selectedSubject;
                    const matchesDifficulty = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
                    const matchesScope = selectedScope === "all" || quiz.scope === selectedScope;
                    return matchesSearch && matchesSubject && matchesDifficulty && matchesScope;
                  })
                  .map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <HelpCircle className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Available Quizzes</h3>
                  <p className="text-muted-foreground">
                    There are no quizzes available for {classDisplay} - {termDisplay} at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedQuizzes
                  .filter(quiz => {
                    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                         quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesSubject = selectedSubject === "all" || quiz.subjectId === selectedSubject;
                    const matchesDifficulty = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
                    const matchesScope = selectedScope === "all" || quiz.scope === selectedScope;
                    return matchesSearch && matchesSubject && matchesDifficulty && matchesScope;
                  })
                  .map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Quizzes</h3>
                  <p className="text-muted-foreground">
                    Complete a quiz to see it here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {filteredQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <HelpCircle className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Quizzes Found</h3>
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
    </motion.div>
  );
}