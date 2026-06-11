export type TicketStatus = "Open" | "Closed" | "Pending" | "Resolved" | string;

export interface TicketPriority {
  id: number;
  name: string;
}

export interface TicketCategory {
  id: number;
  name: string;
}

export interface TicketAttachment {
  id: number;
  path: string;
  file_name?: string;
}

export interface TicketReplyAttachment {
  id: number;
  path: string;
  file_name?: string;
}

export interface TicketReply {
  id: number;
  reply: string;
  sender_type: "user" | "admin" | "superadmin" | string;
  created_at: string;
  reply_attachments: TicketReplyAttachment[];
}

export interface SupportAgent {
  id: number;
  name: string;
  email: string;
}

export interface TicketAssignment {
  id: number;
  ticket_id: number;
  assigned_to: SupportAgent;
  assigned_by: SupportAgent;
  created_at: string;
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: string;
  category: string;
  created_at: string;
  closed_by?: SupportAgent | null;
}

export interface TicketDetail extends Ticket {
  replies: TicketReply[];
  attachments: TicketAttachment[];
  assignments?: TicketAssignment[];
}

export interface TicketStatusOption {
  id: number;
  name: string;
}
