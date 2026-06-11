"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { getTicket, closeTicket } from "@/lib/api/tickets";
import { TicketDetail } from "@/lib/types/ticket";
import { showApiToast } from "@/lib/utils/api-toast";
import { parseDateString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TicketStatusBadge } from "@/components/tickets/ticket-status-badge";
import { TicketReplyThread } from "@/components/tickets/ticket-reply-thread";
import { TicketReplyForm } from "@/components/tickets/ticket-reply-form";

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ticketId = Number(params.id);

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const fetchCountRef = useRef(0);

  async function fetchTicket() {
    const currentFetch = ++fetchCountRef.current;
    setLoading(true);
    setError(null);
    const res = await getTicket(ticketId);
    
    if (currentFetch !== fetchCountRef.current) return;

    if (res.success && res.content) {
      setTicket(res.content.ticket);
    } else {
      setError(res.message || "Failed to fetch ticket details");
      showApiToast(res.type ?? "error", res.message || "Failed to fetch ticket details");
    }
    setLoading(false);
  }

  async function handleCloseTicket() {
    if (!confirm("Are you sure you want to close this ticket?")) return;
    
    const res = await closeTicket(ticketId);
    if (res.success) {
      showApiToast("success", res.message || "Ticket closed successfully");
      fetchTicket();
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to close ticket");
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
          <Link href="/dashboard/tickets">
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
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/tickets">
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
        
        {ticket.status.toLowerCase() !== "closed" && (
          <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleCloseTicket}>
            Close Ticket
          </Button>
        )}
      </div>

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

      {ticket.status.toLowerCase() !== "closed" && (
        <Card>
          <CardContent className="pt-6">
            <TicketReplyForm ticketId={ticket.id} onSuccess={fetchTicket} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
