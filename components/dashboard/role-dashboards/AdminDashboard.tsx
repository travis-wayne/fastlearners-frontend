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
    <div className="space-y-6 sm:space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
          <CardContent className="space-y-3 p-4 sm:p-6">
            <div className="grid gap-1.5 sm:gap-2">
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
          <CardContent className="space-y-3 p-4 sm:p-6">
            <div className="grid gap-1.5 sm:gap-2">
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
          <CardContent className="p-4 sm:p-6">
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
      </div>

      {/* Recent Activity */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-base font-semibold sm:text-lg">Recent Activity</h3>
        <TransactionsList />
        <TransactionsList />
      </div>
    </div>
  );
}
