/**
 * FastLearners Grading System Utility
 * 
 * New Scale:
 * A: 90 - 100%
 * B: 80 - 89%
 * C: 70 - 79%
 * D: 60 - 69%
 * E: 50 - 59%
 * F: 0 - 49%
 */

export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface GradeInfo {
  letter: Grade;
  colorClass: string;
  isBorderline: boolean;
  message: string;
}

export function getGrade(percentage: number): GradeInfo {
  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.max(0, Math.min(100, percentage));

  if (normalizedPercentage >= 90) {
    return {
      letter: 'A',
      colorClass: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      isBorderline: false,
      message: "Excellent!"
    };
  }
  
  if (normalizedPercentage >= 80) {
    return {
      letter: 'B',
      colorClass: "text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
      isBorderline: false,
      message: "Very Good!"
    };
  }

  if (normalizedPercentage >= 70) {
    return {
      letter: 'C',
      colorClass: "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      isBorderline: false,
      message: "Good"
    };
  }

  if (normalizedPercentage >= 60) {
    return {
      letter: 'D',
      colorClass: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
      isBorderline: false,
      message: "Fair"
    };
  }

  if (normalizedPercentage >= 50) {
    // 50-59% is borderline
    return {
      letter: 'E',
      colorClass: "text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 font-bold",
      isBorderline: true, // Specifically highlight borderline
      message: "Borderline. Needs Attention."
    };
  }

  return {
    letter: 'F',
    colorClass: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    isBorderline: false,
    message: "Failed. Retake recommended."
  };
}
