"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { 
  adminGetTicket, 
  getTicketStatuses, 
  updateTicketStatus,
  getSupportAgents,
  assignSupportAgent,
  getAssignmentHistory,
  deleteAssignment,
  deleteTicket
} from "@/lib/api/tickets";
import { TicketDetail, TicketStatusOption, SupportAgent, TicketAssignment } from "@/lib/types/ticket";
import { showApiToast } from "@/lib/utils/api-toast";
import { parseDateString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TicketStatusBadge } from "@/components/tickets/ticket-status-badge";
import { TicketReplyThread } from "@/components/tickets/ticket-reply-thread";
import { TicketReplyForm } from "@/components/tickets/ticket-reply-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function SuperadminTicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const ticketId = Number(params.id);

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status update
  const [statuses, setStatuses] = useState<TicketStatusOption[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Assignment
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [assignments, setAssignments] = useState<TicketAssignment[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Deletion
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTicket();
    fetchStatuses();
    fetchAgents();
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const fetchCountRef = useRef(0);

  async function fetchTicket() {
    const currentFetch = ++fetchCountRef.current;
    setLoading(true);
    setError(null);
    const res = await adminGetTicket(ticketId);
    
    if (currentFetch !== fetchCountRef.current) return;

    if (res.success && res.content) {
      setTicket(res.content.ticket);
    } else {
      setError(res.message || "Failed to fetch ticket details");
      showApiToast(res.type ?? "error", res.message || "Failed to fetch ticket details");
    }
    setLoading(false);
  }

  async function fetchStatuses() {
    const res = await getTicketStatuses();
    if (res.success && res.content) {
      setStatuses(res.content.statuses || []);
    }
  }

  async function fetchAgents() {
    const res = await getSupportAgents();
    if (res.success && res.content) {
      setAgents(res.content.support_agents || []);
    }
  }

  async function fetchAssignments() {
    const res = await getAssignmentHistory(ticketId);
    if (res.success && res.content) {
      setAssignments(res.content.assignment_history || []);
    }
  }

  async function handleUpdateStatus() {
    if (!selectedStatusId) return;
    setIsUpdatingStatus(true);
    const res = await updateTicketStatus(ticketId, Number(selectedStatusId));
    if (res.success) {
      showApiToast("success", res.message || "Status updated successfully");
      fetchTicket();
      setSelectedStatusId("");
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to update status");
    }
    setIsUpdatingStatus(false);
  }

  async function handleAssignAgent() {
    if (!selectedAgentId) return;
    setIsAssigning(true);
    const res = await assignSupportAgent({ ticket_id: ticketId, assign_to: Number(selectedAgentId) });
    if (res.success) {
      showApiToast("success", res.message || "Agent assigned successfully");
      fetchAssignments();
      setSelectedAgentId("");
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to assign agent");
    }
    setIsAssigning(false);
  }

  async function handleDeleteAssignment(id: number) {
    const res = await deleteAssignment(id);
    if (res.success) {
      showApiToast("success", res.message || "Assignment removed");
      fetchAssignments();
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to remove assignment");
    }
  }

  async function handleDeleteTicket() {
    setIsDeleting(true);
    const res = await deleteTicket(ticketId);
    if (res.success) {
      showApiToast("success", res.message || "Ticket deleted successfully");
      router.push("/dashboard/superadmin/tickets");
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to delete ticket");
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/superadmin/tickets">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="size-5" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Ticket Details</h2>
        </div>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Ticket not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/superadmin/tickets">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Ticket #{ticket.id}
          </h2>
          <p className="text-muted-foreground">
            {ticket.subject}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div>
                  <p className="mb-1 font-medium text-muted-foreground">Status</p>
                  <TicketStatusBadge status={ticket.status as string} />
                </div>
                <div>
                  <p className="mb-1 font-medium text-muted-foreground">Category</p>
                  <p>{ticket.category || "-"}</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-muted-foreground">Priority</p>
                  <p>{ticket.priority || "-"}</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-muted-foreground">Created</p>
                  <p>{ticket.created_at ? parseDateString(ticket.created_at)?.toLocaleDateString() : "-"}</p>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-6">
                <p className="mb-2 font-medium text-muted-foreground">Description</p>
                <p className="whitespace-pre-wrap">{ticket.description}</p>
              </div>

              {ticket.closed_by && (
                <div className="mt-6 border-t pt-6">
                  <p className="mb-1 font-medium text-muted-foreground">Closed By</p>
                  <p>{ticket.closed_by.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Conversation</h3>
            <TicketReplyThread replies={ticket.replies || []} />
          </div>

          <Card>
            <CardContent className="pt-6">
              <TicketReplyForm ticketId={ticket.id} onSuccess={fetchTicket} isAdmin={true} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Management Panel */}
        <div className="space-y-6">
          {/* Status Update Card */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedStatusId} onValueChange={setSelectedStatusId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(s => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleUpdateStatus} 
                disabled={!selectedStatusId || isUpdatingStatus}
                className="w-full"
              >
                {isUpdatingStatus ? "Updating..." : "Update Status"}
              </Button>
            </CardContent>
          </Card>

          {/* Agent Assignment Card */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignments.length > 0 && (
                <div className="mb-4 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Current Assignments</p>
                  {assignments.map(a => (
                    <div key={a.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                      <div>
                        <p className="font-medium">{a.assigned_to?.name}</p>
                        <p className="text-xs text-muted-foreground">Assigned by {a.assigned_by?.name}</p>
                      </div>
                      <ConfirmationDialog
                        trigger={
                          <Button variant="ghost" size="icon" className="size-8 text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        }
                        title="Remove Assignment"
                        description={`Are you sure you want to remove ${a.assigned_to?.name} from this ticket?`}
                        onConfirm={() => handleDeleteAssignment(a.id)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map(a => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAssignAgent} 
                disabled={!selectedAgentId || isAssigning}
                className="w-full"
              >
                {isAssigning ? "Assigning..." : "Assign Agent"}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone Card */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for this ticket.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConfirmationDialog
                trigger={
                  <Button variant="destructive" className="w-full" disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete Ticket"}
                  </Button>
                }
                title="Delete Ticket"
                description="Are you sure you want to delete this ticket? This action cannot be undone and will delete all replies and attachments."
                onConfirm={handleDeleteTicket}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
