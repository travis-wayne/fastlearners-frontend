"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface LessonTocSidebarProps {
  content?: string | any;
}

export function LessonTocSidebar({ content }: LessonTocSidebarProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Generate TOC from content headings
    if (typeof content === "string") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const headings = doc.querySelectorAll("h2, h3, h4");

      const tocItems: TocItem[] = [];
      headings.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        heading.id = id;
        tocItems.push({
          id,
          title: heading.textContent || "",
          level: parseInt(heading.tagName.charAt(1)),
        });
      });

      setToc(tocItems);
    }
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h2, h3, h4");
      let current = "";

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });

      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (toc.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No headings available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <nav className="space-y-1">
            {toc.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={cn(
                  "block w-full text-left text-sm transition-colors hover:text-primary",
                  item.level === 2 && "pl-0 font-medium",
                  item.level === 3 && "pl-4 text-muted-foreground",
                  item.level === 4 && "pl-8 text-muted-foreground",
                  activeId === item.id && "font-medium text-primary",
                )}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
