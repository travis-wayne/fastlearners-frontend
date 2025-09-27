"use client";

import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { 
  Clock, 
  BookOpen, 
  Trophy, 
  TrendingUp,
  Sparkles,
  GraduationCap,
  Users,
  Shield
} from "lucide-react";

import { WobbleCard } from "@/components/ui/wobble-card";
import { Badge } from "@/components/ui/badge";

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <WobbleCard
      containerClassName={`col-span-1 lg:col-span-2 h-full min-h-[300px] bg-gradient-to-br ${getRoleColor()} ${className}`}
    >
      <div className="max-w-sm">
        {/* Header with greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            {getRoleIcon()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {getGreeting()}, {user.name || "there"}!
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
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
          <p className="text-white/90 text-lg leading-relaxed">
            Welcome back to Fast Learners! Ready to continue your learning journey?
          </p>
        </motion.div>

        {/* Stats or quick info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <Clock className="size-4 text-white/70" />
            <span className="text-white/90 text-sm font-medium">
              {getCurrentTime()}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <Sparkles className="size-4 text-white/70" />
            <span className="text-white/90 text-sm font-medium">
              Learning Mode
            </span>
          </div>
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 text-sm"
        >
          {getCurrentDate()}
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <div className="flex flex-col gap-2">
            <div className="size-2 bg-white rounded-full"></div>
            <div className="size-1 bg-white rounded-full"></div>
            <div className="size-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Background decorative pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 size-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 size-60 bg-white/5 rounded-full blur-2xl"></div>
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
      containerClassName={`col-span-1 h-full min-h-[200px] bg-gradient-to-br from-indigo-500 to-indigo-700 ${className}`}
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-white mb-2">
            {getGreeting()}!
          </h3>
          <p className="text-white/80 text-sm mb-4">
            Welcome back, {user.name || "there"}
          </p>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {user.role[0].charAt(0).toUpperCase() + user.role[0].slice(1)}
          </Badge>
        </motion.div>
      </div>
    </WobbleCard>
  );
}