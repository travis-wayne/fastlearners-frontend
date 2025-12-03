"use client";

import { useState, type JSX } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: {
    href: string;
    title: string;
    icon: JSX.Element;
  }[];
};

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [val, setVal] = useState(pathname ?? "/dashboard/settings");

  const handleSelect = (e: string) => {
    setVal(e);
    router.push(e);
  };

  return (
    <>
      {/* Mobile selector */}
      <div className="p-1 md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-11 rounded-xl border-muted bg-card/80 text-sm shadow-sm backdrop-blur sm:w-56">
            <SelectValue placeholder="Settings section" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className="flex items-center gap-x-3 px-2 py-1.5">
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop sidebar */}
      <ScrollArea className="hidden w-full min-w-40 rounded-2xl border bg-card/70 px-2 py-3 shadow-sm backdrop-blur md:block">
        <nav
          className={cn(
            "flex space-x-2 py-1 lg:flex-col lg:space-x-0 lg:space-y-1",
            className,
          )}
          {...props}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "justify-start rounded-xl border border-transparent px-3 py-2 text-sm font-medium transition-all",
                pathname.startsWith(item.href)
                  ? "bg-primary/10 text-primary shadow-sm hover:bg-primary/15"
                  : "text-muted-foreground hover:border-primary/20 hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span className="me-2 text-muted-foreground">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  );
}
