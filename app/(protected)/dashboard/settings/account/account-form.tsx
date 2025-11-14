"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChangePasswordForm } from '@/components/profile/change-password-form'
import { DeleteAccountSection } from '@/components/dashboard/delete-account'
import { useAuthStore } from '@/store/authStore'

export function AccountForm() {
  const { user } = useAuthStore()

  const getStatusBadgeProps = (status: string) => {
    if (status === 'active') {
      return {
        variant: 'outline' as const,
        className: 'border-green-200 bg-green-50 text-green-700'
      }
    }
    return {
      variant: 'outline' as const,
      className: 'border-red-200 bg-red-50 text-red-700'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-balance text-2xl font-semibold">Password</h1>
        <p className="mt-1 text-muted-foreground">
          Remember, your password is your digital key to your account. Keep it safe, keep it secure!
        </p>
      </div>

      <ChangePasswordForm />

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and subscription.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Account Status</Label>
              <p className="text-sm text-muted-foreground">Your account is currently {user?.status}</p>
            </div>
            <Badge {...getStatusBadgeProps(user?.status || 'inactive')}>
              {user?.status}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Account Created</Label>
              <p className="text-sm text-muted-foreground">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteAccountSection />
    </div>
  )
}