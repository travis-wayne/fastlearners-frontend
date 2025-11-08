# Subject Selection Interface - Implementation Plan

## Executive Summary

This plan outlines the implementation of a comprehensive Subject Selection interface for the Fast Learner platform, adhering to the Nigerian education system's JSS/SSS requirements. The implementation will follow a sequential flow: **Class Selection → Subject Selection → Term Selection → Topic Selection → Lessons**, with focus on the first two phases initially.

**Current State:**
- ✅ Basic subject selection components exist (`SubjectSelectionView`, `CompulsorySelector`, `SelectiveGrid`)
- ✅ API client implemented (`lib/api/subjects.ts`)
- ✅ Type definitions exist (`lib/types/subjects.ts`)
- ✅ Route structure in place (`app/(protected)/dashboard/subject`)

**Target State:**
- Enhanced UI/UX with shadcn/ui + Aceternity UI
- Class selection step before subject selection
- Improved visual feedback and engagement
- Better error handling and loading states
- Consistent design language

---

## Phase 1: Subject Selection Enhancement (Current Focus)

### 1.1 Current Implementation Audit

**Existing Components:**
- `components/dashboard/subjects/SubjectSelectionView.tsx` - Main container
- `components/dashboard/subjects/compulsory-selector.tsx` - JSS compulsory selection
- `components/dashboard/subjects/selective-grid.tsx` - Selective subjects grid
- `app/(protected)/dashboard/subject/page.tsx` - Route page
- `app/(protected)/dashboard/subject/page.client.tsx` - Client wrapper
- `app/(protected)/dashboard/subject/layout.tsx` - Layout wrapper

**Existing API:**
- `lib/api/subjects.ts` - API client functions
- `lib/types/subjects.ts` - TypeScript interfaces

**Gaps Identified:**
1. No class selection step (required before subject selection)
2. UI could be more engaging (needs Aceternity UI integration)
3. Missing progress indicators
4. Limited visual feedback
5. No step-by-step wizard flow

### 1.2 Implementation Steps

#### Step 1: Add Class Selection Component
**Priority: HIGH**

**File:** `components/dashboard/subjects/class-selector.tsx`

**Requirements:**
- Fetch available classes from API (GET `/api/v1/lessons/lessons/` returns classes)
- Display classes in a visually appealing grid/card layout
- Use shadcn/ui `Card` component with Aceternity UI hover effects
- Show class name (e.g., "JSS1", "JSS2", "SSS1")
- Store selected class in context or state
- Validate selection before proceeding

**Design:**
- Use `BentoGrid` from Aceternity UI for class cards
- Each card shows class name and level indicator (JSS/SSS)
- Selected state with visual feedback (border, glow effect)
- Smooth transitions between states

**API Integration:**
- Create `getAvailableClasses()` in `lib/api/subjects.ts` or `lib/api/lessons.ts`
- Endpoint: Extract from `/api/v1/lessons/lessons/` response (classes array)

#### Step 2: Enhance Subject Selection UI
**Priority: HIGH**

**Files to Update:**
- `components/dashboard/subjects/SubjectSelectionView.tsx`
- `components/dashboard/subjects/selective-grid.tsx`
- `components/dashboard/subjects/compulsory-selector.tsx`

**Enhancements:**

1. **Progress Indicator**
   - Add step indicator at top (Step 1: Class → Step 2: Subjects)
   - Use shadcn/ui `Progress` component
   - Show completion percentage

2. **Visual Feedback**
   - Add success animations when selections are saved
   - Use Aceternity UI `AnimatedBeam` or `Sparkles` for celebrations
   - Toast notifications with shadcn/ui `Toast`

3. **Subject Cards Enhancement**
   - Use `WobbleCard` or `3D Card` from Aceternity UI
   - Add hover effects with `Magnetic` component
   - Show selection state clearly (checkmark, border glow)
   - Add subtle animations on selection

4. **Loading States**
   - Replace basic skeletons with `ShimmerButton` or enhanced skeletons
   - Add loading animations during API calls
   - Show progress for multi-step operations

5. **Error Handling**
   - Better error messages with `Alert` component
   - Retry mechanisms
   - Clear validation feedback

#### Step 3: Create Multi-Step Wizard Flow
**Priority: MEDIUM**

**File:** `components/dashboard/subjects/subject-selection-wizard.tsx`

**Flow:**
1. **Step 1: Class Selection**
   - Display available classes
   - User selects their class
   - Store in state/context

2. **Step 2: Subject Selection**
   - Show appropriate selection based on class (JSS/SSS)
   - JSS: Compulsory Selective → Selective
   - SSS: Discipline Selective only
   - Real-time validation
   - Save button with loading state

**Components Needed:**
- Wizard container with step navigation
- Step indicator component
- Navigation buttons (Next/Back/Save)
- Step validation logic

**Design Pattern:**
- Use shadcn/ui `Tabs` or custom step indicator
- Smooth transitions between steps
- Disable navigation until current step is valid

#### Step 4: Integrate Aceternity UI Components
**Priority: MEDIUM**

**Components to Install/Use:**
1. **BentoGrid** - For class and subject grids
2. **WobbleCard** - For subject cards
3. **3D Card** - Alternative card style
4. **AnimatedBeam** - For success celebrations
5. **Sparkles** - For visual feedback
6. **Magnetic** - For interactive hover effects
7. **ShimmerButton** - For loading states

**Installation:**
```bash
pnpm add @aceternity/ui
# Or install individual components from shadcn.io
```

#### Step 5: Add Context for Academic State
**Priority: MEDIUM**

**File:** `components/providers/academic-context.tsx` (may already exist)

**State to Manage:**
- Selected class
- Selected subjects
- Current term (for future use)
- Selection status

**Benefits:**
- Share state across components
- Persist selections
- Easy access to academic context

---

## Phase 2: API Integration & Data Flow

### 2.1 API Client Enhancements

**File:** `lib/api/subjects.ts`

**Functions Needed:**
1. `getAvailableClasses()` - Fetch classes from lessons endpoint
2. `getStudentSubjects()` - ✅ Already exists
3. `updateCompulsorySelective()` - ✅ Already exists
4. `updateSelectiveSubjects()` - ✅ Already exists

**New Function:**
```typescript
export async function getAvailableClasses(): Promise<ClassesResponse> {
  // Call GET /api/v1/lessons/lessons/ or dedicated classes endpoint
  // Extract classes array from response
  // Return typed response
}
```

### 2.2 Type Definitions

**File:** `lib/types/subjects.ts`

**Add:**
```typescript
export interface Class {
  id: number;
  name: string; // "JSS1", "JSS2", "SSS1", etc.
}

export interface ClassesResponse {
  success: boolean;
  message: string;
  content: {
    classes: Class[];
  };
  code: number;
}
```

---

## Phase 3: UI/UX Design Implementation

### 3.1 Design Principles (From Learning Platforms)

**Apply These Patterns:**

1. **Bite-Sized, Sequential Learning**
   - Clear step-by-step flow
   - One task at a time
   - Progress indicators

2. **Visual Feedback and Delight**
   - Immediate feedback on actions
   - Success animations
   - Clear error messages
   - Progress visualization

3. **Minimalist and Focused UI**
   - Clean layout with white space
   - Focus on current step
   - Remove distractions
   - Clear typography

4. **Gamification Elements**
   - Progress bars
   - Completion badges (future)
   - Visual rewards on completion

### 3.2 Component Structure

```
components/dashboard/subjects/
├── subject-selection-wizard.tsx    # Main wizard container
├── class-selector.tsx               # Step 1: Class selection
├── SubjectSelectionView.tsx        # Step 2: Subject selection (enhanced)
├── compulsory-selector.tsx         # JSS compulsory (enhanced)
├── selective-grid.tsx               # Selective subjects (enhanced)
├── subject-card.tsx                 # Reusable subject card
├── step-indicator.tsx               # Progress indicator
└── selection-summary.tsx            # Review before finalizing
```

### 3.3 Recommended shadcn/ui Components

**Already Installed:**
- ✅ Card, Button, Toast, RadioGroup, Skeleton, Progress

**To Add:**
- `Badge` - For status indicators
- `Alert` - For error messages
- `Dialog` - For confirmation modals
- `Tabs` - For step navigation (optional)
- `Separator` - For visual separation

### 3.4 Recommended Aceternity UI Components

**From shadcn.io:**
1. **BentoGrid** - Grid layout for classes/subjects
2. **WobbleCard** - Interactive subject cards
3. **AnimatedBeam** - Success animations
4. **Sparkles** - Visual feedback
5. **Magnetic** - Hover interactions
6. **ShimmerButton** - Loading states

**Installation:**
```bash
# Install via shadcn CLI
npx shadcn@latest add bento-grid
npx shadcn@latest add wobble-card
npx shadcn@latest add animated-beam
npx shadcn@latest add sparkles
npx shadcn@latest add magnetic
npx shadcn@latest add shimmer-button
```

---

## Phase 4: Implementation Checklist

### Phase 4.1: Setup & Preparation
- [ ] Audit existing components and identify gaps
- [ ] Install required Aceternity UI components
- [ ] Review API endpoints and ensure all are accessible
- [ ] Set up TypeScript types for new data structures
- [ ] Create component file structure

### Phase 4.2: Class Selection Implementation
- [ ] Create `class-selector.tsx` component
- [ ] Implement `getAvailableClasses()` API function
- [ ] Add class selection UI with BentoGrid
- [ ] Add class selection to wizard flow
- [ ] Store selected class in context/state
- [ ] Add validation for class selection

### Phase 4.3: Subject Selection Enhancement
- [ ] Enhance `SubjectSelectionView.tsx` with better UI
- [ ] Update `selective-grid.tsx` with Aceternity UI components
- [ ] Update `compulsory-selector.tsx` with better visuals
- [ ] Add progress indicators
- [ ] Implement success animations
- [ ] Add error handling and retry logic
- [ ] Improve loading states

### Phase 4.4: Wizard Flow Integration
- [ ] Create `subject-selection-wizard.tsx` container
- [ ] Implement step navigation
- [ ] Add step validation
- [ ] Create step indicator component
- [ ] Add navigation buttons (Next/Back/Save)
- [ ] Implement state persistence

### Phase 4.5: Polish & Testing
- [ ] Add smooth transitions between steps
- [ ] Test JSS flow (compulsory + selective)
- [ ] Test SSS flow (selective only)
- [ ] Test error scenarios
- [ ] Test loading states
- [ ] Verify API integration
- [ ] Mobile responsiveness
- [ ] Accessibility checks

---

## Phase 5: Future Enhancements (Post-MVP)

### 5.1 Term Selection
- Add term selection step after subject selection
- Integrate with academic context
- Store term preference

### 5.2 Topic Selection
- Add topic selection interface
- Filter topics by selected subjects
- Visual topic cards

### 5.3 Lessons Integration
- Connect to lessons API
- Filter lessons by selected subjects
- Display lesson progress

### 5.4 Advanced Features
- Subject recommendations based on class
- Progress tracking
- Selection history
- Undo/redo functionality

---

## Technical Specifications

### API Endpoints

**Class Selection:**
- `GET /api/v1/lessons/lessons/` - Returns classes in response
- Or dedicated: `GET /api/v1/classes` (if available)

**Subject Selection:**
- `GET /api/v1/subjects` - ✅ Already implemented
- `POST /api/v1/subjects/update-compulsory-selective` - ✅ Already implemented
- `POST /api/v1/subjects/update-selective` - ✅ Already implemented

### Component Props & Interfaces

**ClassSelector:**
```typescript
interface ClassSelectorProps {
  onSelect: (classId: number) => void;
  selectedClassId?: number;
  isLoading?: boolean;
}
```

**SubjectSelectionWizard:**
```typescript
interface SubjectSelectionWizardProps {
  initialStep?: number;
  onComplete?: () => void;
}
```

### State Management

**Recommended Approach:**
- Use React Context for academic state (class, subjects, term)
- Local component state for UI state (current step, loading, errors)
- Server state via React Query or SWR (optional, for caching)

---

## Design Guidelines

### Color Scheme
- Use existing theme colors from base project
- Primary: For selected states
- Success: Green for completed steps
- Error: Red for validation errors
- Muted: For disabled states

### Typography
- Headings: Use project's heading font
- Body: Use project's body font
- Sizes: Follow project's type scale

### Spacing
- Consistent padding/margins
- Use Tailwind spacing scale
- Ample white space for focus

### Animations
- Subtle transitions (200-300ms)
- Smooth state changes
- Purposeful animations
- Avoid excessive motion

---

## Testing Strategy

### Unit Tests
- Component rendering
- State management
- Validation logic
- API function calls

### Integration Tests
- Wizard flow
- API integration
- Error handling
- State persistence

### E2E Tests
- Complete selection flow
- JSS vs SSS paths
- Error recovery
- Mobile responsiveness

---

## Success Criteria

### Functional Requirements
- ✅ Users can select their class
- ✅ Users can select subjects based on class level
- ✅ JSS users select 1 compulsory + 4 selective
- ✅ SSS users select 5 selective
- ✅ Selections are saved to backend
- ✅ Proper error handling
- ✅ Loading states work correctly

### UI/UX Requirements
- ✅ Clean, modern interface
- ✅ Clear visual feedback
- ✅ Smooth transitions
- ✅ Mobile responsive
- ✅ Accessible (keyboard navigation, screen readers)
- ✅ Consistent with base project design

### Performance Requirements
- ✅ Fast initial load
- ✅ Smooth animations (60fps)
- ✅ Efficient API calls
- ✅ No unnecessary re-renders

---

## Next Steps

1. **Immediate Actions:**
   - Review and approve this plan
   - Set up development environment
   - Install required components
   - Begin with Step 1: Class Selection

2. **Development Order:**
   - Start with class selection (foundation)
   - Enhance existing subject components
   - Integrate wizard flow
   - Polish and test

3. **Iteration:**
   - Build incrementally
   - Test each component
   - Gather feedback
   - Refine based on results

---

## Notes

- This plan focuses on **Subject Selection** only
- **Lessons interface** will be addressed in a separate phase
- All components should be reusable and modular
- Follow existing code patterns in the project
- Maintain TypeScript strict mode
- Use existing authentication flow
- Respect HttpOnly cookie pattern

---

**Document Version:** 1.0  
**Last Updated:** Based on current codebase state  
**Status:** Ready for Implementation

