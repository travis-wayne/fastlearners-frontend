"use client";

import { useEffect, useState } from "react";
import { 
  getStudentGuardianRequestHistory, 
  acceptGuardianRequest, 
  rejectGuardianRequest 
} from "@/lib/api/guardian";
import { GuardianRequestItem } from "@/lib/types/guardian";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function GuardiansForm() {
  const [history, setHistory] = useState<GuardianRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    const data = await getStudentGuardianRequestHistory();
    if (data.success) {
      setHistory(data.content?.history.request_history || []);
      setError(null);
    } else {
      setError(data.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAction = async (id: number, action: 'accept' | 'reject') => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    const result = action === 'accept' 
      ? await acceptGuardianRequest(id) 
      : await rejectGuardianRequest(id);
    
    if (result.success) {
      await fetchHistory();
    } else {
      // In a real app, we might show a toast here
      console.error(result.message);
    }
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
        <Clock className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">No guardian requests yet</h3>
        <p className="text-sm text-muted-foreground">
          When a guardian invites you to monitor your progress, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div
          key={item.id}
          className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{item.guardian_name}</span>
              <Badge 
                variant={item.status === "pending" ? "secondary" : "outline"}
                className="capitalize"
              >
                {item.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{item.guardian_email}</p>
            {item.response_date && (
              <p className="text-xs text-muted-foreground">
                Date: {new Date(item.response_date).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={() => item.status === "pending" && handleAction(item.id, "reject")}
              disabled={item.status !== "pending" || actionLoading[item.id]}
            >
              {actionLoading[item.id] ? "Processing..." : "Reject"}
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              onClick={() => item.status === "pending" && handleAction(item.id, "accept")}
              disabled={item.status !== "pending" || actionLoading[item.id]}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {actionLoading[item.id] ? "Processing..." : "Accept"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
