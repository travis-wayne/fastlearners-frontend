import { Badge } from "@/components/ui/badge";

export function getSubscriptionStatusBadge(status?: string | null): React.ReactNode {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s === "active") {
    return <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Active</Badge>;
  }
  if (s === "pending") {
    return <Badge className="border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
  }
  if (s === "expired") {
    return <Badge className="border-red-200 bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>;
  }
  if (s === "cancelled") {
    return <Badge className="border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-100">Cancelled</Badge>;
  }
  return <Badge className="border-gray-200 bg-gray-100 capitalize text-gray-800 hover:bg-gray-100">{status}</Badge>;
}
