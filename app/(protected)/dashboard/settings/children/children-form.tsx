"use client";

import { useEffect, useState } from "react";
import { 
  getGuardianChildrenHistory, 
  sendChildRequest, 
  cancelChildRequest 
} from "@/lib/api/guardian";
import { ChildRequestItem } from "@/lib/types/guardian";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, XCircle, GraduationCap } from "lucide-react";

export function ChildrenForm() {
  const [children, setChildren] = useState<ChildRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<Record<number, boolean>>({});

  const fetchChildren = async () => {
    setIsLoading(true);
    const data = await getGuardianChildrenHistory();
    if (data.success) {
      setChildren(data.content?.history.request_history || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const result = await sendChildRequest(email);

    if (result.success) {
      setSubmitSuccess("Invitation sent successfully!");
      setEmail("");
      await fetchChildren();
    } else {
      setSubmitError(result.message);
    }
    setIsSubmitting(false);
  };

  const handleCancel = async (id: number) => {
    setCancelLoading((prev) => ({ ...prev, [id]: true }));
    const result = await cancelChildRequest(id);
    
    if (result.success) {
      await fetchChildren();
    } else {
      console.error(result.message);
    }
    setCancelLoading((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="space-y-8">
      {/* Invite Form */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium">Invite a Child</h3>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Child's email address"
              className="flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <Button type="submit" disabled={isSubmitting || !email}>
              <UserPlus className="mr-2 h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Invite"}
            </Button>
          </div>
          {submitError && (
            <p className="text-sm font-medium text-red-500">{submitError}</p>
          )}
          {submitSuccess && (
            <p className="text-sm font-medium text-green-600">{submitSuccess}</p>
          )}
        </form>
      </div>

      {/* Children List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Monitoring History</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : children.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No children linked yet</h3>
            <p className="text-sm text-muted-foreground">
              Send an invite to your child to start monitoring their progress.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {children.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.child_name || "New Invitation"}</span>
                    <Badge 
                      variant={item.status === "pending" ? "secondary" : "outline"}
                      className="capitalize"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.child_email}</p>
                  {item.class && (
                    <p className="text-xs font-medium text-primary">Class: {item.class}</p>
                  )}
                </div>

                {item.status === "pending" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={() => handleCancel(item.id)}
                    disabled={cancelLoading[item.id]}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {cancelLoading[item.id] ? "Canceling..." : "Cancel"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
