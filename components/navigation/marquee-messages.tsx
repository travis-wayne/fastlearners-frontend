"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  AlertCircle,
  Info,
  Megaphone,
  Pause,
  Play,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Type definitions
interface MarqueeMessage {
  id: string;
  content: string;
  type: "announcement" | "alert" | "info" | "maintenance";
  isActive: boolean;
  createdAt: string;
}

interface MarqueeMessagesProps {
  apiEndpoint?: string;
  className?: string;
  autoRefreshInterval?: number; // milliseconds
}

export function MarqueeMessages({
  apiEndpoint = "/api/marquee-messages",
  className,
  autoRefreshInterval = 60000, // 1 minute
}: MarqueeMessagesProps) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<MarqueeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    content: "",
    type: "info" as MarqueeMessage["type"],
  });
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Check if user has admin permissions
  const isAdmin =
    user?.role &&
    (user.role.includes("admin") || user.role.includes("superadmin"));

  const fetchMessages = useCallback(async () => {
    try {
      setError(null);
      // API endpoint removed - marquee messages feature disabled
      // If needed, replace with a documented, real endpoint
      setMessages([]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching marquee messages:", error);
      setMessages([]);
      setError("Marquee messages feature is currently unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  const addMessage = async () => {
    // API endpoint removed - marquee messages feature disabled
    console.warn("Marquee messages API is not available");
  };

  const deleteMessage = async (messageId: string) => {
    // API endpoint removed - marquee messages feature disabled
    console.warn("Marquee messages API is not available");
  };

  useEffect(() => {
    fetchMessages();

    // Set up auto-refresh
    const intervalId = setInterval(fetchMessages, autoRefreshInterval);

    return () => clearInterval(intervalId);
  }, [fetchMessages, autoRefreshInterval]);

  const getMessageConfig = (type: MarqueeMessage["type"]) => {
    switch (type) {
      case "announcement":
        return {
          icon: Megaphone,
          color: "text-blue-600",
          bgColor: "bg-blue-100 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800",
        };
      case "alert":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-100 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
        };
      case "maintenance":
        return {
          icon: Settings,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
        };
      default: // info
        return {
          icon: Info,
          color: "text-gray-600",
          bgColor: "bg-gray-100 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800",
        };
    }
  };

  // TODO: Wire this component back into the dashboard layout when the marquee API is available.
  // Marquee messages feature disabled - hide UI until backend endpoint exists
  return null;
}
