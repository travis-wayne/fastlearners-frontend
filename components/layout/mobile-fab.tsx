"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { getQuickActions } from "@/config/navigation";
import { UserRole } from "@/types";

interface MobileFabProps {
  className?: string;
}

export function MobileFab({ className }: MobileFabProps) {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get user's primary role and quick actions
  const primaryRole = user?.role[0] || UserRole.GUEST;
  const quickActions = getQuickActions(primaryRole);

  // Don't show FAB for guests or if no quick actions
  if (primaryRole === UserRole.GUEST || quickActions.length === 0) {
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
              <Button
                key={index}
                asChild
                size="default"
                className={cn(
                  "h-12 px-4 rounded-full shadow-lg",
                  "bg-background border border-border hover:bg-muted",
                  "transition-all duration-200 ease-in-out",
                  isOpen 
                    ? `transform translate-y-0 opacity-100` 
                    : `transform translate-y-2 opacity-0`,
                )}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : `${(quickActions.length - index) * 30}ms`
                }}
                onClick={closeFab}
              >
                <Link 
                  href={action.href}
                  className="flex items-center gap-2"
                >
                  <Icon className="size-4" />
                  <span className="text-sm font-medium">{action.title}</span>
                </Link>
              </Button>
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
  const primaryRole = user?.role[0] || UserRole.GUEST;
  const quickActions = getQuickActions(primaryRole);

  // Don't show FAB for guests or if no quick actions
  if (primaryRole === UserRole.GUEST || quickActions.length === 0) {
    return null;
  }

  // Use the first quick action as primary
  const primaryAction = quickActions[0];
  const Icon = Icons[primaryAction.icon as keyof typeof Icons];

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 md:hidden", className)}>
      <Button
        asChild
        size="default"
        className="size-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Link 
          href={primaryAction.href}
          className="flex items-center justify-center"
          title={primaryAction.description}
        >
          <Icon className="size-6" />
          <span className="sr-only">{primaryAction.title}</span>
        </Link>
      </Button>
    </div>
  );
}
