# Tailwind CSS Guidelines & Best Practices

## 🎯 Class Ordering Rules

### Proper Order (as enforced by tailwindcss/classnames-order):

1. **Layout** - display, position, top, right, bottom, left
2. **Flexbox & Grid** - flex, grid properties
3. **Spacing** - margin, padding
4. **Sizing** - width, height, min/max dimensions
5. **Typography** - font, text properties
6. **Visual** - background, border, shadow
7. **Misc** - cursor, user-select, etc.

### Examples:

```jsx
// ✅ CORRECT - Proper ordering
<div className="flex items-center justify-between w-full p-4 text-sm bg-white border rounded-lg shadow-sm">

// ❌ INCORRECT - Wrong ordering
<div className="bg-white flex p-4 w-full border text-sm items-center rounded-lg justify-between shadow-sm">
```

## 🔧 Size Shorthands (tailwindcss/enforces-shorthand)

### Use Modern Shorthands:

```jsx
// ✅ CORRECT - Use size-* shorthand
<Icon className="size-4" />
<div className="size-12 rounded-full" />

// ❌ INCORRECT - Separate height/width
<Icon className="h-4 w-4" />
<div className="h-12 w-12 rounded-full" />
```

### Common Size Mappings:

- `h-3 w-3` → `size-3`
- `h-4 w-4` → `size-4`
- `h-5 w-5` → `size-5`
- `h-6 w-6` → `size-6`
- `h-8 w-8` → `size-8`
- `h-10 w-10` → `size-10`
- `h-12 w-12` → `size-12`
- `h-16 w-16` → `size-16`

## 🚀 Migration from Tailwind v2

### Remove Deprecated Classes:

```jsx
// ✅ CORRECT - Tailwind v3
<div className="shrink-0" />

// ❌ INCORRECT - Tailwind v2 (deprecated)
<div className="flex-shrink-0" />
```

### Remove Unnecessary Classes:

```jsx
// ✅ CORRECT - transform is automatic in v3
<div className="rotate-45 scale-110" />

// ❌ INCORRECT - transform not needed in v3
<div className="transform rotate-45 scale-110" />
```

## 📏 Responsive Design Patterns

### Proper Responsive Ordering:

```jsx
// ✅ CORRECT - Mobile first, then responsive modifiers
<div className="flex flex-col gap-3 pt-4 sm:flex-row">

// ❌ INCORRECT - Desktop first approach
<div className="flex-row gap-3 pt-4 flex-col sm:flex-row">
```

## 🎨 Common Component Patterns

### Cards:

```jsx
<Card className="mx-4 w-full max-w-2xl">
  <CardHeader className="text-center">
    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
      <Icon className="size-8 text-destructive" />
    </div>
  </CardHeader>
</Card>
```

### Buttons with Icons:

```jsx
<Button onClick={handleClick} className="flex-1">
  <Icon className="mr-2 size-4" />
  Button Text
</Button>
```

### Spacing Utilities (Proper Order):

```jsx
// ✅ CORRECT - Margin/padding after layout
<div className="flex items-center gap-2 p-4 mb-4 bg-muted rounded-lg">

// ❌ INCORRECT - Spacing before layout
<div className="p-4 mb-4 flex items-center gap-2 bg-muted rounded-lg">
```

## 🔍 Debugging Classes

### Temporary Debug Classes (Remove Before Commit):

```jsx
// Use these for debugging layout issues, but remove before committing
<div className="border border-red-500"> // Visualize boundaries
<div className="bg-red-100"> // Highlight areas
```

## ⚠️ Common ESLint Warnings to Avoid

1. **Invalid class order** - Follow the ordering rules above
2. **Use size-\* shorthand** - Replace h-X w-X combinations
3. **Remove deprecated classes** - Update flex-shrink-0 to shrink-0
4. **Remove unnecessary transforms** - Don't use 'transform' class in v3

## 🛠️ ESLint Configuration

Our project uses these rules:

```json
{
  "tailwindcss/classnames-order": "warn",
  "tailwindcss/enforces-shorthand": "warn",
  "tailwindcss/migration-from-tailwind-2": "warn"
}
```

## 📝 Pre-Commit Checklist

Before committing code with Tailwind classes:

- [ ] Classes are in proper order (layout → spacing → visual)
- [ ] Used size-\* shorthand for equal height/width
- [ ] No deprecated Tailwind v2 classes
- [ ] No unnecessary 'transform' classes
- [ ] Responsive classes follow mobile-first approach
- [ ] No ESLint tailwindcss warnings

## 🔧 Quick Fixes

### Auto-fix with Prettier (if configured):

```bash
npx prettier --write . --plugin=prettier-plugin-tailwindcss
```

### Manual Quick Fixes:

```bash
# Find and replace common issues
h-4 w-4 → size-4
flex-shrink-0 → shrink-0
transform rotate → rotate
```

Remember: Clean, well-ordered Tailwind classes improve readability and maintainability!
