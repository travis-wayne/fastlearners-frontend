# Lessons Interface Implementation Guide

This guide outlines the implementation of the Lessons Interface, which follows the subject selection process. The interface is designed to present the learning content in an engaging, structured, and personalized manner, adhering to the principles of leading interactive learning platforms [1].

The user flow for the Lessons Interface is: **Subject Selection -> Term Selection -> Topic Selection -> Lessons**.

## 1. Architectural Overview and Data Flow

The Lessons Interface will be composed of two main pages: the **Lesson Listing Page** (`/dashboard/lessons`) and the **Interactive Lesson Player** (`/dashboard/lessons/[id]`).

### 1.1. Core Principles

The design must incorporate the following pedagogical and UX principles [1]:

*   **Bite-Sized, Sequential Learning:** Content must be broken down into small, manageable chunks.
*   **Interactive Problem-Solving:** Lessons should prioritize active engagement over passive consumption.
*   **Minimalist and Focused UI:** The Lesson Player must minimize distractions.
*   **Visual Feedback:** Clear progress indicators and immediate feedback are essential.

### 1.2. Data Requirements (Assumed API/Mock Data)

Since no specific API endpoints for lessons were provided, the implementation will assume the existence of a local mock data structure (`data/mock-lessons.ts`) and a context for academic selection, as suggested in the Nigerian Education System documentation [3].

| Data Component | Source | Purpose |
| :--- | :--- | :--- |
| **Academic Context** | `AcademicContext` Provider | Current `classLevel` and `term` selected by the student. |
| **Subject List** | `GET /api/v1/subjects` (or local mock) | List of subjects the student has selected. |
| **Lesson Data** | `data/mock-lessons.ts` (or `GET /api/v1/lessons?subjectId=...`) | Detailed lesson content, duration, and progress. |

## 2. Implementation Steps

### Step 2.1: Academic Context Integration

The entire Lessons Interface must be aware of the student's current academic context.

1.  **Context Consumption:** Ensure the Lesson Listing Page and Lesson Player consume the global `AcademicContext` (containing `classLevel` and `term`).
2.  **Initial Selection:** If the `term` is not selected, the user should be prompted to select it first, as per the flow: "class selection -> subject -> **term selection** -> topic selection -> lessons".

### Step 2.2: Lesson Listing Page (`/dashboard/lessons`)

This page serves as the entry point to the learning content.

1.  **URL Structure:** `/dashboard/lessons`
2.  **Components:**
    *   **Academic Selector:** Integrate the `Academic Selector` component to allow the student to change the `classLevel` and `term` [3].
    *   **Subject Filter:** Display the student's selected subjects (from the previous phase) as primary filters.
    *   **Lesson Cards:** Display lessons in a grid or list format. Each card should show:
        *   Lesson Title
        *   Duration
        *   Difficulty (`beginner` | `intermediate` | `advanced`)
        *   **Progress Indicator:** A clear visual representation of completion status (e.g., a progress bar or a checkmark).
3.  **Functionality:**
    *   **Filtering:** Allow filtering by **Subject**, **Term**, **Difficulty**, and **Progress Status** (All, In Progress, Completed) [3].
    *   **Search:** Implement a search bar for lesson titles.
    *   **Navigation:** Clicking a Lesson Card navigates to the Lesson Player (`/dashboard/lessons/[id]`).

### Step 2.3: Interactive Lesson Player (`/dashboard/lessons/[id]`)

This is the core component for content consumption, designed for a focused, distraction-free experience.

1.  **URL Structure:** `/dashboard/lessons/[id]`
2.  **Layout:** Implement a **Minimalist and Focused UI** [1].
    *   **Main Content Area:** Dedicated to the lesson content.
    *   **Sidebar/Navigation:** A compact list of topics/sub-lessons within the current subject, with clear progress tracking.
3.  **Content Structure:** The lesson content should be organized into tabs or sections [3]:
    *   **Lesson Content:** Introduction and summary.
    *   **Objectives:** Learning goals for the lesson.
    *   **Activities:** Interactive exercises or quizzes (implementing **Interactive Problem-Solving**).
    *   **Media & Resources:** Supporting materials (videos, diagrams).
4.  **Progress Tracking:**
    *   **Timer:** Display the time spent on the lesson and the estimated remaining time.
    *   **Completion:** Implement a mechanism (e.g., a "Mark as Complete" button or automatic tracking based on content interaction) to update the lesson's progress status.
    *   **Gamification:** Use visual feedback (e.g., a celebratory animation or toast) upon lesson completion to reinforce the **Streaks and Habit Formation** principle [1].
5.  **Navigation:** Implement clear "Previous Lesson" and "Next Lesson" buttons.

### Step 2.4: Component Structure

| File Path | Purpose | Key Components |
| :--- | :--- | :--- |
| `components/dashboard/lessons/lesson-list.tsx` | Main lesson listing page component. | `AcademicSelector`, `SubjectFilter`, `LessonCard` |
| `components/dashboard/lessons/lesson-card.tsx` | Reusable card for displaying lesson metadata and progress. | `Card`, `Progress`, `Badge` |
| `components/dashboard/lessons/lesson-player.tsx` | Main interactive lesson view. | `Tabs`, `ScrollArea`, `Button` |
| `app/dashboard/lessons/page.tsx` | Renders the Lesson Listing Page. | |
| `app/dashboard/lessons/[id]/page.tsx` | Renders the Interactive Lesson Player. | |

***

### References

[1] Applying the Design Patterns and Concepts of Leading Interactive Learning Platforms. (Source: `pasted_content_2.txt`)
[3] Nigerian Education System Implementation. (Source: `NIGERIAN_EDUCATION_SYSTEM.md`)
