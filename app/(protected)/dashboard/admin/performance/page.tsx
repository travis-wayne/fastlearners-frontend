"use client";

import {
  Activity,
  BarChart3,
  Globe,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AdminPerformancePage() {
  return (
    <div className="dashboard-spacing">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">System Performance</h1>
        <p className="text-muted-foreground">
          Platform-wide metrics, active users, and system health status.
        </p>
      </div>

      <div className="responsive-gap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Active Users
            </CardTitle>
            <Users className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 inline-flex items-center gap-1"><TrendingUp className="size-3"/> +12%</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Completion
            </CardTitle>
            <BarChart3 className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 inline-flex items-center gap-1"><TrendingUp className="size-3"/> +4.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Uptime
            </CardTitle>
            <Globe className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.98%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Error Rate
            </CardTitle>
            <Activity className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.12%</div>
            <p className="text-xs text-muted-foreground">
               <span className="text-emerald-500 inline-flex items-center gap-1"><TrendingDown className="size-3"/> -0.05%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Global Subject Performance</CardTitle>
            <CardDescription>
              Average scores across all enrolled students by subject area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Mathematics</span>
                  <span>72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Sciences (Physics, Chem, Bio)</span>
                  <span>76%</span>
                </div>
                <Progress value={76} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Languages (English, Literature)</span>
                  <span>81%</span>
                </div>
                <Progress value={81} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Humanities</span>
                  <span>79%</span>
                </div>
                <Progress value={79} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Health Events</CardTitle>
            <CardDescription>
              Recent automated system warnings and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="rounded-full bg-amber-500/10 p-2">
                  <Activity className="size-4 text-amber-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">High API Latency</p>
                  <p className="text-xs text-muted-foreground">Database queries degrading in performance during peak hours.</p>
                </div>
                <div className="text-xs text-muted-foreground">2h ago</div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="rounded-full bg-emerald-500/10 p-2">
                  <Activity className="size-4 text-emerald-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Database Backup Success</p>
                  <p className="text-xs text-muted-foreground">Automated daily snapshot completed.</p>
                </div>
                <div className="text-xs text-muted-foreground">8h ago</div>
              </div>
               <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="rounded-full bg-blue-500/10 p-2">
                  <Users className="size-4 text-blue-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">User Surge Detected</p>
                  <p className="text-xs text-muted-foreground">Spike in concurrent active students (+450).</p>
                </div>
                <div className="text-xs text-muted-foreground">Yesterday</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
