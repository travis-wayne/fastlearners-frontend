# Lessons Interface Implementation Guide (v2)

This guide provides a refined plan for implementing the Lessons Interface, which is the core content consumption area of the platform. It adheres to the Nigerian curriculum flow and incorporates the user's preference for **shadcn/ui** and **Aceternity UI** to create a highly engaging and focused learning experience.

## 1. UI/UX Design Strategy

The Lessons Interface is split into two main views: the Lesson Listing Page and the Interactive Lesson Player. Both must adhere to the "Minimalist and Focused UI" principle.

### 1.1. Component Library Usage

| Feature | Component | Library | Purpose |
| :--- | :--- | :--- | :--- |
| **Lesson Cards** | `Card` + `Progress` | shadcn/ui | Display lesson metadata and completion status. |
| **Listing Layout** | `BentoGrid` or `CardStack` | Aceternity UI | Visually appealing, responsive grid for the lesson list. |
| **Lesson Player Layout** | `ScrollArea` + `Tabs` | shadcn/ui | Distraction-free content view with organized sections. |
| **Progress Tracking** | `Progress` | shadcn/ui | Clear visual feedback on lesson completion. |
| **Navigation** | `Button` + `Icon` | shadcn/ui | Previous/Next lesson navigation. |
| **Engagement** | `AnimatedBorderCard` | Aceternity UI | Highlight the currently active lesson or a featured lesson. |

### 1.2. Lesson Flow and Structure

The interface must support the flow: **Subject -> Term -> Topic -> Lesson**.

| View | Path | Primary Goal | Key UI Elements |
| :--- | :--- | :--- | :--- |
| **Lesson Listing** | `/dashboard/lessons` | Filtering and discovery of available lessons based on academic context. | `AcademicSelector`, `Filter Bar`, `Aceternity UI Grid` of Lesson Cards. |
| **Lesson Player** | `/dashboard/lessons/[id]` | Focused, interactive content consumption and progress tracking. | Minimalist Layout, `shadcn/ui/Tabs` (Content, Objectives, Activities). |

## 2. Implementation Steps

### Step 2.1: Data Structures and Mock Data

The implementation will rely on the mock data structure defined in the previous phase (`data/mock-lessons.ts`).

1.  **`types/lessons.ts`:** Ensure the `Lesson` interface includes fields for `subjectId`, `term`, `title`, `duration`, `difficulty`, and `progress` (e.g., `completionPercentage`).
2.  **Data Filtering:** Implement a utility function to filter the mock data based on the selected `classLevel`, `term`, and `subjectId` from the user's context.

### Step 2.2: Lesson Listing Page (`/dashboard/lessons`)

This page will render the `LessonList` component.

1.  **`components/dashboard/lessons/lesson-card.tsx`:**
    *   Use `shadcn/ui/Card` with a clear `shadcn/ui/Progress` bar to show completion.
    *   **UX:** Incorporate a subtle `Aceternity UI` effect (e.g., a glow or border animation) on hover to make the card selection engaging.
2.  **`components/dashboard/lessons/lesson-list.tsx`:**
    *   **Layout:** Use a responsive grid structure, potentially leveraging the visual appeal of **Aceternity UI's `BentoGrid`** for the main lesson display.
    *   **Filtering:** Implement filters for Subject, Term, Difficulty, and Progress Status.
    *   **Academic Context:** Must display the current academic selection (Class/Term) prominently, likely using the pre-existing `AcademicSelector` component.

### Step 2.3: Interactive Lesson Player (`/dashboard/lessons/[id]`)

This component is the most critical for user engagement and focus.

1.  **`components/dashboard/lessons/lesson-player.tsx`:**
    *   **Minimalist Layout:** Implement a two-column layout: a narrow sidebar for lesson navigation (topics within the subject) and a wide, central content area. The sidebar should be collapsible.
    *   **Content Organization:** Use `shadcn/ui/Tabs` to structure the lesson content:
        *   **Lesson Content:** The main text/media.
        *   **Objectives:** Learning goals.
        *   **Activities:** Interactive elements (placeholders for now).
    *   **Progress and Feedback:**
        *   Display a fixed header with the lesson title and a prominent "Mark as Complete" button.
        *   Upon completion, trigger a **Visual Feedback** element (e.g., a `shadcn/ui/Toast` with a subtle `Aceternity UI` confetti effect, if possible, or a simple checkmark animation).
    *   **Navigation:** Implement clear "Previous" and "Next" buttons at the bottom of the content area.

### Step 2.4: Page Wiring

1.  **`app/dashboard/lessons/page.tsx`:** Renders the `LessonList` component.
2.  **`app/dashboard/lessons/[id]/page.tsx`:** Renders the `LessonPlayer` component, fetching the specific lesson data based on the dynamic `[id]` parameter.

## 3. Cursor AI Prompt Focus

The prompt must explicitly instruct Cursor to:
1.  **Prioritize** the "Minimalist and Focused UI" principle for the Lesson Player.
2.  **Integrate** `Aceternity UI` for the visual presentation of the lesson cards and any engaging micro-animations.
3.  **Strictly adhere** to the two-view structure and the use of `shadcn/ui` for all functional components (`Tabs`, `Button`, `Progress`).
