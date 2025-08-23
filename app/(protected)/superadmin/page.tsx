import Link from "next/link";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Upload, Users, Settings, BarChart3 } from "lucide-react";
import InfoCard from "@/components/dashboard/info-card";
import TransactionsList from "@/components/dashboard/transactions-list";

export const metadata = constructMetadata({
  title: "Admin Panel – FastLearners",
  description: "Administrative dashboard for managing FastLearners platform.",
});

export default function AdminPage() {

  return (
    <>
      <DashboardHeader
        heading="Admin Panel"
        text="Manage lessons, users, and platform settings for FastLearners."
      />
      
      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Lesson Management
              </CardTitle>
              <CardDescription>
                Upload, organize, and manage educational content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Link href="/admin/lessons">
                  <Button className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View All Lessons
                  </Button>
                </Link>
                <Link href="/admin/lessons/upload">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Content
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage students, teachers, and administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                <Users className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics
              </CardTitle>
              <CardDescription>
                Platform usage and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard />
          <InfoCard />
          <InfoCard />
          <InfoCard />
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <TransactionsList />
          <TransactionsList />
        </div>
      </div>
    </>
  );
}
