import { Badge } from "@/components/ui/badge";

interface TicketStatusBadgeProps {
  status: string;
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const s = status.toLowerCase();
  switch (s) {
    case "open":
      return <Badge className="bg-blue-100 capitalize text-blue-800 hover:bg-blue-100/80">{status}</Badge>;
    case "closed":
      return <Badge className="bg-gray-100 capitalize text-gray-800 hover:bg-gray-100/80">{status}</Badge>;
    case "pending":
      return <Badge className="bg-amber-100 capitalize text-amber-800 hover:bg-amber-100/80">{status}</Badge>;
    case "resolved":
      return <Badge className="bg-emerald-100 capitalize text-emerald-800 hover:bg-emerald-100/80">{status}</Badge>;
    default:
      return <Badge variant="secondary" className="capitalize">{status}</Badge>;
  }
}
