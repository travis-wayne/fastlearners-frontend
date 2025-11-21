/**
 * Centralized z-index configuration for consistent layering across the application.
 * 
 * IMPORTANT: All z-index values should reference these tokens instead of hardcoded values.
 * This ensures consistent layering and makes it easier to debug stacking issues.
 * 
 * Layering hierarchy (from bottom to top):
 * 
 * 1. stickyBanner (35): Sticky banners and secondary navigation elements
 *    - Used for: Profile completion banners, sticky announcements
 *    - Sits below navbar but above main content
 * 
 * 2. navbar (40): Main navigation header
 *    - Used for: Global header with theme/notification/user controls
 *    - Must be above banners but below overlays
 *    - Critical: Any overlay >= 40 with fixed inset-0 can block header clicks
 * 
 * 3. drawerOverlay (45): Drawer overlays for settings/local areas
 *    - Used for: Settings sidebar, local area drawers, user account nav drawer
 *    - Above navbar but below modals
 * 
 * 4. sheetOverlay (45): Sheet overlays for mobile navigation
 *    - Used for: Mobile sidebar sheets (dashboard-sidebar.tsx)
 *    - Above navbar to cover it on mobile, but below modals
 * 
 * 5. modalOverlay (50): Modal and dialog overlays
 *    - Used for: Dialogs, alert dialogs, modals
 *    - Above drawers and sheets to ensure modal content is always visible
 * 
 * 6. tooltip (50): Tooltips and popovers
 *    - Used for: Hover tooltips, dropdown menus, context menus
 *    - Above sheets but below modals to ensure visibility
 * 
 * 7. floatingToggle (55): Floating action buttons
 *    - Used for: Floating buttons that need to be above most content
 * 
 * 8. toast (60): Toast notifications
 *    - Used for: Toast notifications (components/ui/toast.tsx)
 *    - Above modals to ensure toasts are always visible
 * 
 * 9. debugTools (70): Development/debugging tools
 *    - Used for: Development-only debugging overlays
 * 
 * 10. indicator (80): Critical indicators and alerts
 *     - Used for: Critical system indicators that must always be visible
 * 
 * Usage example:
 * ```tsx
 * import { Z_INDEX } from "@/config/z-index";
 * 
 * <div style={{ zIndex: Z_INDEX.navbar }}>...</div>
 * ```
 */
export const Z_INDEX = {
  /** Sticky banners and secondary navigation elements */
  stickyBanner: 35,
  /** Main navigation header - must be above banners but below overlays */
  navbar: 40,
  /** Drawer overlays for settings/local areas (above navbar, below modals) */
  drawerOverlay: 45,
  /** Sheet overlays for mobile navigation (above navbar, below modals) */
  sheetOverlay: 45,
  /** Modal and dialog overlays (above drawers and sheets) */
  modalOverlay: 50,
  /** Tooltips and popovers (above sheets, below modals) */
  tooltip: 50,
  /** Floating action buttons */
  floatingToggle: 55,
  /** Toast notifications (above modals) */
  toast: 60,
  /** Development/debugging tools */
  debugTools: 70,
  /** Critical indicators and alerts */
  indicator: 80,
} as const;

export type ZIndexToken = keyof typeof Z_INDEX;

