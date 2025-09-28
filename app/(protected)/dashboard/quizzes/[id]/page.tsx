"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { HelpCircle, Clock, CheckCircle, ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getQuizById, type Quiz, type QuizQuestion } from "@/data/mock-quizzes";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (quizId) {
      const foundQuiz = getQuizById(quizId);
      setQuiz(foundQuiz || null);
      if (foundQuiz && foundQuiz.timeLimit > 0) {
        setTimeLeft(foundQuiz.timeLimit * 60);
      }
    }
  }, [quizId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
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

  if (!quiz) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <HelpCircle className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Quiz Not Found</h3>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setIsStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsCompleted(true);
    // Calculate score
    let score = 0;
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        score += question.points;
      }
    });
    alert(`Quiz completed! Your score: ${score}/${quiz.totalPoints} (${Math.round(score/quiz.totalPoints*100)}%)`);
  };

  if (!isStarted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto p-6 space-y-6">
        <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="size-4 mr-2" />Back to Quizzes</Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HelpCircle className="size-6 text-primary" />
              {quiz.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{quiz.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Questions:</strong> {quiz.totalQuestions}</div>
              <div><strong>Time Limit:</strong> {quiz.timeLimit === 0 ? "No limit" : `${quiz.timeLimit} minutes`}</div>
              <div><strong>Total Points:</strong> {quiz.totalPoints}</div>
              <div><strong>Passing Score:</strong> {quiz.passingScore}%</div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Instructions:</h4>
              <p className="text-sm text-muted-foreground">{quiz.instructions}</p>
            </div>

            <Button onClick={handleStartQuiz} size="lg" className="w-full">
              <Play className="size-4 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground">Question {currentQuestion + 1} of {quiz.questions.length}</p>
        </div>
        {quiz.timeLimit > 0 && (
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-600' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">{currentQ.question}</h2>
          
          {currentQ.type === 'multiple-choice' && currentQ.options && (
            <RadioGroup
              value={answers[currentQ.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(currentQ.id, parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQ.type === 'true-false' && (
            <RadioGroup
              value={answers[currentQ.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="True" id="true" />
                <Label htmlFor="true">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="False" id="false" />
                <Label htmlFor="false">False</Label>
              </div>
            </RadioGroup>
          )}

          {currentQ.type === 'fill-blank' && (
            <Input
              placeholder="Enter your answer..."
              value={answers[currentQ.id]?.toString() || ""}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentQuestion === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmitQuiz}>
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Next
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}