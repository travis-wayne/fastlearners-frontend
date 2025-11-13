# Fast Learners Frontend - Comprehensive Codebase Documentation

**Generated:** 2024  
**Project:** Fast Learners Frontend (Next.js)  
**Version:** 0.3.1  
**Framework:** Next.js 14.2.5 with TypeScript

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Architecture & Tech Stack](#architecture--tech-stack)
4. [Project Structure](#project-structure)
5. [Authentication System](#authentication-system)
6. [Authorization & RBAC](#authorization--rbac)
7. [API Architecture](#api-architecture)
8. [State Management](#state-management)
9. [Components Architecture](#components-architecture)
10. [Data Flows](#data-flows)
11. [File Upload System](#file-upload-system)
12. [Lessons System](#lessons-system)
13. [Security Analysis](#security-analysis)
14. [Configuration Files](#configuration-files)
15. [Build & Deployment](#build--deployment)
16. [Known Issues & Technical Debt](#known-issues--technical-debt)
17. [Best Practices & Patterns](#best-practices--patterns)
18. [Development Workflow](#development-workflow)

---

## Executive Summary

**Fast Learners Frontend** is a modern educational platform built with Next.js 14, providing a comprehensive learning management system for Nigerian students. The application features:

- **Multi-role authentication** (Guest, Student, Guardian, Teacher, Admin, Superadmin)
- **Role-based access control (RBAC)** with hierarchical permissions
- **HttpOnly cookie-based authentication** for enhanced security
- **CSV-based lesson upload system** for content management
- **Profile completion system** with two-stage onboarding
- **Content preview system** for guest users
- **Comprehensive dashboard** with role-specific views

### Key Strengths
✅ Modern tech stack with TypeScript  
✅ Comprehensive RBAC implementation  
✅ Secure authentication with HttpOnly cookies  
✅ Well-structured component architecture  
✅ Modular API layer  
✅ Type-safe throughout  

### Critical Issues
⚠️ Middleware RBAC incomplete (userRole is undefined)  
⚠️ Multiple TODO items indicating incomplete features  
⚠️ TypeScript strict mode disabled  
⚠️ Some API endpoints use mock data  
⚠️ Debug logging scattered throughout codebase  

---

## Project Overview

### Purpose
Fast Learners is an educational platform designed for the Nigerian education system, supporting:
- Multiple academic levels (JSS, SS, SSS)
- Subject-based learning with lessons, concepts, examples, and exercises
- Progress tracking and completion
- Multi-stakeholder access (students, parents, teachers, admins)

### Target Users
1. **Students** - Primary learners accessing lessons and exercises
2. **Guardians/Parents** - Monitoring children's progress
3. **Teachers** - Creating and managing lesson content
4. **Admins** - Platform management and oversight
5. **Superadmins** - Full system control
6. **Guests** - Preview access before full registration

### Core Features
- User registration and authentication
- Email verification with OTP
- Password management (creation, reset)
- Profile completion with role selection
- Lesson browsing and viewing
- Progress tracking
- CSV-based content upload
- Role-based dashboards
- Content preview for guests

---

## Architecture & Tech Stack

### Core Technologies

#### Frontend Framework
- **Next.js 14.2.5** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety (strict mode disabled)

#### Styling
- **Tailwind CSS 3.4.6** - Utility-first CSS framework
- **shadcn/ui** - Component library (Radix UI primitives)
- **Framer Motion 12.23.22** - Animation library
- **CSS Variables** - Theme system with dark mode support

#### State Management
- **Zustand 5.0.7** - Lightweight state management
  - `authStore.ts` - Authentication state
  - `lessons.ts` - Lessons data and filters

#### Content Management
- **Contentlayer2 0.5.0** - MDX content processing
- **MDX** - Markdown with React components
- **Rehype/Remark** - Markdown processing plugins

#### Form Handling
- **React Hook Form 7.52.1** - Form state management
- **Zod 3.23.8** - Schema validation
- **@hookform/resolvers** - Form validation integration

#### API & Data Fetching
- **Axios 1.11.0** - HTTP client (legacy, being phased out)
- **Native Fetch API** - Primary HTTP client
- **OpenAPI TypeScript** - Type generation from OpenAPI spec

#### UI Components
- **Radix UI** - Headless component primitives
  - Dialog, Dropdown, Select, Tabs, Toast, etc.
- **Lucide React** - Icon library
- **Recharts 2.12.7** - Chart library
- **Sonner 1.5.0** - Toast notifications

#### Utilities
- **date-fns 3.6.0** - Date manipulation
- **clsx + tailwind-merge** - Conditional class names
- **js-cookie 3.0.5** - Cookie management (legacy)
- **papaparse 5.5.3** - CSV parsing

#### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

### Architecture Patterns

#### 1. Server-Side Rendering (SSR)
- Next.js App Router with server components
- API routes for backend proxy
- Server-side cookie management

#### 2. Client-Side State
- Zustand stores for global state
- React hooks for component state
- Local storage for persistence (legacy)

#### 3. API Layer
- Next.js API routes as proxy layer
- Direct backend API calls from server routes
- HttpOnly cookie-based authentication

#### 4. Component Architecture
- Atomic design principles
- Reusable UI components
- Feature-specific components
- Layout components

---

## Project Structure

```
fast-leaner-frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   └── auth/                  # Auth pages
│   │       ├── login/
│   │       ├── register/
│   │       ├── verify-email/
│   │       ├── create-password/
│   │       └── ...
│   ├── (protected)/              # Protected route group
│   │   ├── dashboard/             # Dashboard pages
│   │   │   ├── student/
│   │   │   ├── teacher/
│   │   │   ├── admin/
│   │   │   └── superadmin/
│   │   ├── onboarding/           # Onboarding flow
│   │   └── debug/                # Debug pages
│   ├── (marketing)/              # Marketing pages
│   │   ├── blog/
│   │   ├── pricing/
│   │   └── ...
│   ├── (docs)/                   # Documentation pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Auth endpoints
│   │   ├── lessons/              # Lesson endpoints
│   │   ├── uploads/              # File upload endpoints
│   │   ├── profile/              # Profile endpoints
│   │   └── subjects/             # Subject endpoints
│   ├── lessons/                  # Public lessons page
│   └── layout.tsx                # Root layout
│
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard components
│   ├── lessons/                   # Lesson components
│   ├── ui/                        # shadcn/ui components
│   ├── forms/                     # Form components
│   ├── layout/                    # Layout components
│   └── ...
│
├── lib/                          # Utilities and helpers
│   ├── api/                      # API clients
│   │   ├── auth.ts               # Auth API
│   │   ├── client.ts              # API client config
│   │   ├── lessons.ts             # Lessons API
│   │   └── ...
│   ├── rbac/                      # RBAC utilities
│   │   └── role-config.ts         # Role configurations
│   ├── server/                    # Server utilities
│   │   ├── auth-cookies.ts        # Cookie management
│   │   └── cookie-constants.ts    # Cookie constants
│   ├── types/                     # TypeScript types
│   ├── utils/                     # Utility functions
│   └── validations/               # Zod schemas
│
├── store/                        # Zustand stores
│   └── authStore.ts               # Auth state store
│
├── hooks/                         # Custom React hooks
│   ├── useAuthInit.ts             # Auth initialization
│   ├── useRBACGuard.ts           # RBAC guard hook
│   └── ...
│
├── config/                        # Configuration files
│   ├── site.ts                    # Site config
│   ├── navigation.ts              # Navigation config
│   ├── dashboard.ts               # Dashboard config
│   └── education.ts               # Education system config
│
├── content/                       # MDX content
│   ├── blog/                      # Blog posts
│   ├── docs/                      # Documentation
│   └── guides/                    # Guides
│
├── public/                        # Static assets
│   ├── lesson-csv-files/          # Sample CSV files
│   └── ...
│
├── styles/                        # Global styles
│   ├── globals.css                # Global CSS
│   └── mdx.css                    # MDX styles
│
├── middleware.ts                  # Next.js middleware
├── next.config.js                 # Next.js config
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies
└── env.mjs                        # Environment validation
```

---

## Authentication System

### Overview
The authentication system uses **HttpOnly cookies** for secure token storage, preventing XSS attacks. The system supports:
- Email/password authentication
- Google OAuth (partial implementation)
- Multi-step registration flow
- Email verification with OTP
- Password reset flow

### Authentication Flow

#### Registration Flow
```
1. User enters email → POST /api/auth/register
2. Backend sends OTP to email
3. User enters 6-digit OTP → POST /api/auth/verify-email
4. Backend returns temporary token (stored in HttpOnly cookie)
5. User creates password → POST /api/auth/create-password
6. User automatically logged in with guest role
7. Redirect to onboarding/profile completion
```

#### Login Flow
```
1. User enters email/phone + password → POST /api/auth/login
2. Backend validates credentials
3. Backend returns access_token + user data
4. Server sets HttpOnly cookies:
   - auth_token (access token)
   - auth_expires (expiration timestamp)
5. Client updates Zustand store with user data
6. Redirect based on user role
```

#### Logout Flow
```
1. User clicks logout → POST /api/auth/logout
2. Server clears HttpOnly cookies
3. Client clears Zustand store
4. Redirect to login page
```

### Cookie Management

#### Server-Side (`lib/server/auth-cookies.ts`)
```typescript
// Cookie names
AUTH_TOKEN_COOKIE = "auth_token"
AUTH_EXPIRES_COOKIE = "auth_expires"
REG_TOKEN_COOKIE = "reg_token" // Temporary during registration

// Cookie options
{
  httpOnly: true,        // Prevents JavaScript access
  secure: isProd,        // HTTPS only in production
  sameSite: "strict",    // CSRF protection
  path: "/"
}
```

#### Cookie Functions
- `setAuthCookiesServer()` - Set auth cookies
- `clearAuthCookiesServer()` - Clear auth cookies
- `parseAuthCookiesServer()` - Read auth cookies
- `setRegTokenServer()` - Set temporary registration token

### Auth Store (`store/authStore.ts`)

#### State
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;              // Store hydration status
  academicFieldsChanged: boolean;  // Track profile changes
}
```

#### Key Actions
- `hydrate()` - Initialize auth state from server session
- `login()` - Authenticate user
- `logout()` - Clear authentication
- `updateUserProfile()` - Update user data
- `getProfileStatus()` - Get profile completion status
- `isProfileComplete()` - Check if profile is complete
- `canAccessFeature()` - Feature gating for guests

#### Hydration Process
1. Client-side only (`typeof window !== "undefined"`)
2. Fetches `/api/auth/session` to get current user
3. Updates store with user data or null
4. Sets `isHydrated: true` to prevent blocking
5. Includes retry logic with exponential backoff

### API Routes

#### `/api/auth/login` (`app/api/auth/login/route.ts`)
- Validates credentials
- Calls backend API
- Sets HttpOnly cookies
- Returns user data
- Handles unverified users (redirects to verification)

#### `/api/auth/session` (`app/api/auth/session/route.ts`)
- Reads auth cookies
- Validates token expiration
- Fetches user from backend
- Returns current user or null

#### `/api/auth/logout` (`app/api/auth/logout/route.ts`)
- Clears HttpOnly cookies
- Calls backend logout endpoint

### Security Features

✅ **HttpOnly Cookies** - Tokens not accessible via JavaScript  
✅ **Secure Flag** - HTTPS only in production  
✅ **SameSite Strict** - CSRF protection  
✅ **Token Expiration** - Automatic expiration checking  
✅ **Server-Side Validation** - All auth checks on server  

### Known Issues

⚠️ **Google OAuth** - Partially implemented, may not work fully  
⚠️ **Token Refresh** - No automatic token refresh mechanism  
⚠️ **Session Timeout** - No explicit session timeout handling  

---

## Authorization & RBAC

### Role Hierarchy

```typescript
ROLE_HIERARCHY = {
  guest: 0,
  student: 1,
  guardian: 1,
  teacher: 2,
  admin: 3,
  superadmin: 4
}
```

### Role Configurations (`lib/rbac/role-config.ts`)

#### Guest Role
- **Home Route:** `/onboarding`
- **Allowed Routes:** Auth pages, onboarding, settings
- **Restricted Routes:** Dashboard, admin, teacher routes
- **Can Switch Roles:** Yes (once)
- **Requires Onboarding:** Yes

#### Student Role
- **Home Route:** `/dashboard`
- **Allowed Routes:** Dashboard, lessons, exercises, profile
- **Restricted Routes:** Admin, teacher, superadmin routes
- **Can Switch Roles:** No
- **Requires Onboarding:** No

#### Guardian Role
- **Home Route:** `/dashboard`
- **Allowed Routes:** Dashboard, progress, guardian tools
- **Restricted Routes:** Admin, teacher routes
- **Can Switch Roles:** No
- **Requires Onboarding:** No

#### Teacher Role
- **Home Route:** `/dashboard/teacher/lessons`
- **Allowed Routes:** Teacher dashboard, lessons, uploads
- **Restricted Routes:** Superadmin routes
- **Can Switch Roles:** No
- **Assigned By:** Superadmin only

#### Admin Role
- **Home Route:** `/dashboard/admin/charts`
- **Allowed Routes:** Admin dashboard, users, reports
- **Restricted Routes:** Superadmin, teacher routes
- **Can Switch Roles:** No
- **Assigned By:** Superadmin only

#### Superadmin Role
- **Home Route:** `/dashboard/superadmin`
- **Allowed Routes:** Everything
- **Restricted Routes:** None
- **Can Switch Roles:** No
- **Assigned By:** Self (only superadmin can create superadmin)

### RBAC Utilities (`RBACUtils`)

#### `canAccessRoute(user, route)`
Checks if user can access a specific route based on:
- Role configuration
- Route restrictions
- Protected route patterns
- Profile completion status

#### `hasPermission(userRole, permission)`
Checks if role has specific permission level:
- `SUPERADMIN` - Superadmin only
- `ADMIN` - Admin and above
- `TEACHER` - Teacher and above
- `STUDENT` - Student or teacher+
- `GUARDIAN` - Guardian or admin+

#### `getHomeRoute(userRole)`
Returns appropriate home route for role.

### Middleware (`middleware.ts`)

#### Current Implementation
```typescript
export function middleware(request: NextRequest) {
  const authData = getAuthData(request);
  const isAuthenticated = !!authData;
  const userRole = undefined as unknown as UserRole; // ⚠️ ISSUE
  // ...
}
```

#### Issues
⚠️ **Critical:** `userRole` is hardcoded to `undefined`  
⚠️ **No Role Extraction:** Role not extracted from cookies/token  
⚠️ **Incomplete RBAC:** Fine-grained RBAC skipped in middleware  

#### What Works
✅ Public route checking  
✅ Authentication checking  
✅ Auth route redirection  
✅ Guest role handling (partial)  

#### What Doesn't Work
❌ Role-based route access control  
❌ Permission-based route blocking  
❌ Dynamic role extraction from token  

### Protected Routes Component

#### `ProtectedRoute` (`components/auth/ProtectedRoute.tsx`)
Client-side route protection:
- Checks authentication status
- Validates required roles
- Enforces profile completion
- Redirects unauthorized users

#### Usage
```tsx
<ProtectedRoute requiredRoles={["student"]} requireCompleteProfile>
  <StudentDashboard />
</ProtectedRoute>
```

### RBAC Guard Hook

#### `useRBACGuard` (`hooks/useRBACGuard.ts`)
Custom hook for permission checking:
- Checks user permissions
- Returns permission status
- Provides debug logging
- Handles role hierarchy

---

## API Architecture

### API Client (`lib/api/client.ts`)

#### Base Configuration
```typescript
API_BASE = process.env.NEXT_PUBLIC_API_URL || 
           'https://fastlearnersapp.com/api/v1'
```

#### Header Building
- `buildApiHeaders(token)` - For external API calls
- `buildInternalApiHeaders()` - For internal Next.js routes

### API Route Pattern

All API routes follow this pattern:
1. **Parse auth cookies** - Get user token
2. **Validate request** - Check required fields
3. **Call backend API** - Forward request to upstream
4. **Handle errors** - Standardized error responses
5. **Return response** - JSON response with consistent format

### API Response Format

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  content: T | null;
  code: number;
  errors?: Record<string, string[]>;
}
```

### Error Handling (`lib/api/error-handler.ts`)

#### Functions
- `handleUpstreamError()` - Handle backend errors
- `handleApiError()` - Handle API route errors
- `createErrorResponse()` - Create standardized error response

#### Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `422` - Validation Error
- `500` - Internal Server Error

### API Routes

#### Authentication (`app/api/auth/`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/create-password` - Password creation
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/set-role` - Set user role
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-reset-code` - Verify reset code
- `POST /api/auth/reset-password` - Reset password

#### Lessons (`app/api/lessons/`)
- `GET /api/lessons` - List lessons
- `GET /api/lessons/[subjectSlug]/[topicSlug]/overview` - Lesson overview
- `GET /api/lessons/[subjectSlug]/[topicSlug]/content` - Lesson content
- `POST /api/lessons/by-id/[id]/complete` - Mark lesson complete

#### Uploads (`app/api/uploads/`)
- `POST /api/uploads/lessons` - Upload lessons CSV
- `POST /api/uploads/concepts` - Upload concepts CSV
- `POST /api/uploads/examples` - Upload examples CSV
- `POST /api/uploads/exercises` - Upload exercises CSV
- `POST /api/uploads/general-exercises` - Upload general exercises CSV
- `POST /api/uploads/check-markers` - Upload check markers CSV
- `POST /api/uploads/scheme-of-work` - Upload scheme of work CSV
- `POST /api/uploads/all-lesson-files` - Bulk upload all files

#### Profile (`app/api/profile/`)
- `GET /api/profile` - Get user profile
- `POST /api/profile/edit` - Update profile
- `POST /api/profile/edit/password` - Change password

#### Subjects (`app/api/subjects/`)
- `GET /api/subjects` - List subjects
- `POST /api/subjects/update-selective` - Update selective subjects
- `POST /api/subjects/update-compulsory-selective` - Update compulsory/selective

### Proxy Route

#### `/api/proxy/[...path]` (`app/api/proxy/[...path]/route.ts`)
Generic proxy for backend API calls:
- Forwards requests to upstream API
- Preserves authentication headers
- Handles CORS
- Returns responses as-is

---

## State Management

### Zustand Stores

#### Auth Store (`store/authStore.ts`)

**State:**
```typescript
{
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  academicFieldsChanged: boolean;
}
```

**Actions:**
- `setUser(user)` - Update user data
- `login(credentials)` - Authenticate user
- `logout()` - Clear authentication
- `updateUserProfile(updates)` - Update profile
- `getProfileStatus()` - Get completion status
- `isProfileComplete()` - Check completion
- `canAccessFeature(feature)` - Feature gating

**Profile Helpers:**
- `getProfileCompletionPercentage()` - Calculate completion %
- `getMissingProfileFields()` - Get missing fields
- `hasRole(role)` - Check if user has role
- `isGuest()` - Check if user is guest

#### Lessons Store (`lib/store/lessons.ts`)

**State:**
```typescript
{
  classes: ClassItem[];
  subjects: Subject[];
  terms: Term[];
  weeks: Week[];
  lessons: Lesson[];
  selectedLesson: LessonContent | null;
  filters: LessonFilters;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  progress: number;
}
```

**Actions:**
- `fetchMetadata()` - Load classes, subjects, terms, weeks
- `fetchLessons(page)` - Load lessons list
- `fetchLessonContentBySlug()` - Load lesson content
- `setFilters()` - Update filters
- `setCurrentSection()` - Set active section
- `markSectionCompleted()` - Mark section done

### State Persistence

#### Auth Store
- **No persistence** - Relies on HttpOnly cookies
- Hydrates from `/api/auth/session` on mount
- State cleared on logout

#### Lessons Store
- **Persisted** - Uses Zustand persist middleware
- Stored in localStorage
- Survives page refreshes

---

## Components Architecture

### Component Organization

#### Auth Components (`components/auth/`)
- `LoginForm.tsx` - Email/password login
- `RegisterForm.tsx` - Email registration
- `VerifyOtpForm.tsx` - OTP verification
- `CreatePasswordForm.tsx` - Password creation
- `ProtectedRoute.tsx` - Route protection wrapper
- `AuthLayout.tsx` - Auth page layout
- `GoogleAuthChecker.tsx` - Google OAuth handler

#### Dashboard Components (`components/dashboard/`)
- `OverviewGrid.tsx` - Dashboard grid layout
- `PerformanceSection.tsx` - Performance metrics
- `AchievementsSection.tsx` - Achievements display
- `LeaderBoard.tsx` - Leaderboard component
- `role-dashboards/` - Role-specific dashboards
- `subjects/` - Subject selection and display

#### Lesson Components (`components/lessons/`)
- `LessonViewer.tsx` - Main lesson viewer
- `LessonContent.tsx` - Lesson content display
- `LessonNavigation.tsx` - Lesson navigation
- `LessonFilters.tsx` - Filter controls
- `LessonsList.tsx` - Lessons list display
- `file-upload.tsx` - CSV file upload

#### UI Components (`components/ui/`)
shadcn/ui components:
- Button, Card, Dialog, Dropdown, Input, etc.
- All built on Radix UI primitives
- Fully typed with TypeScript
- Accessible by default

#### Form Components (`components/forms/`)
- `user-name-form.tsx` - Name update form
- `user-role-form.tsx` - Role selection form
- `billing-form-button.tsx` - Billing form
- `newsletter-form.tsx` - Newsletter signup

### Component Patterns

#### Server Components (Default)
- No "use client" directive
- Server-side rendering
- Direct database/API access
- No client-side JavaScript

#### Client Components
- "use client" directive
- Interactive features
- State management
- Event handlers

#### Layout Components
- `AuthLayout` - Auth page wrapper
- `DashboardLayout` - Dashboard wrapper
- `LessonLayout` - Lesson page wrapper

---

## Data Flows

### User Registration Flow

```
1. User fills registration form
   ↓
2. POST /api/auth/register
   ↓
3. Next.js route calls backend API
   ↓
4. Backend sends OTP email
   ↓
5. User enters OTP
   ↓
6. POST /api/auth/verify-email
   ↓
7. Backend validates OTP
   ↓
8. Server sets reg_token cookie
   ↓
9. User creates password
   ↓
10. POST /api/auth/create-password
   ↓
11. Backend creates user account
   ↓
12. Server sets auth_token cookie
   ↓
13. Zustand store updated
   ↓
14. Redirect to onboarding
```

### Login Flow

```
1. User enters credentials
   ↓
2. POST /api/auth/login
   ↓
3. Next.js route validates input
   ↓
4. Calls backend /login endpoint
   ↓
5. Backend validates credentials
   ↓
6. Returns access_token + user
   ↓
7. Server sets HttpOnly cookies
   ↓
8. Returns user data to client
   ↓
9. Zustand store updated
   ↓
10. Redirect based on role
```

### Lesson Viewing Flow

```
1. User navigates to lesson
   ↓
2. GET /api/lessons/[subjectSlug]/[topicSlug]/content
   ↓
3. Next.js route reads auth cookies
   ↓
4. Calls backend API with token
   ↓
5. Backend returns lesson content
   ↓
6. Client renders lesson
   ↓
7. User marks section complete
   ↓
8. POST /api/lessons/by-id/[id]/complete
   ↓
9. Backend updates progress
   ↓
10. Client updates UI
```

### File Upload Flow

```
1. User selects CSV file
   ↓
2. Client validates file format
   ↓
3. POST /api/uploads/[type]
   ↓
4. Next.js route reads auth cookies
   ↓
5. Creates FormData with file
   ↓
6. Calls backend upload endpoint
   ↓
7. Backend processes CSV
   ↓
8. Returns upload result
   ↓
9. Client displays success/error
```

---

## File Upload System

### Overview
The file upload system supports bulk CSV uploads for lesson content. It handles:
- Lessons
- Concepts
- Examples
- Exercises
- General Exercises
- Check Markers
- Scheme of Work

### Upload Components

#### `FileUpload` (`components/lessons/file-upload.tsx`)
- Drag-and-drop interface
- File validation
- Progress tracking
- Error display
- Success feedback

#### `SmartCSVUpload` (`components/upload/SmartCSVUpload.tsx`)
- Intelligent CSV parsing
- Format detection (comma/pipe)
- Column validation
- Error diagnostics

### Upload Services

#### `lesson-service.ts` (`lib/api/lesson-service.ts`)
- `uploadLessonsFileWithValidation()` - Upload with validation
- `uploadConceptsFileWithValidation()` - Concepts upload
- `uploadExamplesFileWithValidation()` - Examples upload
- `uploadExercisesFileWithValidation()` - Exercises upload
- `uploadSchemeOfWorkFileWithValidation()` - Scheme upload

#### `bulk-lesson-upload.ts` (`lib/api/bulk-lesson-upload.ts`)
- `uploadAllLessonFilesBulk()` - Bulk upload all files
- Validates all required files
- Creates FormData
- Handles errors

### CSV Validation

#### Required Columns
```typescript
LESSON_REQUIRED_COLUMNS = [
  "id", "topic", "overview", "class", "subject",
  "term", "week", "objectives", "key_concepts"
]
```

#### Validation Process
1. File type check (CSV/TXT)
2. File size check (max 10MB)
3. Column presence check
4. Format detection (comma/pipe)
5. Content validation

### Upload Flow

```
1. User selects file
   ↓
2. Client validates file
   ↓
3. Parse CSV content
   ↓
4. Detect format (comma/pipe)
   ↓
5. Validate columns
   ↓
6. Create FormData
   ↓
7. POST /api/uploads/[type]
   ↓
8. Server validates auth
   ↓
9. Forward to backend
   ↓
10. Backend processes CSV
   ↓
11. Return result
   ↓
12. Client displays feedback
```

### Error Handling

- File validation errors
- Column mismatch errors
- Format detection errors
- Upload failures
- Backend validation errors

---

## Lessons System

### Lesson Structure

```typescript
interface LessonContent {
  id: number;
  title: string;
  topic: string;
  class: string;
  subject: string;
  term: string;
  week: string | number;
  overview: string;
  objectives: LessonObjective[];
  key_concepts: Record<string, string>;
  concepts: Concept[];
  general_exercises: GeneralExercise[];
  video_path?: string | null;
  summary?: string;
  application?: string;
}
```

### Lesson Components

#### `LessonViewer` (`components/lessons/LessonViewer.tsx`)
Main lesson viewing component:
- Loads lesson content
- Displays overview, concepts, exercises
- Tracks progress
- Marks sections complete
- Navigation between sections

#### `LessonContent` (`components/lessons/LessonContent.tsx`)
Content display:
- Renders lesson sections
- Displays concepts
- Shows exercises
- Progress indicators

#### `LessonNavigation` (`components/lessons/LessonNavigation.tsx`)
Navigation controls:
- Previous/Next lesson
- Section navigation
- Progress tracking

### Lesson API

#### `lessons.ts` (`lib/api/lessons.ts`)
- `getSubjectsWithSlugs()` - Get subjects
- `getTopicsBySubjectSlug()` - Get topics
- `getLessonContentBySlug()` - Get lesson content
- `getLessonOverviewBySlug()` - Get overview

#### `lessons-api.ts` (`lib/api/lessons-api.ts`)
- `getLessonsList()` - List lessons
- `getLessonDetail()` - Get lesson details
- `getLessonMetadata()` - Get metadata

### Lesson Routes

#### `/lessons` - Public lessons page
#### `/dashboard/lessons/[...slug]` - Protected lesson viewer
#### `/api/lessons/[subjectSlug]/[topicSlug]/content` - API endpoint
#### `/api/lessons/[subjectSlug]/[topicSlug]/overview` - Overview API

### Progress Tracking

- Section completion tracking
- Lesson completion status
- Progress percentage calculation
- Completion API endpoints

---

## Security Analysis

### Security Strengths

✅ **HttpOnly Cookies**
- Tokens not accessible via JavaScript
- Prevents XSS token theft
- Server-side only access

✅ **Secure Flag**
- HTTPS only in production
- Prevents man-in-the-middle attacks

✅ **SameSite Strict**
- CSRF protection
- Prevents cross-site requests

✅ **Token Expiration**
- Automatic expiration checking
- Prevents long-lived sessions

✅ **Server-Side Validation**
- All auth checks on server
- Client validation is UX only

✅ **Input Validation**
- Zod schemas for validation
- Type-safe throughout

### Security Concerns

⚠️ **Middleware RBAC Incomplete**
- Role not extracted from token
- Fine-grained RBAC skipped
- Potential unauthorized access

⚠️ **No Token Refresh**
- Tokens expire, user must re-login
- No automatic refresh mechanism

⚠️ **Debug Logging**
- Debug logs in production code
- May leak sensitive information
- Should be environment-gated

⚠️ **TypeScript Strict Mode Disabled**
- `strict: false` in tsconfig.json
- Potential type safety issues
- Runtime errors possible

⚠️ **Client-Side Role Checks**
- Some role checks on client
- Can be bypassed
- Should be server-only

### Recommendations

1. **Fix Middleware RBAC**
   - Extract role from JWT token
   - Implement fine-grained checks
   - Add permission validation

2. **Add Token Refresh**
   - Implement refresh token flow
   - Automatic token renewal
   - Seamless user experience

3. **Remove Debug Logging**
   - Environment-gate all logs
   - Remove production logs
   - Use proper logging service

4. **Enable Strict Mode**
   - Fix type errors
   - Enable strict null checks
   - Improve type safety

5. **Server-Side Validation**
   - Move all role checks to server
   - Validate permissions server-side
   - Client checks for UX only

---

## Configuration Files

### Next.js Config (`next.config.js`)

```javascript
{
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      // GitHub avatars
      // Google avatars
      // Random user avatars
    ]
  },
  webpack: {
    watchOptions: {
      poll: true,  // Windows compatibility
      ignored: /node_modules/
    }
  }
}
```

### TypeScript Config (`tsconfig.json`)

```json
{
  "strict": false,  // ⚠️ Should be true
  "strictNullChecks": true,
  "baseUrl": ".",
  "paths": {
    "@/*": ["./*"]
  }
}
```

### Tailwind Config (`tailwind.config.ts`)

- Custom color system (HSL variables)
- Dark mode support
- Custom fonts
- Custom animations
- Typography plugin

### Environment (`env.mjs`)

Validates environment variables:
- Server variables (RESEND_API_KEY, STRIPE_API_KEY)
- Client variables (NEXT_PUBLIC_*)
- Runtime validation with Zod

### Contentlayer Config (`contentlayer.config.ts`)

- MDX processing
- Document types (Doc, Guide, Post, Page)
- Rehype plugins
- Remark plugins

---

## Build & Deployment

### Build Process

```bash
pnpm build  # Production build
```

Process:
1. TypeScript compilation
2. Next.js build
3. Contentlayer content generation
4. Static page generation
5. Optimization

### Development

```bash
pnpm dev  # Development server
```

Features:
- Hot module replacement
- Fast refresh
- Contentlayer watch mode
- Error overlay

### Scripts

- `dev` - Development server
- `build` - Production build
- `start` - Production server
- `lint` - ESLint
- `format` - Prettier
- `type-check` - TypeScript check
- `check:no-token-cookies` - Security check

### Deployment Considerations

- Environment variables required
- Node.js 18.17.0+ required
- Contentlayer build step
- Static asset optimization
- Image optimization

---

## Known Issues & Technical Debt

### Critical Issues

#### 1. Middleware RBAC Incomplete
**Location:** `middleware.ts:41`
```typescript
const userRole = undefined as unknown as UserRole; // ⚠️
```
**Impact:** High - No role-based route protection  
**Fix:** Extract role from JWT token or session

#### 2. TypeScript Strict Mode Disabled
**Location:** `tsconfig.json:7`
```json
"strict": false
```
**Impact:** Medium - Type safety compromised  
**Fix:** Enable strict mode and fix type errors

#### 3. Mock Data Flags
**Location:** Multiple API routes
```typescript
const USE_MOCK_DATA = false; // Currently uses mock
```
**Impact:** Medium - Some features may not work  
**Fix:** Implement real API integration

### TODO Items

#### High Priority
- [ ] Fix middleware role extraction
- [ ] Replace admin-only endpoint TODOs
- [ ] Implement user deletion API
- [ ] Fix option value update in user-role-form
- [ ] Add confirmation dialog for unsaved changes

#### Medium Priority
- [ ] Populate subject ID map from API
- [ ] Replace debug logging with proper logger
- [ ] Implement token refresh mechanism
- [ ] Add session timeout handling

#### Low Priority
- [ ] Clean up unused code
- [ ] Remove legacy Axios usage
- [ ] Consolidate duplicate code
- [ ] Improve error messages

### Technical Debt

1. **Debug Logging Scattered**
   - 168 instances of debug-related code
   - Should use proper logging service
   - Environment-gate all logs

2. **Legacy Code**
   - Axios still imported (not used)
   - js-cookie usage (replaced by HttpOnly)
   - Old localStorage patterns

3. **Incomplete Features**
   - Google OAuth partial
   - Some API endpoints mock
   - Profile completion flow incomplete

4. **Code Duplication**
   - Similar error handling patterns
   - Duplicate validation logic
   - Repeated API call patterns

---

## Best Practices & Patterns

### Good Practices

✅ **Type Safety**
- TypeScript throughout
- Zod validation schemas
- Type-safe API responses

✅ **Component Organization**
- Atomic design principles
- Feature-based grouping
- Reusable components

✅ **Error Handling**
- Standardized error format
- User-friendly messages
- Proper error boundaries

✅ **State Management**
- Zustand for global state
- React hooks for local state
- Server state via API routes

✅ **Security**
- HttpOnly cookies
- Server-side validation
- CSRF protection

### Patterns Used

1. **API Route Proxy Pattern**
   - Next.js routes as proxy
   - Backend API abstraction
   - Consistent error handling

2. **Cookie-Based Auth**
   - HttpOnly cookies
   - Server-side token management
   - Client-side state sync

3. **RBAC Pattern**
   - Role hierarchy
   - Permission checking
   - Route protection

4. **Form Validation**
   - React Hook Form
   - Zod schemas
   - Client + server validation

### Areas for Improvement

1. **Error Handling**
   - Centralized error handling
   - Error boundary components
   - Better error messages

2. **Loading States**
   - Consistent loading patterns
   - Skeleton screens
   - Progress indicators

3. **Testing**
   - Unit tests missing
   - Integration tests needed
   - E2E tests recommended

4. **Documentation**
   - Component documentation
   - API documentation
   - Architecture diagrams

---

## Development Workflow

### Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Start development
pnpm dev
```

### Code Quality

```bash
# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm type-check

# All checks
pnpm check:all
```

### Git Workflow

- Pre-commit hooks (Husky)
- Lint-staged for changed files
- Commitlint for commit messages

### Branch Strategy

- `main` - Production
- `develop` - Development
- Feature branches

---

## Conclusion

The Fast Learners Frontend is a well-structured Next.js application with a solid foundation. Key strengths include modern tech stack, comprehensive RBAC, and secure authentication. However, there are critical issues that need addressing, particularly the incomplete middleware RBAC and disabled TypeScript strict mode.

### Priority Actions

1. **Fix middleware RBAC** - Extract and validate user roles
2. **Enable strict mode** - Improve type safety
3. **Remove debug logging** - Clean up production code
4. **Complete API integration** - Replace mock data
5. **Add testing** - Unit and integration tests

### Long-term Improvements

1. Token refresh mechanism
2. Comprehensive error handling
3. Performance optimization
4. Accessibility improvements
5. Documentation expansion

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Maintained By:** Development Team

