import type { LessonCompletionData, ConceptScoreBreakdown } from "@/lib/types/lessons";

/**
 * Comprehensive performance insights structure
 */
export interface PerformanceInsights {
  overallPerformance: string;
  conceptInsights: string[];
  timeInsights: string[];
  accuracyInsights: string[];
  strengths: string[];
  areasForImprovement: string[];
}

/**
 * Personalized recommendations structure
 */
export interface PersonalizedRecommendations {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  studyStrategies: string[];
}

/**
 * Complete analytics result
 */
export interface AnalyticsResult {
  insights: PerformanceInsights;
  recommendations: PersonalizedRecommendations;
  metrics: {
    timeEfficiency: number;
    firstAttemptAccuracy: number;
    retryRate: number;
    averageTimePerExercise: number;
    averageTimePerConcept: number;
  };
}

/**
 * Accuracy metrics breakdown
 */
interface AccuracyMetrics {
  firstAttemptAccuracy: number;
  retryRate: number;
  totalAttempts: number;
  successfulAttempts: number;
  errorDistribution: Map<number, number>;
}

/**
 * Calculate detailed accuracy metrics from exercise progress
 */
export function calculateAccuracyMetrics(
  exerciseProgress: Record<number, any>
): AccuracyMetrics {
  let firstAttemptCorrect = 0;
  let totalExercises = 0;
  let totalAttempts = 0;
  let successfulAttempts = 0;
  const errorDistribution = new Map<number, number>();

  Object.entries(exerciseProgress).forEach(([exerciseId, progress]) => {
    if (progress.isCompleted) {
      totalExercises++;
      const attempts = progress.attempts || 1;
      totalAttempts += attempts;
      
      if (progress.isCorrect) {
        successfulAttempts++;
        if (attempts === 1) {
          firstAttemptCorrect++;
        }
      }
      
      // Track error distribution
      const errorCount = attempts - 1;
      if (errorCount > 0) {
        errorDistribution.set(
          Number(exerciseId),
          errorCount
        );
      }
    }
  });

  const firstAttemptAccuracy = totalExercises > 0
    ? (firstAttemptCorrect / totalExercises) * 100
    : 0;
  
  const retryRate = totalExercises > 0
    ? ((totalAttempts - totalExercises) / totalExercises) * 100
    : 0;

  return {
    firstAttemptAccuracy,
    retryRate,
    totalAttempts,
    successfulAttempts,
    errorDistribution,
  };
}

/**
 * Identify strongest concepts above threshold
 */
export function identifyStrongestConcepts(
  conceptScores: ConceptScoreBreakdown[],
  threshold: number = 80
): ConceptScoreBreakdown[] {
  return conceptScores
    .filter(concept => concept.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

/**
 * Identify weakest concepts below threshold
 */
export function identifyWeakestConcepts(
  conceptScores: ConceptScoreBreakdown[],
  threshold: number = 70
): ConceptScoreBreakdown[] {
  return conceptScores
    .filter(concept => concept.score < threshold)
    .sort((a, b) => a.score - b.score);
}

/**
 * Calculate time efficiency metrics
 */
export function calculateTimeEfficiency(
  timeSpent: number,
  totalExercises: number,
  conceptCount: number
): {
  averageTimePerExercise: number;
  averageTimePerConcept: number;
  efficiencyRating: number;
} {
  const averageTimePerExercise = totalExercises > 0
    ? timeSpent / totalExercises
    : 0;
  
  const averageTimePerConcept = conceptCount > 0
    ? timeSpent / conceptCount
    : 0;
  
  // Efficiency rating: lower time per exercise = higher efficiency
  // Assuming optimal time is 30 seconds per exercise
  const optimalTimePerExercise = 30;
  const efficiencyRating = averageTimePerExercise > 0
    ? Math.min(100, (optimalTimePerExercise / averageTimePerExercise) * 100)
    : 0;

  return {
    averageTimePerExercise,
    averageTimePerConcept,
    efficiencyRating,
  };
}

/**
 * Compare with average performance
 */
export function compareWithAveragePerformance(
  completionData: LessonCompletionData,
  historicalData?: { score: number; time: number; accuracy: number }
): {
  scoreDifference: number;
  timeDifference: number;
  accuracyDifference: number;
} | null {
  if (!historicalData) {
    return null;
  }

  return {
    scoreDifference: completionData.lessonScore - historicalData.score,
    timeDifference: completionData.timeSpent - historicalData.time,
    accuracyDifference: completionData.accuracyRate - historicalData.accuracy,
  };
}

/**
 * Generate performance insights
 */
export function generatePerformanceInsights(
  completionData: LessonCompletionData,
  exerciseProgress: Record<number, any>
): string[] {
  const insights: string[] = [];
  const { lessonScore, conceptScores, accuracyRate } = completionData;
  const strongConcepts = identifyStrongestConcepts(conceptScores);
  const weakConcepts = identifyWeakestConcepts(conceptScores);

  // Overall performance insight
  if (lessonScore >= 90) {
    insights.push("Outstanding performance! You've demonstrated excellent mastery of the material.");
  } else if (lessonScore >= 75) {
    insights.push("Great work! You have a solid understanding of most concepts.");
  } else if (lessonScore >= 60) {
    insights.push("Good effort! There's room for improvement in some areas.");
  } else {
    insights.push("Keep practicing! Focus on reviewing the fundamental concepts.");
  }

  // Concept-specific insights
  if (strongConcepts.length > 0) {
    const topConcept = strongConcepts[0];
    insights.push(`You excelled at "${topConcept.title}" with ${Math.round(topConcept.score)}% mastery.`);
  }

  if (weakConcepts.length > 0) {
    const weakestConcept = weakConcepts[0];
    insights.push(`Consider reviewing "${weakestConcept.title}" to strengthen your understanding.`);
  }

  // Accuracy insights
  if (accuracyRate === 100) {
    insights.push("Perfect accuracy! Every answer was correct.");
  } else if (accuracyRate >= 90) {
    insights.push("Excellent accuracy rate, showing strong comprehension.");
  }

  return insights;
}

/**
 * Generate time-based insights
 */
export function generateTimeInsights(
  timeSpent: number,
  averageTime?: number
): string[] {
  const insights: string[] = [];
  const minutes = Math.floor(timeSpent / 60);

  if (averageTime) {
    const difference = timeSpent - averageTime;
    const percentDifference = Math.abs((difference / averageTime) * 100);

    if (difference < -60) {
      insights.push(`Completed ${Math.round(percentDifference)}% faster than your average!`);
    } else if (difference > 60) {
      insights.push(`Took ${Math.round(percentDifference)}% more time than usual. Consider focusing on time management.`);
    } else {
      insights.push("Completion time was consistent with your average pace.");
    }
  } else {
    insights.push(`You spent ${minutes} minutes on this lesson.`);
  }

  return insights;
}

/**
 * Generate accuracy insights
 */
export function generateAccuracyInsights(
  accuracyRate: number,
  firstAttemptAccuracy: number
): string[] {
  const insights: string[] = [];

  const retryImprovement = accuracyRate - firstAttemptAccuracy;

  if (firstAttemptAccuracy >= 90) {
    insights.push("Excellent first-attempt accuracy! You're demonstrating strong initial understanding.");
  } else if (firstAttemptAccuracy < 70 && retryImprovement > 20) {
    insights.push("Good problem-solving! You significantly improved with practice.");
  } else if (retryImprovement < 5) {
    insights.push("Consider reviewing concepts before attempting exercises for better first-attempt results.");
  }

  return insights;
}

/**
 * Generate personalized recommendations
 */
export function generatePersonalizedRecommendations(
  completionData: LessonCompletionData,
  exerciseProgress: Record<number, any>
): PersonalizedRecommendations {
  const { lessonScore, conceptScores, accuracyRate } = completionData;
  const weakConcepts = identifyWeakestConcepts(conceptScores);
  const accuracyMetrics = calculateAccuracyMetrics(exerciseProgress);

  const immediate: string[] = [];
  const shortTerm: string[] = [];
  const longTerm: string[] = [];
  const studyStrategies: string[] = [];

  // Immediate actions
  if (weakConcepts.length > 0) {
    weakConcepts.slice(0, 2).forEach(concept => {
      immediate.push(`Review exercises for "${concept.title}" to strengthen understanding`);
    });
  }

  if (accuracyRate < 70) {
    immediate.push("Revisit lesson materials before moving to the next topic");
  }

  // Short-term recommendations
  if (lessonScore >= 80) {
    shortTerm.push("You're ready to advance to the next lesson");
  } else if (lessonScore >= 60) {
    shortTerm.push("Practice additional exercises before advancing");
  } else {
    shortTerm.push("Retake this lesson after reviewing the concepts");
  }

  if (weakConcepts.length > 2) {
    shortTerm.push("Focus on mastering 2-3 weak concepts at a time rather than all at once");
  }

  // Long-term recommendations
  if (accuracyMetrics.firstAttemptAccuracy < 70) {
    longTerm.push("Develop a habit of reviewing concepts before attempting exercises");
  }

  if (lessonScore >= 90) {
    longTerm.push("Challenge yourself with advanced topics in this subject");
  }

  longTerm.push("Track your progress over time to identify learning patterns");

  // Study strategies
  if (accuracyMetrics.retryRate > 50) {
    studyStrategies.push("Take more time to understand each concept before moving to exercises");
  }

  if (accuracyMetrics.firstAttemptAccuracy >= 80) {
    studyStrategies.push("Your preparation strategy is working well - continue with your current approach");
  } else {
    studyStrategies.push("Try active recall: explain concepts in your own words before practicing");
  }

  studyStrategies.push("Use spaced repetition: review weak concepts multiple times over several days");

  return {
    immediate,
    shortTerm,
    longTerm,
    studyStrategies,
  };
}

/**
 * Get next steps recommendations based on performance
 */
export function getNextStepsRecommendations(
  overallScore: number,
  weakConcepts: ConceptScoreBreakdown[]
): string[] {
  const recommendations: string[] = [];

  if (overallScore >= 85) {
    recommendations.push("Proceed to the next lesson with confidence");
    recommendations.push("Consider exploring advanced topics in this subject");
  } else if (overallScore >= 70) {
    recommendations.push("Review weak concepts, then proceed to the next lesson");
    if (weakConcepts.length > 0) {
      recommendations.push(`Focus particularly on: ${weakConcepts.map(c => c.title).join(", ")}`);
    }
  } else {
    recommendations.push("Retake this lesson after thorough review");
    recommendations.push("Spend extra time on the concepts you found challenging");
    recommendations.push("Consider seeking additional resources or help for difficult topics");
  }

  return recommendations;
}

/**
 * Get study strategy recommendations
 */
export function getStudyStrategyRecommendations(
  timeEfficiency: number,
  accuracyRate: number
): string[] {
  const strategies: string[] = [];

  // Time-based strategies
  if (timeEfficiency < 50) {
    strategies.push("Take breaks between concepts to maintain focus and efficiency");
    strategies.push("Try the Pomodoro technique: 25 minutes of focused study, 5-minute breaks");
  } else if (timeEfficiency > 80) {
    strategies.push("Your pace is excellent - maintain this efficient study rhythm");
  }

  // Accuracy-based strategies
  if (accuracyRate < 70) {
    strategies.push("Before exercises, summarize key points from each concept in your own words");
    strategies.push("Create flashcards for concepts you find challenging");
  } else if (accuracyRate >= 90) {
    strategies.push("Your accuracy is excellent - this indicates strong understanding");
  }

  // General strategies
  strategies.push("Review mistakes immediately to understand what went wrong");
  strategies.push("Connect new concepts to things you already know");

  return strategies;
}

/**
 * Main analytics orchestration function
 */
export function calculatePerformanceInsights(
  completionData: LessonCompletionData,
  exerciseProgress: Record<number, any>,
  historicalData?: { score: number; time: number; accuracy: number }
): AnalyticsResult {
  try {
    // Calculate metrics
    const accuracyMetrics = calculateAccuracyMetrics(exerciseProgress);
    const timeEfficiency = calculateTimeEfficiency(
      completionData.timeSpent,
      completionData.completedExercises,
      completionData.conceptScores.length
    );

    // Calculate comparison
    const comparison = compareWithAveragePerformance(completionData, historicalData);

    // Generate insights
    const performanceInsights = generatePerformanceInsights(completionData, exerciseProgress);
    const timeInsights = generateTimeInsights(
      completionData.timeSpent,
      historicalData?.time
    );
    const accuracyInsights = generateAccuracyInsights(
      completionData.accuracyRate,
      accuracyMetrics.firstAttemptAccuracy
    );

    const strongConcepts = identifyStrongestConcepts(completionData.conceptScores);
    const weakConcepts = identifyWeakestConcepts(completionData.conceptScores);

    const strengths = strongConcepts.map(
      c => `${c.title} (${Math.round(c.score)}%)`
    );
    const areasForImprovement = weakConcepts.map(
      c => `${c.title} (${Math.round(c.score)}%)`
    );

    // Generate recommendations
    const recommendations = generatePersonalizedRecommendations(
      completionData,
      exerciseProgress
    );

    // Compile insights
    const insights: PerformanceInsights = {
      overallPerformance: performanceInsights[0] || "Lesson completed",
      conceptInsights: performanceInsights.slice(1),
      timeInsights,
      accuracyInsights,
      strengths,
      areasForImprovement,
    };

    return {
      insights,
      recommendations,
      metrics: {
        timeEfficiency: timeEfficiency.efficiencyRating,
        firstAttemptAccuracy: accuracyMetrics.firstAttemptAccuracy,
        retryRate: accuracyMetrics.retryRate,
        averageTimePerExercise: timeEfficiency.averageTimePerExercise,
        averageTimePerConcept: timeEfficiency.averageTimePerConcept,
      },
    };
  } catch (error) {
    console.error("Error calculating performance insights:", error);
    
    // Return fallback analytics
    return {
      insights: {
        overallPerformance: "Lesson completed",
        conceptInsights: [],
        timeInsights: [],
        accuracyInsights: [],
        strengths: [],
        areasForImprovement: [],
      },
      recommendations: {
        immediate: ["Review the lesson materials"],
        shortTerm: ["Practice the exercises"],
        longTerm: ["Continue learning"],
        studyStrategies: ["Maintain consistent study habits"],
      },
      metrics: {
        timeEfficiency: 0,
        firstAttemptAccuracy: 0,
        retryRate: 0,
        averageTimePerExercise: 0,
        averageTimePerConcept: 0,
      },
    };
  }
}
