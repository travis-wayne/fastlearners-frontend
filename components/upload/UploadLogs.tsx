"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface UploadLog {
  type: "success" | "error" | "info";
  message: string;
  timestamp: Date;
  configKey?: string;
  fileName?: string;
}

interface UploadLogsProps {
  logs: UploadLog[];
  onClearLogs?: () => void;
  className?: string;
}

export function UploadLogs({ logs, onClearLogs, className }: UploadLogsProps) {
  const downloadLogs = () => {
    const logText = logs
      .map(
        (log) =>
          `[${log.timestamp.toISOString()}] ${log.type.toUpperCase()}: ${log.message}`,
      )
      .join("\n");

    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `upload-logs-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLogIcon = (type: UploadLog["type"]) => {
    switch (type) {
      case "success":
        return (
          <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
        );
      case "error":
        return (
          <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
        );
      default:
        return <Clock className="size-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getLogStyles = (type: UploadLog["type"]) => {
    switch (type) {
      case "success":
        return "border-green-500 bg-green-50/50 dark:bg-green-950/20";
      case "error":
        return "border-red-500 bg-red-50/50 dark:bg-red-950/20";
      default:
        return "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20";
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="p-component-sm sm:p-component-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-heading-md sm:text-heading-lg">
              <Clock className="size-4 sm:size-5" />
              Upload Logs
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Real-time logs of upload attempts and results ({logs.length}{" "}
              entries)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {logs.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={downloadLogs}
                className="text-[10px] sm:text-xs"
              >
                <Download className="mr-1 size-3" />
                Export
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClearLogs}
              disabled={logs.length === 0}
              className="text-[10px] sm:text-xs"
            >
              <Trash2 className="mr-1 size-3" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-component-sm sm:p-component-md">
        {logs.length === 0 ? (
          <div className="py-6 text-center sm:py-8">
            <Clock className="mx-auto mb-3 size-10 text-muted-foreground/50 sm:mb-4 sm:size-12" />
            <p className="text-xs text-muted-foreground sm:text-sm">
              No logs yet. Upload activity will appear here.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-80 sm:h-96">
            <div className="space-y-2 sm:space-y-3">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-lg border-l-4 p-2 transition-all duration-200 sm:p-3",
                    getLogStyles(log.type),
                  )}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <div className="flex flex-1 items-start gap-2 sm:gap-3">
                      {getLogIcon(log.type)}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium leading-relaxed sm:text-sm">
                          {log.message}
                        </p>
                        {log.fileName && (
                          <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                            File: {log.fileName}
                          </p>
                        )}
                        <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                          {log.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Badge
                        variant={
                          log.type === "success"
                            ? "default"
                            : log.type === "error"
                              ? "destructive"
                              : "secondary"
                        }
                        className="shrink-0 text-[10px] capitalize sm:text-xs"
                      >
                        {log.type}
                      </Badge>
                      {log.configKey && (
                        <Badge variant="outline" className="shrink-0 text-[10px] sm:text-xs">
                          {log.configKey}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
