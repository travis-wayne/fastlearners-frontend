"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

export function DisplayForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account preferences and subscription.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Account Status</Label>
            <p className="text-sm text-muted-foreground">Your account is currently active</p>
          </div>
          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
            Active
          </Badge>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Subscription Plan</Label>
            <p className="text-sm text-muted-foreground">Pro Plan - $29/month</p>
          </div>
          <Button variant="outline">Manage Subscription</Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Account Visibility</Label>
            <p className="text-sm text-muted-foreground">
              Make your profile visible to other users
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Data Export</Label>
            <p className="text-sm text-muted-foreground">Download a copy of your data</p>
          </div>
          <Button variant="outline">Export Data</Button>
        </div>
      </CardContent>
    </Card>
  )
}
