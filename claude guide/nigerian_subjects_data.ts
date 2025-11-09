// data/subjects.ts

export interface Subject {
  id: string;
  name: string;
  description?: string;
  isCore: boolean; // Mandatory subjects
  category: 'jss' | 'sss';
  icon?: string; // Optional icon for UI
}

export interface ClassLevel {
  id: string;
  name: string;
  category: 'jss' | 'sss';
  displayName: string;
  description: string;
}

export interface SubjectRequirement {
  total: number;
  core: number;
  elective: number;
}

// Class Levels
export const classLevels: ClassLevel[] = [
  { 
    id: 'jss1', 
    name: 'JSS 1', 
    category: 'jss', 
    displayName: 'Junior Secondary 1',
    description: 'First year of junior secondary education'
  },
  { 
    id: 'jss2', 
    name: 'JSS 2', 
    category: 'jss', 
    displayName: 'Junior Secondary 2',
    description: 'Second year of junior secondary education'
  },
  { 
    id: 'jss3', 
    name: 'JSS 3', 
    category: 'jss', 
    displayName: 'Junior Secondary 3',
    description: 'Final year of junior secondary education'
  },
  { 
    id: 'sss1', 
    name: 'SSS 1', 
    category: 'sss', 
    displayName: 'Senior Secondary 1',
    description: 'First year of senior secondary education'
  },
  { 
    id: 'sss2', 
    name: 'SSS 2', 
    category: 'sss', 
    displayName: 'Senior Secondary 2',
    description: 'Second year of senior secondary education'
  },
  { 
    id: 'sss3', 
    name: 'SSS 3', 
    category: 'sss', 
    displayName: 'Senior Secondary 3',
    description: 'Final year - WAEC/NECO preparation'
  },
];

// Academic Terms
export const academicTerms = [
  { id: '1', name: 'First Term', description: 'September - December' },
  { id: '2', name: 'Second Term', description: 'January - April' },
  { id: '3', name: 'Third Term', description: 'May - August' },
];

// JSS Core Subjects (Mandatory)
export const jssCoreSubjects: Subject[] = [
  { 
    id: 'eng-jss', 
    name: 'English Language', 
    isCore: true, 
    category: 'jss',
    description: 'Communication and language skills',
    icon: '📚'
  },
  { 
    id: 'math-jss', 
    name: 'Mathematics', 
    isCore: true, 
    category: 'jss',
    description: 'Basic mathematical concepts',
    icon: '🔢'
  },
  { 
    id: 'basic-sci-jss', 
    name: 'Basic Science', 
    isCore: true, 
    category: 'jss',
    description: 'Introduction to scientific concepts',
    icon: '🔬'
  },
  { 
    id: 'basic-tech-jss', 
    name: 'Basic Technology', 
    isCore: true, 
    category: 'jss',
    description: 'Technical and practical skills',
    icon: '⚙️'
  },
  { 
    id: 'civic-jss', 
    name: 'Civic Education', 
    isCore: true, 
    category: 'jss',
    description: 'Citizenship and moral values',
    icon: '🏛️'
  },
  { 
    id: 'social-jss', 
    name: 'Social Studies', 
    isCore: true, 
    category: 'jss',
    description: 'Society and culture',
    icon: '🌍'
  },
];

// JSS Elective Subjects
export const jssElectiveSubjects: Subject[] = [
  { 
    id: 'agric-jss', 
    name: 'Agricultural Science', 
    isCore: false, 
    category: 'jss',
    description: 'Farming and agriculture basics',
    icon: '🌾'
  },
  { 
    id: 'home-econ-jss', 
    name: 'Home Economics', 
    isCore: false, 
    category: 'jss',
    description: 'Home management and nutrition',
    icon: '🏠'
  },
  { 
    id: 'french-jss', 
    name: 'French Language', 
    isCore: false, 
    category: 'jss',
    description: 'French communication skills',
    icon: '🇫🇷'
  },
  { 
    id: 'music-jss', 
    name: 'Music', 
    isCore: false, 
    category: 'jss',
    description: 'Musical theory and practice',
    icon: '🎵'
  },
  { 
    id: 'fine-art-jss', 
    name: 'Fine Arts', 
    isCore: false, 
    category: 'jss',
    description: 'Visual arts and creativity',
    icon: '🎨'
  },
  { 
    id: 'computer-jss', 
    name: 'Computer Studies', 
    isCore: false, 
    category: 'jss',
    description: 'Basic computing skills',
    icon: '💻'
  },
  { 
    id: 'business-jss', 
    name: 'Business Studies', 
    isCore: false, 
    category: 'jss',
    description: 'Introduction to business',
    icon: '💼'
  },
  { 
    id: 'arabic-jss', 
    name: 'Arabic Language', 
    isCore: false, 
    category: 'jss',
    description: 'Arabic language and culture',
    icon: '📖'
  },
  { 
    id: 'yoruba-jss', 
    name: 'Yoruba Language', 
    isCore: false, 
    category: 'jss',
    description: 'Yoruba language and culture',
    icon: '🗣️'
  },
  { 
    id: 'igbo-jss', 
    name: 'Igbo Language', 
    isCore: false, 
    category: 'jss',
    description: 'Igbo language and culture',
    icon: '🗣️'
  },
  { 
    id: 'hausa-jss', 
    name: 'Hausa Language', 
    isCore: false, 
    category: 'jss',
    description: 'Hausa language and culture',
    icon: '🗣️'
  },
  { 
    id: 'physical-edu-jss', 
    name: 'Physical Education', 
    isCore: false, 
    category: 'jss',
    description: 'Sports and physical fitness',
    icon: '⚽'
  },
  { 
    id: 'creative-arts-jss', 
    name: 'Creative Arts', 
    isCore: false, 
    category: 'jss',
    description: 'Drama, music, and arts',
    icon: '🎭'
  },
];

// SSS Core Subjects (Mandatory)
export const sssCoreSubjects: Subject[] = [
  { 
    id: 'eng-sss', 
    name: 'English Language', 
    isCore: true, 
    category: 'sss',
    description: 'Advanced communication skills',
    icon: '📚'
  },
  { 
    id: 'math-sss', 
    name: 'Mathematics', 
    isCore: true, 
    category: 'sss',
    description: 'Advanced mathematics',
    icon: '🔢'
  },
  { 
    id: 'civic-sss', 
    name: 'Civic Education', 
    isCore: true, 
    category: 'sss',
    description: 'Citizenship and governance',
    icon: '🏛️'
  },
];

// SSS Elective Subjects (organized by streams)
export const sssElectiveSubjects: Subject[] = [
  // Science Stream
  { 
    id: 'physics-sss', 
    name: 'Physics', 
    isCore: false, 
    category: 'sss',
    description: 'Study of matter and energy',
    icon: '⚛️'
  },
  { 
    id: 'chemistry-sss', 
    name: 'Chemistry', 
    isCore: false, 
    category: 'sss',
    description: 'Study of substances and reactions',
    icon: '🧪'
  },
  { 
    id: 'biology-sss', 
    name: 'Biology', 
    isCore: false, 
    category: 'sss',
    description: 'Study of living organisms',
    icon: '🧬'
  },
  { 
    id: 'agric-sss', 
    name: 'Agricultural Science', 
    isCore: false, 
    category: 'sss',
    description: 'Advanced agriculture studies',
    icon: '🌾'
  },
  { 
    id: 'further-math-sss', 
    name: 'Further Mathematics', 
    isCore: false, 
    category: 'sss',
    description: 'Advanced mathematical concepts',
    icon: '📐'
  },
  
  // Arts/Humanities Stream
  { 
    id: 'lit-sss', 
    name: 'Literature in English', 
    isCore: false, 
    category: 'sss',
    description: 'Literary analysis and criticism',
    icon: '📖'
  },
  { 
    id: 'govt-sss', 
    name: 'Government', 
    isCore: false, 
    category: 'sss',
    description: 'Political science and governance',
    icon: '🏛️'
  },
  { 
    id: 'history-sss', 
    name: 'History', 
    isCore: false, 
    category: 'sss',
    description: 'Historical events and analysis',
    icon: '📜'
  },
  { 
    id: 'geography-sss', 
    name: 'Geography', 
    isCore: false, 
    category: 'sss',
    description: 'Physical and human geography',
    icon: '🗺️'
  },
  { 
    id: 'crs-sss', 
    name: 'Christian Religious Studies', 
    isCore: false, 
    category: 'sss',
    description: 'Christian teachings and values',
    icon: '✝️'
  },
  { 
    id: 'irs-sss', 
    name: 'Islamic Religious Studies', 
    isCore: false, 
    category: 'sss',
    description: 'Islamic teachings and values',
    icon: '☪️'
  },
  
  // Commercial Stream
  { 
    id: 'commerce-sss', 
    name: 'Commerce', 
    isCore: false, 
    category: 'sss',
    description: 'Trade and business operations',
    icon: '💼'
  },
  { 
    id: 'accounting-sss', 
    name: 'Accounting', 
    isCore: false, 
    category: 'sss',
    description: 'Financial record keeping',
    icon: '💰'
  },
  { 
    id: 'economics-sss', 
    name: 'Economics', 
    isCore: false, 
    category: 'sss',
    description: 'Economic theory and practice',
    icon: '📊'
  },
  
  // Other Subjects
  { 
    id: 'french-sss', 
    name: 'French Language', 
    isCore: false, 
    category: 'sss',
    description: 'Advanced French',
    icon: '🇫🇷'
  },
  { 
    id: 'computer-sss', 
    name: 'Computer Studies', 
    isCore: false, 
    category: 'sss',
    description: 'Programming and ICT',
    icon: '💻'
  },
  { 
    id: 'tech-drawing-sss', 
    name: 'Technical Drawing', 
    isCore: false, 
    category: 'sss',
    description: 'Engineering drawing',
    icon: '📐'
  },
  { 
    id: 'home-econ-sss', 
    name: 'Home Economics', 
    isCore: false, 
    category: 'sss',
    description: 'Advanced home management',
    icon: '🏠'
  },
  { 
    id: 'fine-art-sss', 
    name: 'Fine Arts', 
    isCore: false, 
    category: 'sss',
    description: 'Advanced visual arts',
    icon: '🎨'
  },
  { 
    id: 'music-sss', 
    name: 'Music', 
    isCore: false, 
    category: 'sss',
    description: 'Advanced music theory',
    icon: '🎵'
  },
  { 
    id: 'yoruba-sss', 
    name: 'Yoruba Language', 
    isCore: false, 
    category: 'sss',
    description: 'Advanced Yoruba',
    icon: '🗣️'
  },
  { 
    id: 'igbo-sss', 
    name: 'Igbo Language', 
    isCore: false, 
    category: 'sss',
    description: 'Advanced Igbo',
    icon: '🗣️'
  },
  { 
    id: 'hausa-sss', 
    name: 'Hausa Language', 
    isCore: false, 
    category: 'sss',
    description: 'Advanced Hausa',
    icon: '🗣️'
  },
  { 
    id: 'physical-edu-sss', 
    name: 'Physical Education', 
    isCore: false, 
    category: 'sss',
    description: 'Sports science and health',
    icon: '⚽'
  },
];

// Subject count requirements based on Nigerian curriculum
export const SUBJECT_REQUIREMENTS: Record<'jss' | 'sss', SubjectRequirement> = {
  jss: {
    total: 12,     // Total subjects for JSS
    core: 6,       // Mandatory core subjects
    elective: 6    // Electives to choose
  },
  sss: {
    total: 9,      // Total subjects for SSS (for WAEC/NECO)
    core: 3,       // Mandatory core subjects
    elective: 6    // Electives to choose
  }
};

// Helper functions
export const getCoreSubjects = (category: 'jss' | 'sss'): Subject[] => {
  return category === 'jss' ? jssCoreSubjects : sssCoreSubjects;
};

export const getElectiveSubjects = (category: 'jss' | 'sss'): Subject[] => {
  return category === 'jss' ? jssElectiveSubjects : sssElectiveSubjects;
};

export const getAllSubjects = (category: 'jss' | 'sss'): Subject[] => {
  return [...getCoreSubjects(category), ...getElectiveSubjects(category)];
};

export const getRequirements = (category: 'jss' | 'sss'): SubjectRequirement => {
  return SUBJECT_REQUIREMENTS[category];
};

export const getClassCategory = (classId: string): 'jss' | 'sss' | null => {
  const classLevel = classLevels.find(c => c.id === classId);
  return classLevel?.category || null;
};

export const getClassName = (classId: string): string => {
  const classLevel = classLevels.find(c => c.id === classId);
  return classLevel?.displayName || classId;
};

export const getTermName = (termId: string): string => {
  const term = academicTerms.find(t => t.id === termId);
  return term?.name || `Term ${termId}`;
};

// Subject combination recommendations for SSS
export const sssSubjectCombinations = {
  science: {
    name: 'Science Stream',
    description: 'For students pursuing medicine, engineering, or science-related fields',
    recommended: ['physics-sss', 'chemistry-sss', 'biology-sss', 'further-math-sss'],
    icon: '🔬'
  },
  commercial: {
    name: 'Commercial Stream',
    description: 'For students interested in business, accounting, or economics',
    recommended: ['commerce-sss', 'accounting-sss', 'economics-sss'],
    icon: '💼'
  },
  arts: {
    name: 'Arts/Humanities Stream',
    description: 'For students interested in law, languages, or social sciences',
    recommended: ['lit-sss', 'govt-sss', 'history-sss', 'geography-sss'],
    icon: '📚'
  }
};

// Validation helpers
export const validateSubjectSelection = (
  category: 'jss' | 'sss',
  selectedSubjects: string[]
): { valid: boolean; message?: string } => {
  const requirements = getRequirements(category);
  const coreSubjects = getCoreSubjects(category);
  const coreIds = coreSubjects.map(s => s.id);
  
  // Check if all core subjects are selected
  const hasAllCore = coreIds.every(id => selectedSubjects.includes(id));
  if (!hasAllCore) {
    return { 
      valid: false, 
      message: 'All core subjects must be selected' 
    };
  }
  
  // Check total count
  if (selectedSubjects.length !== requirements.total) {
    return { 
      valid: false, 
      message: `You must select exactly ${requirements.total} subjects (${requirements.core} core + ${requirements.elective} electives)` 
    };
  }
  
  return { valid: true };
};
