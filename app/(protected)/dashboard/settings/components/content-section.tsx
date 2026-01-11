import React from "react";
import { Separator } from "@/components/ui/separator";

type ContentSectionProps = {
  title: string;
  desc: string;
  children: React.ReactNode;
};

export function ContentSection({ title, desc, children }: ContentSectionProps) {
  return (
    <div className="flex flex-1 flex-col font-sans duration-500 will-change-transform animate-in fade-in-50">
      <div className="flex-none pb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-primary/80 md:text-base">{desc}</p>
      </div>
      <Separator className="my-6 w-full opacity-60" />
      
      <div className="w-full max-w-4xl flex-1 space-y-8">
        {children}
      </div>
    </div>
  );
}
