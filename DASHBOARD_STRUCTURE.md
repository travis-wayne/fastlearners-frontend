# Dashboard Structure

## Overview
The dashboard is organized using Next.js 14 App Router with role-based access control. The main layout is at `app/(protected)/dashboard/` and uses a unified dashboard page that renders different components based on user roles.

## Quick Visual Summary

```
📁 dashboard/
├── 🏠 page.tsx (Unified Dashboard - Role-based)
├── 📐 layout.tsx (Sidebar + Header + Breadcrumbs)
│
├── 📚 subjects/ (Subject Selection)
│   ├── page.tsx ⚠️ (Currently shows blog posts)
│   └── category/[slug]/page.tsx
│
├── 📖 lessons/ (Lessons Browser)
│   ├── page.tsx ✅ (Full-featured with filters)
│   └── [id]/page.tsx
│
├── 🎯 quizzes/ (Quizzes)
│   └── [id]/page.tsx
│
├── 📊 charts/ (Analytics)
├── 💰 billing/ (Billing)
├── 📦 orders/ (Orders)
├── ⚙️ settings/ (Settings)
├── 📝 records/ (Academic Records)
├── 📄 past-questions/ (Past Questions)
│
├── 👨‍💼 admin/ (Admin Pages)
├── 👨‍🏫 teacher/ (Teacher Pages)
└── 👑 superadmin/ (Super Admin Pages)
```

**Legend:**
- ✅ Fully implemented
- ⚠️ Needs update/integration
- 📁 Directory
- 📄 File

## Directory Structure

```
app/(protected)/dashboard/
├── layout.tsx                    # Main dashboard layout (sidebar, header, breadcrumbs)
├── page.tsx                      # Unified dashboard (renders role-specific dashboards)
├── loading.tsx                   # Loading state for dashboard
│
├── subjects/                     # Subject Selection & Management
│   ├── layout.tsx               # Blog-style layout wrapper
│   ├── page.tsx                 # Subject listing page (currently blog posts)
│   └── category/
│       └── [slug]/
│           └── page.tsx         # Subject category detail page
│
├── lessons/                      # Lessons Management
│   ├── layout.tsx               # Blog-style layout wrapper
│   ├── page.tsx                 # Lessons listing with filters
│   └── [id]/
│       └── page.tsx             # Individual lesson detail page
│
├── quizzes/                       # Quizzes
│   ├── page.tsx                 # Quiz listing
│   └── [id]/
│       └── page.tsx             # Individual quiz page
│
├── charts/                        # Analytics & Charts
│   ├── page.tsx                 # Charts dashboard
│   └── loading.tsx              # Loading state
│
├── records/                       # Academic Records
│   └── page.tsx                 # Student records page
│
├── past-questions/                # Past Questions
│   └── page.tsx                 # Past questions listing
│
├── billing/                       # Billing Management
│   ├── page.tsx                 # Billing dashboard
│   └── loading.tsx              # Loading state
│
├── orders/                        # Order Management
│   ├── page.tsx                 # Orders listing
│   └── loading.tsx              # Loading state
│
├── settings/                      # User Settings
│   ├── page.tsx                 # Settings page
│   └── loading.tsx              # Loading state
│
├── api-test/                        # API Testing (Development)
│   └── page.tsx                 # API test page
│
├── admin/                         # Admin Role Pages
│   ├── billing/
│   │   └── page.tsx
│   ├── charts/
│   │   └── page.tsx
│   ├── lessons/
│   │   └── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
├── teacher/                       # Teacher Role Pages
│   ├── billing/
│   │   └── page.tsx
│   ├── charts/
│   │   └── page.tsx
│   ├── lessons/
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── upload/
│   │   │   └── page.tsx
│   │   └── trash/
│   │       └── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
└── superadmin/                    # Super Admin Role Pages
    ├── page.tsx                  # Super admin dashboard
    ├── billing/
    │   └── page.tsx
    ├── charts/
    │   └── page.tsx
    ├── lessons/
    │   ├── page.tsx
    │   ├── [id]/
    │   │   ├── page.tsx
    │   │   └── content/
    │   │       └── page.tsx
    │   ├── browse/
    │   │   └── page.tsx
    │   └── upload/
    │       └── page.tsx
    ├── orders/
    │   └── page.tsx
    └── settings/
        └── page.tsx
```

## Component Structure

```
components/dashboard/
├── role-dashboards/              # Role-specific dashboard components
│   ├── StudentDashboard.tsx     # Student dashboard
│   ├── TeacherDashboard.tsx     # Teacher dashboard
│   ├── AdminDashboard.tsx       # Admin dashboard
│   ├── SuperAdminDashboard.tsx  # Super admin dashboard
│   ├── GuardianDashboard.tsx    # Guardian dashboard
│   └── GuestDashboard.tsx       # Guest dashboard
│
├── subjects/                     # Subject selection components
│   ├── SubjectSelectionView.tsx # Main subject selection view
│   ├── subject-selection-wizard.tsx
│   ├── step-indicator.tsx
│   ├── class-selector.tsx
│   ├── selective-grid.tsx
│   ├── compulsory-selector.tsx
│   └── subject-card.tsx
│
├── student/                      # Student-specific components
│   └── shared/
│       ├── subject-card.tsx    # Subject card with progress
│       └── academic-selector.tsx # Class/term selector
│
├── header.tsx                    # Dashboard header
├── breadcrumb.tsx                # Breadcrumb navigation
├── search-command.tsx            # Command palette search
├── welcome-back-card.tsx         # Welcome card
├── upgrade-card.tsx              # Upgrade prompt card
├── transactions-list.tsx         # Transaction list
├── section-columns.tsx            # Section layout
├── project-switcher.tsx           # Project switcher
├── info-card.tsx                 # Info card component
├── delete-account.tsx            # Account deletion
├── PerformanceSection.tsx        # Performance metrics
├── OverviewGrid.tsx              # Overview grid layout
├── ProgressDonut.tsx             # Progress donut chart
├── LeaderBoard.tsx               # Leaderboard component
└── AchievementsSection.tsx       # Achievements section
```

## API Routes

```
app/api/
├── subjects/                     # Subject API routes
│   ├── route.ts                 # GET /api/subjects
│   ├── update-compulsory-selective/
│   │   └── route.ts             # POST /api/subjects/update-compulsory-selective
│   └── update-selective/
│       └── route.ts             # POST /api/subjects/update-selective
│
└── proxy/
    └── [...path]/
        └── route.ts              # Proxy route for upstream API
```

## Key Features

### 1. **Unified Dashboard (`/dashboard/page.tsx`)**
   - Renders role-specific dashboards based on user's primary role
   - Supports: student, teacher, admin, superadmin, guardian, guest
   - Uses `useAuthStore` for authentication state

### 2. **Main Layout (`/dashboard/layout.tsx`)**
   - Provides sidebar navigation
   - Header with breadcrumbs, search, notifications
   - Wraps all dashboard pages
   - Includes `AcademicProvider` for class/term context

### 3. **Subject Selection (`/dashboard/subjects/`)**
   - Currently uses blog-style layout
   - Has components for:
     - Compulsory subject selection (JSS only)
     - Selective subject selection (4 for JSS, 5 for SSS)
     - Class selection
     - Step-by-step wizard

### 4. **Lessons (`/dashboard/lessons/`)**
   - Full-featured lesson browser
   - Filters: search, subject, difficulty, status
   - Tabs: All, In Progress, Completed
   - Uses `AcademicContext` for class/term filtering

### 5. **Role-Based Access**
   - Each role has dedicated subdirectories
   - Sidebar links filtered by `authorizeOnly` property
   - Layout checks user role from `useAuthStore`

## Data Flow

1. **Authentication**: `useAuthStore` → `useAuthInit` → User data
2. **Academic Context**: `AcademicProvider` → Class/Term selection
3. **API Calls**: Client components → `/api/*` routes → Upstream API
4. **Subject Selection**: `SubjectSelectionView` → API routes → Backend

## Current State

- ✅ Main dashboard structure in place
- ✅ Role-based dashboards implemented
- ✅ Subject selection components created
- ⚠️ Subjects page currently shows blog posts (needs update)
- ⚠️ Lessons page currently shows blog content posts (needs update)
- ⚠️ Subject selection UI needs integration with main subjects page

## Next Steps

1. Integrate subject selection wizard with class selection
2. Add subject category browsing
3. Connect subject selection to lessons/quizzes

