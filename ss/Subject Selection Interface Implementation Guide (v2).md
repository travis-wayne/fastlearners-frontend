# Subject Selection Interface Implementation Guide (v2)

This guide provides a refined, step-by-step plan for implementing the Subject Selection interface, incorporating the user's preference for **Next.js, TypeScript, shadcn/ui, and Aceternity UI** components. The goal is to create a highly engaging and consistent user experience while adhering to the Nigerian education system's JSS/SSS subject selection rules.

## 1. UI/UX Design Strategy

The interface will be built upon the existing `/dashboard/subjects` route, utilizing a clean, modern aesthetic inspired by the starter project's layout and the specified UI libraries.

### 1.1. Component Library Usage

| Feature | Component | Library | Purpose |
| :--- | :--- | :--- | :--- |
| **Page Layout** | `Container` (or equivalent) | Starter Project/Tailwind | Consistent page width and padding. |
| **Subject Cards** | `Card` + `HoverCard` | shadcn/ui | Display subject name and details. |
| **Selection Effect** | `BentoGrid` or `CardStack` | Aceternity UI | Visually engaging selection mechanism for the selective subjects. |
| **JSS Compulsory** | `RadioGroup` or `Select` | shadcn/ui | Simple, clear selection of one religious study. |
| **Action Buttons** | `Button` | shadcn/ui | Primary actions (Save, Next Step). |
| **Feedback** | `Toast` | shadcn/ui | Success/Error notifications. |
| **Loading State** | `Skeleton` or `ShimmerButton` | shadcn/ui / Aceternity UI | Engaging loading states. |

### 1.2. Subject Selection Flow (JSS Example)

The interface will be divided into two distinct sections for JSS students, presented sequentially or side-by-side for clarity.

| Section | Title | Rule | UI Component |
| :--- | :--- | :--- | :--- |
| **Step 1: Compulsory Selective** | Select your Religious Study | **Select 1** from the list (e.g., CRS, IRS). | `RadioGroup` or `Select` |
| **Step 2: Selective Subjects** | Choose your Electives | **Select 4** from the list. | `BentoGrid` or `CardStack` of selectable subject cards. |
| **SSS Students** | Discipline Selective Subjects | **Select 5** from the list. | Single section using the `BentoGrid` approach. |

## 2. Implementation Steps

### Step 2.1: API Client and Types Refinement

The API client (`lib/api/subjects.ts`) and types (`types/subjects.ts`) from the previous guide remain valid. Ensure the client handles the `Authorization: Bearer {access_token}` securely.

### Step 2.2: Core Subject Card Component (`components/dashboard/subjects/subject-card.tsx`)

Create a reusable component for displaying a single subject.

1.  **Structure:** Use `shadcn/ui/Card` as the base.
2.  **Content:** Display the subject name, and a brief description (if available).
3.  **Interactivity:** Implement a visual state change (e.g., border color, checkmark icon) when the card is selected. This component will be used within the `BentoGrid` or `CardStack` structure.

### Step 2.3: JSS Compulsory Selection Component (`components/dashboard/subjects/compulsory-selector.tsx`)

This component handles the single-choice selection for JSS students.

1.  **Data:** Takes the `compulsory_selective` array as a prop.
2.  **UI:** Use `shadcn/ui/RadioGroup` for a clear, mutually exclusive choice.
3.  **Logic:** Manages the local selection state and calls `updateCompulsorySelective` on save.

### Step 2.4: Selective Subject Grid Component (`components/dashboard/subjects/selective-grid.tsx`)

This component handles the multi-choice selection for JSS/SSS students.

1.  **Data:** Takes the `selective` array, selection limit (4 or 5), and current selections as props.
2.  **UI:** Use a responsive grid layout, leveraging the visual appeal of **Aceternity UI's `BentoGrid`** or a similar animated card structure for the subject cards.
3.  **Logic:**
    *   Manages the array of selected subject IDs.
    *   Disables unselected cards once the selection limit is reached.
    *   Displays a clear counter (e.g., "4/5 Selected").
    *   Calls `updateSelectiveSubjects` on save.

### Step 2.5: Main Page Wiring (`app/dashboard/subjects/selection/page.tsx`)

1.  **Data Fetching:** Fetch all subject data (`GET /api/v1/subjects`) in a Server Component or using a secure data fetching hook.
2.  **Conditional Rendering:**
    *   Determine student type (JSS/SSS) and selection status.
    *   If JSS and compulsory selection is pending, render `CompulsorySelector`.
    *   If JSS and compulsory selection is complete, or if SSS, render `SelectiveGrid`.
    *   If all selections are complete, redirect to the main `/dashboard/subjects` page.

## 3. Cursor AI Prompt Focus

The prompt must explicitly instruct Cursor to:
1.  **Prioritize** `shadcn/ui` for standard elements (`Button`, `Card`, `Toast`).
2.  **Integrate** `Aceternity UI` components (e.g., `BentoGrid` or `CardStack`) for the main subject selection grid to achieve the desired "great UI."
3.  **Strictly adhere** to the JSS (1+4 subjects) and SSS (5 subjects) selection rules.
