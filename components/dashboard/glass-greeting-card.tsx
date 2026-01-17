"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Flame,
  BookOpen,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AppleHelloEnglishEffect } from "@/components/ui/shadcn-io/apple-hello-effect";

interface TimeData {
  time: string;
  date: string;
  greeting: string;
  period: "morning" | "afternoon" | "evening" | "night";
}

interface GlassGreetingCardProps {
  userName?: string;
  role?: string;
  level?: number;
  streak?: number;
  lessonsToday?: number;
  className?: string;
}

const periodConfig = {
  morning: {
    gradient: "from-amber-500/30 via-orange-400/25 to-yellow-300/30",
    darkGradient: "dark:from-amber-400/20 dark:via-orange-300/15 dark:to-yellow-200/20",
    glowColor: "shadow-orange-500/30 dark:shadow-orange-500/20",
    accentColor: "text-amber-600 dark:text-amber-400",
    icon: Sunrise,
  },
  afternoon: {
    gradient: "from-blue-500/30 via-cyan-400/25 to-sky-300/30",
    darkGradient: "dark:from-blue-400/20 dark:via-cyan-300/15 dark:to-sky-200/20",
    glowColor: "shadow-blue-500/30 dark:shadow-blue-500/20",
    accentColor: "text-blue-600 dark:text-blue-400",
    icon: Sun,
  },
  evening: {
    gradient: "from-purple-500/30 via-pink-400/25 to-orange-300/30",
    darkGradient: "dark:from-purple-500/20 dark:via-pink-400/15 dark:to-orange-300/20",
    glowColor: "shadow-purple-500/30 dark:shadow-purple-500/20",
    accentColor: "text-purple-600 dark:text-purple-400",
    icon: Sunset,
  },
  night: {
    gradient: "from-indigo-600/30 via-purple-500/25 to-blue-400/30",
    darkGradient: "dark:from-indigo-600/20 dark:via-purple-500/15 dark:to-blue-400/20",
    glowColor: "shadow-indigo-500/30 dark:shadow-indigo-500/20",
    accentColor: "text-indigo-600 dark:text-indigo-400",
    icon: Moon,
  },
};

// Animated name component with Apple-style stroke animation
function AnimatedName({ name, delay = 0 }: { name: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="relative inline-block"
    >
      {name.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + index * 0.05,
            duration: 0.4,
            ease: "easeOut",
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
      {/* Underline animation like Apple Hello */}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          delay: delay + name.length * 0.05 + 0.2,
          duration: 0.5,
          ease: "easeOut",
        }}
        className="absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-500"
      />
    </motion.span>
  );
}

export function GlassGreetingCard({
  userName = "Student",
  role = "Student",
  level = 5,
  streak = 7,
  lessonsToday = 3,
  className,
}: GlassGreetingCardProps) {
  const [timeData, setTimeData] = useState<TimeData | null>(null);
  const [showHelloAnimation, setShowHelloAnimation] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();

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

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
    // Fade out animation after a brief pause
    setTimeout(() => {
      setShowHelloAnimation(false);
    }, 1200);
  }, []);

  const config = timeData ? periodConfig[timeData.period] : periodConfig.night;
  const PeriodIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("relative", className)}
    >
      {/* Outer glow effect */}
      <div
        className={cn(
          "absolute -inset-1 rounded-3xl bg-gradient-to-br opacity-50 blur-xl transition-all duration-1000",
          config.gradient,
          config.darkGradient
        )}
      />

      {/* Main glass card */}
      <div
        className={cn(
          // Glass effect base
          "relative overflow-hidden rounded-2xl",
          // Backdrop blur for frosted glass
          "backdrop-blur-2xl backdrop-saturate-150",
          // Background with transparency - stronger in light mode
          "bg-white/40 dark:bg-white/5",
          // Border for glass edge effect
          "border border-white/50 dark:border-white/10",
          // Combined shadow (inset highlight + outer shadow-2xl)
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_25px_50px_-12px_rgba(0,0,0,0.25)]",
          config.glowColor
        )}
      >
        {/* Gradient overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-80 transition-all duration-1000 dark:opacity-60",
            config.gradient,
            config.darkGradient
          )}
        />

        {/* Noise texture for glass realism */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Highlight line at top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/30" />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8">
          {/* Top row: Date and Time pills */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            {timeData && (
              <>
                {/* Date pill */}
                <div className="flex items-center gap-2 rounded-full border border-gray-300/50 bg-white/50 px-4 py-2 backdrop-blur-md dark:border-white/20 dark:bg-white/10">
                  <Calendar className="size-4 text-gray-700 dark:text-white/80" />
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {timeData.date}
                  </span>
                </div>

                {/* Time pill */}
                <div className="flex items-center gap-2 rounded-full border border-gray-300/50 bg-white/50 px-4 py-2 backdrop-blur-md dark:border-white/20 dark:bg-white/10">
                  <Clock className="size-4 text-gray-700 dark:text-white/80" />
                  <span className="font-mono text-sm font-medium text-gray-800 dark:text-white/90">
                    {timeData.time}
                  </span>
                </div>
              </>
            )}
          </motion.div>

          {/* Greeting section with Apple Hello animation */}
          <div className="mb-6 min-h-[100px]">
            <AnimatePresence mode="wait">
              {showHelloAnimation ? (
                <motion.div
                  key="hello-animation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-start"
                >
                  <AppleHelloEnglishEffect
                    speed={0.8}
                    onAnimationComplete={handleAnimationComplete}
                    className="h-12 text-gray-800 dark:text-white sm:h-16"
                  />
                  {animationComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl"
                    >
                      <AnimatedName name={userName} delay={0.1} />
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 + userName.length * 0.05 + 0.3 }}
                      >
                        !
                      </motion.span>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="greeting-text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <PeriodIcon className={cn("size-6", config.accentColor)} />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">
                      {timeData?.greeting}, {userName}!
                    </h2>
                  </div>
                  <p className="text-base text-gray-600 dark:text-white/70">
                    Ready to learn something amazing today?
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Badges row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            {/* Role badge */}
            <Badge
              variant="secondary"
              className="border border-gray-300/50 bg-white/60 px-3 py-1.5 text-gray-800 backdrop-blur-md transition-all hover:bg-white/80 dark:border-white/20 dark:bg-white/15 dark:text-white dark:hover:bg-white/25"
            >
              <span className="mr-1.5">🎓</span>
              {role}
            </Badge>

            {/* Level badge */}
            <Badge
              variant="secondary"
              className="border border-gray-300/50 bg-white/60 px-3 py-1.5 text-gray-800 backdrop-blur-md transition-all hover:bg-white/80 dark:border-white/20 dark:bg-white/15 dark:text-white dark:hover:bg-white/25"
            >
              <Star className="mr-1.5 size-3.5 fill-yellow-500 text-yellow-500" />
              Level {level}
            </Badge>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-3"
          >
            {/* Streak stat */}
            <div className="flex items-center gap-2 rounded-xl border border-gray-300/50 bg-white/50 px-4 py-2.5 backdrop-blur-md transition-all hover:bg-white/70 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/15">
              <Flame className="size-5 text-orange-500" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  {streak} day streak
                </span>
              </div>
            </div>

            {/* Lessons today stat */}
            <div className="flex items-center gap-2 rounded-xl border border-gray-300/50 bg-white/50 px-4 py-2.5 backdrop-blur-md transition-all hover:bg-white/70 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/15">
              <BookOpen className="size-5 text-emerald-500" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  {lessonsToday} lessons today
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative floating orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-10 -top-10 size-40 rounded-full bg-black/5 blur-3xl dark:bg-white/5"
          />
          <motion.div
            animate={{
              x: [0, -20, 0],
              y: [0, 30, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-16 -left-10 size-48 rounded-full bg-black/5 blur-3xl dark:bg-white/5"
          />
        </div>

        {/* Bottom highlight */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
      </div>
    </motion.div>
  );
}
