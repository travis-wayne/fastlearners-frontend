"use client";

import { ReactNode } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

interface LessonLayoutProps {
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar: ReactNode;
}

export function LessonLayout({
  leftSidebar,
  mainContent,
  rightSidebar,
}: LessonLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Sidebar - Concepts */}
      <aside className="lg:col-span-3">
        <div className="sticky top-20">
          <ScrollArea className="h-[calc(100vh-6rem)]">
            {leftSidebar}
          </ScrollArea>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:col-span-6">
        <ScrollArea className="h-[calc(100vh-6rem)]">{mainContent}</ScrollArea>
      </main>

      {/* Right Sidebar - TOC */}
      <aside className="lg:col-span-3">
        <div className="sticky top-20">
          <ScrollArea className="h-[calc(100vh-6rem)]">
            {rightSidebar}
          </ScrollArea>
        </div>
      </aside>
    </div>
  );
}
