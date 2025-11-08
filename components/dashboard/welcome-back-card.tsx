"use client";

import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Shield,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { WobbleCard } from "@/components/ui/wobble-card";

interface WelcomeBackCardProps {
  className?: string;
}

export function WelcomeBackCard({ className }: WelcomeBackCardProps) {
  const { user } = useAuthStore();

  if (!user) return null;

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getRoleIcon = () => {
    const primaryRole = user.role[0];
    switch (primaryRole) {
      case "student":
        return <GraduationCap className="size-6" />;
      case "guardian":
        return <Shield className="size-6" />;
      case "teacher":
        return <Users className="size-6" />;
      case "admin":
      case "superadmin":
        return <Trophy className="size-6" />;
      default:
        return <BookOpen className="size-6" />;
    }
  };

  const getRoleColor = () => {
    const primaryRole = user.role[0];
    switch (primaryRole) {
      case "student":
        return "from-blue-500 to-blue-700";
      case "guardian":
        return "from-green-500 to-green-700";
      case "teacher":
        return "from-purple-500 to-purple-700";
      case "admin":
        return "from-orange-500 to-orange-700";
      case "superadmin":
        return "from-red-500 to-red-700";
      default:
        return "from-indigo-500 to-indigo-700";
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <WobbleCard
      containerClassName={`col-span-1 lg:col-span-2 h-full min-h-[300px] bg-gradient-to-br ${getRoleColor()} ${className}`}
    >
      <div className="max-w-sm sm:max-w-md">
        {/* Header with greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 flex items-center gap-3"
        >
          <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
            {getRoleIcon()}
          </div>
          <div>
            <h2 className="mb-1 text-2xl font-bold text-white">
              {getGreeting()}, {user.name || "there"}!
            </h2>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="border-white/30 bg-white/20 text-white"
              >
                {user.role[0].charAt(0).toUpperCase() + user.role[0].slice(1)}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Welcome message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-lg leading-relaxed text-white/90">
            Welcome back to Fast Learners! Ready to continue your learning
            journey?
          </p>
        </motion.div>

        {/* Stats or quick info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 flex items-center gap-4"
        >
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
            <Clock className="size-4 text-white/70" />
            <span className="text-sm font-medium text-white/90">
              {getCurrentTime()}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
            <Sparkles className="size-4 text-white/70" />
            <span className="text-sm font-medium text-white/90">
              Learning Mode
            </span>
          </div>
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-white/70"
        >
          {getCurrentDate()}
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute right-4 top-4 opacity-20">
          <div className="flex flex-col gap-2">
            <div className="size-2 rounded-full bg-white"></div>
            <div className="size-1 rounded-full bg-white"></div>
            <div className="size-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      </div>

      {/* Background decorative pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 size-60 rounded-full bg-white/5 blur-2xl"></div>
      </div>
    </WobbleCard>
  );
}

// Compact version for smaller screens
export function CompactWelcomeCard({ className }: WelcomeBackCardProps) {
  const { user } = useAuthStore();

  if (!user) return null;

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <WobbleCard
      // containerClassName={`col-span-1 h-full min-h-[200px] bg-gradient-to-br from-indigo-500 to-indigo-700 ${className}`}
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="mb-2 text-xl font-bold text-white">
            {getGreeting()}!
          </h3>
          <p className="mb-4 text-sm text-white/80">
            Welcome back, {user.name || "there"}
          </p>
          <Badge
            variant="secondary"
            className="border-white/30 bg-white/20 text-white"
          >
            {user.role[0].charAt(0).toUpperCase() + user.role[0].slice(1)}
          </Badge>
        </motion.div>
      </div>
    </WobbleCard>
  );
}
