"use client";

import { ReactNode } from "react";
import { List, PanelRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonLayoutProps {
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar: ReactNode;
  leftSidebarTitle?: string;
  rightSidebarTitle?: string;
}

export function LessonLayout({
  leftSidebar,
  mainContent,
  rightSidebar,
  leftSidebarTitle = "Concepts",
  rightSidebarTitle = "Resources",
}: LessonLayoutProps) {
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-6">
      {/* Mobile Floating Triggers */}
      <div className="sticky top-16 z-30 flex items-center justify-between gap-2 border-b bg-background/95 p-2 backdrop-blur lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-11 gap-2">
              <List className="size-4" />
              <span>{leftSidebarTitle}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 sm:w-[360px] md:w-[400px]">
            <SheetHeader className="border-b p-4">
              <SheetTitle>{leftSidebarTitle}</SheetTitle>
            </SheetHeader>
            <ScrollArea className="responsive-padding h-[calc(100vh-5rem)]">
              {leftSidebar}
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-11 gap-2">
              <span>{rightSidebarTitle}</span>
              <PanelRight className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0 sm:w-[360px] md:w-[400px]">
            <SheetHeader className="border-b p-4">
              <SheetTitle>{rightSidebarTitle}</SheetTitle>
            </SheetHeader>
            <ScrollArea className="responsive-padding h-[calc(100vh-5rem)]">
              {rightSidebar}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Left Sidebar - Desktop */}
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-20">
          <ScrollArea className="h-[calc(100vh-7rem)] border-r px-component-md">
            {leftSidebar}
          </ScrollArea>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full lg:col-span-6">
        <div className="h-full lg:min-h-[calc(100vh-7rem)]">
          {mainContent}
        </div>
      </main>

      {/* Right Sidebar - Desktop */}
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-20">
          <ScrollArea className="h-[calc(100vh-7rem)] border-l px-component-md">
            {rightSidebar}
          </ScrollArea>
        </div>
      </aside>
    </div>
  );
}
