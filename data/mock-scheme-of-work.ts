/**
 * Mock Scheme of Work Data for Nigerian Education System
 * This would typically come from an API or database
 */

import { SchemeOfWork, WeekPlan } from "@/config/education";

// Mathematics JSS 1 First Term Scheme of Work
export const mathematicsJSS1Term1: SchemeOfWork = {
  id: "math-jss1-term1",
  subjectId: "mathematics",
  classLevelId: "jss1",
  termId: "term1",
  weeks: [
    {
      week: 1,
      topics: ["Numbers and Numeration", "Place Value"],
      objectives: [
        "Identify place values up to millions",
        "Read and write numbers in words and figures",
        "Compare and order numbers",
      ],
      activities: [
        "Practice writing numbers in expanded form",
        "Number games and exercises",
        "Real-life examples using large numbers",
      ],
      resources: [
        "Mathematics textbook",
        "Number cards",
        "Calculator",
        "Whiteboard and markers",
      ],
      assessment: "Class work on place value identification and number writing",
    },
    {
      week: 2,
      topics: ["Basic Operations", "Addition and Subtraction"],
      objectives: [
        "Perform addition and subtraction of whole numbers",
        "Solve word problems involving addition and subtraction",
        "Apply mental arithmetic strategies",
      ],
      activities: [
        "Group work on addition problems",
        "Creating word problems",
        "Mental math competitions",
      ],
      resources: [
        "Mathematics textbook",
        "Exercise books",
        "Mathematical charts",
        "Abacus",
      ],
      assessment: "Quiz on basic operations and word problems",
    },
    {
      week: 3,
      topics: ["Multiplication", "Division"],
      objectives: [
        "Multiply numbers using various methods",
        "Divide numbers with and without remainders",
        "Apply multiplication and division to solve problems",
      ],
      activities: [
        "Long multiplication practice",
        "Division by single and double digits",
        "Problem-solving exercises",
      ],
      resources: [
        "Mathematics textbook",
        "Multiplication tables",
        "Worksheets",
        "Mathematical instruments",
      ],
      assessment: "Test on multiplication and division operations",
    },
    {
      week: 4,
      topics: ["Factors and Multiples"],
      objectives: [
        "Find factors of given numbers",
        "Identify multiples of numbers",
        "Determine HCF and LCM of numbers",
      ],
      activities: [
        "Factor tree construction",
        "Multiple identification games",
        "Practical applications of HCF and LCM",
      ],
      resources: [
        "Mathematics textbook",
        "Factor cards",
        "Grid paper",
        "Calculators",
      ],
      assessment: "Assignment on factors, multiples, HCF and LCM",
    },
    {
      week: 5,
      topics: ["Fractions", "Types of Fractions"],
      objectives: [
        "Identify different types of fractions",
        "Convert improper fractions to mixed numbers",
        "Compare and order fractions",
      ],
      activities: [
        "Fraction charts creation",
        "Hands-on activities with fraction strips",
        "Real-life fraction examples",
      ],
      resources: [
        "Mathematics textbook",
        "Fraction strips",
        "Pie charts",
        "Measuring cups",
      ],
      assessment: "Class test on types and comparison of fractions",
    },
    {
      week: 6,
      topics: ["Addition and Subtraction of Fractions"],
      objectives: [
        "Add fractions with same denominators",
        "Subtract fractions with same denominators",
        "Solve problems involving addition and subtraction of fractions",
      ],
      activities: [
        "Step-by-step fraction calculations",
        "Word problem solving",
        "Group exercises",
      ],
      resources: [
        "Mathematics textbook",
        "Fraction worksheets",
        "Visual aids",
        "Practice sheets",
      ],
      assessment: "Quiz on addition and subtraction of fractions",
    },
    {
      week: 7,
      topics: ["Decimals", "Place Value in Decimals"],
      objectives: [
        "Understand decimal place values",
        "Read and write decimal numbers",
        "Convert fractions to decimals and vice versa",
      ],
      activities: [
        "Decimal place value charts",
        "Conversion exercises",
        "Money calculations using decimals",
      ],
      resources: [
        "Mathematics textbook",
        "Decimal charts",
        "Play money",
        "Calculators",
      ],
      assessment: "Test on decimal concepts and conversions",
    },
    {
      week: 8,
      topics: ["Operations with Decimals"],
      objectives: [
        "Add and subtract decimal numbers",
        "Multiply and divide decimals",
        "Solve real-world problems with decimals",
      ],
      activities: [
        "Decimal operations practice",
        "Shopping calculations",
        "Problem-solving sessions",
      ],
      resources: [
        "Mathematics textbook",
        "Calculators",
        "Price lists",
        "Exercise books",
      ],
      assessment: "Assignment on decimal operations",
    },
    {
      week: 9,
      topics: ["Percentages", "Converting Percentages"],
      objectives: [
        "Understand the concept of percentage",
        "Convert percentages to fractions and decimals",
        "Calculate simple percentages",
      ],
      activities: [
        "Percentage charts creation",
        "Real-life percentage examples",
        "Conversion practice exercises",
      ],
      resources: [
        "Mathematics textbook",
        "Percentage charts",
        "Newspapers with statistics",
        "Calculators",
      ],
      assessment: "Quiz on percentage concepts and calculations",
    },
    {
      week: 10,
      topics: ["Revision", "Past Questions"],
      objectives: [
        "Review all topics covered in the term",
        "Practice examination techniques",
        "Identify and address weak areas",
      ],
      activities: [
        "Comprehensive revision exercises",
        "Past questions practice",
        "Group discussions and peer teaching",
      ],
      resources: [
        "All previous materials",
        "Past examination papers",
        "Revision guides",
        "Summary notes",
      ],
      assessment:
        "Continuous assessment and preparation for end-of-term examination",
    },
    {
      week: 11,
      topics: ["End of Term Examination"],
      objectives: [
        "Demonstrate mastery of term's learning objectives",
        "Apply mathematical concepts to solve problems",
        "Show understanding through written examination",
      ],
      activities: [
        "Final examination",
        "Examination review",
        "Result analysis and feedback",
      ],
      resources: [
        "Examination papers",
        "Answer sheets",
        "Mathematical instruments",
        "Calculators (where permitted)",
      ],
      assessment: "End-of-term examination (60% of total score)",
    },
  ],
};

// English Studies JSS 1 First Term Scheme of Work
export const englishJSS1Term1: SchemeOfWork = {
  id: "eng-jss1-term1",
  subjectId: "english",
  classLevelId: "jss1",
  termId: "term1",
  weeks: [
    {
      week: 1,
      topics: ["Introduction to English Language", "Parts of Speech - Nouns"],
      objectives: [
        "Understand the importance of English language",
        "Identify different types of nouns",
        "Use nouns correctly in sentences",
      ],
      activities: [
        "Introduction games and icebreakers",
        "Noun identification exercises",
        "Creating sentences with different types of nouns",
      ],
      resources: [
        "English textbook",
        "Dictionary",
        "Noun charts",
        "Worksheets",
      ],
      assessment: "Class participation and noun identification exercise",
    },
    {
      week: 2,
      topics: ["Parts of Speech - Pronouns", "Subject and Object Pronouns"],
      objectives: [
        "Identify personal pronouns",
        "Distinguish between subject and object pronouns",
        "Use pronouns correctly in speech and writing",
      ],
      activities: [
        "Pronoun substitution exercises",
        "Role-playing activities",
        "Sentence construction practice",
      ],
      resources: [
        "English textbook",
        "Pronoun reference charts",
        "Exercise books",
        "Audio materials",
      ],
      assessment: "Quiz on pronoun usage and sentence correction",
    },
    {
      week: 3,
      topics: ["Parts of Speech - Verbs", "Action and Linking Verbs"],
      objectives: [
        "Distinguish between action and linking verbs",
        "Identify verbs in sentences",
        "Understand verb tenses (present, past, future)",
      ],
      activities: [
        "Verb charades and games",
        "Tense transformation exercises",
        "Story writing using different tenses",
      ],
      resources: [
        "English textbook",
        "Verb charts",
        "Story books",
        "Writing materials",
      ],
      assessment: "Test on verb identification and tense usage",
    },
    {
      week: 4,
      topics: ["Parts of Speech - Adjectives", "Descriptive Writing"],
      objectives: [
        "Identify adjectives and their functions",
        "Use adjectives to enhance descriptions",
        "Write descriptive paragraphs",
      ],
      activities: [
        "Description games",
        "Adjective matching exercises",
        "Creative writing with focus on descriptions",
      ],
      resources: [
        "English textbook",
        "Picture cards",
        "Descriptive passages",
        "Art materials",
      ],
      assessment: "Descriptive writing assignment",
    },
    {
      week: 5,
      topics: ["Sentence Structure", "Simple and Compound Sentences"],
      objectives: [
        "Understand sentence structure",
        "Construct simple and compound sentences",
        "Identify subject and predicate",
      ],
      activities: [
        "Sentence building activities",
        "Combining simple sentences",
        "Grammar analysis exercises",
      ],
      resources: [
        "English textbook",
        "Grammar worksheets",
        "Sentence strips",
        "Markers",
      ],
      assessment: "Quiz on sentence structure and construction",
    },
    {
      week: 6,
      topics: ["Reading Comprehension", "Answering Questions"],
      objectives: [
        "Develop reading comprehension skills",
        "Answer different types of questions",
        "Extract information from texts",
      ],
      activities: [
        "Guided reading sessions",
        "Question and answer practice",
        "Discussion of reading passages",
      ],
      resources: [
        "Comprehension passages",
        "Question sheets",
        "Timer",
        "Highlighters",
      ],
      assessment: "Reading comprehension test",
    },
    {
      week: 7,
      topics: ["Composition Writing", "Narrative Essays"],
      objectives: [
        "Understand the structure of narrative essays",
        "Write coherent stories with beginning, middle, and end",
        "Use appropriate vocabulary and grammar",
      ],
      activities: [
        "Story planning and outlining",
        "Collaborative storytelling",
        "Peer review sessions",
      ],
      resources: [
        "English textbook",
        "Story prompts",
        "Planning sheets",
        "Sample essays",
      ],
      assessment: "Narrative essay writing",
    },
    {
      week: 8,
      topics: ["Vocabulary Development", "Synonyms and Antonyms"],
      objectives: [
        "Expand vocabulary through synonyms and antonyms",
        "Use context clues to determine word meanings",
        "Apply new vocabulary in writing and speech",
      ],
      activities: [
        "Word games and puzzles",
        "Synonym/antonym matching",
        "Vocabulary journals",
      ],
      resources: [
        "English textbook",
        "Dictionaries",
        "Vocabulary cards",
        "Word games",
      ],
      assessment: "Vocabulary quiz and application exercise",
    },
    {
      week: 9,
      topics: ["Letter Writing", "Informal Letters"],
      objectives: [
        "Understand the format of informal letters",
        "Write letters to friends and family",
        "Use appropriate tone and language",
      ],
      activities: [
        "Letter format practice",
        "Writing letters to classmates",
        "Sharing and feedback sessions",
      ],
      resources: [
        "English textbook",
        "Letter samples",
        "Writing paper",
        "Envelopes",
      ],
      assessment: "Informal letter writing assignment",
    },
    {
      week: 10,
      topics: ["Revision and Practice", "Examination Preparation"],
      objectives: [
        "Review all topics covered in the term",
        "Practice examination techniques",
        "Build confidence for assessment",
      ],
      activities: [
        "Comprehensive revision exercises",
        "Mock examinations",
        "Question and answer sessions",
      ],
      resources: [
        "All term materials",
        "Past questions",
        "Revision guides",
        "Sample papers",
      ],
      assessment: "Continuous assessment and mock examination",
    },
    {
      week: 11,
      topics: ["End of Term Examination"],
      objectives: [
        "Demonstrate understanding of English language concepts",
        "Apply grammar rules correctly",
        "Show proficiency in reading and writing",
      ],
      activities: [
        "Written examination",
        "Oral assessment",
        "Result review and feedback",
      ],
      resources: [
        "Examination papers",
        "Answer sheets",
        "Dictionaries",
        "Audio equipment",
      ],
      assessment: "End-of-term examination (comprehensive assessment)",
    },
  ],
};

// Basic Science JSS 1 First Term Scheme of Work
export const basicScienceJSS1Term1: SchemeOfWork = {
  id: "bsc-jss1-term1",
  subjectId: "basic-science",
  classLevelId: "jss1",
  termId: "term1",
  weeks: [
    {
      week: 1,
      topics: ["Introduction to Science", "Branches of Science"],
      objectives: [
        "Define science and its importance",
        "Identify the main branches of science",
        "Relate science to everyday life",
      ],
      activities: [
        "Science discovery discussion",
        "Branch identification activities",
        "Real-life science examples sharing",
      ],
      resources: [
        "Basic Science textbook",
        "Science magazines",
        "Chart of science branches",
        "Multimedia presentations",
      ],
      assessment: "Class discussion and branch identification quiz",
    },
    {
      week: 2,
      topics: ["Scientific Method", "Observation and Hypothesis"],
      objectives: [
        "Understand the steps of scientific method",
        "Make accurate observations",
        "Form testable hypotheses",
      ],
      activities: [
        "Simple experiments and observations",
        "Hypothesis formation practice",
        "Recording observations systematically",
      ],
      resources: [
        "Basic Science textbook",
        "Observation sheets",
        "Simple laboratory equipment",
        "Notebooks",
      ],
      assessment: "Observation and hypothesis writing exercise",
    },
    {
      week: 3,
      topics: ["Matter and Its Properties", "States of Matter"],
      objectives: [
        "Define matter and identify its properties",
        "Distinguish between solid, liquid, and gas",
        "Explain changes of state",
      ],
      activities: [
        "Matter identification activities",
        "State change demonstrations",
        "Properties comparison exercises",
      ],
      resources: [
        "Basic Science textbook",
        "Various materials (ice, water, etc.)",
        "Thermometer",
        "Observation charts",
      ],
      assessment: "Test on matter properties and states",
    },
    {
      week: 4,
      topics: ["Elements, Compounds, and Mixtures"],
      objectives: [
        "Differentiate between elements, compounds, and mixtures",
        "Give examples of each category",
        "Understand basic separation techniques",
      ],
      activities: [
        "Classification exercises",
        "Simple separation experiments",
        "Real-world examples identification",
      ],
      resources: [
        "Basic Science textbook",
        "Various substances for classification",
        "Separation apparatus",
        "Reference charts",
      ],
      assessment: "Classification and separation quiz",
    },
    {
      week: 5,
      topics: ["Living and Non-living Things", "Characteristics of Life"],
      objectives: [
        "Distinguish between living and non-living things",
        "List characteristics of living things",
        "Identify life processes",
      ],
      activities: [
        "Nature walk and observation",
        "Living/non-living classification games",
        "Life process identification activities",
      ],
      resources: [
        "Basic Science textbook",
        "Pictures of various objects",
        "Magnifying glasses",
        "Classification charts",
      ],
      assessment: "Living vs non-living identification test",
    },
    {
      week: 6,
      topics: ["Plant and Animal Cells", "Cell Structure"],
      objectives: [
        "Identify basic cell structures",
        "Compare plant and animal cells",
        "Understand the functions of cell parts",
      ],
      activities: [
        "Microscope observation of cells",
        "Cell drawing and labeling",
        "Comparison chart creation",
      ],
      resources: [
        "Basic Science textbook",
        "Microscopes",
        "Prepared slides",
        "Drawing materials",
      ],
      assessment: "Cell structure drawing and labeling exercise",
    },
    {
      week: 7,
      topics: ["Energy and Its Forms", "Sources of Energy"],
      objectives: [
        "Define energy and identify its forms",
        "Distinguish between renewable and non-renewable energy",
        "Understand energy transformations",
      ],
      activities: [
        "Energy form identification activities",
        "Energy source investigations",
        "Simple energy transformation experiments",
      ],
      resources: [
        "Basic Science textbook",
        "Pictures of energy sources",
        "Simple machines for demonstrations",
        "Energy charts",
      ],
      assessment: "Energy forms and sources quiz",
    },
    {
      week: 8,
      topics: ["Force and Motion", "Types of Forces"],
      objectives: [
        "Define force and identify different types",
        "Understand the relationship between force and motion",
        "Demonstrate simple machines",
      ],
      activities: [
        "Force demonstration experiments",
        "Simple machine investigations",
        "Motion observation activities",
      ],
      resources: [
        "Basic Science textbook",
        "Spring balances",
        "Simple machines (pulleys, levers)",
        "Measuring tools",
      ],
      assessment: "Force and motion practical test",
    },
    {
      week: 9,
      topics: ["Water Cycle", "Weather and Climate"],
      objectives: [
        "Explain the water cycle process",
        "Distinguish between weather and climate",
        "Identify factors affecting weather",
      ],
      activities: [
        "Water cycle model creation",
        "Weather observation and recording",
        "Climate data analysis",
      ],
      resources: [
        "Basic Science textbook",
        "Weather instruments",
        "Water cycle diagrams",
        "Local weather data",
      ],
      assessment: "Water cycle and weather patterns test",
    },
    {
      week: 10,
      topics: ["Revision and Project Work"],
      objectives: [
        "Review all topics covered in the term",
        "Apply scientific knowledge in projects",
        "Demonstrate understanding through presentations",
      ],
      activities: [
        "Comprehensive revision exercises",
        "Science project presentations",
        "Peer teaching sessions",
      ],
      resources: [
        "All term materials",
        "Project materials",
        "Presentation equipment",
        "Evaluation rubrics",
      ],
      assessment: "Project presentation and revision exercises",
    },
    {
      week: 11,
      topics: ["End of Term Examination"],
      objectives: [
        "Demonstrate mastery of basic science concepts",
        "Apply scientific methods in problem-solving",
        "Show understanding through written and practical examination",
      ],
      activities: [
        "Written examination",
        "Practical examination",
        "Result analysis and feedback",
      ],
      resources: [
        "Examination papers",
        "Laboratory equipment",
        "Answer sheets",
        "Assessment sheets",
      ],
      assessment: "Comprehensive end-of-term examination",
    },
  ],
};

// Export all schemes
export const mockSchemeOfWork = {
  mathematicsJSS1Term1,
  englishJSS1Term1,
  basicScienceJSS1Term1,
};
