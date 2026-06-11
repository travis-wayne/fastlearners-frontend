import { TicketReply } from "@/lib/types/ticket";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseDateString } from "@/lib/utils";
import { Paperclip } from "lucide-react";
import Link from "next/link";

interface TicketReplyThreadProps {
  replies: TicketReply[];
}

export function TicketReplyThread({ replies }: TicketReplyThreadProps) {
  if (!replies || replies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p>No replies yet.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {replies.map((reply) => {
          // If sender_type is 'user', align right (for the student's own messages).
          // If it's an admin/superadmin, align left.
          const isUser = reply.sender_type === "user";
          return (
            <div
              key={reply.id}
              className={`flex flex-col ${
                isUser ? "items-end" : "items-start"
              }`}
            >
              <div className="mb-1 text-xs text-muted-foreground">
                <span className="mr-2 font-medium">
                  {isUser ? "You" : "Support Agent"}
                </span>
                {reply.created_at ? parseDateString(reply.created_at)?.toLocaleString() : ""}
              </div>
              <Card
                className={`max-w-[80%] ${
                  isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <CardContent className="whitespace-pre-wrap p-3 text-sm">
                  {reply.reply}
                  {reply.reply_attachments && reply.reply_attachments.length > 0 && (
                    <div className="mt-3 space-y-1 border-t border-primary/20 pt-3">
                      {reply.reply_attachments.map((att) => (
                        <Link
                          key={att.id}
                          href={att.path}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center text-xs hover:underline"
                        >
                          <Paperclip className="mr-1 size-3" />
                          {att.file_name || `Attachment ${att.id}`}
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
