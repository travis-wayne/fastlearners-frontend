import type { LessonCompletionData } from "@/lib/types/lessons";
import { Trophy, Zap, Target, Award, Star, Flame } from "lucide-react";

export type AchievementType = 
  | 'PERFECT_SCORE' 
  | 'EXCELLENT' 
  | 'SPEED_DEMON' 
  | 'ACCURACY_MASTER' 
  | 'FIRST_TRY' 
  | 'CONCEPT_MASTER';

export type AchievementTier = 'gold' | 'silver' | 'bronze';

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: typeof Trophy;
  tier: AchievementTier;
  earnedAt: Date;
}

/**
 * Calculate achievements based on lesson completion data
 * @param completionData - The lesson completion data
 * @param averageTimeMinutes - Average time to complete lesson (default: 10 minutes)
 * @returns Array of earned achievements sorted by tier
 */
export function calculateAchievements(
  completionData: LessonCompletionData,
  averageTimeMinutes: number = 10
): Achievement[] {
  const achievements: Achievement[] = [];
  const now = new Date();

  // Perfect Score Achievement (100%)
  if (completionData.lessonScore >= 100) {
    achievements.push({
      id: 'perfect-score',
      type: 'PERFECT_SCORE',
      title: 'Perfect Score!',
      description: 'Achieved 100% on this lesson',
      icon: Trophy,
      tier: 'gold',
      earnedAt: now,
    });
  }

  // Excellent Achievement (90%+)
  if (completionData.lessonScore >= 90 && completionData.lessonScore < 100) {
    achievements.push({
      id: 'excellent',
      type: 'EXCELLENT',
      title: 'Excellent Work!',
      description: 'Scored 90% or higher',
      icon: Award,
      tier: 'silver',
      earnedAt: now,
    });
  }

  // Speed Demon Achievement (faster than average)
  const timeInMinutes = completionData.timeSpent / 60;
  if (timeInMinutes < averageTimeMinutes && timeInMinutes > 0) {
    achievements.push({
      id: 'speed-demon',
      type: 'SPEED_DEMON',
      title: 'Speed Demon!',
      description: `Completed in ${Math.round(timeInMinutes)} minutes`,
      icon: Zap,
      tier: 'bronze',
      earnedAt: now,
    });
  }

  // Accuracy Master Achievement (95%+ accuracy)
  if (completionData.accuracyRate >= 95) {
    achievements.push({
      id: 'accuracy-master',
      type: 'ACCURACY_MASTER',
      title: 'Accuracy Master!',
      description: `${Math.round(completionData.accuracyRate)}% accuracy rate`,
      icon: Target,
      tier: 'gold',
      earnedAt: now,
    });
  }

  // First Try Achievement (100% accuracy)
  if (completionData.accuracyRate === 100 && completionData.completedExercises > 0) {
    achievements.push({
      id: 'first-try',
      type: 'FIRST_TRY',
      title: 'First Try!',
      description: 'All exercises correct on first attempt',
      icon: Star,
      tier: 'gold',
      earnedAt: now,
    });
  }

  // Concept Master Achievement (all concepts 80%+)
  const allConceptsStrong = completionData.conceptScores.every(
    concept => concept.score >= 80
  );
  if (allConceptsStrong && completionData.conceptScores.length > 0) {
    achievements.push({
      id: 'concept-master',
      type: 'CONCEPT_MASTER',
      title: 'Concept Master!',
      description: 'Mastered all concepts',
      icon: Flame,
      tier: 'silver',
      earnedAt: now,
    });
  }

  // Sort by tier (gold > silver > bronze)
  const tierOrder: Record<AchievementTier, number> = {
    gold: 3,
    silver: 2,
    bronze: 1,
  };

  return achievements.sort((a, b) => tierOrder[b.tier] - tierOrder[a.tier]);
}

/**
 * Get gradient colors for achievement tier
 */
export function getAchievementGradient(tier: AchievementTier): string {
  switch (tier) {
    case 'gold':
      return 'from-yellow-400 via-yellow-500 to-amber-600';
    case 'silver':
      return 'from-gray-300 via-gray-400 to-gray-500';
    case 'bronze':
      return 'from-orange-400 via-orange-500 to-amber-700';
    default:
      return 'from-gray-400 to-gray-600';
  }
}

/**
 * Get ring color for achievement tier
 */
export function getAchievementRing(tier: AchievementTier): string {
  switch (tier) {
    case 'gold':
      return 'ring-yellow-300/50';
    case 'silver':
      return 'ring-gray-300/50';
    case 'bronze':
      return 'ring-orange-300/50';
    default:
      return 'ring-gray-300/50';
  }
}
