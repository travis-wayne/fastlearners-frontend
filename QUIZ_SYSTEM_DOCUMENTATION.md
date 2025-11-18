# Quiz System Documentation

## Overview

This document describes the modern quiz system implementation for the Fast Learner platform. The system includes quiz management, real-time quiz taking, leaderboards, competitor tracking, and comprehensive feedback mechanisms.

## System Architecture

### Components Structure

```
components/quiz/
├── Timer.tsx              # Countdown timer with visual progress
├── ScoreDisplay.tsx       # Score visualization with passing indicators
├── Leaderboard.tsx        # Top performers ranking
├── CompetitorsList.tsx    # Active competitors on the platform
├── QuestionModal.tsx      # Modal-based question interface
└── FeedbackMessage.tsx    # Success/error feedback messages
```

### Pages Structure

```
app/(protected)/dashboard/quizzes/
├── page.tsx                    # Quiz list with filters and stats
├── [id]/
│   ├── page.tsx               # Quiz detail/start page
│   ├── take/
│   │   └── page.tsx           # Quiz taking interface
│   └── results/
│       └── page.tsx           # Detailed results and review
```

## Data Models

### Quiz Model

```typescript
interface Quiz {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName?: string;
  classLevel: string;
  term: string;
  difficulty: "easy" | "medium" | "hard";
  scope: "topic" | "multi-topic" | "midterm" | "final";
  timeLimit: number;           // in minutes, 0 = unlimited
  totalQuestions: number;
  totalPoints: number;
  passingScore: number;         // percentage (0-100)
  maxAttempts: number;          // 0 = unlimited
  isAvailable: boolean;
  dueDate?: string;            // ISO date string
  instructions: string;
  createdAt: string;
  updatedAt: string;
  questions: QuizQuestion[];
}
```

### Quiz Question Model

```typescript
interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "fill-blank";
  options?: string[];           // For multiple-choice
  correctAnswer: string | number;
  points: number;
  explanation?: string;
  feedback?: {
    positive: string;
    negative: string;
  };
}
```

### Quiz Attempt Model

```typescript
interface QuizAttempt {
  attemptId: string;
  quizId: string;
  userId: string;
  startedAt: string;            // ISO date string
  completedAt?: string;         // ISO date string (null if in progress)
  score?: number;
  totalPoints: number;
  percentage?: number;
  timeTaken?: number;           // in seconds
  answers: Record<string, string | number>;
  status: "in-progress" | "completed" | "abandoned";
}
```

### Leaderboard Entry Model

```typescript
interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeTaken: number;            // in seconds
  completedAt: string;           // ISO date string
  quizId: string;
  isCurrentUser?: boolean;
}
```

### Competitor Model

```typescript
interface Competitor {
  userId: string;
  username: string;
  avatar?: string;
  totalQuizzesCompleted: number;
  averageScore: number;
  totalPoints: number;
  rank: number;
  badges: string[];
  isOnline: boolean;
  lastActive: string;           // ISO date string
}
```

## API Endpoints

### Base URL
All endpoints should be prefixed with `/api/quizzes` or `/api/quiz` depending on your backend structure.

### 1. Get Quizzes List

**Endpoint:** `GET /api/quizzes`

**Description:** Retrieve a list of available quizzes with optional filtering.

**Query Parameters:**
- `classLevel` (string, optional): Filter by class level
- `term` (string, optional): Filter by term
- `subjectId` (string, optional): Filter by subject
- `difficulty` (string, optional): Filter by difficulty (easy/medium/hard)
- `scope` (string, optional): Filter by scope (topic/multi-topic/midterm/final)
- `status` (string, optional): Filter by status (available/completed/pending)

**Response:**
```json
{
  "success": true,
  "data": {
    "quizzes": [
      {
        "id": "quiz-001",
        "title": "Mathematics Fundamentals - Algebra",
        "description": "...",
        "subjectId": "math",
        "classLevel": "JSS 1",
        "term": "First Term",
        "difficulty": "easy",
        "scope": "topic",
        "timeLimit": 30,
        "totalQuestions": 10,
        "totalPoints": 100,
        "passingScore": 60,
        "maxAttempts": 3,
        "isAvailable": true,
        "dueDate": "2024-12-31T23:59:59Z",
        "instructions": "...",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-20T14:30:00Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 20
  }
}
```

### 2. Get Quiz Details

**Endpoint:** `GET /api/quizzes/:quizId`

**Description:** Retrieve detailed information about a specific quiz, including questions.

**Response:**
```json
{
  "success": true,
  "data": {
    "quiz": {
      "id": "quiz-001",
      "title": "Mathematics Fundamentals - Algebra",
      "description": "...",
      "questions": [
        {
          "id": "q1",
          "question": "What is the value of x?",
          "type": "multiple-choice",
          "options": ["5", "10", "15", "20"],
          "correctAnswer": 0,
          "points": 10,
          "explanation": "...",
          "feedback": {
            "positive": "Great job!",
            "negative": "Try again."
          }
        }
      ]
    },
    "userAttempts": [
      {
        "attemptId": "attempt-001",
        "status": "completed",
        "score": 85,
        "completedAt": "2024-01-25T14:30:00Z"
      }
    ]
  }
}
```

### 3. Start Quiz Attempt

**Endpoint:** `POST /api/quizzes/:quizId/attempts`

**Description:** Start a new quiz attempt. Creates an attempt record and returns attempt ID.

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attemptId": "attempt-001",
    "quizId": "quiz-001",
    "startedAt": "2024-01-25T18:00:00Z",
    "status": "in-progress",
    "timeLimit": 1800,
    "questions": [
      {
        "id": "q1",
        "question": "...",
        "type": "multiple-choice",
        "options": [...],
        "points": 10
      }
    ]
  }
}
```

### 4. Save Answer

**Endpoint:** `PUT /api/quizzes/:quizId/attempts/:attemptId/answers`

**Description:** Save or update an answer for a specific question in an active attempt.

**Request Body:**
```json
{
  "questionId": "q1",
  "answer": "5"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "questionId": "q1",
    "answer": "5",
    "savedAt": "2024-01-25T18:05:00Z"
  }
}
```

### 5. Submit Quiz Attempt

**Endpoint:** `POST /api/quizzes/:quizId/attempts/:attemptId/submit`

**Description:** Submit a completed quiz attempt. Calculates score and returns results.

**Request Body:**
```json
{
  "answers": {
    "q1": "5",
    "q2": "x + 12",
    "q3": "5"
  },
  "timeTaken": 1250
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attemptId": "attempt-001",
    "quizId": "quiz-001",
    "score": 85,
    "totalPoints": 100,
    "percentage": 85,
    "passed": true,
    "timeTaken": 1250,
    "completedAt": "2024-01-25T18:20:50Z",
    "results": {
      "correct": 8,
      "incorrect": 2,
      "unanswered": 0
    }
  }
}
```

### 6. Get Quiz Results

**Endpoint:** `GET /api/quizzes/:quizId/attempts/:attemptId/results`

**Description:** Retrieve detailed results for a completed quiz attempt, including question-by-question breakdown.

**Response:**
```json
{
  "success": true,
  "data": {
    "attempt": {
      "attemptId": "attempt-001",
      "quizId": "quiz-001",
      "score": 85,
      "totalPoints": 100,
      "percentage": 85,
      "passed": true,
      "timeTaken": 1250,
      "completedAt": "2024-01-25T18:20:50Z"
    },
    "questions": [
      {
        "id": "q1",
        "question": "...",
        "userAnswer": "5",
        "correctAnswer": "5",
        "isCorrect": true,
        "points": 10,
        "explanation": "..."
      }
    ]
  }
}
```

### 7. Get Leaderboard

**Endpoint:** `GET /api/quizzes/:quizId/leaderboard`

**Description:** Retrieve the leaderboard for a specific quiz.

**Query Parameters:**
- `limit` (number, optional): Number of entries to return (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user-001",
        "username": "Alex Johnson",
        "avatar": "https://...",
        "score": 95,
        "totalPoints": 100,
        "percentage": 95,
        "timeTaken": 1250,
        "completedAt": "2024-01-25T14:30:00Z"
      }
    ],
    "total": 150,
    "currentUserRank": 5
  }
}
```

### 8. Get Competitors

**Endpoint:** `GET /api/quizzes/competitors`

**Description:** Retrieve the list of top competitors across all quizzes.

**Query Parameters:**
- `limit` (number, optional): Number of competitors to return (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "competitors": [
      {
        "userId": "user-001",
        "username": "Alex Johnson",
        "avatar": "https://...",
        "totalQuizzesCompleted": 12,
        "averageScore": 92,
        "totalPoints": 1150,
        "rank": 1,
        "badges": ["Top Performer", "Speed Demon"],
        "isOnline": true,
        "lastActive": "2024-01-25T18:30:00Z"
      }
    ]
  }
}
```

### 9. Get User Quiz Statistics

**Endpoint:** `GET /api/quizzes/stats`

**Description:** Retrieve statistics for the current user's quiz performance.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalQuizzes": 25,
    "completedQuizzes": 12,
    "averageScore": 85,
    "totalPoints": 1200,
    "passedQuizzes": 10,
    "failedQuizzes": 2,
    "bestScore": 98,
    "recentAttempts": [
      {
        "quizId": "quiz-001",
        "quizTitle": "...",
        "score": 85,
        "percentage": 85,
        "completedAt": "2024-01-25T18:20:50Z"
      }
    ]
  }
}
```

### 10. Get User Attempts for Quiz

**Endpoint:** `GET /api/quizzes/:quizId/attempts`

**Description:** Retrieve all attempts by the current user for a specific quiz.

**Response:**
```json
{
  "success": true,
  "data": {
    "attempts": [
      {
        "attemptId": "attempt-001",
        "startedAt": "2024-01-25T18:00:00Z",
        "completedAt": "2024-01-25T18:20:50Z",
        "score": 85,
        "percentage": 85,
        "passed": true,
        "timeTaken": 1250
      }
    ],
    "bestScore": 85,
    "attemptsRemaining": 2
  }
}
```

## Error Responses

All endpoints should return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "QUIZ_NOT_FOUND",
    "message": "The requested quiz does not exist.",
    "details": {}
  }
}
```

### Common Error Codes

- `QUIZ_NOT_FOUND` (404): Quiz does not exist
- `QUIZ_NOT_AVAILABLE` (403): Quiz is not available for the user
- `MAX_ATTEMPTS_REACHED` (403): User has reached maximum attempts
- `ATTEMPT_NOT_FOUND` (404): Quiz attempt does not exist
- `ATTEMPT_ALREADY_COMPLETED` (400): Attempt has already been submitted
- `INVALID_ANSWER` (400): Answer format is invalid
- `TIME_LIMIT_EXCEEDED` (400): Time limit has been exceeded
- `UNAUTHORIZED` (401): User is not authenticated
- `FORBIDDEN` (403): User does not have permission

## Frontend Integration

### Loading Quiz Data

```typescript
// Load quizzes list
const response = await fetch('/api/quizzes?classLevel=JSS 1&term=First Term');
const data = await response.json();
const quizzes = data.data.quizzes;

// Load quiz details
const quizResponse = await fetch(`/api/quizzes/${quizId}`);
const quizData = await quizResponse.json();
const quiz = quizData.data.quiz;
```

### Starting a Quiz

```typescript
// Start quiz attempt
const attemptResponse = await fetch(`/api/quizzes/${quizId}/attempts`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});
const attemptData = await attemptResponse.json();
const attemptId = attemptData.data.attemptId;
```

### Saving Answers

```typescript
// Save answer
await fetch(`/api/quizzes/${quizId}/attempts/${attemptId}/answers`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    questionId: 'q1',
    answer: '5'
  })
});
```

### Submitting Quiz

```typescript
// Submit quiz
const submitResponse = await fetch(
  `/api/quizzes/${quizId}/attempts/${attemptId}/submit`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      answers: {
        q1: '5',
        q2: 'x + 12'
      },
      timeTaken: 1250
    })
  }
);
const results = await submitResponse.json();
```

## Features

### 1. Quiz Flow
- Pre-quiz information page with instructions
- Modal-based question interface
- Real-time answer saving
- Progress tracking
- Timer with visual warnings
- Question navigation
- Immediate feedback option

### 2. Scoring System
- Point-based scoring
- Percentage calculation
- Passing score validation
- Best score tracking
- Attempt history

### 3. Leaderboard
- Real-time rankings
- Time-based sorting
- Score-based sorting
- Current user highlighting
- Top 3 special styling

### 4. Competitors
- Active user tracking
- Online status indicators
- Badge system
- Overall statistics
- Recent activity

### 5. Feedback System
- Positive feedback for correct answers
- Constructive negative feedback
- Detailed explanations
- Question review after completion

## Security Considerations

1. **Authentication**: All endpoints require user authentication
2. **Authorization**: Users can only access their own attempts
3. **Time Validation**: Server should validate time limits
4. **Answer Validation**: Server should validate answer formats
5. **Attempt Limits**: Server should enforce max attempts
6. **Rate Limiting**: Prevent abuse of API endpoints

## Performance Optimization

1. **Caching**: Cache quiz lists and leaderboards
2. **Pagination**: Implement pagination for large datasets
3. **Lazy Loading**: Load questions on demand
4. **Optimistic Updates**: Update UI before server confirmation
5. **Debouncing**: Debounce answer saves to reduce API calls

## Testing Checklist

- [ ] Quiz list loading and filtering
- [ ] Quiz detail page display
- [ ] Starting a quiz attempt
- [ ] Answer selection and saving
- [ ] Timer functionality
- [ ] Quiz submission
- [ ] Results display
- [ ] Leaderboard updates
- [ ] Competitor list updates
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Accessibility

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live leaderboard updates
2. **Question Types**: Add more question types (essay, matching, etc.)
3. **Quiz Analytics**: Detailed analytics dashboard
4. **Social Features**: Share results, challenge friends
5. **Adaptive Quizzes**: Difficulty adjustment based on performance
6. **Offline Support**: PWA capabilities for offline quiz taking
7. **Question Bank**: Random question selection from question banks
8. **Time-based Challenges**: Daily/weekly quiz challenges

