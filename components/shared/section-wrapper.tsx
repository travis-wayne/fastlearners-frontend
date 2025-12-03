import { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  disableVerticalPadding?: boolean;
  id?: string;
}

export function SectionWrapper({
  as: Component = "section",
  children,
  className,
  disableVerticalPadding = false,
  id,
}: SectionWrapperProps) {
  return (
    <Component
      id={id}
      className={cn(
        "container mx-auto w-full px-4 sm:px-6 lg:px-8",
        disableVerticalPadding
          ? "py-0"
          : "py-10 sm:py-14 lg:py-20 xl:py-24",
        className,
      )}
    >
      {children}
    </Component>
  );
}

