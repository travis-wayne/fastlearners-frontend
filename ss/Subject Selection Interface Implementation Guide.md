# Subject Selection Interface Implementation Guide

This guide details the implementation of the Subject Selection interface, which is the first step in the student's learning journey after successful registration. The interface must adhere to the Nigerian education system's requirements and utilize the provided backend API endpoints.

## 1. Architectural Overview and API Integration

The Subject Selection process is complex due to the Nigerian curriculum's distinction between Junior Secondary School (JSS) and Senior Secondary School (SSS) subject requirements.

### 1.1. API Endpoints

The implementation will rely on the following authenticated API endpoints:

| Endpoint | Method | Purpose | Key Data |
| :--- | :--- | :--- | :--- |
| `/api/v1/subjects` | `GET` | Retrieve the student's current subjects and available selective subjects. | `subjects`, `compulsory_selective`, `selective`, `compulsory_selective_status`, `selective_status` |
| `/api/v1/subjects/update-compulsory-selective` | `POST` | Update the single compulsory selective subject (JSS only). | `subject` (ID) |
| `/api/v1/subjects/update-selective` | `POST` | Update the main selective subjects (JSS/SSS). | `subjects[]` (Array of IDs) |

### 1.2. Data Flow and State Management

1.  The component will first fetch data from `GET /api/v1/subjects`.
2.  The response will determine the UI state:
    *   **JSS Students:** Must select **one (1)** Compulsory Selective Subject (e.g., Religious Studies) and **four (4)** Selective Subjects.
    *   **SSS Students:** Must select **five (5)** Selective Subjects (Discipline Selective).
3.  The UI must reflect the current selection status (`compulsory_selective_status`, `selective_status`).
4.  The user's current class level (JSS/SSS) is assumed to be available from the user's session or a profile endpoint.

## 2. Implementation Steps

### Step 2.1: Extend API Client (`lib/api/auth.ts` or `lib/api/subjects.ts`)

Create a new API client file (e.g., `lib/api/subjects.ts`) to handle the subject-related endpoints. These functions should be authenticated (i.e., they must include the `Authorization: Bearer {access_token}` header, which should be handled securely, likely via a server-side proxy or a secure client-side fetch wrapper).

| Function | Endpoint | Request Body | Response Type |
| :--- | :--- | :--- | :--- |
| `getStudentSubjects()` | `GET /api/v1/subjects` | None | Typed response including all subject lists and statuses. |
| `updateCompulsorySelective(subjectId: number)` | `POST /api/v1/subjects/update-compulsory-selective` | `{ subject: number }` | Success/Error message. |
| `updateSelectiveSubjects(subjectIds: number[])` | `POST /api/v1/subjects/update-selective` | `{ "subjects[]": number[] }` | Success/Error message. |

### Step 2.2: Create Subject Selection Component (`components/dashboard/subject-selection.tsx`)

This component will be the main container for the selection logic.

1.  **Data Fetching:** Use `getStudentSubjects()` to load the initial state. Implement loading and error states.
2.  **UI Structure:** Use a **card-based grid layout** for subjects, following the **Minimalist and Focused UI** principle [1].
3.  **Conditional Rendering:**
    *   If the student is JSS, render the **Compulsory Selective** section first, followed by the **Selective** section.
    *   If the student is SSS, only render the **Selective** section (Discipline Selective).

### Step 2.3: Implement JSS Compulsory Selective Logic

This section handles the selection of one subject from the religious studies group.

1.  **Component:** Use a `RadioGroup` or similar component (e.g., `shadcn/ui` Card with a radio button) to display the subjects from `content.compulsory_selective`.
2.  **Validation:** Enforce the selection of **exactly one** subject.
3.  **Submission:** On selection, call `updateCompulsorySelective(subjectId)`.
4.  **Feedback:** Display a success toast on completion and update the UI status to `compulsory_selective_status: "selected"`.

### Step 2.4: Implement JSS/SSS Selective Subject Logic

This section handles the selection of the main elective subjects.

1.  **Component:** Use a `Checkbox` or a toggle button on each subject card from `content.selective`.
2.  **Validation:**
    *   **JSS:** Enforce the selection of **four (4)** subjects.
    *   **SSS:** Enforce the selection of **five (5)** subjects.
3.  **Submission:** Use a primary "Save Selection" button. On click, call `updateSelectiveSubjects(selectedIds)`.
4.  **Feedback:** Display a success toast on completion and update the UI status to `selective_status: "selected"`.

### Step 2.5: Final Page Wiring (`app/dashboard/subjects/selection/page.tsx`)

1.  Create the page component to render the `SubjectSelection` component.
2.  Implement a guard: If the student has already completed the selection process (i.e., both statuses are "selected"), redirect them to the main `/dashboard/subjects` page.
3.  Ensure the page layout is clean and mobile-responsive.

## 3. Design and UX Considerations

Adhere to the principles derived from leading interactive learning platforms [1]:

*   **Visual Feedback:** Use clear visual indicators (e.g., checkmarks, color changes) on subject cards to confirm selection.
*   **Progress Indicator:** If the selection is multi-step (JSS), use a simple progress bar (e.g., Step 1 of 2) to manage user expectation.
*   **Minimalist UI:** Use `shadcn/ui` components (Card, Button, Checkbox) with ample white space to keep the focus on the subject choices.

***

### References

[1] Applying the Design Patterns and Concepts of Leading Interactive Learning Platforms. (Source: `pasted_content_2.txt`)
[2] Student Management API Documentation. (Source: `pasted_content_2.txt`)
[3] Nigerian Education System Structure. (Source: `README_NIGERIAN_SYSTEM.md`, `NIGERIAN_EDUCATION_SYSTEM.md`)
