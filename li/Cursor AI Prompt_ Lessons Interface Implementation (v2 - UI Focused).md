# Cursor AI Prompt: Lessons Interface Implementation (v2 - UI Focused)

**Goal:** Implement the complete Lessons Interface, consisting of a Lesson Listing Page (`/dashboard/lessons`) and an Interactive Lesson Player (`/dashboard/lessons/[id]`), strictly adhering to the Nigerian education system's flow and incorporating advanced UI components.

**Technology Stack & Design Constraints:**
*   **Framework:** Next.js 14+ (App Router), TypeScript.
*   **Base Project:** `https://github.com/mickasmt/next-saas-stripe-starter` (Adopt its existing layout/styling).
*   **Data Source:** Use mock data from `data/mock-lessons.ts` (must be created first).
*   **UI Libraries (MUST USE):**
    1.  **`shadcn/ui`:** For standard components (`Button`, `Card`, `Toast`, `Tabs`, `Progress`, `ScrollArea`).
    2.  **`Aceternity UI`:** For visual appeal and engagement (e.g., `BentoGrid` for the listing, subtle animations/effects for the cards).

**Architectural Requirements:**
1.  **Academic Context:** All data filtering must be based on the selected `classLevel` and `term` from the `AcademicContext` (assume a hook like `useAcademicContext()` exists).
2.  **UX Principle:** The Lesson Player must be a **Minimalist and Focused UI** to reduce distractions.

---

## Implementation Steps (Execute in Order)

### Step 1: Data Structures and Mock Data
1.  **`types/lessons.ts`:** Define the `Lesson` interface (including fields for `subjectId`, `term`, `title`, `duration`, `difficulty`, and `progress`).
2.  **`data/mock-lessons.ts`:** Create a mock data array of `Lesson` objects.

### Step 2: Lesson Listing Page (`/dashboard/lessons`)
1.  **`app/dashboard/lessons/page.tsx`:** Create the page component.
2.  **`components/dashboard/lessons/lesson-card.tsx`:**
    *   **Design:** Use `shadcn/ui/Card` as the base. Display title, duration, difficulty, and a clear `shadcn/ui/Progress` bar.
    *   **UX:** Integrate a subtle `Aceternity UI` effect (e.g., a border glow or hover animation) to make the card visually engaging.
3.  **`components/dashboard/lessons/lesson-list.tsx`:**
    *   **Layout:** Use **Aceternity UI's `BentoGrid`** or a similar responsive grid for the main lesson display.
    *   **Filtering:** Implement a filter bar for Subject, Term, Difficulty, and Progress Status.
    *   **Data:** Filter the mock data based on the academic context.

### Step 3: Interactive Lesson Player (`/dashboard/lessons/[id]`)
1.  **`app/dashboard/lessons/[id]/page.tsx`:** Create the dynamic route page component.
2.  **`components/dashboard/lessons/lesson-player.tsx`:**
    *   **Layout:** Implement a two-column layout: a narrow, collapsible sidebar for topic navigation and a wide, central content area.
    *   **Content:** Use `shadcn/ui/Tabs` to organize the content into: **Lesson Content**, **Objectives**, and **Activities**.
    *   **Progress & Feedback:**
        *   Implement a "Mark as Complete" button.
        *   On completion, trigger a `shadcn/ui/Toast` notification. **If possible, integrate a subtle Aceternity UI animation (like confetti or a sparkle effect) with the toast for "Visual Feedback and Delight."**
    *   **Navigation:** Implement "Previous Lesson" and "Next Lesson" buttons.

**Start with Step 1: Data Structures and Mock Data.** Define the types and create the mock data to ensure the subsequent components have the necessary data to render. Then proceed to Step 2, focusing on the UI components with the specified libraries.
