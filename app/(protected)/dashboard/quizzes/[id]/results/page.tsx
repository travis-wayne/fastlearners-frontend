"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScoreDisplay } from "@/components/quiz/ScoreDisplay";
import { Leaderboard } from "@/components/quiz/Leaderboard";
import { FeedbackMessage } from "@/components/quiz/FeedbackMessage";
import mockQuizData from "@/data/mock-quizzes.json";
import { QuizQuestion } from "@/components/quiz/QuestionModal";

interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  timeTaken: number;
  completedAt: string;
  answers: Record<string, string | number>;
  questions: QuizQuestion[];
}

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;

  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quizId) {
      // In production, this would be an API call
      const quiz = mockQuizData.quizzes.find((q) => q.id === quizId);
      if (quiz) {
        // Simulate a completed quiz result
        const mockResult: QuizResult = {
          quizId: quiz.id,
          quizTitle: quiz.title,
          score: 85, // Mock score
          totalPoints: quiz.totalPoints,
          percentage: 85,
          passed: 85 >= quiz.passingScore,
          timeTaken: 1250, // seconds
          completedAt: new Date().toISOString(),
          answers: {}, // Mock answers
          questions: quiz.questions as QuizQuestion[],
        };
        setResult(mockResult);
      }
      setLoading(false);
    }
  }, [quizId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">Loading results...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Results Not Found</h3>
            <p className="mb-4 text-muted-foreground">
              No results found for this quiz.
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const correctAnswers = result.questions.filter((q, idx) => {
    const userAnswer = result.answers[q.id];
    return (
      userAnswer !== null &&
      String(userAnswer).toLowerCase() ===
        String(q.correctAnswer).toLowerCase()
    );
  }).length;

  const incorrectAnswers = result.questions.length - correctAnswers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto space-y-6 p-6"
    >
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 size-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-5 text-yellow-500" />
                Quiz Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold">{result.quizTitle}</h1>
                <p className="text-muted-foreground">
                  Completed on{" "}
                  {new Date(result.completedAt).toLocaleDateString()}
                </p>
              </div>

              <ScoreDisplay
                score={result.score}
                totalPoints={result.totalPoints}
                passingScore={60} // TODO: Get from quiz
              />

              <Separator />

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      Correct
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {correctAnswers}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <XCircle className="size-5 text-red-600" />
                    <span className="text-sm text-muted-foreground">
                      Incorrect
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {incorrectAnswers}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock className="size-5 text-blue-600" />
                    <span className="text-sm text-muted-foreground">
                      Time Taken
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{formatTime(result.timeTaken)}</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="size-5 text-purple-600" />
                    <span className="text-sm text-muted-foreground">
                      Percentage
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{result.percentage}%</p>
                </div>
              </div>

              {/* Feedback */}
              {result.passed ? (
                <FeedbackMessage
                  type="success"
                  message="Congratulations! You passed the quiz. Excellent work!"
                />
              ) : (
                <FeedbackMessage
                  type="warning"
                  message="You didn't pass this time, but don't give up! Review the questions and try again."
                />
              )}
            </CardContent>
          </Card>

          {/* Question Review */}
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.questions.map((question, idx) => {
                  const userAnswer = result.answers[question.id];
                  const isCorrect =
                    userAnswer !== null &&
                    String(userAnswer).toLowerCase() ===
                      String(question.correctAnswer).toLowerCase();

                  return (
                    <div
                      key={question.id}
                      className={`rounded-lg border p-4 ${
                        isCorrect
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline">Question {idx + 1}</Badge>
                            {isCorrect ? (
                              <Badge className="bg-green-600">
                                Correct
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Incorrect</Badge>
                            )}
                          </div>
                          <p className="font-medium">{question.question}</p>
                        </div>
                        <Badge variant="outline">{question.points} pts</Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        {question.type === "multiple-choice" &&
                          question.options && (
                            <div>
                              <p className="font-medium text-muted-foreground">
                                Your Answer:
                              </p>
                              <p>
                                {
                                  question.options[
                                    typeof userAnswer === "number"
                                      ? userAnswer
                                      : parseInt(String(userAnswer)) || 0
                                  ]
                                }
                              </p>
                            </div>
                          )}
                        {(question.type === "true-false" ||
                          question.type === "fill-blank") && (
                          <div>
                            <p className="font-medium text-muted-foreground">
                              Your Answer:
                            </p>
                            <p>{String(userAnswer || "No answer")}</p>
                          </div>
                        )}
                        {question.explanation && (
                          <div className="mt-2 rounded bg-white/50 p-2">
                            <p className="font-medium text-muted-foreground">
                              Explanation:
                            </p>
                            <p>{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Leaderboard */}
        <div>
          <Leaderboard
            entries={mockQuizData.leaderboard.map((entry, idx) => ({
              ...entry,
              rank: idx + 1,
            }))}
            currentUserId="current-user"
          />
        </div>
      </div>
    </motion.div>
  );
}

