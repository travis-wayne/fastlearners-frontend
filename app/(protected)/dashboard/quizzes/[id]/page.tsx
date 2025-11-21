"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Play,
  Target,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import mockQuizData from "@/data/mock-quizzes.json";
import { getSubjectById } from "@/config/education";

interface Quiz {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  classLevel: string;
  term: string;
  difficulty: "easy" | "medium" | "hard";
  scope: string;
  timeLimit: number;
  totalQuestions: number;
  totalPoints: number;
  passingScore: number;
  maxAttempts: number;
  isAvailable: boolean;
  dueDate?: string;
  instructions: string;
  questions: any[];
}

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quizId) {
      // In production, this would be an API call
      const foundQuiz = mockQuizData.quizzes.find((q) => q.id === quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz as Quiz);
      }
      setLoading(false);
    }
  }, [quizId]);

  const handleStartQuiz = () => {
    router.push(`/dashboard/quizzes/${quizId}/take`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">Loading quiz...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <HelpCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Quiz Not Found</h3>
            <p className="mb-4 text-muted-foreground">
              The quiz you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subject = getSubjectById(quiz.subjectId);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto space-y-6 p-6"
    >
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 size-4" />
        Back to Quizzes
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Quiz Info */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-lg p-2"
                      style={{
                        backgroundColor: `${subject?.color || "#6B7280"}20`,
                      }}
                    >
                      <HelpCircle
                        className="size-6"
                        style={{ color: subject?.color || "#6B7280" }}
                      />
                    </div>
                    <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {quiz.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={getDifficultyColor(quiz.difficulty)}
                >
                  {quiz.difficulty}
                </Badge>
                <Badge variant="outline">{quiz.scope}</Badge>
                {quiz.dueDate && (
                  <Badge variant="outline" className="bg-red-50 text-red-600">
                    Due {new Date(quiz.dueDate).toLocaleDateString()}
                  </Badge>
                )}
              </div>

              <Separator />

              {/* Quiz Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Target className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Questions</p>
                    <p className="text-lg font-semibold">
                      {quiz.totalQuestions}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Limit</p>
                    <p className="text-lg font-semibold">
                      {quiz.timeLimit === 0
                        ? "No limit"
                        : `${quiz.timeLimit} minutes`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Award className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Points
                    </p>
                    <p className="text-lg font-semibold">
                      {quiz.totalPoints} pts
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Passing Score
                    </p>
                    <p className="text-lg font-semibold">
                      {quiz.passingScore}%
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Instructions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  <h3 className="text-lg font-semibold">Instructions</h3>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {quiz.instructions}
                  </p>
                </div>
              </div>

              {/* Important Notes */}
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 size-5 text-yellow-600" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-yellow-900">
                      Important Notes:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-yellow-800">
                      <li>
                        Make sure you have a stable internet connection before
                        starting
                      </li>
                      <li>
                        You cannot pause the quiz once started (unless time limit
                        is unlimited)
                      </li>
                      <li>
                        Answers are saved automatically as you progress through
                        questions
                      </li>
                      <li>
                        You have {quiz.maxAttempts === 0
                          ? "unlimited"
                          : quiz.maxAttempts}{" "}
                        attempt{quiz.maxAttempts !== 1 ? "s" : ""} for this quiz
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Start Quiz Card */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Ready to Start?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleStartQuiz}
                size="lg"
                className="w-full"
                disabled={!quiz.isAvailable}
              >
                <Play className="mr-2 size-4" />
                Start Quiz
              </Button>

              {!quiz.isAvailable && (
                <p className="text-center text-sm text-muted-foreground">
                  This quiz is not available at the moment.
                </p>
              )}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium">
                    {subject?.name || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class:</span>
                  <span className="font-medium">{quiz.classLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Term:</span>
                  <span className="font-medium">{quiz.term}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
