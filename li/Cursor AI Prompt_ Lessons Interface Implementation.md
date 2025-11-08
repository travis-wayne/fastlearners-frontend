# Cursor AI Prompt: Lessons Interface Implementation

**Goal:** Implement the Lessons Interface, consisting of a Lesson Listing Page and an Interactive Lesson Player, adhering to the Nigerian education system's structure and incorporating best practices from leading interactive learning platforms.

**Technology Stack:**
*   **Framework:** Next.js 14+ (App Router)
*   **Language:** TypeScript
*   **Styling/UI:** shadcn/ui (Card, Tabs, Progress, Button, ScrollArea), Tailwind CSS
*   **Data Source:** Assume mock data structures are available in `data/mock-lessons.ts` (as defined in `NIGERIAN_EDUCATION_SYSTEM.md`).

**Architectural Requirements:**
1.  **Academic Context:** The entire interface must be driven by the global `AcademicContext` (current `classLevel` and `term`).
2.  **User Flow:** The interface must support the flow: **Subject Selection -> Term Selection -> Topic Selection -> Lessons**.
3.  **UX Focus:** Implement a **Minimalist and Focused UI** for the Lesson Player to maximize concentration.

---

## Implementation Steps (Execute in Order)

### Step 1: Data Structures and Mock Data
1.  **`data/mock-lessons.ts`:** Create a mock data file containing an array of `Lesson` objects, following the interface defined in `NIGERIAN_EDUCATION_SYSTEM.md`. Ensure the mock data covers various subjects, terms, and difficulty levels.
2.  **`types/lessons.ts`:** Define the TypeScript interfaces for `Lesson` and any related types (e.g., `MediaItem`, `ProgressData`).

### Step 2: Lesson Listing Page (`/dashboard/lessons`)
1.  **`app/dashboard/lessons/page.tsx`:** Create the page component.
2.  **`components/dashboard/lessons/lesson-list.tsx`:** Create the main listing component.
    *   **Data Fetching:** Load the mock lesson data, filtering it based on the current `classLevel` and `term` from the `AcademicContext`.
    *   **UI Components:**
        *   Integrate the `AcademicSelector` component (assumed to be pre-existing).
        *   Implement a filter section for **Subject**, **Difficulty**, and **Progress Status** (All, In Progress, Completed).
        *   Implement a search bar.
    *   **`components/dashboard/lessons/lesson-card.tsx`:** Create a card component to display each lesson, including title, duration, difficulty, and a clear `Progress` indicator (using `shadcn/ui/progress`).

### Step 3: Interactive Lesson Player (`/dashboard/lessons/[id]`)
1.  **`app/dashboard/lessons/[id]/page.tsx`:** Create the dynamic route page component.
2.  **`components/dashboard/lessons/lesson-player.tsx`:** Create the main player component.
    *   **Layout:** Implement a two-column layout: a focused main content area and a compact sidebar for lesson navigation (topics/sub-lessons).
    *   **Content Tabs:** Use `shadcn/ui/tabs` to organize the lesson content into:
        *   **Lesson Content**
        *   **Objectives**
        *   **Activities** (Placeholder for interactive elements)
        *   **Media & Resources**
    *   **Progress & Navigation:**
        *   Implement a simple progress tracking mechanism (e.g., a "Mark as Complete" button).
        *   Include "Previous Lesson" and "Next Lesson" buttons.
        *   Use a `Toast` notification on completion to provide **Visual Feedback** and reinforce engagement.

**Start with Step 1: Data Structures and Mock Data.** Define the types and create the mock data to ensure the subsequent components have the necessary data to render.
