# API Endpoints Documentation

This document describes the internal API endpoints that require backend implementation. Currently, these endpoints use mock data from `data/mock-lesson-data.ts`.

## Endpoints Requiring Backend Implementation

### 1. Batch Lessons List Endpoint

**Route:** `POST /api/lessons/list/batch`

**Purpose:** Fetch lessons for multiple subjects in a single request to avoid N+1 queries.

**Request Body:**
```json
{
  "class": "string (class ID)",
  "subject_ids": [1, 2, 3],
  "term": "string (term ID)",
  "week": "string | 'all'"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lessons fetched successfully",
  "content": {
    "data": [
      {
        "id": 1,
        "title": "Lesson Title",
        "subject_id": 1,
        "class_id": 1,
        "term_id": 1,
        "week_id": 1,
        "status": "not_started | in_progress | completed",
        "progress": 0
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 10
    }
  },
  "code": 200
}
```

**Backend Implementation:**
- Create endpoint: `POST /api/v1/lessons/list/batch`
- Accept array of `subject_ids` in request body
- Return aggregated lessons across all specified subjects
- Support pagination via `page` parameter
- Filter by class, term, and week as specified

**Current Status:** Uses mock data from `data/mock-lesson-data.ts`

---

### 2. Mark Lesson as Complete

**Route:** `POST /api/lessons/[id]/complete`

**Purpose:** Mark a lesson as completed and update all check markers.

**Request Body:** None (lesson ID in URL)

**Response:**
```json
{
  "success": true,
  "message": "Lesson marked as complete",
  "content": {
    "id": 1,
    "title": "Lesson Title",
    "check_markers": [
      {
        "id": 1,
        "concept_id": 1,
        "completed": true
      }
    ]
  },
  "code": 200
}
```

**Backend Implementation:**
- Create endpoint: `POST /api/v1/lessons/{id}/complete`
- Mark all check markers for the lesson as completed
- Update lesson progress to 100%
- Ensure idempotency (multiple calls should not cause issues)
- Return updated lesson content with completed markers

**Current Status:** Uses mock data from `data/mock-lesson-data.ts`

---

### 3. Subject Detail Endpoint

**Route:** `GET /api/subjects/[id]`

**Purpose:** Fetch detailed information about a subject including scheme of work and progress.

**Response:**
```json
{
  "success": true,
  "message": "Subject detail fetched successfully",
  "content": {
    "id": 1,
    "name": "Mathematics",
    "progress": 75,
    "grade": "B2",
    "caScore": 82,
    "currentWeek": 9,
    "totalWeeks": 11,
    "upcomingAssessments": 2,
    "schemeOfWork": [
      {
        "week": 1,
        "topics": ["Topic 1", "Topic 2"],
        "objectives": ["Objective 1", "Objective 2"],
        "activities": ["Activity 1"],
        "resources": ["Resource 1"],
        "assessment": "Assessment description"
      }
    ]
  },
  "code": 200
}
```

**Backend Implementation:**
- Create endpoint: `GET /api/v1/subjects/{id}`
- Validate that the subject is registered for the authenticated user
- Return 403 if subject is not registered
- Include scheme of work, progress metrics, and assessment information
- Filter by current class and term context

**Current Status:** Uses mock data from `data/mock-lesson-data.ts`

---

### 4. Profile Update with Term Support

**Route:** `POST /api/profile/edit`

**Purpose:** Update user profile including class, discipline, and term.

**Request Body:**
```json
{
  "class": "JSS1",
  "discipline": "science",
  "term": "term1"
}
```

**Backend Implementation:**
- Extend existing `/api/v1/profile/edit` endpoint to accept `term` field
- Store term in user profile if backend supports it
- If backend doesn't support term storage, document that term is client-side only
- Return updated user profile

**Current Status:** Endpoint exists but term may not be persisted by backend

---

## Cookie Forwarding

**Current Implementation:**
- All API routes use `Authorization: Bearer {token}` header from `parseAuthCookiesServer()`
- Only the auth token is forwarded to upstream APIs
- No additional cookies are currently forwarded

**If Backend Requires Additional Cookies:**
1. Extract required cookies from request in API route
2. Forward them in the `Cookie` header to upstream:
   ```typescript
   const cookieHeader = req.headers.get('cookie');
   // Forward to upstream
   headers: {
     'Cookie': cookieHeader,
     'Authorization': `Bearer ${auth.token}`
   }
   ```

**Documentation:** The current implementation relies on bearer token authentication only. If the backend requires additional cookies, update the API routes accordingly and document the requirements.

---

## Error Handling

All endpoints use standardized error handling from `lib/api/error-handler.ts`:

- **401 Unauthorized:** Missing or invalid auth token
- **400 Bad Request:** Invalid request parameters
- **403 Forbidden:** Resource not accessible to user
- **404 Not Found:** Resource doesn't exist
- **500 Internal Server Error:** Server-side error

All error responses include:
- `success: false`
- `message`: Error message
- `code`: HTTP status code
- `requestId`: Unique request identifier for tracing

---

## Timeouts and Retries

All endpoints implement:
- **15-second timeout** using AbortController
- **Single retry** on network errors (AbortError or fetch failures)
- **Idempotent operations** for safe retries

---

## Migration from Mock Data

To migrate from mock data to real backend:

1. Set `USE_MOCK_DATA = false` in the respective route file
2. Ensure backend endpoints match the documented structure
3. Test with real authentication tokens
4. Verify error handling and edge cases
5. Update response types if backend structure differs
