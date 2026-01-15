import Link from "next/link";
import {
  Upload,
  BookOpen,
  Layers,
  Trash2,
  FolderCog,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCards } from "@/components/superadmin/stats-cards";

export default function SuperadminOverviewPage() {
  return (
    <div className="space-y-6 duration-500 animate-in fade-in-50">
      {/* Statistics Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Content Statistics</h3>
        <p className="text-sm text-muted-foreground">
          Overview of your curriculum structure and content status
        </p>
      </div>
      <StatsCards />

      {/* Quick Actions Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">
          Common tasks for managing your content
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upload Content</CardTitle>
            <Upload className="size-4 text-muted-foreground group-hover:text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Import lesson data via CSV files
            </CardDescription>
            <Link href="/dashboard/superadmin/uploads">
              <Button className="w-full gap-2" variant="secondary">
                Go to Uploads
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Browse Lessons</CardTitle>
            <BookOpen className="size-4 text-muted-foreground group-hover:text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              View and verify uploaded content
            </CardDescription>
            <Link href="/dashboard/superadmin/browse">
              <Button className="w-full gap-2" variant="secondary">
                Browse Content
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulk Upload</CardTitle>
            <Layers className="size-4 text-muted-foreground group-hover:text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Upload full curriculum at once
            </CardDescription>
            <Link href="/dashboard/superadmin/uploads">
              <Button className="w-full gap-2" variant="outline">
                All-In-One Upload
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trash</CardTitle>
            <Trash2 className="size-4 text-muted-foreground group-hover:text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Restore or delete trashed lessons
            </CardDescription>
            <Link href="/dashboard/superadmin/manage/trash">
              <Button className="w-full gap-2" variant="outline">
                View Trash
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Management Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Management</h3>
        <p className="text-sm text-muted-foreground">
          Advanced tools for content management
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FolderCog className="size-5 text-primary" />
            <CardTitle>File Management</CardTitle>
          </div>
          <CardDescription>
            Monitor uploads, manage files, and handle content organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/superadmin/manage">
              <Button variant="outline" className="gap-2">
                <FolderCog className="size-4" />
                Manage Files
              </Button>
            </Link>
            <Link href="/dashboard/superadmin/manage/trash">
              <Button variant="outline" className="gap-2">
                <Trash2 className="size-4" />
                Trash Management
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
