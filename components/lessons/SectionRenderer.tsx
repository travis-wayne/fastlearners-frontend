import React, { ComponentType } from "react";
import { LessonContent } from "@/lib/types/lessons";
import { LessonOverview } from "./sections/LessonOverview";
import { LessonConcept } from "./sections/LessonConcept";
import { LessonSummaryApplication } from "./sections/LessonSummaryApplication";
import { LessonGeneralExercises } from "./sections/LessonGeneralExercises";
import { SectionType, getSectionType, getSectionData } from "./section-types";

/**
 * SectionRenderer uses a registry pattern to dynamically render the appropriate
 * lesson section component based on the current step index.
 *
 * To add a new section type:
 * 1. Add the type to `SectionType` in `section-types.ts`
 * 2. Add logic to `getSectionType` in `section-types.ts`
 * 3. Add data extraction logic to `getSectionData` in `section-types.ts`
 * 4. Create the new component
 * 5. Import it here and add to `SECTION_COMPONENT_MAP`
 *
 * Example for adding 'video' section:
 * // in section-types.ts: type SectionType = ... | 'video'
 * // in SECTION_COMPONENT_MAP: video: LessonVideoComponent
 */

interface SectionRendererProps {
  lesson: LessonContent;
  currentStepIndex: number;
  onAnswerExercise: (exerciseId: number, answer: string, isGeneral?: boolean) => Promise<any>;
  onStartLesson?: () => void;
  onResumeLesson?: () => void;
}

// Registry mapping section types to React components
const SECTION_COMPONENT_MAP: Record<SectionType, ComponentType<any>> = {
  overview: LessonOverview,
  concept: LessonConcept,
  summary_application: LessonSummaryApplication,
  general_exercises: LessonGeneralExercises,
  // Future extensions:
  video: () => null, // Placeholder for valid type
  interactive_lab: () => null, // Placeholder for valid type
} as const;

export function SectionRenderer({ 
  lesson, 
  currentStepIndex, 
  onAnswerExercise,
  onStartLesson,
  onResumeLesson
}: SectionRendererProps) {
  const conceptsLength = lesson.concepts?.length || 0;
  const sectionType = getSectionType(currentStepIndex, conceptsLength);
  
  // Get the component from the registry
  const Component = SECTION_COMPONENT_MAP[sectionType];
  
  if (!Component) {
    console.warn(`No component found for section type: ${sectionType}`);
    return null;
  }

  // Get data specific to this section
  const sectionData = getSectionData(sectionType, lesson, currentStepIndex);
  
  if (!sectionData) {
    console.warn(`No data found for section type: ${sectionType}`);
    return null;
  }
  
  const handleAnswerExercise = React.useCallback((exerciseId: number, answer: string) => {
    // Determine if this is a general exercise based on the section type
    const isGeneral = sectionType === 'general_exercises';
    return onAnswerExercise(exerciseId, answer, isGeneral);
  }, [sectionType, onAnswerExercise]);
  
  // Combine all props
  // We explicitly pass callbacks that might be needed by specific sections
  const props = {
    ...sectionData,
    onAnswerExercise: handleAnswerExercise,
    onStartLesson,
    onResumeLesson,
    // Add any other common props here
  };

  return <Component {...props} />;
}
