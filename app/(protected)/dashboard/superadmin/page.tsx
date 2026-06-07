import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FolderCog,
  Layers,
  Trash2,
  Upload,
  Package,
  Ticket,
  Users,
  CreditCard,
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upload Content
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">
              Browse Lessons
            </CardTitle>
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

        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Packages</CardTitle>
            <Package className="size-4 text-muted-foreground group-hover:text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Manage subscription packages
            </CardDescription>
            <Link href="/dashboard/superadmin/packages">
              <Button className="w-full gap-2" variant="outline">
                Go to Packages
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coupons</CardTitle>
            <Ticket className="size-4 text-muted-foreground group-hover:text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Manage discount coupons
            </CardDescription>
            <Link href="/dashboard/superadmin/coupons">
              <Button className="w-full gap-2" variant="outline">
                Go to Coupons
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <Users className="size-4 text-muted-foreground group-hover:text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              View all user subscriptions
            </CardDescription>
            <Link href="/dashboard/superadmin/subscriptions">
              <Button className="w-full gap-2" variant="outline">
                Go to Subscriptions
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="size-4 text-muted-foreground group-hover:text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              View all payment transactions
            </CardDescription>
            <Link href="/dashboard/superadmin/transactions">
              <Button className="w-full gap-2" variant="outline">
                Go to Transactions
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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="size-5 text-primary" />
            <CardTitle>Subscription Management</CardTitle>
          </div>
          <CardDescription>
            Manage subscription packages, view coupons, and track user subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/superadmin/packages">
              <Button variant="outline" className="gap-2">
                <Package className="size-4" />
                Packages
              </Button>
            </Link>
            <Link href="/dashboard/superadmin/coupons">
              <Button variant="outline" className="gap-2">
                <Ticket className="size-4" />
                Coupons
              </Button>
            </Link>
            <Link href="/dashboard/superadmin/subscriptions">
              <Button variant="outline" className="gap-2">
                <Users className="size-4" />
                Subscriptions
              </Button>
            </Link>
            <Link href="/dashboard/superadmin/transactions">
              <Button variant="outline" className="gap-2">
                <CreditCard className="size-4" />
                Transactions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
