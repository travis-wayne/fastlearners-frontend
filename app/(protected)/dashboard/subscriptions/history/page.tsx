"use client";

import { useEffect, useState } from "react";
import { getSubscriptionHistory } from "@/lib/api/subscription";
import { Subscription } from "@/lib/types/subscription";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Calendar, History } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Helper for date parsing (handles day-first like DD-MM-YYYY or DD/MM/YYYY)
function formatApiDate(dateStr: string | undefined | null) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString();
  }
  const parts = dateStr.match(/(\d{2})[-/](\d{2})[-/](\d{4})/);
  if (parts) {
    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1;
    const year = parseInt(parts[3], 10);
    return new Date(year, month, day).toLocaleDateString();
  }
  return dateStr;
}

const getSubscriptionStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">Active</span>;
    case "expired":
      return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">Expired</span>;
    case "pending":
      return <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Pending</span>;
    default:
      return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800">{status}</span>;
  }
};

const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "package",
    header: "Package",
    cell: ({ row }) => <span className="font-medium">{row.original.package}</span>,
  },
  {
    accessorKey: "subscription_reference",
    header: "Subscription Reference",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.subscription_reference}</span>,
  },
  {
    accessorKey: "starts_at",
    header: "Start Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="size-4 text-muted-foreground" />
        <span className="text-sm">{formatApiDate(row.original.starts_at)}</span>
      </div>
    ),
  },
  {
    accessorKey: "expires_at",
    header: "Expiry Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="size-4 text-muted-foreground" />
        <span className="text-sm">{formatApiDate(row.original.expires_at)}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getSubscriptionStatusBadge(row.original.status),
  },
];

export default function SubscriptionHistoryPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      setError(null);
      const response = await getSubscriptionHistory();
      // Handle 404 as empty state
      if (response.code === 404) {
        setSubscriptions([]);
        setError(null);
      } else if (response.success && response.content && response.content.length > 0) {
        setSubscriptions(response.content[0].subscriptions || []);
      } else {
        setError(response.message || "Failed to load subscription history.");
      }
      setIsLoading(false);
    }
    fetchHistory();
  }, []);

  const table = useReactTable({
    data: subscriptions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscription History</h1>
          <p className="text-muted-foreground">View your active and past subscriptions.</p>
        </div>
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => (
                  <TableHead key={i}>{typeof col.header === 'string' ? col.header : '...'}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscription History</h1>
          <p className="text-muted-foreground">View your active and past subscriptions.</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription History</h1>
        <p className="text-muted-foreground">View your active and past subscriptions.</p>
      </div>

      {!subscriptions || subscriptions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <History className="mb-4 size-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No subscription history found</h3>
            <p className="text-sm text-muted-foreground">
              You do not have any active or past subscriptions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
