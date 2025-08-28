"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProfileForm } from "@/components/profile/profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { User, Lock, Trash2, Shield, Crown, GraduationCap, Users } from "lucide-react";
import { useAuthStore } from '@/store/authStore';

interface SharedSettingsPageProps {
  customTitle?: string;
  customDescription?: string;
  hideAccountTab?: boolean;
}

export function SharedSettingsPage({ 
  customTitle, 
  customDescription,
  hideAccountTab = false 
}: SharedSettingsPageProps) {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading user data...</div>
      </div>
    );
  }

  // Role-based icon and color mapping
  const getRoleDisplay = (role: string) => {
    const roleMap = {
      student: { 
        icon: GraduationCap, 
        label: 'Student', 
        color: 'bg-blue-100 text-blue-800 border-blue-200' 
      },
      guest: { 
        icon: User, 
        label: 'Guest', 
        color: 'bg-gray-100 text-gray-800 border-gray-200' 
      },
      guardian: { 
        icon: Shield, 
        label: 'Guardian', 
        color: 'bg-green-100 text-green-800 border-green-200' 
      },
      teacher: { 
        icon: Users, 
        label: 'Teacher', 
        color: 'bg-purple-100 text-purple-800 border-purple-200' 
      },
      admin: { 
        icon: Crown, 
        label: 'Administrator', 
        color: 'bg-orange-100 text-orange-800 border-orange-200' 
      },
      superadmin: { 
        icon: Crown, 
        label: 'Super Administrator', 
        color: 'bg-red-100 text-red-800 border-red-200' 
      }
    };

    return roleMap[role as keyof typeof roleMap] || roleMap.guest;
  };

  const roleDisplay = getRoleDisplay(user.role[0] || 'guest'); // Use primary role
  const RoleIcon = roleDisplay.icon;

  return (
    <>
      <DashboardHeader
        heading={customTitle || "Settings"}
        text={customDescription || "Manage your account, profile, and security settings."}
      />
      
      {/* User Info Card */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <RoleIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{user.name || 'User'}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span>{user.email}</span>
                  <Badge className={roleDisplay.color}>
                    <RoleIcon className="h-3 w-3 mr-1" />
                    {roleDisplay.label}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <div className="space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className={`grid w-full ${hideAccountTab ? 'grid-cols-2' : 'grid-cols-3'}`}>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            {!hideAccountTab && (
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Account
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileForm 
              onSuccess={(profile) => {
                // You can add additional success handling here if needed
                console.log('Profile updated:', profile);
              }}
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <ChangePasswordForm 
              onSuccess={() => {
                // You can add additional success handling here if needed
                console.log('Password changed successfully');
              }}
            />
          </TabsContent>

          {!hideAccountTab && (
            <TabsContent value="account" className="space-y-6">
              <DeleteAccountSection />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
}
