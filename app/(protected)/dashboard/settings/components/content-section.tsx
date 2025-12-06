import React from "react";

import { Separator } from "@/components/ui/separator";

type ContentSectionProps = {
  title: string;
  desc: string;
  children: React.ReactNode;
};

export function ContentSection({ title, desc, children }: ContentSectionProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Section header */}
      <div className="flex-none pb-2">
        <h3 className="text-lg font-semibold tracking-tight md:text-xl">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
      <Separator className="my-4 flex-none" />

      {/* Scrollable content area */}
      <div className="faded-bottom size-full overflow-y-auto scroll-smooth pb-6 pe-2 md:pb-8 md:pe-4">
        <div className="relative -mx-1 rounded-2xl border bg-card/70 px-3 py-4 shadow-sm backdrop-blur-sm md:p-6 lg:max-w-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 rounded-2xl bg-gradient-to-b from-background/80 to-transparent opacity-80" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-2xl bg-gradient-to-t from-background/80 to-transparent opacity-80" />
          <div className="relative space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
