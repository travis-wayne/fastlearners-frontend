"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Moon,
  Play,
  Star,
  Sun,
  Sunrise,
  Sunset,
  Target,
  TrendingUp,
  Trophy,
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
import { Progress } from "@/components/ui/progress";
import { WobbleCard } from "@/components/ui/wobble-card";

// Animation variants for smooth entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

interface TimeData {
  time: string;
  date: string;
  greeting: string;
  period: "morning" | "afternoon" | "evening" | "night";
}

export function StudentDashboard() {
  const [timeData, setTimeData] = useState<TimeData | null>(null);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();

      // Determine greeting and period based on time
      let greeting = "Good evening";
      let period: TimeData["period"] = "evening";

      if (hours >= 5 && hours < 12) {
        greeting = "Good morning";
        period = "morning";
      } else if (hours >= 12 && hours < 17) {
        greeting = "Good afternoon";
        period = "afternoon";
      } else if (hours >= 17 && hours < 21) {
        greeting = "Good evening";
        period = "evening";
      } else {
        greeting = "Good night";
        period = "night";
      }

      setTimeData({
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        date: now.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        greeting,
        period,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Time period icons
  const getPeriodIcon = () => {
    if (!timeData) return <Sun className="size-4 text-white/80" />;

    switch (timeData.period) {
      case "morning":
        return <Sunrise className="size-4 text-white/80" />;
      case "afternoon":
        return <Sun className="size-4 text-white/80" />;
      case "evening":
        return <Sunset className="size-4 text-white/80" />;
      case "night":
        return <Moon className="size-4 text-white/80" />;
      default:
        return <Sun className="size-4 text-white/80" />;
    }
  };

  // Mock data - replace with real data from your API
  const todaysLessons = [
    {
      id: 1,
      subject: "Mathematics",
      lesson: "Algebra Basics",
      duration: "45 min",
      progress: 0,
      new: true,
    },
    {
      id: 2,
      subject: "Science",
      lesson: "Physics: Motion",
      duration: "30 min",
      progress: 75,
      new: false,
    },
    {
      id: 3,
      subject: "English",
      lesson: "Grammar Review",
      duration: "25 min",
      progress: 100,
      new: false,
    },
  ];

  const weeklyProgress = [
    { subject: "Mathematics", progress: 68, target: 80 },
    { subject: "Science", progress: 85, target: 80 },
    { subject: "English", progress: 92, target: 85 },
    { subject: "History", progress: 45, target: 70 },
  ];

  const achievements = [
    { title: "7-Day Streak", icon: "🔥", earned: true },
    { title: "Perfect Score", icon: "⭐", earned: true },
    { title: "Fast Learner", icon: "⚡", earned: false },
    { title: "Subject Master", icon: "🏆", earned: false },
  ];

  const stats = [
    { label: "Lessons Completed", value: "24", change: "+12%", positive: true },
    { label: "Current Streak", value: "7 days", change: "🔥", positive: true },
    { label: "Average Score", value: "85%", change: "+5%", positive: true },
    { label: "Time This Week", value: "12h", change: "+2h", positive: true },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 p-6"
    >
      {/* Enhanced Welcome Header with WobbleCard */}
      <motion.div variants={itemVariants}>
        <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full min-h-[240px] bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            {/* Header with time and date */}
            {timeData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 rounded-lg bg-blue-100/20 px-3 py-2 backdrop-blur-sm">
                  <Calendar className="size-4 text-white/80" />
                  <span className="text-sm font-medium text-white/90">
                    {timeData.date}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-blue-100/20 px-3 py-2 backdrop-blur-sm">
                  <Clock className="size-4 text-white/80" />
                  <span className="font-mono text-sm font-medium text-white/90">
                    {timeData.time}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Main greeting */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="mb-2 flex items-center gap-2">
                {getPeriodIcon()}
                <h2 className="text-2xl font-bold text-white">
                  {timeData?.greeting || "Good day"}, Student! 🎓
                </h2>
              </div>
              <p className="text-base leading-relaxed text-white/90">
                Ready to learn something amazing today?
              </p>
            </motion.div>

            {/* Role and status badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4 flex items-center gap-3"
            >
              <Badge
                variant="secondary"
                className="border-white/30 bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <span className="mr-1">🎓</span>
                Student
              </Badge>

              <Badge
                variant="secondary"
                className="border-white/20 bg-white/15 text-white/90"
              >
                <Star className="mr-1 size-3" />
                Level 5
              </Badge>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2 rounded-lg bg-blue-100/20 px-3 py-2 backdrop-blur-sm">
                <span className="text-sm text-white/70">🔥</span>
                <span className="text-sm font-medium text-white/90">
                  7 day streak
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-100/20 px-3 py-2 backdrop-blur-sm">
                <span className="text-sm text-white/70">📚</span>
                <span className="text-sm font-medium text-white/90">
                  3 lessons today
                </span>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 opacity-20">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity },
                }}
                className="flex size-16 items-center justify-center rounded-full bg-white/10"
              >
                <span className="text-2xl">🎓</span>
              </motion.div>
            </div>
          </div>

          {/* Animated background elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -right-10 -top-10 size-32 rounded-full bg-white/5 blur-xl"
            />
            <motion.div
              animate={{
                x: [0, -80, 0],
                y: [0, 60, 0],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{ duration: 12, repeat: Infinity, delay: 2 }}
              className="absolute -bottom-10 -left-10 size-40 rounded-full bg-white/5 blur-2xl"
            />
          </div>
        </WobbleCard>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="relative overflow-hidden border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50 dark:border-gray-700/50 dark:from-gray-900 dark:to-gray-800/50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <Badge
                      variant={stat.positive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className="absolute right-0 top-0 flex size-8 items-center justify-center rounded-bl-xl bg-primary/10">
                  <div className="size-2 rounded-full bg-primary/40"></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Today's Lessons - Enhanced */}
      <motion.div variants={itemVariants}>
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50/50 dark:to-blue-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Calendar className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Today&apos;s Lessons
                  </CardTitle>
                  <CardDescription>
                    Start with your scheduled lessons for today
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                3 lessons
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between rounded-xl border border-white/50 bg-white/80 p-4 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/30">
                    <BookOpen className="size-6 text-primary" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="font-semibold">{lesson.lesson}</h4>
                      {lesson.new && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-xs text-green-800"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{lesson.subject}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {lesson.progress > 0 && (
                    <div className="flex items-center gap-2">
                      <Progress value={lesson.progress} className="w-24" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {lesson.progress}%
                      </span>
                    </div>
                  )}
                  <Button size="sm" className="gap-2 shadow-sm">
                    <Play className="size-4" />
                    {lesson.progress === 0
                      ? "Start"
                      : lesson.progress === 100
                        ? "Review"
                        : "Continue"}
                  </Button>
                </div>
              </motion.div>
            ))}
            <div className="pt-2">
              <Link href="/dashboard/lessons">
                <Button variant="outline" className="group w-full">
                  View All Lessons
                  <ChevronRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress and Achievements Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Progress - Takes 2 columns */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-green-100 p-2">
                  <Target className="size-5 text-green-600" />
                </div>
                This Week&apos;s Progress
              </CardTitle>
              <CardDescription>
                Track your progress across all subjects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {weeklyProgress.map((subject, index) => (
                <motion.div
                  key={subject.subject}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{subject.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {subject.progress}% of {subject.target}%
                      </span>
                      {subject.progress >= subject.target && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.5 }}
                        >
                          <Trophy className="size-4 text-yellow-500" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={subject.progress} className="h-3" />
                    <div
                      className="absolute top-0 h-3 w-1 rounded-full bg-primary opacity-60"
                      style={{ left: `${Math.min(subject.target, 95)}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-yellow-100 p-2">
                  <Trophy className="size-5 text-yellow-600" />
                </div>
                Achievements
              </CardTitle>
              <CardDescription>Your learning milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                    achievement.earned
                      ? "border border-primary/20 bg-primary/5"
                      : "bg-muted/30"
                  }`}
                >
                  <div
                    className={`text-xl ${achievement.earned ? "" : "opacity-50 grayscale"}`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`font-medium ${
                        achievement.earned
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {achievement.title}
                    </span>
                  </div>
                  {achievement.earned && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.3 }}
                    >
                      <Star className="size-4 fill-current text-yellow-500" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
              <Button variant="outline" size="sm" className="mt-3 w-full">
                View All Achievements
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
