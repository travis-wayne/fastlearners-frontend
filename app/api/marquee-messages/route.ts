import { NextRequest, NextResponse } from "next/server";

// Types
interface MarqueeMessage {
  id: string;
  content: string;
  type: "announcement" | "alert" | "info" | "maintenance";
  isActive: boolean;
  createdAt: string;
  createdBy?: string; // Future: track who created the message
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  messages?: T;
  error?: string;
}

// Mock data store (in production, this would be a database)
let mockMessages: MarqueeMessage[] = [
  {
    id: "1",
    content:
      "Welcome to the enhanced navigation system! Enjoy the new features and improved user experience.",
    type: "announcement",
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    content:
      "Scheduled maintenance tonight from 2:00-4:00 AM EST. Some features may be temporarily unavailable.",
    type: "maintenance",
    isActive: true,
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "3",
    content:
      "New lesson upload feature now available in the teacher dashboard. Upload multiple files at once!",
    type: "info",
    isActive: true,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "4",
    content:
      "Important: Please update your profile information to ensure you receive important notifications.",
    type: "alert",
    isActive: true,
    createdAt: "2024-01-15T07:00:00Z",
  },
];

// Utility function to generate IDs (in production, use a proper UUID library)
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Utility function to validate message type
function isValidMessageType(type: string): type is MarqueeMessage["type"] {
  return ["announcement", "alert", "info", "maintenance"].includes(type);
}

/**
 * GET /api/marquee-messages
 * Retrieve all active marquee messages
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<MarqueeMessage[]>>> {
  try {
    // In production, this would query the database
    // const messages = await db.marqueeMessages.findMany({ where: { isActive: true } });

    const activeMessages = mockMessages
      .filter((message) => message.isActive)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    return NextResponse.json({
      success: true,
      message: `Retrieved ${activeMessages.length} active messages`,
      messages: activeMessages,
    });
  } catch (error) {
    console.error("Error retrieving marquee messages:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve messages",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/marquee-messages
 * Create a new marquee message
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<MarqueeMessage>>> {
  try {
    const body = await request.json();
    const { content, type, isActive = true } = body;

    // Validation
    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Content is required and must be a non-empty string",
        },
        { status: 400 },
      );
    }

    if (!type || !isValidMessageType(type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Type is required and must be one of: announcement, alert, info, maintenance",
        },
        { status: 400 },
      );
    }

    if (content.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Content must be 200 characters or less",
        },
        { status: 400 },
      );
    }

    // Create new message
    const newMessage: MarqueeMessage = {
      id: generateId(),
      content: content.trim(),
      type,
      isActive: Boolean(isActive),
      createdAt: new Date().toISOString(),
    };

    // In production, this would save to the database
    // const savedMessage = await db.marqueeMessages.create({ data: newMessage });

    mockMessages.push(newMessage);

    return NextResponse.json(
      {
        success: true,
        message: "Message created successfully",
        messages: newMessage,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating marquee message:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create message",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/marquee-messages?id={messageId}
 * Delete a marquee message by ID
 */
export async function DELETE(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("id");

    if (!messageId) {
      return NextResponse.json(
        {
          success: false,
          message: "Message ID is required",
        },
        { status: 400 },
      );
    }

    // Find message index
    const messageIndex = mockMessages.findIndex(
      (message) => message.id === messageId,
    );

    if (messageIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found",
        },
        { status: 404 },
      );
    }

    // In production, this would delete from the database
    // await db.marqueeMessages.delete({ where: { id: messageId } });

    // Soft delete (mark as inactive) or hard delete
    mockMessages.splice(messageIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting marquee message:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete message",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/marquee-messages?id={messageId}
 * Update a marquee message (future enhancement)
 */
export async function PUT(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  return NextResponse.json(
    {
      success: false,
      message: "PUT method not implemented yet",
    },
    { status: 501 },
  );
}

/**
 * PATCH /api/marquee-messages?id={messageId}
 * Partially update a marquee message (future enhancement)
 */
export async function PATCH(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  return NextResponse.json(
    {
      success: false,
      message: "PATCH method not implemented yet",
    },
    { status: 501 },
  );
}
