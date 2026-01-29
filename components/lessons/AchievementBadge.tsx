"use client";

import React from "react";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getAchievementGradient, 
  getAchievementRing, 
  type AchievementTier 
} from "@/lib/utils/achievements";

interface AchievementBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tier: AchievementTier;
  index?: number;
  prefersReducedMotion?: boolean;
}

export function AchievementBadge({
  icon: Icon,
  title,
  description,
  tier,
  index = 0,
  prefersReducedMotion = false,
}: AchievementBadgeProps) {
  const gradient = getAchievementGradient(tier);
  const ring = getAchievementRing(tier);

  // Animation variants
  const badgeVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      rotate: -10,
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        delay: index * 0.15,
      },
    },
  };

  const shimmerVariants = {
    animate: {
      x: ['-100%', '100%'],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "linear" as const,
      },
    },
  };

  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : badgeVariants}
      initial={prefersReducedMotion ? undefined : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
      className={cn(
        "group relative overflow-hidden rounded-xl border-2 bg-gradient-to-br p-4",
        "shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
        gradient,
        `ring-4 ${ring}`,
        "border-white/20"
      )}
    >
      {/* Shimmer effect */}
      {!prefersReducedMotion && (
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{ width: '50%' }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-center">
        {/* Icon */}
        <div className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Icon className="size-6 text-white drop-shadow-lg" />
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-white drop-shadow-md">
          {title}
        </h4>

        {/* Description */}
        <p className="text-xs text-white/90 drop-shadow-sm">
          {description}
        </p>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className={cn(
          "absolute inset-0 rounded-xl blur-xl",
          tier === 'gold' && "bg-yellow-400/30",
          tier === 'silver' && "bg-gray-400/30",
          tier === 'bronze' && "bg-orange-400/30"
        )} />
      </div>
    </motion.div>
  );
}
