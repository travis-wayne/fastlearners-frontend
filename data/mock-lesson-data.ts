// data/mock-lesson-data.ts - Mock data for lesson-related endpoints

import type { Lesson, LessonContent } from "@/lib/types/lessons";

// Mock lessons for batch fetching
export const mockLessons: Lesson[] = [
  {
    id: 1,
    title: "Introduction to Whole Numbers",
    description: "Understanding what whole numbers are and their properties",
    subject_id: 1,
    class_id: 1,
    term_id: 1,
    week_id: 1,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-10T08:00:00Z",
    status: "not_started",
    progress: 0,
  },
  {
    id: 2,
    title: "Number Bases System",
    description: "Converting numbers between different base systems",
    subject_id: 1,
    class_id: 1,
    term_id: 1,
    week_id: 1,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-10T08:00:00Z",
    status: "in_progress",
    progress: 45,
  },
  {
    id: 3,
    title: "Basic Operations",
    description: "Addition, subtraction, multiplication, and division",
    subject_id: 1,
    class_id: 1,
    term_id: 1,
    week_id: 2,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-10T08:00:00Z",
    status: "completed",
    progress: 100,
  },
];

// Mock lesson content
export const mockLessonContent: Record<number, LessonContent> = {
  1: {
    id: 1,
    title: "Introduction to Whole Numbers",
    subject_id: 1,
    overview: "Whole numbers are the numbers we use for counting and ordering. They include 0, 1, 2, 3, 4, 5, and so on.",
    objectives: [
      "Define whole numbers",
      "Identify whole numbers in everyday situations",
      "Arrange whole numbers in ascending and descending order",
    ],
    key_concepts: {
      "Whole Numbers": "Non-negative integers starting from 0",
      "Counting": "The process of determining the number of objects",
    },
    concepts: [
      {
        id: 1,
        title: "What are Whole Numbers?",
        description: "Whole numbers are the set of numbers that includes zero and all positive integers.",
        examples: [
          { title: "Example 1", content: "0, 1, 2, 3, 4, 5 are whole numbers" },
        ],
        exercises: [
          { title: "Exercise 1", content: "Identify which numbers are whole numbers: -5, 0, 3, 7.5" },
        ],
      },
    ],
    check_markers: [
      { id: 1, concept_id: 1, completed: false },
    ],
  },
  2: {
    id: 2,
    title: "Number Bases System",
    subject_id: 1,
    overview: "A number base system is a way of representing numbers using a set of digits or symbols.",
    objectives: [
      "Convert from base 10 to other bases",
      "Convert from other bases to base 10",
    ],
    key_concepts: {
      "Base 10": "Our standard decimal system",
      "Binary": "Base 2 number system",
    },
    concepts: [
      {
        id: 2,
        title: "Base Conversion",
        description: "Converting numbers between different base systems using division or expansion methods.",
        examples: [
          { title: "Example 1", content: "Convert 10 (base 10) to binary: 1010" },
        ],
        exercises: [
          { title: "Exercise 1", content: "Convert 25 (base 10) to binary" },
        ],
      },
    ],
    check_markers: [
      { id: 2, concept_id: 2, completed: true },
    ],
  },
};

// Mock subject detail data
export interface MockSubjectDetail {
  id: number;
  name: string;
  progress: number;
  grade: string;
  caScore: number;
  currentWeek: number;
  totalWeeks: number;
  upcomingAssessments: number;
  schemeOfWork: Array<{
    week: number;
    topics: string[];
    objectives: string[];
    activities: string[];
    resources: string[];
    assessment: string;
  }>;
}

export const mockSubjectDetails: Record<string, MockSubjectDetail> = {
  "mathematics": {
    id: 1,
    name: "Mathematics",
    progress: 75,
    grade: "B2",
    caScore: 82,
    currentWeek: 9,
    totalWeeks: 11,
    upcomingAssessments: 2,
    schemeOfWork: [
      {
        week: 1,
        topics: ["Introduction to Whole Numbers", "Basic Concepts"],
        objectives: ["Understand the fundamentals", "Learn key terminology"],
        activities: ["Class discussion", "Group work"],
        resources: ["Textbook Chapter 1", "Video tutorial"],
        assessment: "Weekly quiz on basic concepts",
      },
      {
        week: 2,
        topics: ["Number Bases", "Conversion Methods"],
        objectives: ["Apply concepts to problems", "Develop analytical skills"],
        activities: ["Problem-solving session", "Case studies"],
        resources: ["Textbook Chapter 2", "Practice problems"],
        assessment: "Assignment submission",
      },
    ],
  },
};

