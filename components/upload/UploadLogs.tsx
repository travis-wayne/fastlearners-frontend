"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Download, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadLog {
  type: 'success' | 'error' | 'info';
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
    const logText = logs.map(log => 
      `[${log.timestamp.toISOString()}] ${log.type.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upload-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLogIcon = (type: UploadLog['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getLogStyles = (type: UploadLog['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50/50 dark:bg-green-950/20';
      case 'error':
        return 'border-red-500 bg-red-50/50 dark:bg-red-950/20';
      default:
        return 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20';
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upload Logs
            </CardTitle>
            <CardDescription>
              Real-time logs of upload attempts and results ({logs.length} entries)
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
                <Download className="h-3 w-3 mr-1" />
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
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No logs yet. Upload activity will appear here.</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {logs.map((log, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border-l-4 transition-all duration-200",
                    getLogStyles(log.type)
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getLogIcon(log.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-relaxed">
                          {log.message}
                        </p>
                        {log.fileName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            File: {log.fileName}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          log.type === 'success' 
                            ? 'default' 
                            : log.type === 'error' 
                            ? 'destructive' 
                            : 'secondary'
                        }
                        className="text-xs capitalize shrink-0"
                      >
                        {log.type}
                      </Badge>
                      {log.configKey && (
                        <Badge variant="outline" className="text-xs shrink-0">
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
