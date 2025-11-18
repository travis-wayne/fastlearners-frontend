"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuestionModal, QuizQuestion } from "@/components/quiz/QuestionModal";
import { Timer } from "@/components/quiz/Timer";
import { ScoreDisplay } from "@/components/quiz/ScoreDisplay";
import { Leaderboard } from "@/components/quiz/Leaderboard";
import { FeedbackMessage } from "@/components/quiz/FeedbackMessage";
import mockQuizData from "@/data/mock-quizzes.json";

interface Quiz {
  id: string;
  title: string;
  timeLimit: number;
  totalPoints: number;
  passingScore: number;
  questions: QuizQuestion[];
}

export default function QuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, string | number | null>
  >({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (quizId) {
      const foundQuiz = mockQuizData.quizzes.find((q) => q.id === quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz as Quiz);
        if (foundQuiz.timeLimit > 0) {
          setTimeLeft(foundQuiz.timeLimit * 60);
        }
      }
    }
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStarted, isCompleted, timeLeft]);

  const handleStartQuiz = () => {
    setIsStarted(true);
    setStartTime(new Date());
    // Modal will open automatically when isStarted is true
  };

  const handleAnswerSelect = (questionId: string, answer: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowFeedback(false);
    }
  };

  const handleSubmitQuiz = useCallback(() => {
    if (!quiz) return;

    setIsCompleted(true);
    setShowFeedback(false);

    let calculatedScore = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (
        userAnswer !== null &&
        String(userAnswer).toLowerCase() ===
          String(question.correctAnswer).toLowerCase()
      ) {
        calculatedScore += question.points;
      }
    });

    setScore(calculatedScore);
  }, [answers, quiz]);

  const handleTimeUp = () => {
    handleSubmitQuiz();
  };

  if (!quiz) {
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

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const percentage = Math.round((score / quiz.totalPoints) * 100);
  const passed = percentage >= quiz.passingScore;

  // Results view
  if (isCompleted) {
    const timeTaken = startTime
      ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto space-y-6 p-6"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Results Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6 text-center">
                  <div
                    className={`mx-auto mb-4 flex size-20 items-center justify-center rounded-full ${
                      passed
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {passed ? (
                      <CheckCircle2 className="size-10" />
                    ) : (
                      <XCircle className="size-10" />
                    )}
                  </div>
                  <h1 className="mb-2 text-3xl font-bold">{quiz.title}</h1>
                  <p className="text-muted-foreground">Quiz Completed</p>
                </div>

                <ScoreDisplay
                  score={score}
                  totalPoints={quiz.totalPoints}
                  passingScore={quiz.passingScore}
                />

                <div className="mt-6">
                  {passed ? (
                    <FeedbackMessage
                      type="success"
                      message="Congratulations! You passed the quiz. Great job!"
                    />
                  ) : (
                    <FeedbackMessage
                      type="warning"
                      message={`You scored ${percentage}%, but you need ${quiz.passingScore}% to pass. Keep practicing!`}
                    />
                  )}
                </div>

                <div className="mt-6 flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/quizzes")}
                    className="flex-1"
                  >
                    Back to Quizzes
                  </Button>
                  <Button
                    onClick={() => router.push(`/dashboard/quizzes/${quizId}/results`)}
                    className="flex-1"
                  >
                    View Detailed Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
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

  // Quiz taking view
  if (!isStarted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-6"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="mx-auto mb-4 size-16 text-primary" />
            <h1 className="mb-2 text-2xl font-bold">{quiz.title}</h1>
            <p className="mb-6 text-muted-foreground">
              Are you ready to start? Click the button below when you're ready.
            </p>
            <Button onClick={handleStartQuiz} size="lg">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto space-y-4 p-6">
      {/* Header with Timer and Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        {quiz.timeLimit > 0 && (
          <Timer
            timeLeft={timeLeft}
            totalTime={quiz.timeLimit * 60}
            onTimeUp={handleTimeUp}
          />
        )}
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2" />

      {/* Question Navigation Cards */}
      <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
        {quiz.questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== null && answers[q.id] !== undefined;
          const isCurrent = idx === currentQuestionIndex;

          return (
            <button
              key={q.id}
              onClick={() => {
                setCurrentQuestionIndex(idx);
                setShowFeedback(false);
              }}
              className={`rounded-lg border p-2 text-sm transition-colors ${
                isCurrent
                  ? "border-primary bg-primary text-primary-foreground"
                  : isAnswered
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-muted hover:border-primary"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Modal */}
      {currentQuestion && isStarted && (
        <QuestionModal
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          selectedAnswer={answers[currentQuestion.id] ?? null}
          onAnswerSelect={(answer) =>
            handleAnswerSelect(currentQuestion.id, answer)
          }
          onNext={handleNextQuestion}
          onPrevious={handlePreviousQuestion}
          onClose={() => {
            // Prevent closing during quiz - could show confirmation dialog
            // For now, just keep it open
          }}
          showFeedback={showFeedback}
          isOpen={true}
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFeedback(!showFeedback)}
            disabled={!answers[currentQuestion.id]}
          >
            {showFeedback ? "Hide" : "Show"} Feedback
          </Button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
          ) : (
            <Button onClick={handleNextQuestion}>Next</Button>
          )}
        </div>
      </div>
    </div>
  );
}

