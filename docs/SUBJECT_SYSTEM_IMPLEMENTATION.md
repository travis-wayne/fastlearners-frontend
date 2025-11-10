# Subject System Implementation Guide

## Overview

This document describes the updated subject registration and management system implementation, following the specifications from the implementation guides.

## System Architecture

### Flow Overview

The subject registration system follows a 4-step flow:

1. **Academic Setup** → Student sets class, term, and discipline (SSS only)
2. **Compulsory Selective** → Select 1 religious study subject
3. **Elective Subjects** → Select 4 (JSS) or 5 (SSS) elective subjects
4. **Dashboard** → View registered subjects and progress

### Component Structure

```
components/dashboard/subjects/
├── AcademicSetupForm.tsx          # Step 1: Class, Term, Discipline selection
├── AcademicSetupClient.tsx         # Client wrapper for AcademicSetupForm
├── SubjectSelectionForm.tsx        # Steps 2-3: Compulsory + Elective selection
└── (legacy components remain for backward compatibility)
```

### Main Page Flow Control

The main subjects page (`app/(protected)/dashboard/subjects/page.tsx`) implements intelligent flow control:

1. **Check Authentication** → Redirect to login if no token
2. **Fetch User Profile** → Get user's class and discipline
3. **Determine Flow State**:
   - No class → Show `AcademicSetupForm`
   - Has class but no subjects → Show `SubjectSelectionForm`
   - Has subjects → Show `SubjectDashboard`

## API Integration

### Direct Backend Functions

The system provides direct backend API functions (with token parameter) for server-side use:

```typescript
// lib/api/subjects.ts
- getUserProfile(token: string): Promise<ProfileData>
- updateProfile(token: string, data: {...}): Promise<ProfileData>
- getSubjects(token: string): Promise<ApiSubjectsResponse['content']>
- updateCompulsorySelective(token: string, subjectId: number): Promise<void>
- updateSelectiveSubjects(token: string, subjectIds: number[]): Promise<void>
- getDashboard(token: string): Promise<DashboardData['content']>
```

### Client-Side Functions

For client components, internal API routes are used (tokens stay server-side):

```typescript
- getStudentSubjects(): Promise<SubjectsResponse>
- updateCompulsorySelectiveClient(subjectId: number): Promise<UpdateResponse>
- updateSelectiveSubjectsClient(subjectIds: number[]): Promise<UpdateResponse>
```

## Key Implementation Details

### 1. Term Storage

**Important**: The `term` field is stored in `localStorage`, NOT sent to the backend API. Only `class` and `discipline` are sent to the backend via `POST /api/v1/profile/edit`.

```typescript
// Store term locally
localStorage.setItem('current_term', selectedTerm);
```

### 2. FormData Format for Selective Subjects

When updating selective subjects, use `FormData` with `subjects[]` key repeated:

```typescript
const formData = new FormData();
subjectIds.forEach(id => {
  formData.append('subjects[]', id.toString());
});
```

### 3. Subject Requirements

- **JSS Classes**: 1 compulsory selective + 4 selective subjects
- **SSS Classes**: 1 compulsory selective + 5 discipline selective subjects
- **SSS Requirement**: Must have discipline (Art/Commercial/Science) in profile

### 4. Profile Fields (One-Time Only)

These fields can only be set ONCE:
- `username`
- `class`
- `discipline`
- `gender`
- `date_of_birth`

### 5. Discipline Field

- Only shown for SSS classes (JSS1, JSS2, JSS3 don't need discipline)
- Required before fetching subjects for SSS students
- Options: Science, Art, Commercial

## Data Types

### Core Types

```typescript
// lib/types/subjects.ts
- SubjectItem: { id: number; name: string }
- ProfileData: User profile with class, discipline, etc.
- ApiSubjectsResponse: Full API response structure
- SubjectRegistrationState: Frontend form state
```

### Metadata

```typescript
// data/subjects-metadata.ts
- subjectIcons: Record<string, string>  // Emoji icons for subjects
- academicTerms: Array of term definitions
- disciplines: Array of discipline options
- Helper functions: getSubjectIcon(), getClassCategory(), getSelectiveRequirement()
```

## Component Usage

### AcademicSetupForm

```tsx
<AcademicSetupForm 
  token={token}  // Optional: for server-side direct API calls
  onComplete={() => router.refresh()}  // Callback after successful setup
/>
```

**Features**:
- Class selection (JSS1-JSS3, SSS1-SSS3)
- Discipline selection (SSS only)
- Term selection (stored in localStorage)
- Validates all required fields before submission

### SubjectSelectionForm

```tsx
<SubjectSelectionForm 
  token={token}  // Optional: for server-side direct API calls
  classLevel="SSS1"  // Required: determines elective count
/>
```

**Features**:
- Fetches available subjects from API
- Two-step selection:
  1. Compulsory selective (1 religious study)
  2. Elective subjects (4 for JSS, 5 for SSS)
- Progress tracking and validation
- Disables selection when limit reached

## API Endpoints

### Backend Endpoints (FastLearnersApp)

```
GET  /api/v1/profile                    # Get user profile
POST /api/v1/profile/edit               # Update profile (class, discipline)
GET  /api/v1/subjects                   # Get available subjects
POST /api/v1/subjects/update-compulsory-selective  # Update core subject
POST /api/v1/subjects/update-selective  # Update elective subjects
GET  /api/v1/dashboard                  # Get dashboard data
```

### Internal API Routes (Next.js)

```
GET  /api/subjects                      # Proxy to backend (server-side)
POST /api/subjects/update-compulsory-selective  # Proxy (server-side)
POST /api/subjects/update-selective     # Proxy (server-side)
POST /api/profile/edit                  # Proxy (server-side)
```

## Testing Checklist

### Academic Setup
- [ ] Class selection works (JSS1-SSS3)
- [ ] Discipline field only shows for SSS classes
- [ ] Discipline is required for SSS, not for JSS
- [ ] Term selection works
- [ ] API call to POST /api/v1/profile/edit succeeds
- [ ] Term is stored in localStorage
- [ ] Success redirects/reloads page
- [ ] Error handling shows toast messages

### Subject Selection
- [ ] Compulsory selective subjects load from API
- [ ] Can select exactly 1 compulsory subject
- [ ] POST to /api/v1/subjects/update-compulsory-selective works
- [ ] "Complete" badge shows after compulsory saved
- [ ] Elective section appears after compulsory complete
- [ ] Elective subjects load from API
- [ ] Can select exactly 4 (JSS) or 5 (SSS) electives
- [ ] Progress bar updates correctly
- [ ] Subjects disable when limit reached
- [ ] POST to /api/v1/subjects/update-selective uses FormData
- [ ] subjects[] array is sent correctly
- [ ] Final submission redirects to dashboard

### Subject Dashboard
- [ ] All registered subjects display
- [ ] Core subject identified with badge
- [ ] Stats cards render (even with 0 values)
- [ ] Search filters subjects
- [ ] Tabs filter correctly (All/Core/Electives)
- [ ] Subject cards link to lessons with ?subject={id}
- [ ] Icons display correctly
- [ ] Cards have hover effect

### Flow Control
- [ ] New user sees academic setup
- [ ] After academic setup, sees subject selection
- [ ] After subjects registered, sees dashboard
- [ ] Returning user goes straight to dashboard
- [ ] All auth checks work
- [ ] Layout matches design aesthetic

## Error Handling

### Common Issues & Solutions

**Issue**: "Unauthorized" errors
- **Solution**: Check that auth token is being retrieved correctly from cookies

**Issue**: Discipline not saving for SSS
- **Solution**: Ensure discipline is only sent when class starts with 'SSS'

**Issue**: subjects[] not received by backend
- **Solution**: Use FormData, not JSON, for the selective subjects endpoint

**Issue**: Term not persisting
- **Solution**: Term is stored in localStorage, not in the backend

**Issue**: Page not updating after submission
- **Solution**: Use `router.refresh()` or `window.location.reload()` after successful API calls

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://fastlearnersapp.com
```

## Migration Notes

### Backward Compatibility

- Legacy components (`SubjectSetupForm.tsx`, `SubjectSetupShell.tsx`) remain for backward compatibility
- Internal API routes continue to work for existing code
- New components can use either direct functions (with token) or internal routes

### Future Enhancements

1. **Lessons API Integration**
   - Connect to actual lessons endpoints
   - Implement lesson content viewer
   - Add progress tracking

2. **Reregistration Flow**
   - Allow subject changes (with restrictions)
   - Handle class upgrades

3. **Dashboard Enhancements**
   - Real progress calculations
   - Time tracking
   - Achievement badges

## Files Created/Updated

### New Files
- `components/dashboard/subjects/AcademicSetupForm.tsx`
- `components/dashboard/subjects/AcademicSetupClient.tsx`
- `components/dashboard/subjects/SubjectSelectionForm.tsx`
- `data/subjects-metadata.ts`
- `docs/SUBJECT_SYSTEM_IMPLEMENTATION.md`

### Updated Files
- `lib/types/subjects.ts` - Added new type definitions
- `lib/api/subjects.ts` - Added direct backend functions
- `app/(protected)/dashboard/subjects/page.tsx` - Updated flow control

### Legacy Files (Still Functional)
- `components/dashboard/student/SubjectSetupForm.tsx`
- `components/dashboard/student/SubjectSetupShell.tsx`
- `components/dashboard/student/SubjectDashboard.tsx`

## References

- Implementation Guide: `cursor_implementation_update_guide.md`
- Final Guide: `final_cursor_guide.md`
- API Documentation: `docs/API_ENDPOINTS.md`

