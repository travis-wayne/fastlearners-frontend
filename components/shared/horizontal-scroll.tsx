import { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface HorizontalScrollProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  hideScrollbar?: boolean;
}

export function HorizontalScroll({
  as: Component = "div",
  children,
  className,
  hideScrollbar = true,
}: HorizontalScrollProps) {
  return (
    <Component
      className={cn(
        "flex w-full gap-3 overflow-x-auto pb-2",
        hideScrollbar &&
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {children}
    </Component>
  );
}

