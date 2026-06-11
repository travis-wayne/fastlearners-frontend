"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { Users } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/header";
import { ChildrenForm } from "../settings/children/children-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getGuardianChildren } from "@/lib/api/guardian";
import { GuardianChild } from "@/lib/types/guardian";

export default function ChildrenPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  const [children, setChildren] = useState<GuardianChild[]>([]);
  const [isFetchingChildren, setIsFetchingChildren] = useState(true);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !user?.role?.includes("guardian")) {
      router.push("/dashboard");
    }
  }, [user, isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role?.includes("guardian")) {
      const fetchChildren = async () => {
        setIsFetchingChildren(true);
        try {
          const res = await getGuardianChildren();
          if (res.success && res.content?.children) {
            setChildren(res.content.children);
          }
        } catch (error) {
          console.error("Failed to fetch children:", error);
        } finally {
          setIsFetchingChildren(false);
        }
      };
      fetchChildren();
    }
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user?.role?.includes("guardian")) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="My Children"
        text="Manage your linked children and monitor their progress."
      />

      <Tabs defaultValue="linked" className="space-y-6">
        <TabsList>
          <TabsTrigger value="linked">Linked Children</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="linked" className="space-y-6">
          {isFetchingChildren ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="mt-4 h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : children.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => (
                <Card key={child.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{child.name}</h3>
                        <p className="text-sm text-muted-foreground">{child.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{child.class}</Badge>
                        <Badge variant={child.subscription_active ? "default" : "secondary"}>
                          {child.subscription_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <Button asChild className="mt-2" variant="outline">
                        <Link href={`/dashboard/children/${child.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Users className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No children linked yet</h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                You haven&apos;t linked any children yet. Go to the Requests tab to invite a child to monitor their learning progress.
              </p>
              <Button onClick={() => {
                const trigger = document.querySelector('[data-state="inactive"][data-value="requests"]') as HTMLElement;
                if (trigger) trigger.click();
              }}>
                Go to Requests
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="requests" className="space-y-6">
          <ChildrenForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
