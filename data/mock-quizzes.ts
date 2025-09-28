export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | number; // answer index for MC, string for others
  explanation?: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  startedAt: string;
  completedAt?: string;
  score: number;
  totalPoints: number;
  timeSpent: number; // in seconds
  answers: Record<string, string | number>; // questionId -> answer
  passed: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  classLevel: string;
  term: string;
  topicId?: string;
  weekId?: string;
  scope: 'topic' | 'multi-topic' | 'term' | 'midterm' | 'final';
  timeLimit: number; // in minutes, 0 for no limit
  totalQuestions: number;
  totalPoints: number;
  passingScore: number; // percentage
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  attempts: QuizAttempt[];
  maxAttempts: number; // 0 for unlimited
  isAvailable: boolean;
  dueDate?: string;
  instructions: string;
  createdAt: string;
}

export const mockQuizzes: Quiz[] = [
  {
    id: 'math-jss1-t1-whole-numbers-quiz',
    title: 'Whole Numbers Quiz',
    description: 'Test your understanding of whole numbers and their properties',
    subjectId: 'mathematics',
    classLevel: 'JSS1',
    term: 'Term1',
    topicId: 'whole-numbers',
    weekId: 'week-1',
    scope: 'topic',
    timeLimit: 15,
    totalQuestions: 10,
    totalPoints: 20,
    passingScore: 70,
    difficulty: 'easy',
    maxAttempts: 3,
    isAvailable: true,
    instructions: 'Answer all questions. Each question carries 2 marks. You have 15 minutes to complete this quiz.',
    createdAt: '2024-01-10T08:00:00Z',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Which of the following is NOT a whole number?',
        options: ['0', '5', '-3', '12'],
        correctAnswer: 2,
        explanation: 'Whole numbers are non-negative integers starting from 0. -3 is negative, so it is not a whole number.',
        points: 2
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'What is the smallest whole number?',
        options: ['1', '0', '-1', '2'],
        correctAnswer: 1,
        explanation: 'The smallest whole number is 0.',
        points: 2
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Arrange these numbers in ascending order: 25, 3, 17, 8',
        options: ['25, 17, 8, 3', '3, 8, 17, 25', '17, 25, 3, 8', '8, 3, 17, 25'],
        correctAnswer: 1,
        explanation: 'Ascending order means from smallest to largest: 3, 8, 17, 25',
        points: 2
      },
      {
        id: 'q4',
        type: 'true-false',
        question: 'All counting numbers are whole numbers.',
        correctAnswer: 'True',
        explanation: 'Counting numbers (1, 2, 3, ...) are all whole numbers, but whole numbers also include 0.',
        points: 2
      },
      {
        id: 'q5',
        type: 'fill-blank',
        question: 'The whole numbers between 15 and 18 are: 16, __, 17',
        correctAnswer: '16',
        explanation: 'The whole numbers between 15 and 18 are 16 and 17.',
        points: 2
      },
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'In the number 247, what is the place value of 4?',
        options: ['Units', 'Tens', 'Hundreds', 'Thousands'],
        correctAnswer: 1,
        explanation: 'In 247, the digit 4 is in the tens place.',
        points: 2
      },
      {
        id: 'q7',
        type: 'multiple-choice',
        question: 'What is 356 + 127?',
        options: ['483', '473', '493', '463'],
        correctAnswer: 0,
        explanation: '356 + 127 = 483',
        points: 2
      },
      {
        id: 'q8',
        type: 'true-false',
        question: 'The number 0 is neither positive nor negative.',
        correctAnswer: 'True',
        explanation: 'Zero is considered neither positive nor negative.',
        points: 2
      },
      {
        id: 'q9',
        type: 'multiple-choice',
        question: 'Which is the largest whole number?',
        options: ['999', '1000', 'There is no largest whole number', '9999'],
        correctAnswer: 2,
        explanation: 'Whole numbers continue infinitely, so there is no largest whole number.',
        points: 2
      },
      {
        id: 'q10',
        type: 'fill-blank',
        question: 'Complete the pattern: 5, 10, 15, __, 25',
        correctAnswer: '20',
        explanation: 'This is a pattern of multiples of 5: 5, 10, 15, 20, 25',
        points: 2
      }
    ],
    attempts: [
      {
        id: 'attempt-1',
        startedAt: '2024-01-15T10:00:00Z',
        completedAt: '2024-01-15T10:12:00Z',
        score: 16,
        totalPoints: 20,
        timeSpent: 720,
        answers: { 'q1': 2, 'q2': 1, 'q3': 1, 'q4': 'True', 'q5': '16', 'q6': 1, 'q7': 0, 'q8': 'True', 'q9': 1, 'q10': '20' },
        passed: true
      }
    ]
  },
  {
    id: 'eng-jss1-t1-speech-sounds-quiz',
    title: 'Speech Sounds Quiz',
    description: 'Test your knowledge of English speech sounds and pronunciation',
    subjectId: 'english',
    classLevel: 'JSS1',
    term: 'Term1',
    topicId: 'speech-sounds',
    weekId: 'week-1',
    scope: 'topic',
    timeLimit: 20,
    totalQuestions: 8,
    totalPoints: 16,
    passingScore: 75,
    difficulty: 'easy',
    maxAttempts: 2,
    isAvailable: true,
    instructions: 'Listen carefully to pronunciation and answer all questions. Each question carries 2 marks.',
    createdAt: '2024-01-12T09:00:00Z',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'How many vowel sounds are there in English?',
        options: ['3', '5', '7', '12'],
        correctAnswer: 1,
        explanation: 'English has 5 basic vowel sounds: a, e, i, o, u',
        points: 2
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Which of these is a consonant sound?',
        options: ['a', 'e', 'b', 'o'],
        correctAnswer: 2,
        explanation: 'B is a consonant sound, while a, e, and o are vowel sounds.',
        points: 2
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'The letter Y can sometimes act as a vowel.',
        correctAnswer: 'True',
        explanation: 'Y can act as a vowel in words like "my" or "gym".',
        points: 2
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'In the word "cat", which sound comes first?',
        options: ['a', 'c', 't', 'at'],
        correctAnswer: 1,
        explanation: 'The word "cat" starts with the consonant sound /c/',
        points: 2
      },
      {
        id: 'q5',
        type: 'fill-blank',
        question: 'The vowel sound in "bat" is ____',
        correctAnswer: 'a',
        explanation: 'The vowel sound in "bat" is /a/',
        points: 2
      },
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'Which word has the same vowel sound as "see"?',
        options: ['sit', 'bet', 'me', 'cat'],
        correctAnswer: 2,
        explanation: 'Both "see" and "me" have the long /e/ sound.',
        points: 2
      },
      {
        id: 'q7',
        type: 'true-false',
        question: 'All letters are sounds.',
        correctAnswer: 'False',
        explanation: 'Letters are symbols that represent sounds, but they are not sounds themselves.',
        points: 2
      },
      {
        id: 'q8',
        type: 'multiple-choice',
        question: 'How do you produce vowel sounds?',
        options: ['By blocking air flow', 'By allowing air to flow freely', 'By whispering', 'By shouting'],
        correctAnswer: 1,
        explanation: 'Vowel sounds are produced by allowing air to flow freely through the mouth without obstruction.',
        points: 2
      }
    ],
    attempts: []
  },
  {
    id: 'bs-jss1-t1-living-things-quiz',
    title: 'Characteristics of Living Things Quiz',
    description: 'Test your understanding of what makes something alive',
    subjectId: 'basic-science',
    classLevel: 'JSS1',
    term: 'Term1',
    topicId: 'living-things',
    weekId: 'week-1',
    scope: 'topic',
    timeLimit: 25,
    totalQuestions: 12,
    totalPoints: 24,
    passingScore: 70,
    difficulty: 'medium',
    maxAttempts: 2,
    isAvailable: true,
    instructions: 'Answer all questions about living and non-living things. Think carefully about the characteristics of life.',
    createdAt: '2024-01-14T11:00:00Z',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Which of these is NOT a characteristic of living things?',
        options: ['Movement', 'Growth', 'Being made of metal', 'Reproduction'],
        correctAnswer: 2,
        explanation: 'Living things are made of cells, not metal. Metal is a characteristic of non-living things.',
        points: 2
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'All living things need _____ to survive.',
        options: ['air only', 'water only', 'food only', 'air, water, and food'],
        correctAnswer: 3,
        explanation: 'Living things need air (oxygen), water, and food to survive and carry out life processes.',
        points: 2
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'Plants are living things.',
        correctAnswer: 'True',
        explanation: 'Plants are living things because they grow, reproduce, respond to stimuli, and carry out other life processes.',
        points: 2
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'Which of these can reproduce?',
        options: ['A rock', 'A car', 'A dog', 'A chair'],
        correctAnswer: 2,
        explanation: 'Only a dog can reproduce (have offspring). This is a characteristic of living things.',
        points: 2
      },
      {
        id: 'q5',
        type: 'fill-blank',
        question: 'Living things respond to changes in their _______.',
        correctAnswer: 'environment',
        explanation: 'Living things respond to changes in their environment. This is called response to stimuli.',
        points: 2
      },
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'What do living things do to get rid of waste products?',
        options: ['Excretion', 'Nutrition', 'Respiration', 'Movement'],
        correctAnswer: 0,
        explanation: 'Excretion is the process by which living things remove waste products from their bodies.',
        points: 2
      },
      {
        id: 'q7',
        type: 'true-false',
        question: 'All living things must be able to move from place to place.',
        correctAnswer: 'False',
        explanation: 'Not all living things can move from place to place (like plants), but they can still show movement (like growing toward light).',
        points: 2
      },
      {
        id: 'q8',
        type: 'multiple-choice',
        question: 'Which of these is an example of growth in living things?',
        options: ['A balloon getting bigger', 'A puppy becoming a dog', 'Ice melting', 'A car rusting'],
        correctAnswer: 1,
        explanation: 'A puppy growing into a dog is biological growth, a characteristic of living things.',
        points: 2
      },
      {
        id: 'q9',
        type: 'multiple-choice',
        question: 'What is the basic unit of all living things?',
        options: ['Atom', 'Cell', 'Molecule', 'Organ'],
        correctAnswer: 1,
        explanation: 'The cell is the basic unit of all living things.',
        points: 2
      },
      {
        id: 'q10',
        type: 'fill-blank',
        question: 'The process by which living things make more of their kind is called _______.',
        correctAnswer: 'reproduction',
        explanation: 'Reproduction is the process by which living things produce offspring.',
        points: 2
      },
      {
        id: 'q11',
        type: 'true-false',
        question: 'Fire is a living thing because it grows and moves.',
        correctAnswer: 'False',
        explanation: 'Although fire appears to grow and move, it is not alive because it does not have cells, cannot reproduce, or carry out other life processes.',
        points: 2
      },
      {
        id: 'q12',
        type: 'multiple-choice',
        question: 'Which life process involves taking in oxygen and releasing carbon dioxide?',
        options: ['Nutrition', 'Respiration', 'Excretion', 'Growth'],
        correctAnswer: 1,
        explanation: 'Respiration is the process of taking in oxygen and releasing carbon dioxide.',
        points: 2
      }
    ],
    attempts: [
      {
        id: 'attempt-1',
        startedAt: '2024-01-18T14:00:00Z',
        completedAt: '2024-01-18T14:18:00Z',
        score: 18,
        totalPoints: 24,
        timeSpent: 1080,
        answers: { 'q1': 2, 'q2': 3, 'q3': 'True', 'q4': 2, 'q5': 'environment', 'q6': 0, 'q7': 'False', 'q8': 1, 'q9': 1, 'q10': 'reproduction', 'q11': 'True', 'q12': 1 },
        passed: true
      }
    ]
  },
  {
    id: 'math-jss1-t1-midterm',
    title: 'JSS1 Mathematics Midterm Exam',
    description: 'Comprehensive test covering topics from the first half of Term 1',
    subjectId: 'mathematics',
    classLevel: 'JSS1',
    term: 'Term1',
    scope: 'midterm',
    timeLimit: 60,
    totalQuestions: 20,
    totalPoints: 40,
    passingScore: 60,
    difficulty: 'medium',
    maxAttempts: 1,
    isAvailable: false,
    dueDate: '2024-02-15T23:59:59Z',
    instructions: 'This is your midterm examination. You have 60 minutes to complete 20 questions. Read each question carefully and show your working where necessary.',
    createdAt: '2024-01-20T08:00:00Z',
    questions: [], // Would have 20 questions covering multiple topics
    attempts: []
  }
];

// Helper functions
export function getQuizzesBySubject(subjectId: string): Quiz[] {
  return mockQuizzes.filter(quiz => quiz.subjectId === subjectId);
}

export function getQuizzesByClassAndTerm(classLevel: string, term: string): Quiz[] {
  return mockQuizzes.filter(quiz => 
    quiz.classLevel === classLevel && quiz.term === term
  );
}

export function getAvailableQuizzes(): Quiz[] {
  return mockQuizzes.filter(quiz => quiz.isAvailable);
}

export function getCompletedQuizzes(): Quiz[] {
  return mockQuizzes.filter(quiz => 
    quiz.attempts.some(attempt => attempt.completedAt)
  );
}

export function getPendingQuizzes(): Quiz[] {
  return mockQuizzes.filter(quiz => 
    quiz.isAvailable && !quiz.attempts.some(attempt => attempt.completedAt)
  );
}

export function getQuizById(id: string): Quiz | undefined {
  return mockQuizzes.find(quiz => quiz.id === id);
}

export function getQuizStats() {
  const total = mockQuizzes.length;
  const available = getAvailableQuizzes().length;
  const completed = getCompletedQuizzes().length;
  const pending = getPendingQuizzes().length;
  const passed = mockQuizzes.filter(quiz => 
    quiz.attempts.some(attempt => attempt.passed)
  ).length;

  return {
    total,
    available,
    completed,
    pending,
    passed,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    passRate: completed > 0 ? Math.round((passed / completed) * 100) : 0
  };
}

export function getBestScore(quizId: string): QuizAttempt | undefined {
  const quiz = getQuizById(quizId);
  if (!quiz || quiz.attempts.length === 0) return undefined;
  
  return quiz.attempts.reduce((best, current) => 
    current.score > best.score ? current : best
  );
}

export function getLatestAttempt(quizId: string): QuizAttempt | undefined {
  const quiz = getQuizById(quizId);
  if (!quiz || quiz.attempts.length === 0) return undefined;
  
  return quiz.attempts.sort((a, b) => 
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )[0];
}