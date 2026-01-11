"use client";

import { useEffect, useState, useCallback, startTransition } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

// Type definitions
interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Profile Updated",
    message: "Your profile information has been successfully updated.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
  },
  {
    id: "2",
    type: "info",
    title: "New Feature Available",
    message: "Check out the new dashboard analytics feature.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Subscription Expiring",
    message: "Your premium subscription will expire in 3 days.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
  },
  {
    id: "4",
    type: "error",
    title: "Failed Upload",
    message: "Unable to upload lesson file. Please try again.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: false,
  },
];

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = useCallback((notificationId: string) => {
    startTransition(() => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    startTransition(() => {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true })),
      );
    });
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    startTransition(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId),
      );
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    startTransition(() => {
      setNotifications([]);
    });
  }, []);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="size-4 text-green-600" />;
      case "warning":
        return <X className="size-4 text-yellow-600" />;
      case "error":
        return <X className="size-4 text-red-600" />;
      default:
        return <Bell className="size-4 text-blue-600" />;
    }
  };

  const getNotificationColors = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50 dark:bg-green-900/20";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "error":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20";
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("mobile-touch-target relative size-9", className)}
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full p-0 text-xs sm:-right-2 sm:-top-2"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">
            {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "Notifications"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Bell className="mb-2 size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[250px] sm:h-[300px]">
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "responsive-padding group relative cursor-pointer border-l-2 text-left text-sm transition-colors hover:bg-muted/50",
                      getNotificationColors(notification.type),
                      !notification.isRead && "font-medium",
                    )}
                    onClick={() =>
                      !notification.isRead && markAsRead(notification.id)
                    }
                  >
                    <div className="flex items-start space-x-2">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none sm:text-base">
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-8 p-0 opacity-100 hover:bg-background/50 sm:size-6 sm:opacity-0 sm:group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X className="size-3" />
                            <span className="sr-only">Remove notification</span>
                          </Button>
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="size-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-center text-destructive hover:text-destructive"
                  onClick={clearAllNotifications}
                >
                  <Trash2 className="mr-2 size-4" />
                  Clear all notifications
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
