import { useEffect, useState } from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
} as const;

type DeviceType = "mobile" | "sm" | "tablet" | "desktop" | null;

export function useMediaQuery() {
  const [device, setDevice] = useState<DeviceType>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const classifyDevice = (width: number): Exclude<DeviceType, null> => {
      if (width < BREAKPOINTS.sm) return "mobile";
      if (width < BREAKPOINTS.md) return "sm";
      if (width < BREAKPOINTS.lg) return "tablet";
      return "desktop";
    };

    const updateViewportState = () => {
      const { innerWidth, innerHeight } = window;
      setDimensions({ width: innerWidth, height: innerHeight });
      setDevice(classifyDevice(innerWidth));
    };

    updateViewportState();
    window.addEventListener("resize", updateViewportState);

    return () => {
      window.removeEventListener("resize", updateViewportState);
    };
  }, []);

  const width = dimensions?.width ?? null;

  const isMobile = width !== null && width < BREAKPOINTS.sm;
  const isSm =
    width !== null && width >= BREAKPOINTS.sm && width < BREAKPOINTS.md;
  const isTablet =
    width !== null && width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isDesktop = width !== null && width >= BREAKPOINTS.lg;

  return {
    device,
    width,
    height: dimensions?.height ?? null,
    isMobile,
    isSm,
    isTablet,
    isDesktop,
  };
}
