"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DismissibleCardProps {
  id: string; // Unique ID for localStorage
  title?: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function DismissibleCard({ id, title, content, icon, className }: DismissibleCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const dismissed = localStorage.getItem(`dismissed_${id}`);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`dismissed_${id}`, "true");
  };

  if (!hasMounted || !isVisible) {
    return null;
  }

  return (
    <Card className={cn("relative overflow-hidden border-primary/20 bg-primary/5 shadow-sm dark:bg-primary/10", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="mt-0.5 flex-shrink-0 text-primary">
              {icon}
            </div>
          )}
          <div className="flex-1 space-y-1.5">
            {title && <h3 className="font-semibold leading-none tracking-tight text-foreground">{title}</h3>}
            <div className="text-sm text-muted-foreground leading-relaxed">{content}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 -mr-2 -mt-2 h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-foreground"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
