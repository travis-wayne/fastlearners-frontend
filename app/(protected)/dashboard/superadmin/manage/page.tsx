"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  Trash2,
  RotateCcw,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSuperadminState } from "@/components/superadmin/use-superadmin-state";
import { getTrashedLessons } from "@/lib/api/superadmin-lessons";

export default function SuperadminManagePage() {
  const {
    uploadStats,
    uploadRecords,
    uploadHistoryLoading,
    uploadHistoryError,
    fetchUploadHistory,
  } = useSuperadminState();

  const [trashedCount, setTrashedCount] = useState<number>(0);
  const [trashedLoading, setTrashedLoading] = useState(true);

  // Fetch upload history and trash count on mount
  useEffect(() => {
    fetchUploadHistory();

    // Fetch trash count
    async function fetchTrashCount() {
      try {
        const response = await getTrashedLessons({ page: 1 });
        if (response.success && response.content) {
          setTrashedCount(response.content.meta?.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch trash count:", error);
      } finally {
        setTrashedLoading(false);
      }
    }
    fetchTrashCount();
  }, [fetchUploadHistory]);

  // Determine if backend is not yet available (501 error)
  const isBackendPending =
    uploadHistoryError?.includes("not yet implemented") ||
    uploadHistoryError?.includes("501");

  return (
    <div className="space-y-6 duration-500 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">File Management</h2>
        <p className="text-muted-foreground">
          Monitor upload history, manage trash, and handle file organization
        </p>
      </div>

      {/* Trash Management Section - Prominently displayed */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Trash2 className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle>Trash Management</CardTitle>
                <CardDescription>
                  Restore or permanently delete trashed lessons
                </CardDescription>
              </div>
            </div>
            {trashedLoading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : trashedCount > 0 ? (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                {trashedCount} item{trashedCount !== 1 ? "s" : ""} in trash
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                Trash empty
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              {trashedCount > 0 ? (
                <p className="text-sm text-muted-foreground">
                  You have <span className="font-medium text-foreground">{trashedCount}</span>{" "}
                  lesson{trashedCount !== 1 ? "s" : ""} in the trash. Restore them or delete
                  permanently.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No lessons in trash. Deleted lessons will appear here for recovery.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/superadmin/manage/trash">
                <Button className="gap-2">
                  <Trash2 className="size-4" />
                  View Trash
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Status Alert */}
      {isBackendPending && (
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Upload History Feature Status</AlertTitle>
          <AlertDescription>
            Upload history tracking requires backend API endpoints that are not yet
            available.
            <ul className="mt-2 list-inside list-disc text-sm">
              <li className="text-emerald-600">✓ Trash management (available)</li>
              <li className="text-amber-600">⚠ Upload statistics API (pending backend)</li>
              <li className="text-amber-600">⚠ Upload history listing (pending backend)</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {uploadHistoryError && !isBackendPending && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error Loading Upload History</AlertTitle>
          <AlertDescription>{uploadHistoryError}</AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
            <Upload className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uploadStats?.totalUploads ?? "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {uploadStats ? "All time uploads" : "Pending API integration"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uploadStats?.successfulUploads ?? "—"}
            </div>
            <p className="text-xs text-muted-foreground">Completed uploads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uploadStats?.failedUploads ?? "—"}
            </div>
            <p className="text-xs text-muted-foreground">Upload errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Trash</CardTitle>
            <Trash2 className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trashedLoading ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                trashedCount
              )}
            </div>
            <p className="text-xs text-muted-foreground">Lessons in trash</p>
          </CardContent>
        </Card>
      </div>

      {/* Upload History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>
            Recent file uploads and their status
            {uploadStats?.lastUploadAt && (
              <span className="ml-2 text-xs">
                • Last upload: {new Date(uploadStats.lastUploadAt).toLocaleString()}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadHistoryLoading ? (
            <div className="flex items-center justify-center py-8">
              <Clock className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : uploadRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm font-medium">No upload history available</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isBackendPending
                  ? "Upload history will appear here once the backend API is integrated"
                  : "Upload some files to see them here"}
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/dashboard/superadmin/uploads">Go to Uploads</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Conflicts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.fileName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.fileType}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(record.uploadedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {record.status === "success" ? (
                        <Badge variant="default" className="bg-emerald-600">
                          Success
                        </Badge>
                      ) : record.status === "failed" ? (
                        <Badge variant="destructive">Failed</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>{record.recordCount || 0}</TableCell>
                    <TableCell>
                      {record.conflictCount > 0 ? (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-800"
                        >
                          {record.conflictCount}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
