import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InfoCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-component-sm">
        <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
        <Users className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="responsive-padding">
        <div className="text-2xl font-bold">+2350</div>
        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
      </CardContent>
    </Card>
  );
}
