"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Database,
  FileText,
  Globe,
  Lock,
  Server,
  Settings,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function SuperAdminDashboard() {
  // Mock data for superadmin - replace with real data from your API
  const systemStats = [
    { label: "Total Users", value: "1,247", change: "+5.2%", trend: "up" },
    { label: "Active Sessions", value: "892", change: "+12.3%", trend: "up" },
    { label: "System Load", value: "67%", change: "-2.1%", trend: "down" },
    { label: "Storage Used", value: "2.1TB", change: "+8.7%", trend: "up" },
  ];

  const recentActions = [
    {
      id: 1,
      action: "Created new Admin user",
      user: "john.doe@school.edu",
      time: "5 min ago",
      type: "user",
    },
    {
      id: 2,
      action: "Updated system settings",
      user: "SuperAdmin",
      time: "1 hour ago",
      type: "system",
    },
    {
      id: 3,
      action: "Assigned Teacher role",
      user: "sarah.smith@school.edu",
      time: "2 hours ago",
      type: "role",
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      alert: "Database backup completed successfully",
      severity: "info",
      time: "10 min ago",
    },
    {
      id: 2,
      alert: "High memory usage detected on server-2",
      severity: "warning",
      time: "1 hour ago",
    },
    {
      id: 3,
      alert: "Security scan completed - no issues found",
      severity: "success",
      time: "3 hours ago",
    },
  ];

  const roleDistribution = [
    { role: "Students", count: 1089, percentage: 87.3 },
    { role: "Guardians", count: 89, percentage: 7.1 },
    { role: "Teachers", count: 45, percentage: 3.6 },
    { role: "Admins", count: 15, percentage: 1.2 },
    { role: "SuperAdmins", count: 3, percentage: 0.2 },
  ];

  return (
    <div className="space-y-8">
      {/* System Stats Overview */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
                  <p className="text-xl font-bold sm:text-2xl">{stat.value}</p>
                </div>
                <div
                  className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {/* User Management */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              User Role Distribution
            </CardTitle>
            <CardDescription>
              Current user roles across the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roleDistribution.map((roleData) => (
              <div key={roleData.role} className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{roleData.role}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {roleData.count}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({roleData.percentage}%)
                    </span>
                  </div>
                </div>
                <Progress value={roleData.percentage} className="h-1.5 sm:h-2" />
              </div>
            ))}

            <div className="xs:flex-row flex flex-col gap-2 pt-4">
              <Link href="/dashboard/superadmin/users" className="flex-1">
                <Button className="w-full">
                  <Users className="mr-2 size-4" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/dashboard/superadmin/roles">
                <Button variant="outline">
                  <UserPlus className="mr-2 size-4" />
                  Assign Roles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5" />
              System Alerts
            </CardTitle>
            <CardDescription>Recent system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className="space-y-1 rounded-lg bg-muted/50 p-2.5 sm:p-3"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      alert.severity === "warning"
                        ? "destructive"
                        : alert.severity === "success"
                          ? "default"
                          : "secondary"
                    }
                    className="text-[10px] sm:text-xs"
                  >
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {alert.time}
                  </span>
                </div>
                <p className="text-sm">{alert.alert}</p>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-3 w-full">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage users and assign roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Link href="/dashboard/superadmin/users">
                <Button className="w-full justify-start">
                  <Users className="mr-2 size-4" />
                  Manage All Users
                </Button>
              </Link>
              <Link href="/dashboard/superadmin/users/create">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="mr-2 size-4" />
                  Create Admin User
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-5" />
              Content Management
            </CardTitle>
            <CardDescription>Manage lessons and system content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Link href="/dashboard/superadmin/lessons">
                <Button className="w-full justify-start">
                  <FileText className="mr-2 size-4" />
                  All Lessons
                </Button>
              </Link>
              <Link href="/dashboard/superadmin/uploads">
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="mr-2 size-4" />
                  Manage Uploads
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5" />
              System Settings
            </CardTitle>
            <CardDescription>Configure platform settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Link href="/dashboard/superadmin/settings">
                <Button className="w-full justify-start">
                  <Settings className="mr-2 size-4" />
                  System Config
                </Button>
              </Link>
              <Link href="/dashboard/superadmin/reports">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 size-4" />
                  System Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Administrative Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            Recent Administrative Actions
          </CardTitle>
          <CardDescription>
            Latest system and user management activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActions.map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-2.5 sm:p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-7 items-center justify-center rounded-full sm:size-8 ${action.type === "user"
                        ? "bg-blue-100"
                        : action.type === "system"
                          ? "bg-green-100"
                          : "bg-purple-100"
                      }`}
                  >
                    {action.type === "user" ? (
                      <Users className="size-4 text-blue-600" />
                    ) : action.type === "system" ? (
                      <Settings className="size-4 text-green-600" />
                    ) : (
                      <Lock className="size-4 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium sm:text-sm">{action.action}</p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {action.user}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {action.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
