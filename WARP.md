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