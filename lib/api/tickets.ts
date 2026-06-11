import { ApiResponse } from "@/lib/types/auth";
import {
  Ticket,
  TicketDetail,
  TicketPriority,
  TicketCategory,
  TicketStatusOption,
  SupportAgent,
  TicketAssignment,
} from "@/lib/types/ticket";

// --- STUDENT FUNCTIONS ---

export async function getTickets(): Promise<ApiResponse<{ tickets: Ticket[] }>> {
  try {
    const res = await fetch("/api/proxy/tickets", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.content)) {
      data.content = data.content[0];
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch tickets",
      content: null,
      code: 500,
    };
  }
}

export async function getTicket(id: number): Promise<ApiResponse<{ ticket: TicketDetail }>> {
  try {
    const res = await fetch(`/api/proxy/tickets/${id}/view`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch ticket",
      content: null,
      code: 500,
    };
  }
}

export async function getTicketPriorities(): Promise<ApiResponse<{ priorities: TicketPriority[] }>> {
  try {
    const res = await fetch("/api/proxy/tickets/priorities", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch ticket priorities",
      content: null,
      code: 500,
    };
  }
}

export async function getTicketCategories(): Promise<ApiResponse<{ categories: TicketCategory[] }>> {
  try {
    const res = await fetch("/api/proxy/tickets/categories", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch ticket categories",
      content: null,
      code: 500,
    };
  }
}

export async function createTicket(data: FormData): Promise<ApiResponse<any>> {
  try {
    const res = await fetch("/api/proxy/tickets/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      body: data,
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create ticket",
      content: null,
      code: 500,
    };
  }
}

export async function replyToTicket(id: number, data: FormData): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`/api/proxy/tickets/${id}/reply`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      body: data,
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reply to ticket",
      content: null,
      code: 500,
    };
  }
}

export async function closeTicket(id: number): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`/api/proxy/tickets/${id}/close`, {
      method: "POST",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to close ticket",
      content: null,
      code: 500,
    };
  }
}

// --- SUPERADMIN FUNCTIONS ---

export async function adminGetTickets(): Promise<ApiResponse<{ tickets: Ticket[] }>> {
  try {
    const res = await fetch("/api/proxy/superadmin/tickets", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.content)) {
      data.content = data.content[0];
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch tickets",
      content: null,
      code: 500,
    };
  }
}

export async function adminGetTicket(id: number): Promise<ApiResponse<{ ticket: TicketDetail }>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/tickets/${id}/view`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch ticket",
      content: null,
      code: 500,
    };
  }
}

export async function adminReplyToTicket(id: number, data: FormData): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`/api/proxy/superadmin/tickets/${id}/reply`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      body: data,
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reply to ticket",
      content: null,
      code: 500,
    };
  }
}

export async function getTicketStatuses(): Promise<ApiResponse<{ statuses: TicketStatusOption[] }>> {
  try {
    const res = await fetch("/api/proxy/tickets/statuses", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch ticket statuses",
      content: null,
      code: 500,
    };
  }
}

export async function updateTicketStatus(id: number, statusId: number): Promise<ApiResponse<{ status_id: number }>> {
  try {
    const res = await fetch(`/api/proxy/tickets/${id}/update-status`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status_id: statusId }),
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update ticket status",
      content: null,
      code: 500,
    };
  }
}

export async function getSupportAgents(): Promise<ApiResponse<{ support_agents: SupportAgent[] }>> {
  try {
    const res = await fetch("/api/proxy/tickets/support-agents", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch support agents",
      content: null,
      code: 500,
    };
  }
}

export async function assignSupportAgent(data: { ticket_id: number; assign_to: number }): Promise<ApiResponse<any>> {
  try {
    const res = await fetch("/api/proxy/tickets/assign-support-agent", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to assign support agent",
      content: null,
      code: 500,
    };
  }
}

export async function getAssignmentHistory(id: number): Promise<ApiResponse<{ assignment_history: TicketAssignment[] }>> {
  try {
    const res = await fetch(`/api/proxy/tickets/${id}/assignment-history`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch assignment history",
      content: null,
      code: 500,
    };
  }
}

export async function deleteAssignment(id: number): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`/api/proxy/tickets/${id}/delete-assignment`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete assignment",
      content: null,
      code: 500,
    };
  }
}

export async function deleteTicket(id: number): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`/api/proxy/tickets/${id}/delete-ticket`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete ticket",
      content: null,
      code: 500,
    };
  }
}
