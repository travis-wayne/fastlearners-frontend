"use client";

import { useEffect } from "react";
import { 
  FileText, 
  Upload, 
  AlertCircle, 
  Clock,
  CheckCircle,
  XCircle,
  Info
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

export default function SuperadminManagePage() {
  // Use centralized Zustand store instead of local state
  const {
    uploadStats,
    uploadRecords,
    uploadHistoryLoading,
    uploadHistoryError,
    fetchUploadHistory,
  } = useSuperadminState();

  // Fetch upload history on mount
  useEffect(() => {
    fetchUploadHistory();
  }, [fetchUploadHistory]);

  // Determine if backend is not yet available (501 error)
  const isBackendPending = uploadHistoryError?.includes("not yet implemented") || 
                          uploadHistoryError?.includes("501");

  return (
    <div className="space-y-6 duration-500 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">File Management</h2>
        <p className="text-muted-foreground">
          Monitor upload history, view metrics, and manage file conflicts
        </p>
      </div>

      {/* Feature Status Alert */}
      {isBackendPending && (
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Feature Status</AlertTitle>
          <AlertDescription>
            This page is currently in development. Some features require backend API endpoints that are not yet available.
            <ul className="mt-2 list-inside list-disc text-sm">
              <li className="text-emerald-600">✓ UI and routing configured</li>
              <li className="text-amber-600">⚠ Upload statistics API (pending backend)</li>
              <li className="text-amber-600">⚠ Upload history listing (pending backend)</li>
              <li className="text-amber-600">⚠ Conflict detection and visualization (pending backend)</li>
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
            <p className="text-xs text-muted-foreground">
              Completed uploads
            </p>
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
            <p className="text-xs text-muted-foreground">
              Upload errors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
            <AlertCircle className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uploadStats?.conflictCount ?? "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              Duplicate/conflict records
            </p>
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
                <a href="/dashboard/superadmin/uploads">Go to Uploads</a>
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
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
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

      {/* Conflicts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Conflict Details</CardTitle>
          <CardDescription>
            View and resolve duplicate or conflicting records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadStats && uploadStats.conflictCount > 0 ? (
            <div className="text-sm">
              <p className="mb-4 font-medium">
                {uploadStats.conflictCount} conflict{uploadStats.conflictCount !== 1 ? 's' : ''} detected across uploads
              </p>
              {/* TODO: Add detailed conflicts table when backend provides per-conflict data */}
              <Alert>
                <Info className="size-4" />
                <AlertDescription>
                  Detailed conflict visualization will be available once the backend provides row-level conflict data.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm font-medium">No conflicts detected</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isBackendPending
                  ? "Conflict detection will be available once the backend API supports it"
                  : "All uploads completed without conflicts"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
