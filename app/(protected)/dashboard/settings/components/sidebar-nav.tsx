"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex flex-col space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-200",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <span className={cn(
              "flex items-center justify-center rounded-md p-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
            )}>
              {item.icon}
            </span>
            <span className="flex-1">{item.title}</span>
            
            {isActive && (
              <div
                className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
