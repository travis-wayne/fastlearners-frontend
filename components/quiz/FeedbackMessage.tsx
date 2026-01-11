"use client";

import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type FeedbackType = "success" | "error" | "warning" | "info";

interface FeedbackMessageProps {
  type: FeedbackType;
  message: string;
  className?: string;
}

export function FeedbackMessage({
  type,
  message,
  className,
}: FeedbackMessageProps) {
  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: "border-green-500 bg-green-50 text-green-800",
    error: "border-red-500 bg-red-50 text-red-800",
    warning: "border-yellow-500 bg-yellow-50 text-yellow-800",
    info: "border-blue-500 bg-blue-50 text-blue-800",
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border p-3 sm:gap-3 sm:p-4",
        styles[type],
        className
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0 sm:size-5" />
      <p className="flex-1 text-sm font-medium sm:text-base">{message}</p>
    </div>
  );
}

