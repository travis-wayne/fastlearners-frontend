/**
 * Nigerian Education System Configuration
 * Based on the Federal Ministry of Education curriculum structure
 */

export interface ClassLevel {
  id: string;
  name: string;
  stage: "primary" | "jss" | "sss";
  level: number;
  track?: "science" | "arts" | "commercial" | null;
  description: string;
}

export interface Term {
  id: string;
  name: string;
  shortName: string;
  order: number;
  description: string;
  typicalDuration: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  compulsory: boolean;
  levels: string[]; // ClassLevel IDs where this subject is taught
  track?: "science" | "arts" | "commercial" | null; // For SSS subjects
}

export interface WeekPlan {
  week: number;
  topics: string[];
  objectives: string[];
  activities: string[];
  resources: string[];
  assessment: string;
}

export interface SchemeOfWork {
  id: string;
  subjectId: string;
  classLevelId: string;
  termId: string;
  weeks: WeekPlan[];
}

/**
 * Nigerian Class Levels
 */
export const classLevels: ClassLevel[] = [
  // Primary Education (6 years)
  {
    id: "pry1",
    name: "Primary 1",
    stage: "primary",
    level: 1,
    description: "Foundation year of basic education",
  },
  {
    id: "pry2",
    name: "Primary 2",
    stage: "primary",
    level: 2,
    description: "Second year of primary education",
  },
  {
    id: "pry3",
    name: "Primary 3",
    stage: "primary",
    level: 3,
    description: "Third year of primary education",
  },
  {
    id: "pry4",
    name: "Primary 4",
    stage: "primary",
    level: 4,
    description: "Upper primary - preparation for common entrance",
  },
  {
    id: "pry5",
    name: "Primary 5",
    stage: "primary",
    level: 5,
    description: "Upper primary - advanced foundation",
  },
  {
    id: "pry6",
    name: "Primary 6",
    stage: "primary",
    level: 6,
    description: "Final primary year - common entrance preparation",
  },

  // Junior Secondary School (3 years)
  {
    id: "jss1",
    name: "JSS 1",
    stage: "jss",
    level: 7,
    description: "First year of junior secondary education",
  },
  {
    id: "jss2",
    name: "JSS 2",
    stage: "jss",
    level: 8,
    description: "Second year of junior secondary education",
  },
  {
    id: "jss3",
    name: "JSS 3",
    stage: "jss",
    level: 9,
    description: "Final JSS year - BECE preparation",
  },

  // Senior Secondary School (3 years)
  {
    id: "sss1-science",
    name: "SSS 1 (Science)",
    stage: "sss",
    level: 10,
    track: "science",
    description: "First year senior secondary - Science track",
  },
  {
    id: "sss1-arts",
    name: "SSS 1 (Arts)",
    stage: "sss",
    level: 10,
    track: "arts",
    description: "First year senior secondary - Arts track",
  },
  {
    id: "sss1-commercial",
    name: "SSS 1 (Commercial)",
    stage: "sss",
    level: 10,
    track: "commercial",
    description: "First year senior secondary - Commercial track",
  },
  {
    id: "sss2-science",
    name: "SSS 2 (Science)",
    stage: "sss",
    level: 11,
    track: "science",
    description: "Second year senior secondary - Science track",
  },
  {
    id: "sss2-arts",
    name: "SSS 2 (Arts)",
    stage: "sss",
    level: 11,
    track: "arts",
    description: "Second year senior secondary - Arts track",
  },
  {
    id: "sss2-commercial",
    name: "SSS 2 (Commercial)",
    stage: "sss",
    level: 11,
    track: "commercial",
    description: "Second year senior secondary - Commercial track",
  },
  {
    id: "sss3-science",
    name: "SSS 3 (Science)",
    stage: "sss",
    level: 12,
    track: "science",
    description: "Final SSS year - WAEC/NECO preparation (Science)",
  },
  {
    id: "sss3-arts",
    name: "SSS 3 (Arts)",
    stage: "sss",
    level: 12,
    track: "arts",
    description: "Final SSS year - WAEC/NECO preparation (Arts)",
  },
  {
    id: "sss3-commercial",
    name: "SSS 3 (Commercial)",
    stage: "sss",
    level: 12,
    track: "commercial",
    description: "Final SSS year - WAEC/NECO preparation (Commercial)",
  },
];

/**
 * Academic Terms
 */
export const terms: Term[] = [
  {
    id: "term1",
    name: "First Term",
    shortName: "1st Term",
    order: 1,
    description: "September - December",
    typicalDuration: "13-14 weeks",
  },
  {
    id: "term2",
    name: "Second Term",
    shortName: "2nd Term",
    order: 2,
    description: "January - April",
    typicalDuration: "11-12 weeks",
  },
  {
    id: "term3",
    name: "Third Term",
    shortName: "3rd Term",
    order: 3,
    description: "May - July",
    typicalDuration: "10-11 weeks",
  },
];

/**
 * Nigerian Curriculum Subjects
 */
export const subjects: Subject[] = [
  // Core subjects across multiple levels
  {
    id: "english",
    name: "English Studies",
    code: "ENG",
    description: "English Language, Literature, and Communication",
    icon: "bookOpen",
    color: "#3B82F6",
    compulsory: true,
    levels: [
      "pry1",
      "pry2",
      "pry3",
      "pry4",
      "pry5",
      "pry6",
      "jss1",
      "jss2",
      "jss3",
      "sss1-science",
      "sss1-arts",
      "sss1-commercial",
      "sss2-science",
      "sss2-arts",
      "sss2-commercial",
      "sss3-science",
      "sss3-arts",
      "sss3-commercial",
    ],
  },
  {
    id: "mathematics",
    name: "Mathematics",
    code: "MTH",
    description: "General Mathematics and Further Mathematics",
    icon: "calculator",
    color: "#10B981",
    compulsory: true,
    levels: [
      "pry1",
      "pry2",
      "pry3",
      "pry4",
      "pry5",
      "pry6",
      "jss1",
      "jss2",
      "jss3",
      "sss1-science",
      "sss1-arts",
      "sss1-commercial",
      "sss2-science",
      "sss2-arts",
      "sss2-commercial",
      "sss3-science",
      "sss3-arts",
      "sss3-commercial",
    ],
  },

  // Primary Level Subjects
  {
    id: "basic-science",
    name: "Basic Science",
    code: "BSC",
    description: "Introduction to scientific concepts and phenomena",
    icon: "flask",
    color: "#8B5CF6",
    compulsory: true,
    levels: [
      "pry1",
      "pry2",
      "pry3",
      "pry4",
      "pry5",
      "pry6",
      "jss1",
      "jss2",
      "jss3",
    ],
  },
  {
    id: "social-studies",
    name: "Social Studies",
    code: "SOS",
    description: "Study of society, environment, and civic responsibilities",
    icon: "users",
    color: "#F59E0B",
    compulsory: true,
    levels: [
      "pry1",
      "pry2",
      "pry3",
      "pry4",
      "pry5",
      "pry6",
      "jss1",
      "jss2",
      "jss3",
    ],
  },

  // JSS Subjects
  {
    id: "basic-technology",
    name: "Basic Technology",
    code: "BTE",
    description: "Introduction to technology and technical drawing",
    icon: "wrench",
    color: "#EF4444",
    compulsory: true,
    levels: ["jss1", "jss2", "jss3"],
  },
  {
    id: "business-studies",
    name: "Business Studies",
    code: "BUS",
    description: "Introduction to business concepts and entrepreneurship",
    icon: "briefcase",
    color: "#06B6D4",
    compulsory: false,
    levels: ["jss1", "jss2", "jss3"],
  },
  {
    id: "computer-studies",
    name: "Computer Studies",
    code: "CMP",
    description: "Introduction to computer literacy and programming",
    icon: "monitor",
    color: "#6366F1",
    compulsory: false,
    levels: [
      "jss1",
      "jss2",
      "jss3",
      "sss1-science",
      "sss2-science",
      "sss3-science",
    ],
  },

  // SSS Science Subjects
  {
    id: "physics",
    name: "Physics",
    code: "PHY",
    description: "Study of matter, energy, and their interactions",
    icon: "zap",
    color: "#DC2626",
    compulsory: true,
    levels: ["sss1-science", "sss2-science", "sss3-science"],
    track: "science",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    code: "CHE",
    description: "Study of matter, composition, and chemical reactions",
    icon: "flask",
    color: "#059669",
    compulsory: true,
    levels: ["sss1-science", "sss2-science", "sss3-science"],
    track: "science",
  },
  {
    id: "biology",
    name: "Biology",
    code: "BIO",
    description: "Study of living organisms and life processes",
    icon: "leaf",
    color: "#16A34A",
    compulsory: true,
    levels: ["sss1-science", "sss2-science", "sss3-science"],
    track: "science",
  },

  // SSS Arts Subjects
  {
    id: "literature",
    name: "Literature in English",
    code: "LIT",
    description: "Study of poetry, drama, and prose works",
    icon: "bookOpen",
    color: "#7C3AED",
    compulsory: false,
    levels: ["sss1-arts", "sss2-arts", "sss3-arts"],
    track: "arts",
  },
  {
    id: "government",
    name: "Government",
    code: "GOV",
    description: "Study of political systems and governance",
    icon: "landmark",
    color: "#B91C1C",
    compulsory: false,
    levels: ["sss1-arts", "sss2-arts", "sss3-arts"],
    track: "arts",
  },
  {
    id: "history",
    name: "History",
    code: "HIS",
    description: "Study of past events and civilizations",
    icon: "scroll",
    color: "#92400E",
    compulsory: false,
    levels: ["sss1-arts", "sss2-arts", "sss3-arts"],
    track: "arts",
  },

  // SSS Commercial Subjects
  {
    id: "accounting",
    name: "Accounting",
    code: "ACC",
    description: "Financial record keeping and analysis",
    icon: "calculator",
    color: "#0F766E",
    compulsory: true,
    levels: ["sss1-commercial", "sss2-commercial", "sss3-commercial"],
    track: "commercial",
  },
  {
    id: "economics",
    name: "Economics",
    code: "ECO",
    description: "Study of production, distribution, and consumption",
    icon: "trendingUp",
    color: "#0D9488",
    compulsory: true,
    levels: ["sss1-commercial", "sss2-commercial", "sss3-commercial"],
    track: "commercial",
  },
  {
    id: "commerce",
    name: "Commerce",
    code: "COM",
    description: "Study of trade and business activities",
    icon: "store",
    color: "#0891B2",
    compulsory: true,
    levels: ["sss1-commercial", "sss2-commercial", "sss3-commercial"],
    track: "commercial",
  },

  // Additional subjects
  {
    id: "agricultural-science",
    name: "Agricultural Science",
    code: "AGR",
    description: "Study of crop and animal production",
    icon: "tractor",
    color: "#65A30D",
    compulsory: false,
    levels: [
      "jss1",
      "jss2",
      "jss3",
      "sss1-science",
      "sss2-science",
      "sss3-science",
    ],
  },
  {
    id: "civic-education",
    name: "Civic Education",
    code: "CIV",
    description: "Citizenship, rights, and national values",
    icon: "flag",
    color: "#DC2626",
    compulsory: true,
    levels: ["pry4", "pry5", "pry6", "jss1", "jss2", "jss3"],
  },
  {
    id: "crs",
    name: "Christian Religious Studies",
    code: "CRS",
    description: "Christian teachings and moral values",
    icon: "cross",
    color: "#7C2D12",
    compulsory: false,
    levels: [
      "pry1",
      "pry2",
      "pry3",
      "pry4",
      "pry5",
      "pry6",
      "jss1",
      "jss2",
      "jss3",
    ],
  },
  {
    id: "irs",
    name: "Islamic Religious Studies",
    code: "IRS",
    description: "Islamic teachings and moral values",
    icon: "moon",
    color: "#166534",
    compulsory: false,
    levels: [
      "pry1",
      "pry2",
      "pry3",
      "pry4",
      "pry5",
      "pry6",
      "jss1",
      "jss2",
      "jss3",
    ],
  },
];

/**
 * Grading System
 */
export interface GradeBand {
  grade: string;
  minScore: number;
  maxScore: number;
  description: string;
  color: string;
}

export const gradingSystem: GradeBand[] = [
  {
    grade: "A1",
    minScore: 75,
    maxScore: 100,
    description: "Excellent",
    color: "#16A34A",
  },
  {
    grade: "B2",
    minScore: 70,
    maxScore: 74,
    description: "Very Good",
    color: "#65A30D",
  },
  {
    grade: "B3",
    minScore: 65,
    maxScore: 69,
    description: "Good",
    color: "#CA8A04",
  },
  {
    grade: "C4",
    minScore: 60,
    maxScore: 64,
    description: "Credit",
    color: "#D97706",
  },
  {
    grade: "C5",
    minScore: 55,
    maxScore: 59,
    description: "Credit",
    color: "#DC6D20",
  },
  {
    grade: "C6",
    minScore: 50,
    maxScore: 54,
    description: "Credit",
    color: "#EA580C",
  },
  {
    grade: "D7",
    minScore: 45,
    maxScore: 49,
    description: "Pass",
    color: "#F97316",
  },
  {
    grade: "E8",
    minScore: 40,
    maxScore: 44,
    description: "Pass",
    color: "#FB923C",
  },
  {
    grade: "F9",
    minScore: 0,
    maxScore: 39,
    description: "Fail",
    color: "#DC2626",
  },
];

/**
 * Assessment Configuration
 */
export interface AssessmentConfig {
  continuousAssessment: number; // Percentage
  examination: number; // Percentage
  components: {
    classwork: number;
    assignment: number;
    test: number;
    project?: number;
  };
}

export const assessmentConfig: AssessmentConfig = {
  continuousAssessment: 40,
  examination: 60,
  components: {
    classwork: 10,
    assignment: 10,
    test: 20,
    project: 0,
  },
};

/**
 * Utility Functions
 */
export function getClassLevelsByStage(
  stage: "primary" | "jss" | "sss",
): ClassLevel[] {
  return classLevels.filter((level) => level.stage === stage);
}

export function getSubjectsForClass(classLevelId: string): Subject[] {
  return subjects.filter((subject) => subject.levels.includes(classLevelId));
}

export function getCompulsorySubjectsForClass(classLevelId: string): Subject[] {
  return subjects.filter(
    (subject) => subject.levels.includes(classLevelId) && subject.compulsory,
  );
}

export function getElectiveSubjectsForClass(classLevelId: string): Subject[] {
  return subjects.filter(
    (subject) => subject.levels.includes(classLevelId) && !subject.compulsory,
  );
}

export function getGradeFromScore(score: number): GradeBand {
  return (
    gradingSystem.find(
      (band) => score >= band.minScore && score <= band.maxScore,
    ) || gradingSystem[gradingSystem.length - 1]
  );
}

export function getClassLevelById(id: string): ClassLevel | undefined {
  return classLevels.find((level) => level.id === id);
}

export function getSubjects(): Subject[] {
  return subjects;
}

export function getSubjectById(id: string): Subject | undefined {
  return subjects.find((subject) => subject.id === id);
}

export function getTermById(id: string): Term | undefined {
  return terms.find((term) => term.id === id);
}
