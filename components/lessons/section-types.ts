import { LessonContent } from "@/lib/types/lessons";

export type SectionType = 
  | 'overview' 
  | 'concept' 
  | 'summary_application' 
  | 'general_exercises' 
  | 'video' 
  | 'interactive_lab';

export function getSectionType(currentStepIndex: number, conceptsLength: number): SectionType {
  if (currentStepIndex === 0) {
    return 'overview';
  }
  
  if (currentStepIndex > 0 && currentStepIndex <= conceptsLength) {
    return 'concept';
  }
  
  if (currentStepIndex === conceptsLength + 1) {
    return 'summary_application';
  }
  
  if (currentStepIndex === conceptsLength + 2) {
    return 'general_exercises';
  }
  
  // Fallback for out of bounds or future types
  return 'overview';
}

export function getSectionData(
  sectionType: SectionType, 
  lesson: LessonContent, 
  currentStepIndex: number
) {
  switch (sectionType) {
    case 'overview':
      return { lesson };
    case 'concept':
      // Adjust index to be 0-based for the concepts array
      const conceptIndex = currentStepIndex - 1;
      const concept = lesson.concepts?.[conceptIndex];
      // Safety check: if concept doesn't exist (e.g. during rapid navigation or resume race conditions), return null
      if (!concept) return null;
      return { concept, index: conceptIndex };
    case 'summary_application':
      return { lesson };
    case 'general_exercises':
      return { lesson };
    default:
      return null;
  }
}

export function getSectionTitle(sectionType: SectionType, index?: number): string {
  switch (sectionType) {
    case 'overview':
      return 'Overview';
    case 'concept':
      return `Concept ${index !== undefined ? index + 1 : ''}`;
    case 'summary_application':
      return 'Summary & Application';
    case 'general_exercises':
      return 'General Exercises';
    default:
      return '';
  }
}
