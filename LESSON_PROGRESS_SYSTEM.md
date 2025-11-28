# Lesson Progress System - Technical Documentation

## Overview

This document outlines the enhanced lesson progress tracking system for the FastLearners platform. It covers both frontend implementation and backend API requirements for a robust, production-ready solution.

---

## Table of Contents

1. [Current Implementation](#current-implementation)
2. [Proposed Enhancements](#proposed-enhancements)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend API Specification](#backend-api-specification)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Testing Strategy](#testing-strategy)

---

## Current Implementation

### Frontend Status ✅

The current frontend implementation includes:

- **Toast notifications** using `sonner` for user feedback
- **Try Again functionality** for failed exercises
- **Graceful error handling** for missing check markers (400 errors)
- **Null safety** for inconsistent backend data structures
- **Progress tracking** with completion percentages

### Known Issues 🔧

1. **Shared test account** - Multiple developers using the same account causes conflicts
2. **Inconsistent data structures** - Backend returns different formats for different subjects:
   - `points` can be `string[]` or `object`
   - `solution_steps` can be `array` or `null`
   - `check` response structure varies
3. **"Already answered" errors** - No way to reset progress for testing
4. **Missing check markers** - Some concepts don't have check markers in the database

---

## Proposed Enhancements

### 1. State-Based Architecture

Instead of simple boolean completion flags, implement a comprehensive state system:

```typescript
enum ExerciseState {
  NOT_ATTEMPTED = 'not_attempted',
  IN_PROGRESS = 'in_progress',
  COMPLETED_CORRECT = 'completed_correct',
  COMPLETED_INCORRECT = 'completed_incorrect',
  LOCKED = 'locked'
}

enum SectionState {
  LOCKED = 'locked',
  AVAILABLE = 'available',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

enum LessonState {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  LOCKED = 'locked'
}
```

### 2. Progressive Disclosure

- Lock future sections until prerequisites are met
- Show clear progress indicators
- Persist state across sessions
- Allow navigation to completed sections

### 3. Idempotent Operations

Backend should handle:
- Multiple submissions of the same answer without errors
- Retry logic without creating duplicate records
- State reconciliation when frontend/backend are out of sync

---

## Frontend Architecture

### State Management (Zustand Store)

```typescript
interface LessonProgressState {
  // Current lesson data
  selectedLesson: LessonContent | null;
  
  // Progress tracking
  exerciseStates: Record<number, ExerciseState>;
  sectionStates: Record<string, SectionState>;
  completedSections: string[];
  currentStepIndex: number;
  progress: number;
  
  // Attempt tracking
  exerciseAttempts: Record<number, {
    attempts: number;
    firstAttemptAt: string;
    lastAttemptAt: string;
    userAnswers: string[];
  }>;
  
  // Actions
  submitExerciseAnswer: (exerciseId: number, answer: string) => Promise<ExerciseResult>;
  checkSectionCompletion: (sectionId: string) => Promise<boolean>;
  resetProgress: (lessonId: number) => Promise<void>;
  syncProgress: () => Promise<void>;
}
```

### Optimistic UI Updates

```typescript
// Update UI immediately
setExerciseState(exerciseId, 'in_progress');

// Submit to backend
const result = await submitAnswer(exerciseId, answer);

// Update based on result
if (result.success) {
  setExerciseState(exerciseId, result.is_correct ? 'completed_correct' : 'completed_incorrect');
} else {
  // Rollback on error
  setExerciseState(exerciseId, 'not_attempted');
  showErrorToast(result.message);
}
```

### Offline Support (Future Enhancement)

```typescript
// Cache progress locally using IndexedDB
interface CachedProgress {
  lessonId: number;
  exerciseStates: Record<number, ExerciseState>;
  lastSyncedAt: string;
  pendingActions: PendingAction[];
}

// Sync when connection is restored
async function syncOfflineProgress() {
  const cached = await getFromIndexedDB('lesson_progress');
  const synced = await syncWithBackend(cached);
  await saveToIndexedDB('lesson_progress', synced);
}
```

---

## Backend API Specification

### 1. Exercise Answer Submission

**Endpoint:** `POST /api/v1/lessons/check-exercise-answer`

**Current Request:**
```json
{
  "exercise_id": 5,
  "answer": "B"
}
```

**Enhanced Request:**
```json
{
  "exercise_id": 5,
  "answer": "B",
  "attempt_number": 2,
  "time_spent_seconds": 45
}
```

**Current Response (Success):**
```json
{
  "success": true,
  "message": "Great job! You scored 50% on your 1st attempt.",
  "content": null,
  "code": 200
}
```

**Enhanced Response (Success):**
```json
{
  "success": true,
  "exercise_id": 5,
  "state": "completed_correct",
  "user_answer": "B",
  "correct_answer": "B",
  "is_correct": true,
  "score_percentage": 50,
  "attempts": {
    "current": 1,
    "total": 1,
    "max_allowed": 3
  },
  "timestamps": {
    "first_attempt_at": "2025-11-27T20:00:00Z",
    "last_attempt_at": "2025-11-27T20:00:00Z"
  },
  "can_retry": false,
  "next_action": "proceed_to_next",
  "message": "Great job! You scored 50% on your 1st attempt.",
  "code": 200
}
```

**Enhanced Response (Already Answered):**
```json
{
  "success": true,
  "exercise_id": 5,
  "state": "completed_correct",
  "user_answer": "B",
  "correct_answer": "B",
  "is_correct": true,
  "score_percentage": 50,
  "attempts": {
    "current": 1,
    "total": 1,
    "max_allowed": 3
  },
  "timestamps": {
    "first_attempt_at": "2025-11-27T20:00:00Z",
    "last_attempt_at": "2025-11-27T20:00:00Z"
  },
  "can_retry": false,
  "next_action": "already_completed",
  "message": "You've already answered this exercise correctly.",
  "code": 200
}
```

**Enhanced Response (Incorrect, Can Retry):**
```json
{
  "success": false,
  "exercise_id": 5,
  "state": "completed_incorrect",
  "user_answer": "A",
  "correct_answer": "B",
  "is_correct": false,
  "score_percentage": 0,
  "attempts": {
    "current": 1,
    "total": 1,
    "max_allowed": 3
  },
  "timestamps": {
    "first_attempt_at": "2025-11-27T20:00:00Z",
    "last_attempt_at": "2025-11-27T20:00:00Z"
  },
  "can_retry": true,
  "next_action": "retry",
  "message": "Wrong answer. Try again!",
  "hint": "Think about which field studies living organisms.",
  "code": 200
}
```

### 2. Section Completion Check

**Endpoint:** `GET /api/v1/lessons/check/{type}/{lesson_id}/{concept_id?}`

**Current Response:**
```json
{
  "success": true,
  "message": "Concept completed successfully.",
  "content": {
    "check": {
      "is_completed": true,
      "score": "50%"
    }
  },
  "code": 200
}
```

**Enhanced Response:**
```json
{
  "success": true,
  "section_id": "concept_31",
  "section_type": "concept",
  "state": "completed",
  "completion": {
    "is_completed": true,
    "score_percentage": 50,
    "exercises_completed": 2,
    "exercises_total": 2,
    "completed_at": "2025-11-27T20:30:00Z"
  },
  "exercises": [
    {
      "exercise_id": 45,
      "state": "completed_correct",
      "attempts": 1,
      "is_correct": true
    },
    {
      "exercise_id": 46,
      "state": "completed_correct",
      "attempts": 2,
      "is_correct": true
    }
  ],
  "next_section": {
    "section_id": "concept_32",
    "section_type": "concept",
    "state": "available",
    "title": "Next Concept Title"
  },
  "message": "Concept completed successfully.",
  "code": 200
}
```

**Enhanced Response (Not Completed):**
```json
{
  "success": false,
  "section_id": "concept_31",
  "section_type": "concept",
  "state": "in_progress",
  "completion": {
    "is_completed": false,
    "score_percentage": 25,
    "exercises_completed": 1,
    "exercises_total": 2,
    "started_at": "2025-11-27T20:00:00Z"
  },
  "exercises": [
    {
      "exercise_id": 45,
      "state": "completed_correct",
      "attempts": 1,
      "is_correct": true
    },
    {
      "exercise_id": 46,
      "state": "not_attempted",
      "attempts": 0,
      "is_correct": null
    }
  ],
  "message": "Complete all exercises to proceed.",
  "code": 200
}
```

**Enhanced Response (Missing Check Marker):**
```json
{
  "success": false,
  "section_id": "concept_31",
  "section_type": "concept",
  "state": "available",
  "error": {
    "code": "MISSING_CHECK_MARKER",
    "message": "No lesson check marker found, contact support with this error message code: 1001-2",
    "support_code": "1001-2",
    "can_proceed": true
  },
  "message": "Section check marker not configured. You can proceed, but please contact support.",
  "code": 400
}
```

### 3. Progress Reset (For Testing)

**Endpoint:** `POST /api/v1/lessons/{lesson_id}/reset-progress`

**Request:**
```json
{
  "reset_type": "full" | "section" | "exercise",
  "section_id": "concept_31",
  "exercise_id": 45
}
```

**Response:**
```json
{
  "success": true,
  "message": "Progress reset successfully.",
  "reset_details": {
    "lesson_id": 4,
    "sections_reset": ["concept_31"],
    "exercises_reset": [45, 46],
    "reset_at": "2025-11-27T22:00:00Z"
  },
  "code": 200
}
```

### 4. Bulk Progress Sync

**Endpoint:** `POST /api/v1/lessons/sync-progress`

**Request:**
```json
{
  "lesson_id": 4,
  "local_state": {
    "exercise_states": {
      "45": "completed_correct",
      "46": "in_progress"
    },
    "last_synced_at": "2025-11-27T20:00:00Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "server_state": {
    "exercise_states": {
      "45": "completed_correct",
      "46": "completed_correct"
    },
    "conflicts": [
      {
        "exercise_id": 46,
        "local_state": "in_progress",
        "server_state": "completed_correct",
        "resolution": "server_wins"
      }
    ],
    "synced_at": "2025-11-27T22:00:00Z"
  },
  "code": 200
}
```

---

## Data Models

### Database Schema (Backend)

```sql
-- User Exercise Attempts
CREATE TABLE user_exercise_attempts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  exercise_id BIGINT NOT NULL,
  lesson_id BIGINT NOT NULL,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  attempt_number INT NOT NULL DEFAULT 1,
  time_spent_seconds INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_exercise (user_id, exercise_id),
  INDEX idx_lesson (lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- User Section Progress
CREATE TABLE user_section_progress (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  lesson_id BIGINT NOT NULL,
  section_id VARCHAR(100) NOT NULL,
  section_type ENUM('overview', 'concept', 'summary_application', 'general_exercises') NOT NULL,
  state ENUM('locked', 'available', 'in_progress', 'completed') NOT NULL DEFAULT 'available',
  score_percentage DECIMAL(5,2),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_section (user_id, lesson_id, section_id),
  INDEX idx_user_lesson (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Lesson Check Markers
CREATE TABLE lesson_check_markers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  lesson_id BIGINT NOT NULL,
  section_id VARCHAR(100) NOT NULL,
  section_type ENUM('overview', 'concept', 'summary_application', 'general_exercises') NOT NULL,
  concept_id BIGINT,
  required_exercises INT NOT NULL DEFAULT 0,
  passing_score_percentage DECIMAL(5,2) DEFAULT 100.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_section_marker (lesson_id, section_id),
  INDEX idx_lesson (lesson_id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  FOREIGN KEY (concept_id) REFERENCES concepts(id)
);
```

### TypeScript Interfaces (Frontend)

```typescript
// Exercise State
interface ExerciseProgress {
  exerciseId: number;
  state: ExerciseState;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean | null;
  attempts: {
    current: number;
    total: number;
    maxAllowed: number;
  };
  timestamps: {
    firstAttemptAt: string | null;
    lastAttemptAt: string | null;
  };
  canRetry: boolean;
}

// Section State
interface SectionProgress {
  sectionId: string;
  sectionType: 'overview' | 'concept' | 'summary_application' | 'general_exercises';
  state: SectionState;
  completion: {
    isCompleted: boolean;
    scorePercentage: number;
    exercisesCompleted: number;
    exercisesTotal: number;
    startedAt: string | null;
    completedAt: string | null;
  };
  exercises: ExerciseProgress[];
}

// Lesson State
interface LessonProgress {
  lessonId: number;
  state: LessonState;
  sections: SectionProgress[];
  overallProgress: number;
  currentSectionId: string;
  lastAccessedAt: string;
}
```

---

## Error Handling

### Frontend Error Handling Strategy

```typescript
// Categorize errors
enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHORIZATION = 'authorization',
  SERVER = 'server',
  DATA_CONFLICT = 'data_conflict'
}

// Error handler
function handleLessonError(error: any, context: string) {
  const category = categorizeError(error);
  
  switch (category) {
    case ErrorCategory.NETWORK:
      // Retry with exponential backoff
      retryWithBackoff(() => syncProgress());
      toast.warning('Connection issue', {
        description: 'Retrying...'
      });
      break;
      
    case ErrorCategory.DATA_CONFLICT:
      // Show conflict resolution UI
      showConflictDialog(error.conflicts);
      break;
      
    case ErrorCategory.AUTHORIZATION:
      // Redirect to login
      redirectToLogin();
      break;
      
    case ErrorCategory.SERVER:
      // Log to monitoring service
      logToSentry(error, context);
      toast.error('Server error', {
        description: 'Please try again later.'
      });
      break;
      
    default:
      toast.error('Something went wrong', {
        description: error.message
      });
  }
}
```

### Backend Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid exercise answer format",
    "details": {
      "field": "answer",
      "reason": "Answer must be a single letter (A-D)"
    },
    "support_code": "ERR-1234",
    "can_retry": true,
    "suggested_action": "check_answer_format"
  },
  "code": 422
}
```

---

## Testing Strategy

### Frontend Testing

```typescript
// Unit Tests
describe('LessonProgressStore', () => {
  it('should handle exercise submission correctly', async () => {
    const store = useLessonsStore.getState();
    const result = await store.submitExerciseAnswer(45, 'B');
    expect(result.isCorrect).toBe(true);
    expect(store.exerciseStates[45]).toBe('completed_correct');
  });
  
  it('should handle already answered exercises', async () => {
    // Mock backend response
    mockBackend.onPost('/api/lessons/check-exercise-answer').reply(200, {
      success: true,
      state: 'completed_correct',
      next_action: 'already_completed'
    });
    
    const result = await submitExerciseAnswer(45, 'B');
    expect(result.nextAction).toBe('already_completed');
  });
});

// Integration Tests
describe('Lesson Flow', () => {
  it('should complete full lesson flow', async () => {
    // 1. Load lesson
    await fetchLessonContent('biology', 'introduction');
    
    // 2. Complete overview
    await checkSectionCompletion('overview');
    
    // 3. Complete all concepts
    for (const concept of lesson.concepts) {
      await completeAllExercises(concept.exercises);
      await checkSectionCompletion(`concept_${concept.id}`);
    }
    
    // 4. Verify lesson completion
    expect(lessonProgress.state).toBe('completed');
  });
});
```

### Backend Testing

```php
// Unit Tests
public function test_exercise_submission_creates_attempt_record()
{
    $response = $this->postJson('/api/v1/lessons/check-exercise-answer', [
        'exercise_id' => 45,
        'answer' => 'B'
    ]);
    
    $response->assertStatus(200);
    $this->assertDatabaseHas('user_exercise_attempts', [
        'user_id' => auth()->id(),
        'exercise_id' => 45,
        'answer' => 'B'
    ]);
}

public function test_already_answered_exercise_returns_existing_state()
{
    // Create existing attempt
    UserExerciseAttempt::create([
        'user_id' => auth()->id(),
        'exercise_id' => 45,
        'answer' => 'B',
        'is_correct' => true
    ]);
    
    $response = $this->postJson('/api/v1/lessons/check-exercise-answer', [
        'exercise_id' => 45,
        'answer' => 'A'
    ]);
    
    $response->assertStatus(200)
             ->assertJson([
                 'state' => 'completed_correct',
                 'next_action' => 'already_completed'
             ]);
}
```

---

## Implementation Roadmap

### Phase 1: Backend API Enhancements (Week 1-2)
- [ ] Update exercise submission endpoint with enhanced response
- [ ] Update section completion endpoint with detailed state
- [ ] Add progress reset endpoint
- [ ] Create database migrations for new tables
- [ ] Add comprehensive error handling
- [ ] Write unit and integration tests

### Phase 2: Frontend State Management (Week 2-3)
- [ ] Implement state-based architecture in Zustand store
- [ ] Add optimistic UI updates
- [ ] Enhance error handling with retry logic
- [ ] Update components to use new state system
- [ ] Add loading and error states to UI
- [ ] Write component tests

### Phase 3: Progressive Disclosure (Week 3-4)
- [ ] Implement section locking logic
- [ ] Add progress indicators
- [ ] Create progress dashboard
- [ ] Add navigation controls
- [ ] Implement breadcrumb navigation

### Phase 4: Polish & Testing (Week 4-5)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Documentation updates
- [ ] User acceptance testing

### Phase 5: Future Enhancements
- [ ] Offline support with IndexedDB
- [ ] Real-time progress sync with WebSockets
- [ ] Analytics and insights dashboard
- [ ] Gamification features (badges, streaks)
- [ ] Social features (leaderboards, sharing)

---

## Best Practices

### Frontend
1. **Always use optimistic updates** for better UX
2. **Cache progress locally** to reduce API calls
3. **Handle all error states** gracefully
4. **Show loading indicators** for async operations
5. **Validate data** before sending to backend
6. **Use TypeScript** for type safety
7. **Write tests** for critical flows

### Backend
1. **Make operations idempotent** to handle retries
2. **Use database transactions** for data consistency
3. **Validate all inputs** thoroughly
4. **Return detailed error messages** for debugging
5. **Log all important events** for monitoring
6. **Use proper HTTP status codes**
7. **Document all API endpoints**
8. **Version your APIs** for backward compatibility

---

## Support & Maintenance

### Development Environment Setup
- Each developer should have their own test account
- Use separate database instances for development
- Implement seed data for consistent testing
- Use feature flags for gradual rollout

### Monitoring
- Track API response times
- Monitor error rates by endpoint
- Alert on unusual patterns
- Log user progress events

### Debugging
- Use support codes in error messages
- Maintain audit trail of all attempts
- Provide admin tools to view user progress
- Enable verbose logging in development

---

## Conclusion

This enhanced lesson progress system provides a robust, production-ready solution that handles edge cases, provides excellent user experience, and maintains data integrity. The state-based architecture allows for future enhancements while maintaining backward compatibility.

For questions or clarifications, please contact the development team.

**Last Updated:** November 27, 2025  
**Version:** 1.0.0
