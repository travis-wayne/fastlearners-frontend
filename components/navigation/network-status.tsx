"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NetworkQuality = "excellent" | "good" | "fair" | "poor" | "offline";

interface NetworkStatusProps {
  className?: string;
  showLabel?: boolean;
  showPing?: boolean;
  refreshInterval?: number; // in seconds
}

export function NetworkStatus({
  className,
  showLabel = false,
  showPing = true,
  refreshInterval = 15,
}: NetworkStatusProps) {
  const [quality, setQuality] = useState<NetworkQuality>("excellent");
  const [ping, setPing] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Measure ping by timing a request
  const measurePing = useCallback(async (): Promise<{
    ping: number;
    quality: NetworkQuality;
  } | null> => {
    try {
      if (!navigator.onLine) {
        return { ping: 0, quality: "offline" };
      }

      const startTime = performance.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Multiple fallback methods for ping measurement
      const pingMethods = [
        // Method 1: Favicon request (fastest)
        () =>
          fetch("/favicon.svg", {
            method: "HEAD",
            cache: "no-cache",
            signal: controller.signal,
          }),
        // Method 2: API health check if available
        () =>
          fetch("/api/health", {
            method: "HEAD",
            cache: "no-cache",
            signal: controller.signal,
          }),
        // Method 3: Small image ping
        () =>
          new Promise<Response>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(new Response());
            img.onerror = reject;
            img.src = "/favicon.svg?t=" + Date.now();
          }),
      ];

      let response;
      let methodUsed = 0;

      for (const method of pingMethods) {
        try {
          response = await method();
          break;
        } catch (error) {
          methodUsed++;
          if (methodUsed >= pingMethods.length) {
            throw error;
          }
        }
      }

      clearTimeout(timeoutId);
      const endTime = performance.now();
      const pingTime = Math.round(endTime - startTime);

      // Classify quality based on ping time
      let networkQuality: NetworkQuality;
      if (pingTime < 50) {
        networkQuality = "excellent";
      } else if (pingTime < 100) {
        networkQuality = "good";
      } else if (pingTime < 200) {
        networkQuality = "fair";
      } else {
        networkQuality = "poor";
      }

      return { ping: pingTime, quality: networkQuality };
    } catch (error) {
      // If all methods fail, consider offline or poor connection
      return navigator.onLine
        ? { ping: 999, quality: "poor" }
        : { ping: 0, quality: "offline" };
    }
  }, []);

  const updateNetworkStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await measurePing();
      if (result) {
        setPing(result.ping);
        setQuality(result.quality);
        setIsOnline(result.quality !== "offline");
      }
    } catch (error) {
      console.warn("Network status check failed:", error);
      setQuality("poor");
      setPing(null);
    } finally {
      setIsLoading(false);
      setLastChecked(new Date());
    }
  }, [measurePing]);

  // Manual refresh function for tooltip button
  const handleRefresh = useCallback(() => {
    updateNetworkStatus();
  }, [updateNetworkStatus]);

  useEffect(() => {
    // Initial status check
    updateNetworkStatus();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Check network quality when coming back online
      setTimeout(updateNetworkStatus, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setQuality("offline");
      setPing(0);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Periodic ping check
    const intervalId = setInterval(updateNetworkStatus, refreshInterval * 1000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(intervalId);
    };
  }, [updateNetworkStatus, refreshInterval]);

  const getQualityConfig = (currentQuality: NetworkQuality) => {
    switch (currentQuality) {
      case "excellent":
        return {
          icon: Wifi,
          color: "text-green-600",
          bgColor: "bg-green-100 dark:bg-green-900/20",
          label: "Excellent",
          description: "Excellent connection quality",
          dotColor: "bg-green-500",
        };
      case "good":
        return {
          icon: Wifi,
          color: "text-green-500",
          bgColor: "bg-green-100 dark:bg-green-900/20",
          label: "Good",
          description: "Good connection quality",
          dotColor: "bg-green-400",
        };
      case "fair":
        return {
          icon: Wifi,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
          label: "Fair",
          description: "Fair connection quality",
          dotColor: "bg-yellow-500",
        };
      case "poor":
        return {
          icon: AlertTriangle,
          color: "text-orange-600",
          bgColor: "bg-orange-100 dark:bg-orange-900/20",
          label: "Poor",
          description: "Poor connection quality",
          dotColor: "bg-orange-500",
        };
      case "offline":
        return {
          icon: WifiOff,
          color: "text-red-600",
          bgColor: "bg-red-100 dark:bg-red-900/20",
          label: "Offline",
          description: "No internet connection",
          dotColor: "bg-red-500",
        };
    }
  };

  const config = getQualityConfig(quality);
  const Icon = config.icon;

  const formatLastChecked = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getPingRangeText = (currentQuality: NetworkQuality) => {
    switch (currentQuality) {
      case "excellent":
        return "< 50ms";
      case "good":
        return "50-99ms";
      case "fair":
        return "100-199ms";
      case "poor":
        return "≥ 200ms";
      case "offline":
        return "N/A";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex cursor-pointer items-center space-x-1.5 rounded-md px-2 py-1 transition-colors",
              config.bgColor,
              className,
            )}
          >
            <div className="relative">
              <Icon
                className={cn(
                  "size-4",
                  config.color,
                  isLoading && "animate-pulse",
                )}
              />
              {/* Status dot indicator */}
              <div
                className={cn(
                  "absolute -right-1 -top-1 size-2 rounded-full",
                  config.dotColor,
                  isLoading && "animate-pulse",
                )}
              />
            </div>

            {showPing && ping !== null && quality !== "offline" && (
              <span className={cn("font-mono text-xs", config.color)}>
                {ping}ms
              </span>
            )}

            {showLabel && (
              <span className={cn("text-sm font-medium", config.color)}>
                {config.label}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={cn("size-2 rounded-full", config.dotColor)} />
                <span className="font-medium">{config.label}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="size-6 p-0"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={cn("size-3", isLoading && "animate-spin")}
                />
              </Button>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {config.description}
              </p>
              {showPing && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Ping:</span>
                  <span className={cn("font-mono", config.color)}>
                    {quality === "offline"
                      ? "Offline"
                      : ping !== null
                        ? `${ping}ms`
                        : isLoading
                          ? "Measuring..."
                          : "Unknown"}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Range:</span>
                <span className="font-mono">{getPingRangeText(quality)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Last checked:</span>
                <span>{formatLastChecked(lastChecked)}</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
