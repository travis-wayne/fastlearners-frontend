import * as React from "react";

// @see https://usehooks.com/useLockBodyScroll.
export function useLockBody(shouldLock = true) {
  React.useLayoutEffect(() => {
    if (
      !shouldLock ||
      typeof document === "undefined" ||
      typeof window === "undefined"
    ) {
      return;
    }

    const originalStyle: string = window.getComputedStyle(
      document.body,
    ).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [shouldLock]);
}
