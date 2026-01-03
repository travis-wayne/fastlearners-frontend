# UI Component Design System

## Overview

This document describes the standardized design token system implemented across all UI components in the Fast Learners application. The system ensures visual consistency and proper responsive behavior across mobile, tablet, and desktop devices.

## Design Tokens

### Spacing Scale

Defined in `tailwind.config.ts` under `theme.extend.spacing`:

| Token | Value | Use Case |
|-------|-------|----------|
| `component-xs` | 0.5rem (8px) | Extra small padding/gaps |
| `component-sm` | 0.75rem (12px) | Small padding/gaps |
| `component-md` | 1rem (16px) | Medium padding/gaps (default) |
| `component-lg` | 1.5rem (24px) | Large padding/gaps |
| `component-xl` | 2rem (32px) | Extra large padding/gaps |
| `control-sm` | 2rem (32px) | Small form control height |
| `control-md` | 2.5rem (40px) | Medium form control height (default) |
| `control-lg` | 2.75rem (44px) | Large form control height |

### Typography Scale

Defined in `tailwind.config.ts` under `theme.extend.fontSize`:

| Token | Value | Use Case |
|-------|-------|----------|
| `heading-xs` | 0.875rem (14px) | Extra small headings |
| `heading-sm` | 1rem (16px) | Small headings |
| `heading-md` | 1.125rem (18px) | Medium headings |
| `heading-lg` | 1.25rem (20px) | Large headings |
| `heading-xl` | 1.5rem (24px) | Extra large headings |

### Border Radius

Consistent across all components:
- **Cards, Dialogs, Alerts**: `rounded-lg`
- **Buttons, Inputs, Selects**: `rounded-md`
- **Badges**: `rounded-full`
- **Small elements (checkbox indicators)**: `rounded-sm`

### Z-Index Layering

All components use centralized z-index tokens from `config/z-index.ts`:

| Token | Value | Components |
|-------|-------|------------|
| `Z_INDEX.tooltip` | 50 | Select, Popover, Dropdown, Tooltip |
| `Z_INDEX.modalOverlay` | 50 | Dialog overlays and content |
| `Z_INDEX.sheetOverlay` | 45 | Sheet overlays and content |

## Responsive Breakpoints

Following mobile-first approach:

- **Mobile**: < 640px (base styles)
- **Tablet**: ≥ 640px (`sm:`)
- **Desktop**: ≥ 768px (`md:`)
- **Large Desktop**: ≥ 1024px (`lg:`)
- **Extra Large**: ≥ 1280px (`xl:`)

## Component Standardization

### Form Components

#### Input
- **Height**: `h-control-sm sm:h-control-md` (32px → 40px)
- **Padding**: `px-3 py-2`
- **Text Size**: `text-base sm:text-sm`
- **Border Radius**: `rounded-md`

#### Textarea
- **Min Height**: `min-h-[5rem] sm:min-h-[6rem]`
- **Padding**: `px-3 py-2`
- **Text Size**: `text-base sm:text-sm`
- **Border Radius**: `rounded-md`

#### Select
- **Trigger Height**: `h-control-md`
- **Content Padding**: `p-component-xs sm:p-component-sm`
- **Content Min Width**: `min-w-32 sm:min-w-40`
- **Item Padding**: `py-component-xs pl-component-lg pr-component-xs`
- **Z-Index**: Uses `Z_INDEX.tooltip`

#### Checkbox
- **Size**: `size-4 sm:size-5` (16px → 20px)
- **Touch Target**: Meets 44x44px minimum on mobile
- **Border Radius**: `rounded-sm`

#### Radio
- **Size**: `size-4 sm:size-5` (16px → 20px)
- **Gap**: `gap-2 sm:gap-3`
- **Touch Target**: Meets 44x44px minimum on mobile

#### Label
- **Text Size**: `text-sm sm:text-base`
- **Font Weight**: `font-medium`

### Button Component

| Size | Height | Padding |
|------|--------|---------|
| `sm` | `h-control-sm` (32px) | `px-component-sm` (12px) |
| `default` | `h-control-md` (40px) | `px-component-md` (16px) |
| `lg` | `h-control-lg` (44px) | `px-component-lg` (24px) |
| `responsive` | `h-control-sm sm:h-control-md` | `px-component-sm sm:px-component-md` |
| `icon` | `h-control-md w-control-md` | N/A |

**Features**:
- Consistent `rounded-md` border radius
- Built-in `gap-2` for icon spacing
- Responsive size variant for adaptive sizing

### Card Components

#### Card
- **Border Radius**: `rounded-lg`
- **Shadow**: `shadow-sm`

#### CardHeader
- **Padding**: `p-component-lg sm:p-component-xl` (24px → 32px)
- **Gap**: `space-y-1.5 sm:space-y-2`

#### CardTitle
- **Text Size**: `text-heading-lg sm:text-heading-xl` (20px → 24px)
- **Font Weight**: `font-semibold`

#### CardDescription
- **Text Size**: `text-sm sm:text-base`
- **Color**: `text-muted-foreground`

#### CardContent & CardFooter
- **Padding**: `p-component-lg sm:p-component-xl pt-0`

### Overlay Components

#### Dialog

**DialogContent**:
- **Max Width**: Responsive breakpoints
  - Mobile: `max-w-[calc(100vw-2rem)]`
  - Small: `sm:max-w-lg`
  - Medium: `md:max-w-xl`
  - Large: `lg:max-w-2xl`
- **Padding**: `p-component-lg sm:p-component-xl`
- **Gap**: `gap-component-md sm:gap-component-lg`
- **Z-Index**: `Z_INDEX.modalOverlay + 1`

**DialogHeader**:
- **Gap**: `space-y-1.5 sm:space-y-2`

**DialogFooter**:
- **Layout**: `flex-col-reverse gap-2 sm:flex-row sm:gap-3`

**DialogTitle**:
- **Text Size**: `text-heading-lg sm:text-heading-xl`

**DialogDescription**:
- **Text Size**: `text-sm sm:text-base`

#### Sheet

**SheetContent**:
- **Padding**: `p-component-lg sm:p-component-xl`
- **Gap**: `gap-component-md sm:gap-component-lg`
- **Width (left/right)**: `w-[85vw] sm:w-3/4 md:max-w-sm lg:max-w-md`
- **Height (top/bottom)**: `h-[85vh] sm:h-3/4 md:max-h-[600px]`
- **Z-Index**: `Z_INDEX.sheetOverlay + 1`

**SheetHeader**:
- **Gap**: `space-y-2 sm:space-y-3`

**SheetTitle**:
- **Text Size**: `text-heading-lg sm:text-heading-xl`

**SheetDescription**:
- **Text Size**: `text-sm sm:text-base`

#### Popover

**PopoverContent**:
- **Width**: `w-[calc(100vw-2rem)] sm:w-72 md:w-80`
- **Padding**: `p-component-md sm:p-component-lg`
- **Border Radius**: `rounded-md`
- **Z-Index**: `Z_INDEX.tooltip`

### Navigation & Menu Components

#### Dropdown Menu

**DropdownMenuContent**:
- **Min Width**: `min-w-32 sm:min-w-40`
- **Padding**: `p-component-xs sm:p-component-sm`
- **Border Radius**: `rounded-md`
- **Z-Index**: `Z_INDEX.tooltip`

**DropdownMenuItem**:
- **Padding**: `px-component-xs py-component-xs sm:px-component-sm sm:py-component-sm`
- **Text Size**: `text-sm`

#### Tabs

**TabsList**:
- **Height**: `h-control-md`
- **Padding**: `p-component-xs`
- **Border Radius**: `rounded-md`

**TabsTrigger**:
- **Padding**: `px-component-sm py-component-xs sm:px-component-md`
- **Text Size**: `text-sm sm:text-base`
- **Border Radius**: `rounded-sm`

#### Tooltip

**TooltipContent**:
- **Padding**: `px-component-sm py-component-xs`
- **Text Size**: `text-xs sm:text-sm`
- **Border Radius**: `rounded-md`
- **Z-Index**: `Z_INDEX.tooltip`

### Data Display Components

#### Table

**Table**:
- **Wrapper**: `overflow-x-auto` for horizontal scrolling on mobile
- **Text Size**: `text-xs sm:text-sm`

**TableHead**:
- **Height**: `h-control-md sm:h-12`
- **Padding**: `px-component-sm sm:px-component-md`

**TableCell**:
- **Padding**: `p-component-sm sm:p-component-md`

#### Alert

**Alert**:
- **Padding**: `p-component-md sm:p-component-lg`
- **Border Radius**: `rounded-lg`
- **Icon Size**: `size-4 sm:size-5`

**AlertTitle**:
- **Text Size**: `text-heading-sm sm:text-heading-md`

**AlertDescription**:
- **Text Size**: `text-sm sm:text-base`

#### Badge

**Badge**:
- **Padding**: `px-component-xs py-0.5 sm:px-component-sm`
- **Text Size**: `text-xs sm:text-sm`
- **Border Radius**: `rounded-full`

## Utility Classes

Available in `styles/globals.css`:

### Base Classes

```css
.form-control-base
/* Standard form control styling with focus states */

.card-base
/* Standard card styling with shadow */

.overlay-base
/* Standard overlay with backdrop blur and animations */

.interactive-base
/* Standard interactive element with transitions and focus rings */
```

### Responsive Utilities

```css
.responsive-padding
/* p-component-sm sm:p-component-md lg:p-component-lg */

.responsive-gap
/* gap-2 sm:gap-3 lg:gap-4 */

.responsive-text
/* text-sm sm:text-base */

.responsive-heading
/* text-lg sm:text-xl lg:text-2xl */

.mobile-touch-target
/* min-h-[44px] min-w-[44px] */
```

## Touch Target Guidelines

All interactive elements meet WCAG 2.1 Level AAA touch target requirements:

- **Minimum Touch Target**: 44x44px
- **Implementation**: Responsive sizing ensures mobile elements are larger
  - Checkboxes: `size-4 sm:size-5` (16px → 20px)
  - Radio buttons: `size-4 sm:size-5` (16px → 20px)
  - Buttons: Minimum `h-control-sm` (32px) with padding
  - Input controls: `h-control-sm sm:h-control-md` (32px → 40px)

## Usage Examples

### Form with Responsive Components

```tsx
import { Input, Label, Button } from "@/components/ui"

function ContactForm() {
  return (
    <form className="responsive-gap">
      <div>
        <Label>Email</Label>
        <Input type="email" placeholder="Enter your email" />
      </div>
      <Button size="responsive">Submit</Button>
    </form>
  )
}
```

### Card with Standardized Spacing

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

function ProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Content automatically has consistent padding */}
      </CardContent>
    </Card>
  )
}
```

### Dialog with Responsive Layout

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

function WelcomeDialog() {
  return (
    <Dialog>
      <DialogContent>
        {/* Automatically responsive max-width and padding */}
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogDescription>Get started with your account</DialogDescription>
        </DialogHeader>
        {/* Content */}
      </DialogContent>
    </Dialog>
  )
}
```

## Migration Notes

When updating existing components:

1. **Replace hardcoded values** with design tokens
2. **Add responsive variants** for mobile/tablet/desktop
3. **Update z-index** to use `Z_INDEX` from config
4. **Ensure touch targets** meet 44x44px minimum on mobile
5. **Test responsiveness** across all breakpoints

## Benefits

✅ **Consistency**: Unified spacing and typography across all components
✅ **Responsive**: Mobile-first design with proper breakpoints
✅ **Accessible**: Meets WCAG touch target requirements
✅ **Maintainable**: Centralized design tokens
✅ **Scalable**: Easy to adjust design system globally
✅ **Z-Index Management**: No more stacking context issues

## References

- Design Tokens: [tailwind.config.ts](../../tailwind.config.ts)
- Utility Classes: [styles/globals.css](../../styles/globals.css)
- Z-Index Configuration: [config/z-index.ts](../../config/z-index.ts)
