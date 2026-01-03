"use client";

import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Settings,
  Shield,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InfoCard from "@/components/dashboard/info-card";
import TransactionsList from "@/components/dashboard/transactions-list";

export function AdminDashboard() {
  return (
    <div className="dashboard-spacing">
      {/* Quick Actions */}
      <div className="responsive-gap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5" />
              Lesson Management
            </CardTitle>
            <CardDescription>
              Upload, organize, and manage educational content
            </CardDescription>
          </CardHeader>
          <CardContent className="responsive-padding space-y-component-md">
            <div className="grid gap-component-sm sm:gap-component-md">
              <Link href="/dashboard/admin-tools/lessons">
                <Button className="w-full justify-start">
                  <BookOpen className="mr-2 size-4 sm:size-5" />
                  View All Lessons
                </Button>
              </Link>
              <Link href="/dashboard/admin-tools/lessons/upload">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="mr-2 size-4 sm:size-5" />
                  Upload Content
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage students, teachers, and administrators
            </CardDescription>
          </CardHeader>
          <CardContent className="responsive-padding space-y-component-md">
            <div className="grid gap-component-sm sm:gap-component-md">
              <Link href="/dashboard/admin-tools/users">
                <Button className="w-full justify-start">
                  <Users className="mr-2 size-4 sm:size-5" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/dashboard/admin-tools/roles">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 size-4 sm:size-5" />
                  Assign Roles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5" />
              Analytics
            </CardTitle>
            <CardDescription>
              Platform usage and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="responsive-padding">
            <Link href="/dashboard/admin-tools/analytics">
              <Button className="w-full">
                <BarChart3 className="mr-2 size-4 sm:size-5" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="responsive-gap grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
      </div>

      {/* Recent Activity */}
      <div className="space-y-component-md sm:space-y-component-lg">
        <h3 className="text-base font-semibold sm:text-lg">Recent Activity</h3>
        <TransactionsList />
        <TransactionsList />
      </div>
    </div>
  );
}
