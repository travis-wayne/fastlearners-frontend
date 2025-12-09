import Link from "next/link";
import { 
  Upload, 
  BookOpen, 
  Layers, 
  Shield, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SuperadminOverviewPage() {
  return (
    <div className="space-y-6 duration-500 animate-in fade-in-50">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Upload</CardTitle>
              <Upload className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Import Content</div>
              <p className="text-xs text-muted-foreground">
                Upload lesson data via CSV
              </p>
              <Link href="/dashboard/superadmin/uploads">
                <Button className="mt-4 w-full" variant="secondary">
                  Go to Uploads
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lesson Browser</CardTitle>
              <BookOpen className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Manage Lessons</div>
              <p className="text-xs text-muted-foreground">
                View and verify content
              </p>
              <Link href="/dashboard/superadmin/browse">
                <Button className="mt-4 w-full" variant="secondary">
                  Browse Lessons
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bulk Actions</CardTitle>
              <Layers className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">All-In-One</div>
              <p className="text-xs text-muted-foreground">
                Upload full curriculum at once
              </p>
              <Link href="/dashboard/superadmin/uploads">
                <Button className="mt-4 w-full" variant="outline">
                  Bulk Upload
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Shield className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Superadmin</div>
              <p className="text-xs text-muted-foreground">
                Full system access granted
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
                <CheckCircle className="size-4" />
                <span>System Operational</span>
              </div>
            </CardContent>
          </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
           {/* Placeholder for future charts/stats */}
           <Alert>
            <AlertCircle className="size-4" />
            <AlertTitle>Superadmin Capabilities</AlertTitle>
            <AlertDescription>
              As a superadmin, you have unique access to modify the core curriculum. 
              Use the tabs above or the quick actions to navigate.
              <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                <li>Upload new lessons, concepts, and exercises via CSV</li>
                <li>Browse and verify existing lesson content</li>
                <li>View detailed system logs (coming soon)</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
