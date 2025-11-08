# Cursor AI Prompt: Subject Selection Interface Implementation (v2 - UI Focused)

**Goal:** Implement the complete Subject Selection interface at the path `/app/dashboard/subjects/selection/page.tsx`. The implementation must strictly adhere to the Nigerian education system's JSS/SSS subject selection rules and utilize the provided backend API endpoints.

**Technology Stack & Design Constraints:**
*   **Framework:** Next.js 14+ (App Router), TypeScript.
*   **Base Project:** `https://github.com/mickasmt/next-saas-stripe-starter` (Adopt its existing layout/styling).
*   **UI Libraries (MUST USE):**
    1.  **`shadcn/ui`:** For standard components (`Button`, `Card`, `Toast`, `RadioGroup`, `Skeleton`).
    2.  **`Aceternity UI`:** For the main selective subject grid to achieve a modern, engaging look (e.g., use `BentoGrid` or `CardStack` for the subject cards).
*   **Logic:** Component-based approach for modularity and easier debugging.

**Architectural Requirements:**
1.  **API Client:** Use the existing `lib/api/subjects.ts` (or create it) with the functions: `getStudentSubjects()`, `updateCompulsorySelective()`, and `updateSelectiveSubjects()`.
2.  **JSS/SSS Logic:** The component must dynamically adapt its UI and validation based on the student's class level (JSS or SSS).
    *   **JSS:** Requires selection of **1** Compulsory Selective Subject and **4** Selective Subjects.
    *   **SSS:** Requires selection of **5** Selective Subjects (Discipline Selective).
3.  **Page Flow:** The page should act as a guard, redirecting to `/dashboard/subjects` if the selection is already complete.

---

## Implementation Steps (Execute in Order)

### Step 1: Data Structures and API Client (Refinement)
1.  **`types/subjects.ts`:** Define TypeScript interfaces for `Subject` and `SubjectListResponse`.
2.  **`lib/api/subjects.ts`:** Implement the three authenticated API client functions.

### Step 2: Core UI Components (Focus on Reusability and Design)
1.  **`components/dashboard/subjects/subject-card.tsx`:**
    *   Create a reusable, selectable card component.
    *   **Design:** Use `shadcn/ui/Card` as the base, but integrate a subtle `Aceternity UI` effect (e.g., a hover effect or border animation) to indicate selection.
    *   **Functionality:** Display subject name and handle the selection state (checked/unchecked).

2.  **`components/dashboard/subjects/compulsory-selector.tsx`:** (For JSS Step 1)
    *   **Design:** Use `shadcn/ui/RadioGroup` or a grid of `shadcn/ui/Card` components with a radio-like selection state.
    *   **Logic:** Enforce **Select 1**. Implement the submission logic for `updateCompulsorySelective`.

3.  **`components/dashboard/subjects/selective-grid.tsx`:** (For JSS/SSS Step 2)
    *   **Design:** Use the **Aceternity UI `BentoGrid`** component to display the selectable subjects, utilizing the `subject-card.tsx` component within the grid items.
    *   **Logic:**
        *   Accepts a `limit` prop (4 or 5).
        *   Displays a clear selection counter (e.g., "3/5 Selected").
        *   Disables selection once the limit is reached.
        *   Implements the submission logic for `updateSelectiveSubjects`.

### Step 3: Main Page Wiring and Logic
1.  **`app/dashboard/subjects/selection/page.tsx`:**
    *   Fetch initial data (`getStudentSubjects()`).
    *   Implement loading/error states (use `shadcn/ui/Skeleton` for loading).
    *   **Conditional Rendering:** Based on the student's type and selection status, render the appropriate component(s) (`CompulsorySelector` and/or `SelectiveGrid`).
    *   Implement the final redirection guard.

---

## Relevant API Specifications (Reference)

*   **GET /api/v1/subjects:** Returns all subject lists and current selection statuses (`compulsory_selective_status`, `selective_status`).
*   **POST /api/v1/subjects/update-compulsory-selective:** Updates the single JSS compulsory subject.
*   **POST /api/v1/subjects/update-selective:** Updates the array of selective subjects (`subjects[]`).

**Start with Step 1: Data Structures and API Client.** Focus on creating the necessary data structures and the secure API functions first. Then proceed to Step 2, prioritizing the UI components with the specified libraries.
