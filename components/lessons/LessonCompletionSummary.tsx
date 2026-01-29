"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Star,
  Clock,
  Target,
  TrendingUp,
  Award,
  AlertCircle,
  Eye,
  ArrowRight,
  Home,
  CheckCircle2,
  Volume2,
  VolumeX,
  Share2,
} from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LessonCompletionSummaryProps } from "@/lib/types/lessons";
import { AchievementBadge } from "./AchievementBadge";
import { calculateAchievements } from "@/lib/utils/achievements";
import { SoundManager, SoundType } from "@/lib/utils/sounds";
import { calculatePerformanceInsights } from "@/lib/utils/lesson-analytics";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Lightbulb, BookOpen, TrendingUp as TrendingUpIcon, TrendingDown } from "lucide-react";
import { ShareDialog } from "./ShareDialog";
import { useAuthStore } from "@/store/authStore";
import { useSharingPreferences } from "@/hooks/use-sharing-preferences";

export function LessonCompletionSummary({
  lessonTitle,
  overallScore,
  conceptScores,
  generalExercisesScore,
  generalExercisesWeight,
  timeSpent,
  accuracyRate,
  exerciseProgress,
  historicalAverages,
  onReviewMistakes,
  onContinueNext,
  onBackToDashboard,
  isOpen,
  onClose,
}: LessonCompletionSummaryProps) {
  const [scoreAnimated, setScoreAnimated] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [progressBars, setProgressBars] = useState<number[]>([]);
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Get user info from auth store
  const { user } = useAuthStore();
  
  // Get sharing preferences
  const { preferences } = useSharingPreferences();

  // Calculate achievements
  const achievements = useMemo(() => {
    return calculateAchievements({
      lessonId: 0, // Not needed for achievement calculation
      lessonTitle,
      lessonScore: overallScore,
      conceptScores,
      generalExercisesScore,
      generalExercisesWeight,
      totalExercises: 0,
      completedExercises: 0,
      timeSpent,
      accuracyRate,
    });
  }, [overallScore, conceptScores, generalExercisesScore, generalExercisesWeight, timeSpent, accuracyRate, lessonTitle]);

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    if (!exerciseProgress) {
      return null;
    }
    
    return calculatePerformanceInsights(
      {
        lessonId: 0,
        lessonTitle,
        lessonScore: overallScore,
        conceptScores,
        generalExercisesScore,
        generalExercisesWeight,
        totalExercises: 0,
        completedExercises: Object.keys(exerciseProgress).length,
        timeSpent,
        accuracyRate,
      },
      exerciseProgress,
      historicalAverages
    );
  }, [overallScore, conceptScores, generalExercisesScore, generalExercisesWeight, timeSpent, accuracyRate, exerciseProgress, historicalAverages, lessonTitle]);

  // Fire confetti sequence based on score and achievements
  const fireConfettiSequence = (score: number) => {
    import("canvas-confetti").then((confettiModule) => {
      const confetti = confettiModule.default;

      // Determine confetti pattern based on score
      if (score >= 90) {
        // Excellent: 3 bursts with gold confetti
        const colors = score === 100 ? ['#FFD700', '#FFA500', '#FF8C00'] : ['#10b981', '#3b82f6', '#f59e0b'];
        
        // Initial burst
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors,
          gravity: 1.2,
          drift: 0,
          ticks: 200,
        });

        // Second burst (opposite side) after 300ms
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors,
            gravity: 1.2,
            drift: 0,
            ticks: 200,
          });
        }, 300);

        // Third burst (center) after 600ms
        setTimeout(() => {
          confetti({
            particleCount: 60,
            spread: 70,
            startVelocity: 60,
            origin: { y: 0.6 },
            colors,
            gravity: 1.2,
            ticks: 200,
          });
        }, 600);
      } else if (score >= 75) {
        // Great: 2 bursts
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b'],
        });

        setTimeout(() => {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#10b981', '#3b82f6', '#f59e0b'],
          });
        }, 300);
      } else {
        // Good: 1 burst
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
        });
      }
    });
  };

  // Trigger confetti and sounds on mount
  useEffect(() => {
    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = mediaQuery.matches;
    setPrefersReducedMotion(isReduced);

    // Preload sounds
    SoundManager.preload();
    const currentMuteState = SoundManager.getMuted();
    setIsSoundMuted(currentMuteState);

    if (isOpen) {
      if (isReduced) {
        // Skip confetti and animations, set score immediately
        setScoreAnimated(overallScore);
      } else {
        // Fire enhanced confetti sequence
        fireConfettiSequence(overallScore);

        // Play completion sound after a short delay
        setTimeout(() => {
          SoundManager.play(SoundType.COMPLETION);
          // Play perfect score sound if applicable
          if (overallScore === 100) {
            setTimeout(() => {
              SoundManager.play(SoundType.PERFECT_SCORE);
            }, 800);
          }
        }, 200);

        // Count up animation for score
        let start = 0;
        const duration = 1500;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = overallScore / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= overallScore) {
            setScoreAnimated(overallScore);
            clearInterval(timer);
          } else {
            setScoreAnimated(Math.floor(start));
          }
        }, stepTime);

        return () => clearInterval(timer);
      }
    }
  }, [isOpen, overallScore]);

  // Determine performance badge
  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent", variant: "default" as const, color: "bg-emerald-500 hover:bg-emerald-600" };
    if (score >= 75) return { label: "Great", variant: "default" as const, color: "bg-blue-500 hover:bg-blue-600" };
    if (score >= 60) return { label: "Good", variant: "secondary" as const, color: "bg-yellow-500 hover:bg-yellow-600 text-white" };
    return { label: "Keep Practicing", variant: "destructive" as const, color: "bg-orange-500 hover:bg-orange-600" };
  };

  // Determine stars based on score
  const getStars = (score: number) => {
    if (score >= 90) return 3;
    if (score >= 70) return 2;
    if (score >= 50) return 1;
    return 0;
  };

  const performanceObj = getPerformanceBadge(overallScore);
  const starsCount = getStars(overallScore);

  // Chart configuration
  const chartData = [
    {
      score: overallScore,
      fill: "var(--color-score)",
    },
  ];

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Memoize expensive calculations
  const { strongestConcept, weakestConcept } = useMemo(() => {
    if (!conceptScores || conceptScores.length === 0) {
      return { strongestConcept: null, weakestConcept: null };
    }
    const sorted = [...conceptScores].sort((a, b) => b.score - a.score);
    return {
      strongestConcept: sorted[0],
      weakestConcept: sorted[sorted.length - 1]
    };
  }, [conceptScores]);

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: prefersReducedMotion ? { duration: 0 } : undefined },
  };

  // Animate progress bars with stagger
  useEffect(() => {
    if (!isOpen || prefersReducedMotion) {
      setProgressBars(conceptScores.map(c => c.score));
      return;
    }

    // Start with 0 values
    setProgressBars(conceptScores.map(() => 0));

    // Animate bars with stagger delay
    const timeout = setTimeout(() => {
      conceptScores.forEach((concept, index) => {
        setTimeout(() => {
          setProgressBars(prev => {
            const newBars = [...prev];
            newBars[index] = concept.score;
            return newBars;
          });
          // Play star sound for high scores
          if (concept.score >= 80 && !prefersReducedMotion) {
            SoundManager.play(SoundType.STAR_EARNED, 0.5);
          }
        }, index * 150); // Stagger by 150ms
      });
    }, 500); // Initial delay

    return () => clearTimeout(timeout);
  }, [isOpen, conceptScores, prefersReducedMotion]);

  // Mute toggle handler
  // Mute toggle handler
  const handleToggleMute = () => {
    const newMutedState = SoundManager.toggleMute();
    setIsSoundMuted(newMutedState);
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-[calc(100vw-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-4xl">
        <DialogHeader className="relative bg-gradient-to-b from-primary/5 to-background p-6 pb-2 text-center">
          {/* Mute Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleMute}
            className="absolute right-4 top-4 size-8"
            aria-label={isSoundMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isSoundMuted ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </Button>

          <motion.div
            initial={prefersReducedMotion ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-yellow-100 ring-8 ring-yellow-50 dark:bg-yellow-900/30 dark:ring-yellow-900/10"
          >
            <Trophy className="size-10 text-yellow-600 dark:text-yellow-400" />
          </motion.div>
          <DialogTitle className="text-2xl font-bold sm:text-3xl">Lesson Complete!</DialogTitle>
          <p className="mt-2 text-muted-foreground">{lessonTitle}</p>
          <div className="mt-4 flex justify-center">
            <Badge className={cn("px-4 py-1 text-base", performanceObj.color)}>
              {performanceObj.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-8 p-6 pt-2">
          {/* Overall Score Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative size-48 sm:size-56">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square size-full"
              >
                <RadialBarChart
                  data={chartData}
                  startAngle={90}
                  endAngle={450} // Full circle starting from top
                  innerRadius={80}
                  outerRadius={110}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted/20 last:fill-background"
                    polarRadius={[86, 74]}
                  />
                  <RadialBar
                    dataKey="score"
                    background
                    cornerRadius={10}
                    className="fill-primary"
                  />
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-4xl font-bold"
                              >
                                {scoreAnimated}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground text-sm"
                              >
                                Score
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            </div>
            
            {/* Star Rating */}
            <div className="mt-4 flex gap-2">
              {[1, 2, 3].map((star) => (
                <motion.div
                  key={star}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.5 + star * 0.2, type: "spring" }}
                >
                  <Star
                    className={cn(
                      "size-8",
                      star <= starsCount
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                    )}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Concept Scores Section */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Target className="size-5 text-primary" />
                Concept Breakdown
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {conceptScores.map((concept, index) => (
                  <motion.div key={concept.conceptId} variants={itemVariants}>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <CardTitle className="line-clamp-1 text-sm font-medium" title={concept.title}>
                          {concept.title}
                        </CardTitle>
                        <Badge variant={concept.score >= 80 ? "default" : concept.score >= 60 ? "secondary" : "destructive"}>
                          {concept.score.toFixed(0)}%
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Progress 
                          value={progressBars[index] || 0} 
                          className={cn("mb-2 h-2 transition-all duration-500", 
                            concept.score >= 80 ? "bg-emerald-100 [&>div]:bg-emerald-500" : 
                            concept.score >= 60 ? "bg-yellow-100 [&>div]:bg-yellow-500" : 
                            "bg-red-100 [&>div]:bg-red-500"
                          )} 
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{concept.completedExercises}/{concept.totalExercises} exercises</span>
                          <Badge variant="outline" className="h-5 text-[10px]">Weight: {concept.weight}%</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* General Exercises Section */}
            {generalExercisesWeight > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <CheckCircle2 className="size-5 text-primary" />
                      General Exercises
                    </CardTitle>
                    <span className="text-2xl font-bold text-primary">{generalExercisesScore.toFixed(0)}%</span>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Progress value={generalExercisesScore} className="mb-2 h-3" />
                    <div className="flex justify-end">
                      <Badge variant="secondary">Weight: {generalExercisesWeight}%</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Performance Insights */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="size-5 text-blue-500" />
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" /> Time Spent
                      </p>
                      <p className="text-lg font-semibold">{formatTime(timeSpent)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Target className="size-3" /> Accuracy
                      </p>
                      <p className="text-lg font-semibold">{Math.round(accuracyRate)}%</p>
                    </div>
                    <div className="col-span-2 space-y-1 md:col-span-1">
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Award className="size-3" /> Strongest
                      </p>
                      <p className="truncate text-sm font-medium" title={strongestConcept?.title || "-"}>
                        {strongestConcept ? strongestConcept.title : "-"}
                      </p>
                    </div>
                    {weakestConcept && weakestConcept.score < 70 && (
                      <div className="col-span-2 space-y-1 md:col-span-1">
                        <p className="flex items-center gap-1 text-xs text-orange-500">
                          <AlertCircle className="size-3" /> To Improve
                        </p>
                        <p className="truncate text-sm font-medium" title={weakestConcept.title}>
                          {weakestConcept.title}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Main Insight */}
                  <div className="rounded-lg bg-muted/50 p-3 text-center text-sm italic text-muted-foreground">
                    {analytics?.insights.overallPerformance || 
                      (overallScore >= 90 
                        ? "Outstanding work! You've mastered this lesson's concepts." 
                        : overallScore >= 75 
                        ? "Great job! You have a solid understanding of the material." 
                        : "Good effort! Consider reviewing the concepts marked 'To Improve'.")
                    }
                  </div>

                  {/* Detailed Insights - Collapsible */}
                  {analytics && (analytics.insights.conceptInsights.length > 0 || analytics.insights.timeInsights.length > 0 || analytics.insights.accuracyInsights.length > 0) && (
                    <Collapsible open={showDetailedInsights} onOpenChange={setShowDetailedInsights} className="mt-4">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between">
                          <span className="flex items-center gap-2">
                            <Eye className="size-4" />
                            Detailed Insights
                          </span>
                          <ChevronDown className={cn(
                            "size-4 transition-transform",
                            showDetailedInsights && "rotate-180"
                          )} />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-3 pt-3">
                        {/* Concept Insights */}
                        {analytics.insights.conceptInsights.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase text-muted-foreground">Concept Analysis</h4>
                            <ul className="space-y-1">
                              {analytics.insights.conceptInsights.map((insight, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Time Insights */}
                        {analytics.insights.timeInsights.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground">
                              <Clock className="size-3" />
                              Time Efficiency
                            </h4>
                            <ul className="space-y-1">
                              {analytics.insights.timeInsights.map((insight, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <TrendingUpIcon className="mt-0.5 size-4 shrink-0 text-blue-500" />
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                            {analytics.metrics && (
                              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                <div className="rounded-md bg-muted p-2">
                                  <p className="text-muted-foreground">Avg per exercise</p>
                                  <p className="font-semibold">{Math.round(analytics.metrics.averageTimePerExercise)}s</p>
                                </div>
                                <div className="rounded-md bg-muted p-2">
                                  <p className="text-muted-foreground">Efficiency</p>
                                  <p className="font-semibold">{Math.round(analytics.metrics.timeEfficiency)}%</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Accuracy Insights */}
                        {analytics.insights.accuracyInsights.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground">
                              <Target className="size-3" />
                              Accuracy Analysis
                            </h4>
                            <ul className="space-y-1">
                              {analytics.insights.accuracyInsights.map((insight, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <Award className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                            {analytics.metrics && (
                              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                <div className="rounded-md bg-muted p-2">
                                  <p className="text-muted-foreground">First attempt</p>
                                  <p className="font-semibold">{Math.round(analytics.metrics.firstAttemptAccuracy)}%</p>
                                </div>
                                <div className="rounded-md bg-muted p-2">
                                  <p className="text-muted-foreground">Retry rate</p>
                                  <p className="font-semibold">{Math.round(analytics.metrics.retryRate)}%</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Strengths and Areas for Improvement */}
                        <div className="grid gap-3 md:grid-cols-2">
                           {analytics.insights.strengths.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Strengths</h4>
                              <div className="flex flex-wrap gap-2">
                                {analytics.insights.strengths.map((strength, idx) => (
                                  <Badge key={idx} variant="default" className="text-xs">
                                    {strength}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {analytics.insights.areasForImprovement.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold uppercase text-orange-600 dark:text-orange-400">Areas to Review</h4>
                              <div className="flex flex-wrap gap-2">
                                {analytics.insights.areasForImprovement.map((area, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Personalized Recommendations Section */}
            {analytics?.recommendations && (
              <motion.div variants={itemVariants}>
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="size-5 text-blue-600 dark:text-blue-400" />
                        Personalized Recommendations
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRecommendations(!showRecommendations)}
                      >
                        {showRecommendations ? "Hide" : "Show"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {showRecommendations && (
                    <CardContent className="space-y-4">
                      {/* Immediate Actions */}
                      {analytics.recommendations.immediate.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
                            <AlertCircle className="size-4" />
                            Immediate Actions
                          </h4>
                          <ul className="space-y-1.5">
                            {analytics.recommendations.immediate.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <div className="mt-2 size-1.5 shrink-0 rounded-full bg-red-500" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Study Strategies */}
                      {analytics.recommendations.studyStrategies.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                            <BookOpen className="size-4" />
                            Study Strategies
                          </h4>
                          <ul className="space-y-1.5">
                            {analytics.recommendations.studyStrategies.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <div className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-500" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Short-term Recommendations */}
                      {analytics.recommendations.shortTerm.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                            <TrendingUpIcon className="size-4" />
                            Next Steps
                          </h4>
                          <ul className="space-y-1.5">
                            {analytics.recommendations.shortTerm.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <div className="mt-2 size-1.5 shrink-0 rounded-full bg-yellow-500" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Long-term Goals */}
                      {analytics.recommendations.longTerm.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            <Award className="size-4" />
                            Long-term Goals
                          </h4>
                          <ul className="space-y-1.5">
                            {analytics.recommendations.longTerm.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <div className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Achievements Section */}
            {achievements.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-background dark:border-yellow-800 dark:from-yellow-900/10 dark:to-background">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <Trophy className="size-5 text-yellow-600 dark:text-yellow-400" />
                        Achievements Unlocked
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {achievements.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                      {achievements.map((achievement, index) => (
                        <AchievementBadge
                          key={achievement.id}
                          icon={achievement.icon}
                          title={achievement.title}
                          description={achievement.description}
                          tier={achievement.tier}
                          index={index}
                          prefersReducedMotion={prefersReducedMotion}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>

        <DialogFooter className="flex flex-col gap-3 border-t bg-muted/20 p-6 pt-2 sm:flex-row sm:gap-2">
          <Button 
            variant="outline" 
            onClick={onBackToDashboard} 
            className="w-full gap-2 sm:w-auto"
          >
            <Home className="size-4" />
            Back to Dashboard
          </Button>
          <div className="ml-auto flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button 
              variant="secondary" 
              onClick={onReviewMistakes} 
              className="w-full gap-2 sm:w-auto"
            >
              <Eye className="size-4" />
              Review Mistakes
            </Button>
            <Button 
              onClick={onContinueNext} 
              className="w-full gap-2 sm:w-auto"
            >
              Next Lesson
              <ArrowRight className="size-4" />
            </Button>
          </div>
          {preferences.allowSharing && (
            <Button
              variant="default"
              onClick={() => setShowShareDialog(true)}
              className="w-full gap-2 sm:w-auto"
            >
              <Share2 className="size-4" />
              Share Achievement
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      {/* Share Dialog */}
      {user && (
        <ShareDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          lessonData={{
            lessonId: "0",
            lessonTitle,
            overallScore,
            accuracy: accuracyRate,
            timeSpent: Math.round(timeSpent / 60), // Convert seconds to minutes
            starRating: starsCount,
            completionDate: new Date(),
            conceptScores: conceptScores.map(concept => ({
              name: concept.title,
              score: concept.score,
              weight: concept.weight,
            })),
            generalExerciseScore: generalExercisesScore,
            insights: {
              strengths: analytics?.insights.strengths || [],
              weaknesses: analytics?.insights.areasForImprovement || [],
              recommendations: [
                ...(analytics?.recommendations.immediate || []),
                ...(analytics?.recommendations.shortTerm || []),
              ],
            },
            analytics: {
              averageTimePerConcept: analytics?.metrics?.averageTimePerExercise || 0,
              totalAttempts: Object.keys(exerciseProgress || {}).length,
              improvementRate: analytics?.metrics?.firstAttemptAccuracy || 0,
            },
          }}
          userInfo={{
            name: user.name || "User",
            avatar: user.avatar || user.image,
          }}
        />
      )}
    </Dialog>
  );
}
