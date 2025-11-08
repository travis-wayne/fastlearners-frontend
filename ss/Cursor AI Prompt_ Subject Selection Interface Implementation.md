# Cursor AI Prompt: Subject Selection Interface Implementation

**Goal:** Implement the complete Subject Selection interface for the Fast Learner platform, adhering to the Nigerian education system's JSS/SSS subject selection rules and utilizing the provided backend API endpoints.

**Technology Stack:**
*   **Framework:** Next.js 14+ (App Router)
*   **Language:** TypeScript
*   **Styling/UI:** shadcn/ui (Card, Button, Checkbox, RadioGroup, Toast), Tailwind CSS
*   **Form Handling:** `react-hook-form`, `zod` (for validation of selection counts)
*   **Authentication:** Assumed to be handled via HttpOnly `auth_token` cookie (from previous phase).

**Architectural Requirements:**
1.  **API Client:** Create a new API client (`lib/api/subjects.ts`) to handle all subject-related API calls. These calls must include the `Authorization: Bearer {access_token}` header, which should be securely managed (e.g., by a server-side fetch or a secure client-side wrapper that reads the token from a secure context).
2.  **JSS/SSS Logic:** The component must dynamically adapt its UI and validation based on the student's class level (JSS or SSS).
    *   **JSS:** Requires selection of **1** Compulsory Selective Subject and **4** Selective Subjects.
    *   **SSS:** Requires selection of **5** Selective Subjects (Discipline Selective).
3.  **UX Principles:** Follow the "Minimalist and Focused UI" and "Visual Feedback" principles (e.g., clear card-based selection, immediate feedback on save).

---

## Implementation Steps (Execute in Order)

### Step 1: API Client and Types
1.  **`types/subjects.ts`:** Define TypeScript interfaces for the subject data structures: `Subject` (id, name), `SubjectListResponse` (including `subjects`, `compulsory_selective`, `selective`, and status fields).
2.  **`lib/api/subjects.ts`:** Implement the following authenticated API client functions:
    *   `getStudentSubjects()`: Calls `GET /api/v1/subjects`.
    *   `updateCompulsorySelective(subjectId: number)`: Calls `POST /api/v1/subjects/update-compulsory-selective`.
    *   `updateSelectiveSubjects(subjectIds: number[])`: Calls `POST /api/v1/subjects/update-selective`.

### Step 2: Subject Selection Component
1.  **`components/dashboard/subject-selection.tsx`:** Create the main component.
    *   Fetch initial data using `getStudentSubjects()`.
    *   Implement loading, error, and empty states.
    *   Determine the student's class level (JSS/SSS) from the user context (assume a hook like `useUserContext()` provides `user.classLevel`).
2.  **JSS Compulsory Selective Section:**
    *   Display `compulsory_selective` subjects using a `RadioGroup` (or equivalent card selection).
    *   Allow selection of **exactly one** subject.
    *   Implement a button to call `updateCompulsorySelective`.

### Step 3: Selective Subject Logic
1.  **JSS/SSS Selective Section:**
    *   Display `selective` subjects using a grid of `Card` components with a `Checkbox` or toggle for selection.
    *   Implement client-side validation to enforce the correct number of selections (4 for JSS, 5 for SSS).
    *   Implement a primary "Save Selective Subjects" button to call `updateSelectiveSubjects`.

### Step 4: Page Wiring and Guards
1.  **`app/dashboard/subjects/selection/page.tsx`:** Create the page component.
2.  Implement a server-side or client-side guard: If the student's subject selection is already complete (i.e., both `compulsory_selective_status` and `selective_status` are "selected"), redirect the user to `/dashboard/subjects`.

---

## Relevant API Specifications

**1. List Student's Subjects**
*   **Endpoint:** `GET /api/v1/subjects`
*   **Headers:** `Authorization: Bearer {access_token}`, `Accept: application/json`
*   **Success Response (200) Structure:**
    ```json
    {
      "success": true,
      "content": {
        "subjects": [ /* list of all selected subjects */ ],
        "compulsory_selective_status": "selected" | "pending",
        "compulsory_selective": [ /* list of subjects for JSS compulsory selection */ ],
        "selective_status": "selected" | "pending",
        "selective": [ /* list of subjects for JSS/SSS selective selection */ ]
      }
    }
    ```

**2. Update Compulsory Selective Subject (JSS Only)**
*   **Endpoint:** `POST /api/v1/subjects/update-compulsory-selective`
*   **Headers:** `Authorization: Bearer {access_token}`, `Accept: application/json`
*   **Request Body:**
    ```json
    { "subject": 22 } // Subject ID
    ```

**3. Update Selective Subject (JSS/SSS)**
*   **Endpoint:** `POST /api/v1/subjects/update-selective`
*   **Headers:** `Authorization: Bearer {access_token}`, `Accept: application/json`
*   **Request Body:** (Note the array format for multiple subjects)
    ```json
    {
      "subjects[]": [31, 7, 8, 36, 42] // Array of Subject IDs
    }
    ```

**Start with Step 1: API Client and Types.** Focus on creating the necessary data structures and the secure API functions first.
