import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function for smooth animations
export const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
      type: "spring",
      stiffness: 100,
    },
  }),
};

// Common transition configurations
export const transitions = {
  default: { type: "spring", stiffness: 100, damping: 15 },
  slow: { type: "spring", stiffness: 60, damping: 20 },
  fast: { type: "spring", stiffness: 300, damping: 30 },
};

// Common hover variants
export const hoverVariants = {
  hover: { 
    scale: 1.02,
    transition: transitions.fast
  }
};

// Card hover effects
export const cardVariants = {
  initial: { 
    boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" 
  },
  hover: { 
    boxShadow: "0 10px 40px -10px rgba(59, 130, 246, 0.4)",
    y: -2,
    transition: transitions.default
  }
};