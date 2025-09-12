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
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              Upload Logs
            </CardTitle>
            <CardDescription>
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
                className="text-xs"
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
              className="text-xs"
            >
              <Trash2 className="mr-1 size-3" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {logs.length === 0 ? (
          <div className="py-8 text-center">
            <Clock className="mx-auto mb-4 size-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              No logs yet. Upload activity will appear here.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-lg border-l-4 p-3 transition-all duration-200",
                    getLogStyles(log.type),
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-1 items-start gap-3">
                      {getLogIcon(log.type)}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-relaxed">
                          {log.message}
                        </p>
                        {log.fileName && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            File: {log.fileName}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {log.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          log.type === "success"
                            ? "default"
                            : log.type === "error"
                              ? "destructive"
                              : "secondary"
                        }
                        className="shrink-0 text-xs capitalize"
                      >
                        {log.type}
                      </Badge>
                      {log.configKey && (
                        <Badge variant="outline" className="shrink-0 text-xs">
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
