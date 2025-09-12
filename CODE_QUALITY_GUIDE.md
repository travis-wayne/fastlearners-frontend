# Code Quality Guide - Warning-Free Development

## ✅ Completed Fixes

### 1. React Hook Dependencies
- Fixed all `useEffect` and `useMemo` missing dependency warnings
- Converted functions to `useCallback` where needed for proper dependency management
- Files fixed:
  - `app/(protected)/dashboard/teacher/lessons/page.tsx`
  - `app/(protected)/dashboard/teacher/lessons/[id]/page.tsx`  
  - `components/lessons/LessonsDataTable.tsx`
  - `components/navigation/marquee-messages.tsx`

### 2. Tailwind CSS Formatting
- Set up automated Tailwind CSS class ordering with `prettier-plugin-tailwindcss`
- Most class order warnings resolved through automated formatting

### 3. Automated Tools Setup
- **Prettier with Tailwind Plugin**: Automatically sorts Tailwind classes
- **ESLint with Tailwind Rules**: Catches class order and shorthand issues
- **Pre-commit Hooks**: Runs formatting and linting before each commit
- **Lint-staged**: Only processes changed files for efficiency

## 🔄 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues automatically
pnpm format           # Format all files with Prettier
pnpm format:check     # Check if files need formatting
pnpm type-check       # Run TypeScript type checking

# Combined Scripts
pnpm check:all        # Run all checks (type-check, lint, format:check)
pnpm fix:all          # Fix all issues (lint:fix, format)
```

## 🎯 Remaining Minor Warnings

The following Tailwind CSS shorthand warnings remain and can be fixed manually or ignored:

### Files with remaining shorthand warnings:
1. `app/(protected)/layout.tsx` - Line 89: `left-0, right-0` → `inset-x-0`
2. `components/dashboard/breadcrumb.tsx` - Lines 66, 69: `h-4, w-4` → `size-4`
3. `components/nav-user.tsx` - Multiple lines: Various size combinations → use `size-*`
4. `components/navigation/breadcrumb.tsx` - Lines 107, 122: `h-4, w-4` → `size-4`
5. `components/ui/sidebar.tsx` - Lines 227, 269, 292: Size combinations → use shortcuts

### Quick Fix Commands:
```bash
# To see specific warnings:
pnpm lint:tailwind

# To automatically fix many issues:
pnpm fix:all
```

## 🚀 Future Prevention

### Pre-commit Hooks
The setup automatically:
1. Formats code with Prettier (including Tailwind class ordering)
2. Runs ESLint to catch issues
3. Only processes staged files for efficiency

### VS Code Integration (Recommended)
Add these extensions:
- **Prettier - Code formatter**
- **ESLint**
- **Tailwind CSS IntelliSense**

### VS Code Settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 📝 Best Practices

### React Hooks
- Always include all dependencies in `useEffect` and `useMemo`
- Use `useCallback` for functions that are dependencies of other hooks
- Consider using ESLint's `react-hooks/exhaustive-deps` rule (already enabled)

### Tailwind CSS
- Let Prettier handle class ordering automatically
- Use shorthand classes when possible (`size-4` instead of `h-4 w-4`)
- Use the `cn()` utility function for conditional classes

### Development Workflow
1. Write code normally
2. Pre-commit hooks will automatically format and lint
3. Fix any remaining issues before pushing
4. Run `pnpm build` to ensure production readiness

## 🛠 Troubleshooting

### If pre-commit hooks fail:
1. Run `pnpm fix:all` to fix most issues
2. Manually fix remaining TypeScript errors
3. Commit again

### If build warnings persist:
1. Check the specific file and line mentioned
2. Apply the suggested fix (usually class shorthand)
3. Run `pnpm build` again to verify

## 🎉 Success Metrics

- ✅ Production build completes successfully
- ✅ No React Hook dependency errors  
- ✅ Automated code formatting on commit
- ✅ Consistent code style across the project
- ⚠️ Only minor Tailwind shorthand warnings remain (optional fixes)

The codebase is now set up for maintaining high code quality with minimal manual intervention!
