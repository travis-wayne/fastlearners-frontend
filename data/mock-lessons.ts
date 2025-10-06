export interface Lesson {
  id: string;
  subjectId: string;
  topicId: string;
  weekId: string;
  classLevel: string;
  term: string;
  title: string;
  description: string;
  duration: number; // in minutes
  content: {
    introduction: string;
    objectives: string[];
    materials: string[];
    activities: string[];
    summary: string;
    homework?: string;
  };
  media: {
    type: "video" | "audio" | "document" | "presentation";
    url: string;
    title: string;
  }[];
  progress: {
    completed: boolean;
    timeSpent: number; // in minutes
    lastAccessed: string;
    completionDate?: string;
  };
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  prerequisiteLessonIds: string[];
  nextLessonIds: string[];
}

export const mockLessons: Lesson[] = [
  // Mathematics JSS1 Term1 Lessons
  {
    id: "math-jss1-t1-w1-l1",
    subjectId: "mathematics",
    topicId: "whole-numbers",
    weekId: "week-1",
    classLevel: "JSS1",
    term: "Term1",
    title: "Introduction to Whole Numbers",
    description: "Understanding what whole numbers are and their properties",
    duration: 40,
    content: {
      introduction:
        "Whole numbers are the numbers we use for counting and ordering. They include 0, 1, 2, 3, 4, 5, and so on.",
      objectives: [
        "Define whole numbers",
        "Identify whole numbers in everyday situations",
        "Arrange whole numbers in ascending and descending order",
        "Use whole numbers in simple calculations",
      ],
      materials: [
        "Number charts",
        "Counting objects",
        "Whiteboard",
        "Textbook",
      ],
      activities: [
        "Count objects in the classroom",
        "Practice writing numbers 0-100",
        "Arrange given numbers in order",
        "Identify whole numbers from a mixed list",
      ],
      summary:
        "Whole numbers are non-negative integers starting from 0. They are used in counting and basic arithmetic operations.",
      homework:
        "Practice writing numbers 1-50 and arrange the following numbers in ascending order: 25, 3, 17, 8, 42, 1, 33",
    },
    media: [
      {
        type: "video",
        url: "https://example.com/whole-numbers-intro",
        title: "Introduction to Whole Numbers Video",
      },
      {
        type: "presentation",
        url: "https://example.com/whole-numbers-slides",
        title: "Whole Numbers Presentation",
      },
    ],
    progress: {
      completed: true,
      timeSpent: 35,
      lastAccessed: "2024-01-15T10:30:00Z",
      completionDate: "2024-01-15T11:05:00Z",
    },
    difficulty: "beginner",
    tags: ["numbers", "counting", "basics"],
    prerequisiteLessonIds: [],
    nextLessonIds: ["math-jss1-t1-w1-l2"],
  },
  {
    id: "math-jss1-t1-w1-l2",
    subjectId: "mathematics",
    topicId: "whole-numbers",
    weekId: "week-1",
    classLevel: "JSS1",
    term: "Term1",
    title: "Place Value in Whole Numbers",
    description:
      "Understanding the place value system and representing numbers",
    duration: 45,
    content: {
      introduction:
        "Place value tells us the value of each digit in a number based on its position.",
      objectives: [
        "Understand place value concept",
        "Identify units, tens, hundreds places",
        "Write numbers in expanded form",
        "Compare numbers using place value",
      ],
      materials: ["Place value charts", "Base-10 blocks", "Number cards"],
      activities: [
        "Build numbers using base-10 blocks",
        "Practice with place value charts",
        "Write numbers in expanded form",
        "Compare pairs of numbers",
      ],
      summary:
        "Place value system helps us understand the value of digits based on their position in a number.",
      homework:
        "Write the following numbers in expanded form: 247, 503, 1,892, 4,056",
    },
    media: [
      {
        type: "video",
        url: "https://example.com/place-value-video",
        title: "Understanding Place Value",
      },
    ],
    progress: {
      completed: true,
      timeSpent: 40,
      lastAccessed: "2024-01-16T09:15:00Z",
      completionDate: "2024-01-16T10:00:00Z",
    },
    difficulty: "beginner",
    tags: ["place-value", "numbers", "basics"],
    prerequisiteLessonIds: ["math-jss1-t1-w1-l1"],
    nextLessonIds: ["math-jss1-t1-w2-l1"],
  },
  // English JSS1 Term1 Lessons
  {
    id: "eng-jss1-t1-w1-l1",
    subjectId: "english",
    topicId: "speech-sounds",
    weekId: "week-1",
    classLevel: "JSS1",
    term: "Term1",
    title: "Introduction to Speech Sounds",
    description: "Understanding the basic sounds in English language",
    duration: 40,
    content: {
      introduction:
        "Speech sounds are the basic units of spoken language. In English, we have vowels and consonants.",
      objectives: [
        "Identify vowel and consonant sounds",
        "Pronounce sounds correctly",
        "Distinguish between similar sounds",
        "Practice listening skills",
      ],
      materials: [
        "Audio recordings",
        "Phonetic charts",
        "Mirror for mouth observation",
      ],
      activities: [
        "Listen to and repeat sounds",
        "Practice tongue twisters",
        "Sound discrimination exercises",
        "Record and playback pronunciation",
      ],
      summary:
        "English has vowel sounds (a, e, i, o, u) and consonant sounds. Correct pronunciation is important for effective communication.",
      homework:
        "Practice pronouncing the 5 vowel sounds and record yourself saying 10 words with each vowel sound",
    },
    media: [
      {
        type: "audio",
        url: "https://example.com/speech-sounds-audio",
        title: "English Speech Sounds Audio Guide",
      },
      {
        type: "video",
        url: "https://example.com/pronunciation-guide",
        title: "Pronunciation Guide Video",
      },
    ],
    progress: {
      completed: false,
      timeSpent: 25,
      lastAccessed: "2024-01-18T14:20:00Z",
    },
    difficulty: "beginner",
    tags: ["pronunciation", "phonetics", "listening"],
    prerequisiteLessonIds: [],
    nextLessonIds: ["eng-jss1-t1-w1-l2"],
  },
  // Basic Science JSS1 Term1 Lessons
  {
    id: "bs-jss1-t1-w1-l1",
    subjectId: "basic-science",
    topicId: "living-things",
    weekId: "week-1",
    classLevel: "JSS1",
    term: "Term1",
    title: "Characteristics of Living Things",
    description:
      "Learning about the features that distinguish living things from non-living things",
    duration: 45,
    content: {
      introduction:
        "Living things have certain characteristics that make them different from non-living things.",
      objectives: [
        "List characteristics of living things",
        "Give examples of living and non-living things",
        "Explain each characteristic with examples",
        "Apply knowledge to classify objects",
      ],
      materials: [
        "Pictures of living and non-living things",
        "Plants",
        "Chart paper",
      ],
      activities: [
        "Observe living things in the school environment",
        "Create a chart of living vs non-living things",
        "Discuss each characteristic with examples",
        "Classification game with pictures",
      ],
      summary:
        "Living things show characteristics like movement, reproduction, growth, respiration, nutrition, excretion, and response to stimuli.",
      homework:
        "Make a list of 10 living things and 10 non-living things you can find at home. Explain why each living thing is considered alive.",
    },
    media: [
      {
        type: "video",
        url: "https://example.com/living-things-video",
        title: "Characteristics of Living Things",
      },
      {
        type: "presentation",
        url: "https://example.com/living-things-slides",
        title: "Living Things Presentation",
      },
    ],
    progress: {
      completed: false,
      timeSpent: 30,
      lastAccessed: "2024-01-17T11:45:00Z",
    },
    difficulty: "beginner",
    tags: ["biology", "living-things", "classification"],
    prerequisiteLessonIds: [],
    nextLessonIds: ["bs-jss1-t1-w1-l2"],
  },
  // Add some more lessons for variety
  {
    id: "math-jss1-t1-w2-l1",
    subjectId: "mathematics",
    topicId: "addition-subtraction",
    weekId: "week-2",
    classLevel: "JSS1",
    term: "Term1",
    title: "Addition of Whole Numbers",
    description: "Learning to add whole numbers with and without carrying",
    duration: 50,
    content: {
      introduction:
        "Addition is combining two or more numbers to get a total or sum.",
      objectives: [
        "Understand the concept of addition",
        "Add numbers without carrying",
        "Add numbers with carrying",
        "Solve word problems involving addition",
      ],
      materials: ["Counting objects", "Number line", "Worksheets"],
      activities: [
        "Use objects to demonstrate addition",
        "Practice on number line",
        "Solve addition problems step by step",
        "Work on word problems",
      ],
      summary:
        "Addition combines numbers to find their total. We can add using objects, number lines, or the column method.",
      homework:
        "Complete addition worksheet with 20 problems including word problems",
    },
    media: [
      {
        type: "video",
        url: "https://example.com/addition-methods",
        title: "Methods of Addition",
      },
    ],
    progress: {
      completed: false,
      timeSpent: 15,
      lastAccessed: "2024-01-19T08:30:00Z",
    },
    difficulty: "beginner",
    tags: ["arithmetic", "addition", "problem-solving"],
    prerequisiteLessonIds: ["math-jss1-t1-w1-l2"],
    nextLessonIds: ["math-jss1-t1-w2-l2"],
  },
  {
    id: "eng-jss1-t1-w2-l1",
    subjectId: "english",
    topicId: "reading-comprehension",
    weekId: "week-2",
    classLevel: "JSS1",
    term: "Term1",
    title: "Reading for Understanding",
    description: "Developing reading skills and comprehension strategies",
    duration: 45,
    content: {
      introduction:
        "Reading comprehension involves understanding what we read and being able to answer questions about it.",
      objectives: [
        "Read passages fluently",
        "Identify main ideas in texts",
        "Answer comprehension questions",
        "Summarize what was read",
      ],
      materials: ["Short stories", "Comprehension questions", "Dictionary"],
      activities: [
        "Silent reading practice",
        "Read aloud in turns",
        "Discuss main ideas",
        "Answer comprehension questions together",
      ],
      summary:
        "Good reading comprehension requires understanding vocabulary, identifying main ideas, and making connections.",
      homework:
        "Read the assigned story and answer the comprehension questions. Look up 5 new words in the dictionary.",
    },
    media: [
      {
        type: "document",
        url: "https://example.com/reading-passage1",
        title: "Sample Reading Passage",
      },
    ],
    progress: {
      completed: false,
      timeSpent: 0,
      lastAccessed: "2024-01-20T13:15:00Z",
    },
    difficulty: "intermediate",
    tags: ["reading", "comprehension", "vocabulary"],
    prerequisiteLessonIds: ["eng-jss1-t1-w1-l1"],
    nextLessonIds: ["eng-jss1-t1-w2-l2"],
  },
];

// Helper functions
export function getLessonsBySubject(subjectId: string): Lesson[] {
  return mockLessons.filter((lesson) => lesson.subjectId === subjectId);
}

export function getLessonsByClassAndTerm(
  classLevel: string,
  term: string,
): Lesson[] {
  return mockLessons.filter(
    (lesson) => lesson.classLevel === classLevel && lesson.term === term,
  );
}

export function getLessonById(id: string): Lesson | undefined {
  return mockLessons.find((lesson) => lesson.id === id);
}

export function getCompletedLessons(): Lesson[] {
  return mockLessons.filter((lesson) => lesson.progress.completed);
}

export function getInProgressLessons(): Lesson[] {
  return mockLessons.filter(
    (lesson) => !lesson.progress.completed && lesson.progress.timeSpent > 0,
  );
}

export function getNotStartedLessons(): Lesson[] {
  return mockLessons.filter(
    (lesson) => !lesson.progress.completed && lesson.progress.timeSpent === 0,
  );
}

// Statistics
export function getLessonStats() {
  const total = mockLessons.length;
  const completed = getCompletedLessons().length;
  const inProgress = getInProgressLessons().length;
  const notStarted = getNotStartedLessons().length;

  return {
    total,
    completed,
    inProgress,
    notStarted,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
