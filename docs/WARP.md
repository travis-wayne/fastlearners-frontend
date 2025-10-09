# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Primary Development Workflow

- `pnpm dev` - Start Next.js development server with hot reloading
- `pnpm build` - Build production-ready application
- `pnpm start` - Serve production build locally
- `pnpm preview` - Build and serve in one command for quick testing

### Code Quality & Maintenance

- `pnpm lint` - Run ESLint checks
- `pnpm lint:fix` - Auto-fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check if formatting is needed
- `pnpm type-check` - Run TypeScript type checking
- `pnpm check:all` - Run all checks (type-check, lint, format:check)
- `pnpm fix:all` - Fix all auto-fixable issues (lint:fix, format)

### Specialized Commands

- `pnpm turbo` - Start development server with Turbo mode for faster builds
- `pnpm email` - Run email development server on port 3333
- `pnpm lint:tailwind` - Run Tailwind-specific linting rules

## Architecture Overview

### Core Technologies

- **Next.js 14** with App Router architecture
- **React 18** with TypeScript for type safety
- **Tailwind CSS** with custom design system
- **Contentlayer** for content management (docs, guides, blog posts)
- **Zustand** for client-side state management
- **Radix UI** as the component primitive library
- **React Hook Form** with Zod validation
- **Stripe** for payment processing

### Project Structure

#### App Router Organization

```
app/
├── (auth)/           # Authentication routes (login, register, etc.)
├── (docs)/           # Documentation and guides
├── (marketing)/      # Marketing pages (landing, pricing)
├── (protected)/      # Authenticated user routes
└── api/              # Backend API routes
```

#### Component Architecture

```
components/
├── ui/               # Base UI components (buttons, forms, etc.)
├── auth/             # Authentication-specific components
├── navigation/       # Navigation system (two-tier nav bar)
├── dashboard/        # Dashboard-specific components
├── lessons/          # Lesson management components
├── layout/           # Layout wrapper components
├── forms/            # Form components with validation
└── sections/         # Page section components
```

#### Utility Libraries

```
lib/
├── api/              # API client functions
├── rbac/             # Role-based access control
├── types/            # TypeScript type definitions
├── validations/      # Zod validation schemas
└── utils/            # General utility functions
```

### Authentication & Authorization System

The project uses a sophisticated cookie-based authentication system with role-based access control:

**User Roles**: `guest`, `student`, `guardian`, `teacher`, `admin`, `superadmin`

**Key Files**:

- `store/authStore.ts` - Zustand store managing user state
- `lib/auth-cookies.ts` - Cookie management utilities
- `lib/rbac/` - Role-based permission system
- `middleware.ts` - Route protection middleware

**Authentication Flow**:

1. User login sets auth cookies with 7-day expiration
2. Zustand store hydrates from cookies on client-side
3. RBAC system checks permissions for routes/features
4. Middleware protects routes based on user roles

### Content Management with Contentlayer

The project uses Contentlayer for managing MDX content:

**Content Types**:

- `Doc` - Documentation pages (`docs/**/*.mdx`)
- `Guide` - Tutorial guides (`guides/**/*.mdx`)
- `Post` - Blog posts (`blog/**/*.mdx`)
- `Page` - Static pages (`pages/**/*.mdx`)

**Configuration**: `contentlayer.config.ts` with custom computed fields for slugs and image extraction.

### State Management Architecture

**Global State**: Zustand store for authentication (`store/authStore.ts`)

- Handles user session, roles, and profile completion status
- Cookie persistence with hydration on client-side
- Provides role-checking utilities (`hasRole`, `isPrimaryRole`)

**Local State**: React hooks for component-specific state
**Server State**: React Query patterns in API utilities

### Two-Tier Navigation System

The project implements a comprehensive navigation system:

- **Top Tier**: Brand, breadcrumbs, user menu, notifications, network status
- **Bottom Tier**: Marquee messages from API
- **Components**: `components/navigation/two-tier-navigation-bar.tsx`
- **Features**: Real-time notifications, network status indicator, theme switching

## Development Guidelines

### Code Quality Standards

The project enforces strict code quality with automated tooling:

**Pre-commit Hooks** (via Husky):

- Prettier formatting with Tailwind class ordering
- ESLint checks with auto-fixing
- Processes only staged files for performance

**Tailwind CSS Rules**:

- Use `size-4` instead of `h-4 w-4` for equal dimensions
- Follow class ordering: layout → spacing → visual → misc
- Use shorthand utilities where available
- Let Prettier handle class ordering automatically

**TypeScript Standards**:

- Strict mode enabled with comprehensive type checking
- Use proper dependency arrays in React hooks
- Leverage Zod schemas for runtime validation

### Environment Configuration

**Required Environment Variables** (see `env.mjs`):

```
# Core
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=

# Stripe
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID=
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID=
NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID=
NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID=
```

Create `.env.local` for local development overrides.

### Key Development Patterns

**API Integration**:

- Use utilities in `lib/api/` for consistent API calls
- Handle errors with try-catch and proper user feedback
- Implement loading states and optimistic updates

**Form Handling**:

- Use React Hook Form with Zod validation
- Leverage `lib/validations/` for reusable schemas
- Implement proper error display and field validation

**Component Development**:

- Start with Radix UI primitives in `components/ui/`
- Use class variance authority (cva) for component variants
- Implement proper TypeScript interfaces for props

**Route Protection**:

- Use RBAC utilities for permission checking
- Implement route guards in middleware
- Handle unauthorized access gracefully

### Debugging & Development Tools

**Built-in Debug Components**:

- `AuthDebug` - Authentication state inspector
- `UserRoleDebug` - Role and permission analyzer

**Development Workflow**:

1. Use `pnpm dev` for development with hot reloading
2. Run `pnpm check:all` before commits
3. Use `pnpm build` to verify production readiness
4. Monitor console for auth/RBAC debug information

### Common Troubleshooting

**Contentlayer Issues**:

- Remove `.contentlayer` and restart dev server
- Ensure MDX files have proper frontmatter
- Check `contentlayer.config.ts` for field definitions

**Authentication Problems**:

- Clear browser cookies and localStorage
- Check network tab for API response errors
- Use debug components to inspect auth state
- Verify environment variables are set

**Build Errors**:

- Run `pnpm type-check` to isolate TypeScript issues
- Ensure all imports are properly typed
- Check for missing environment variables
- Clear `.next` folder and rebuild

**Styling Issues**:

- Use `pnpm lint:tailwind` for class-related errors
- Run `pnpm format` to fix class ordering
- Check for conflicting CSS classes
- Verify Tailwind config includes all necessary paths

### Performance Considerations

- Use Next.js Image component for optimized images
- Implement proper loading states for async operations
- Leverage React.memo for expensive component renders
- Use dynamic imports for code splitting
- Optimize Contentlayer builds with proper caching

## 🎓 Nigerian Education System Implementation

### Strategic Overview

The Fast Learner platform now includes a **comprehensive Nigerian Education System** designed specifically for Nigerian schools, students, and educators. This implementation follows official Nigerian curriculum standards and educational practices, positioning the platform as a complete educational solution for the Nigerian market.

### 🏗️ Educational Architecture

#### Class Structure Implementation

```
Nigerian Education Levels:
├── Primary Education (Primary 1-6) - Ages 6-12
├── Junior Secondary (JSS 1-3) - Ages 13-15
└── Senior Secondary (SSS 1-3) - Ages 16-18
    ├── Science Track (Physics, Chemistry, Biology)
    ├── Arts Track (Literature, Government, History)
    └── Commercial Track (Accounting, Economics, Commerce)
```

#### Academic Calendar System

- **3-Term Structure**: 1st Term (Sept-Dec), 2nd Term (Jan-Apr), 3rd Term (May-July)
- **Weekly Breakdown**: 10-14 weeks per term with detailed scheme of work
- **Assessment Framework**: 40% Continuous Assessment + 60% Examination
- **Grading System**: A1 (75-100) to F9 (0-39) following Nigerian standards

### 📊 Core Data Models

#### Education Configuration (`config/education.ts`)

```typescript
interface ClassLevel {
  id: string;
  name: string; // "Primary 1", "JSS 1", "SSS 2 Science"
  stage: "primary" | "jss" | "sss";
  level: number;
  track?: "science" | "arts" | "commercial";
  description: string;
  ageRange: string;
}

interface Subject {
  id: string;
  name: string; // "Mathematics", "Basic Science", "Physics"
  code: string; // "MTH", "BSC", "PHY"
  compulsory: boolean;
  levels: string[]; // Classes where this subject is taught
  track?: string; // For SSS track-specific subjects
}
```

#### Academic Context System

- **Global State Management**: React Context for class/term selection
- **Persistent Storage**: localStorage for user preferences
- **Display Utilities**: Nigerian education terminology helpers
- **Filtering Logic**: Automatic content filtering by class and term

### 📱 Page Implementation Strategy

#### Dashboard Structure

```
app/(protected)/dashboard/
├── subjects/                    # Subject overview and management
│   ├── page.tsx                # Grid view with filtering and search
│   └── [id]/                  # Individual subject details
│       └── page.tsx           # Scheme of work with weekly breakdown
├── lessons/                    # Interactive lesson system
│   ├── page.tsx               # Lesson listing with progress tracking
│   └── [id]/                 # Lesson player with multimedia content
│       └── page.tsx          # Interactive learning experience
├── quizzes/                   # Assessment management system
│   ├── page.tsx              # Quiz dashboard with categorization
│   └── [id]/                # Quiz runner with timer and scoring
│       └── page.tsx         # Interactive quiz-taking interface
├── past-questions/           # Exam preparation system
│   └── page.tsx             # WAEC/NECO/JAMB practice questions
└── records/                  # Academic performance tracking
    └── page.tsx             # Grades, progress, and analytics
```

### 🎯 Key Features Implementation

#### 1. Academic Context Management

**Component**: `components/providers/academic-context.tsx`

- Provides global class and term state management
- Persists user selection across sessions
- Offers display utilities for Nigerian terminology
- Enables automatic content filtering

#### 2. Subject Management System

**Features**:

- Nigerian curriculum-aligned subject allocation
- Class-specific subject filtering
- Progress tracking per subject and term
- Integrated scheme of work with weekly breakdown
- Assessment and quiz status indicators

#### 3. Interactive Lesson System

**Implementation**:

- Multimedia content support (video, audio, documents)
- Progress tracking with timers and completion status
- Prerequisite and sequence management
- Nigerian curriculum-aligned lesson content
- Interactive exercises and homework assignments

#### 4. Comprehensive Quiz System

**Features**:

- Multiple question types (MCQ, True/False, Fill-in-blank)
- Topic, term, and comprehensive assessments
- Timer-based quiz execution
- Automatic scoring and detailed feedback
- Attempt history and performance analytics

#### 5. Past Questions Practice

**Integration**:

- WAEC, NECO, and JAMB question banks
- Practice mode with detailed explanations
- Subject and year-based filtering
- Performance tracking and improvement suggestions

#### 6. Academic Records System

**Analytics**:

- Nigerian grading system (A1-F9) implementation
- CA and Examination score breakdown
- Term-wise performance analysis
- Class position tracking and comparison
- Progress visualization and reporting

### 🔧 Technical Implementation Details

#### Data Structure Strategy

```typescript
// Mock data following Nigerian curriculum standards
data/
├── mock-lessons.ts            # Lesson content with Nigerian curriculum alignment
├── mock-quizzes.ts           # Assessment data with proper question types
├── mock-scheme-of-work.ts    # Weekly curriculum breakdown
└── mock-past-questions.ts    # Exam preparation content
```

#### UI Component Architecture

```typescript
components/dashboard/student/shared/
├── academic-selector.tsx      # Multi-variant class/term selection
├── subject-card.tsx          # Progress tracking with grading integration
└── lesson-card.tsx          # Interactive content with progress indicators
```

#### Navigation Integration

- **Breadcrumb System**: Proper navigation hierarchy
- **Academic Context**: Always-available class/term selector
- **Inter-page Linking**: Seamless flow between educational components
- **Mobile Responsive**: Optimized for various device sizes

### 📋 Development Standards for Educational Content

#### Content Creation Guidelines

1. **Curriculum Alignment**: All content must align with Nigerian educational standards
2. **Progressive Learning**: Lessons build upon previous knowledge
3. **Assessment Integration**: Every topic includes appropriate assessments
4. **Cultural Relevance**: Examples and contexts relevant to Nigerian students
5. **Language Standards**: Proper English with Nigerian context

#### Data Validation Patterns

```typescript
// Academic context validation
const academicContextSchema = z.object({
  classLevel: z.string().min(1),
  term: z.string().min(1),
  subjects: z.array(z.string()),
});

// Quiz validation
const quizSchema = z.object({
  timeLimit: z.number().positive(),
  passingScore: z.number().min(0).max(100),
  questions: z.array(questionSchema),
});
```

### 🎨 UI/UX Design Philosophy

#### Educational Design Principles

1. **Clarity First**: Clean, uncluttered interface focusing on learning
2. **Progress Visibility**: Clear indicators of learning progress
3. **Nigerian Context**: Colors, icons, and terminology familiar to Nigerian students
4. **Accessibility**: Ensuring access for students with different abilities
5. **Mobile-First**: Optimized for smartphone usage (primary device in Nigeria)

#### Component Styling Strategy

- **shadcn/ui**: Consistent base components
- **Tailwind CSS**: Utility-first styling with educational color schemes
- **Framer Motion**: Smooth animations for engaging interactions
- **Lucide React**: Educational icons (book, graduation cap, etc.)

### 🚀 Deployment and Scaling Strategy

#### Phase 1: Core Educational Platform (✅ Completed)

- Nigerian education system implementation
- Student dashboard with full functionality
- Subject management and lesson delivery
- Assessment and performance tracking

#### Phase 2: Multi-User System (Planned)

- Teacher dashboard for content management
- Parent/Guardian access portal
- School administration features
- Real-time collaboration tools

#### Phase 3: Advanced Features (Future)

- AI-powered personalized learning
- Offline mode for limited connectivity
- Video conferencing integration
- Government education portal integration

### 📈 Nigerian Market Integration

#### Examination Bodies Integration

- **WAEC** (West African Examinations Council)
- **NECO** (National Examinations Council)
- **JAMB** (Joint Admissions and Matriculation Board)
- **State Examination Boards**

#### Educational Standards Compliance

- **Federal Ministry of Education** curriculum alignment
- **NERDC** (Nigerian Educational Research and Development Council) standards
- **UNESCO** educational framework compliance
- **State Education Board** requirements

### 🔍 Development Commands for Nigerian System

#### Educational Content Development

```bash
# Development workflow for educational features
pnpm dev                    # Start with Nigerian education system loaded
pnpm build                  # Verify educational content builds correctly
pnpm type-check            # Ensure educational data types are correct

# Educational content testing
pnpm test:education        # Run tests for Nigerian curriculum features
pnpm lint:education        # Check educational content standards
```

#### Debugging Educational Features

```bash
# Debug academic context
console.log(useAcademicContext()) # Check current class/term selection

# Debug curriculum data
console.log(getSubjectsForClass('jss1')) # Verify subject allocation

# Debug progress tracking
console.log(getLessonStats()) # Check learning progress
```

### 📚 Educational Documentation

#### Key Documentation Files

- `NIGERIAN_EDUCATION_SYSTEM.md` - Comprehensive implementation guide
- `README_NIGERIAN_SYSTEM.md` - User-facing system overview
- `config/education.ts` - Core educational configuration
- `data/mock-*.ts` - Educational content data models

#### Content Standards Documentation

- Nigerian curriculum alignment guidelines
- Assessment and grading standards
- Academic calendar implementation
- Cultural and contextual content guidelines

### 🎯 Success Metrics and KPIs

#### Educational Effectiveness

- **Student Engagement**: Lesson completion rates, time spent learning
- **Academic Performance**: Quiz scores, grade improvements
- **Curriculum Coverage**: Percentage of syllabus completed
- **Assessment Success**: Pass rates on practice exams

#### Technical Performance

- **System Reliability**: 99.9% uptime for educational features
- **Response Times**: Sub-second page loads for learning content
- **Mobile Performance**: Optimized for Nigerian mobile networks
- **Offline Capability**: Content accessible without internet

### 🌟 Conclusion

The Nigerian Education System implementation transforms Fast Learner into a comprehensive educational platform specifically designed for the Nigerian market. With complete curriculum alignment, proper assessment systems, and culturally relevant content, the platform is positioned to serve as a leading educational technology solution for Nigerian schools and students.

The implementation follows modern development practices while respecting traditional Nigerian educational values, creating a bridge between technology and established learning methodologies. This strategic approach ensures both technical excellence and educational effectiveness, making Fast Learner a valuable tool for Nigerian education stakeholders.
