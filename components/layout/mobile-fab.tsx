"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/lib/types/auth";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { getQuickActions } from "@/config/navigation";

interface MobileFabProps {
  className?: string;
}

export function MobileFab({ className }: MobileFabProps) {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get user's primary role and quick actions
  const primaryRole = user?.role[0] || 'guest';
  const quickActions = getQuickActions(primaryRole);

  // Don't show FAB for guests or if no quick actions
  if (primaryRole === 'guest' || quickActions.length === 0) {
    return null;
  }

  const toggleFab = () => {
    setIsOpen(!isOpen);
  };

  const closeFab = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={closeFab}
        />
      )}

      {/* FAB Container */}
      <div className={cn("fixed bottom-6 right-6 z-50 md:hidden", className)}>
        {/* Quick Action Buttons */}
        <div 
          className={cn(
            "flex flex-col gap-3 mb-4 transition-all duration-300 ease-in-out",
            isOpen 
              ? "opacity-100 transform translate-y-0 pointer-events-auto" 
              : "opacity-0 transform translate-y-4 pointer-events-none"
          )}
        >
          {quickActions.map((action, index) => {
            const Icon = Icons[action.icon as keyof typeof Icons];
            return (
              <Link 
                key={index}
                href={action.href}
                className={cn(
                  "flex items-center gap-2 h-12 px-4 rounded-full shadow-lg",
                  "bg-background border border-border hover:bg-muted",
                  "transition-all duration-200 ease-in-out",
                  "text-sm font-medium",
                  isOpen 
                    ? `translate-y-0 opacity-100` 
                    : `translate-y-2 opacity-0`,
                )}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : `${(quickActions.length - index) * 30}ms`
                }}
                onClick={closeFab}
              >
                <Icon className="size-4" />
                <span>{action.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Main FAB Button */}
        <Button
          size="default"
          className={cn(
            "size-14 rounded-full shadow-lg",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "transition-all duration-200 ease-in-out",
            isOpen && "rotate-45"
          )}
          onClick={toggleFab}
        >
          {isOpen ? (
            <X className="size-6" />
          ) : (
            <Plus className="size-6" />
          )}
        </Button>

        {/* Action Labels (shown on first render for accessibility) */}
        {isOpen && (
          <div className="sr-only">
            <p>Quick actions menu opened. Available actions:</p>
            <ul>
              {quickActions.map((action, index) => (
                <li key={index}>
                  {action.title}: {action.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Compact version with just the primary action
 */
export function MobileFabCompact({ className }: MobileFabProps) {
  const { user } = useAuthStore();
  
  // Get user's primary role and quick actions
  const primaryRole = user?.role[0] || 'guest';
  const quickActions = getQuickActions(primaryRole);

  // Don't show FAB for guests or if no quick actions
  if (primaryRole === 'guest' || quickActions.length === 0) {
    return null;
  }

  // Use the first quick action as primary
  const primaryAction = quickActions[0];
  const Icon = Icons[primaryAction.icon as keyof typeof Icons];

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 md:hidden", className)}>
      <Link 
        href={primaryAction.href}
        className="size-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        title={primaryAction.description}
      >
        <Icon className="size-6" />
        <span className="sr-only">{primaryAction.title}</span>
      </Link>
    </div>
  );
}
