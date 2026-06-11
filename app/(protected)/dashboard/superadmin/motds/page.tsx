"use client";

import { useEffect, useState } from "react";
import { MessagesSquare, Pencil, Trash2, Plus } from "lucide-react";
import { showApiToast } from "@/lib/utils/api-toast";

import {
  adminGetMotds,
  adminDeleteMotd,
  adminUpdateMotdStatus,
} from "@/lib/api/motd";
import { AdminMotd } from "@/lib/types/motd";
import { parseDateString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { MotdForm } from "@/components/superadmin/motd-form";

export default function MotdsPage() {
  const [motds, setMotds] = useState<AdminMotd[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMotd, setEditingMotd] = useState<AdminMotd | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchMotds();
  }, []);

  async function fetchMotds() {
    setLoading(true);
    const res = await adminGetMotds();
    if (res.success && res.content) {
      setMotds(res.content.motds || []);
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to fetch MOTDs");
    }
    setLoading(false);
  }

  async function handleToggleStatus(motd: AdminMotd) {
    const res = await adminUpdateMotdStatus(motd.id);
    if (res.success) {
      await fetchMotds();
      showApiToast(res.type ?? "success", res.message || "MOTD status updated");
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to update status");
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setIsDeleting(true);
    const res = await adminDeleteMotd(deletingId);
    if (res.success) {
      await fetchMotds();
      showApiToast(res.type ?? "success", res.message || "MOTD deleted");
    } else {
      showApiToast(res.type ?? "error", res.message || "Failed to delete MOTD");
    }
    setIsDeleting(false);
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">MOTDs</h2>
          <p className="text-muted-foreground">
            Manage Message of the Day announcements.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Create MOTD
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Starts At</TableHead>
              <TableHead>Ends At</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[20px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto size-8" /></TableCell>
                </TableRow>
              ))
            ) : motds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Card className="mx-4 mt-4 border-2 border-dashed bg-transparent shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <MessagesSquare className="mb-4 size-10 text-muted-foreground" />
                      <p className="text-muted-foreground">No MOTDs found</p>
                    </CardContent>
                  </Card>
                </TableCell>
              </TableRow>
            ) : (
              motds.map((motd, index) => (
                <TableRow key={motd.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-bold">{motd.title}</TableCell>
                  <TableCell className="capitalize">{motd.audience.replace(/_/g, " ")}</TableCell>
                  <TableCell>
                    <Badge
                      variant={motd.is_active ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(motd)}
                    >
                      {motd.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {parseDateString(motd.starts_at)?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {parseDateString(motd.ends_at)?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{motd.created_by}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingMotd(motd)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeletingId(motd.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Create MOTD</SheetTitle>
          </SheetHeader>
          <MotdForm
            mode="create"
            onSuccess={async () => {
              await fetchMotds();
              setIsCreateOpen(false);
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <Sheet
        open={!!editingMotd}
        onOpenChange={(open) => !open && setEditingMotd(null)}
      >
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Edit MOTD</SheetTitle>
          </SheetHeader>
          {editingMotd && (
            <MotdForm
              mode="edit"
              initialData={editingMotd}
              onSuccess={async () => {
                await fetchMotds();
                setEditingMotd(null);
              }}
              onCancel={() => setEditingMotd(null)}
            />
          )}
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && !isDeleting && setDeletingId(null)}
        title="Delete MOTD"
        description="Are you sure you want to delete this MOTD? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
