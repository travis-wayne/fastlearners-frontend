"use client";

import { useState, type CSSProperties } from "react";
import {
  Bell,
  CreditCard,
  Menu,
  Plus,
  Settings,
  Shield,
  Upload,
  User,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Z_INDEX } from "@/config/z-index";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const sidebarItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notification", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integration", icon: Settings },
];

const integrations = [
  {
    name: "Google Drive",
    description: "Upload your files to Google Drive",
    icon: "🟢",
    enabled: true,
  },
  {
    name: "Slack",
    description: "Post to a Slack channel",
    icon: "🟣",
    enabled: true,
  },
  {
    name: "Notion",
    description: "Retrieve notion note to your project",
    icon: "⚫",
    enabled: false,
  },
  {
    name: "Jira",
    description: "Create Jira issues",
    icon: "🔵",
    enabled: false,
  },
  {
    name: "Zendesk",
    description: "Exchange data with Zendesk",
    icon: "🟢",
    enabled: false,
  },
  {
    name: "Dropbox",
    description: "Exchange data with Dropbox",
    icon: "🔵",
    enabled: false,
  },
  {
    name: "Github",
    description: "Exchange files with a GitHub repository",
    icon: "⚫",
    enabled: false,
  },
  {
    name: "Gitlab",
    description: "Exchange files with a Gitlab repository",
    icon: "🟠",
    enabled: false,
  },
];

const transactions = [
  {
    id: "#36223",
    product: "Mock premium pack",
    status: "Pending",
    date: "12/10/2021",
    amount: "$39.90",
  },
  {
    id: "#34283",
    product: "Business board basic subscription",
    status: "Paid",
    date: "11/13/2021",
    amount: "$59.90",
  },
  {
    id: "#32234",
    product: "Business board basic subscription",
    status: "Paid",
    date: "10/13/2021",
    amount: "$59.90",
  },
  {
    id: "#31354",
    product: "Business board basic subscription",
    status: "Paid",
    date: "09/13/2021",
    amount: "$59.90",
  },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const layoutVariables = {
    "--settings-sidebar-width": "16rem",
  } as CSSProperties;

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "security":
        return <SecuritySection />;
      case "notifications":
        return <NotificationsSection />;
      case "billing":
        return <BillingSection />;
      case "integrations":
        return <IntegrationsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background" style={layoutVariables}>
      {/* Mobile menu button */}
      <div className="fixed left-4 top-4 lg:hidden" style={{ zIndex: Z_INDEX.navbar + 1 }}>
        <Button
          variant="outline"
          size="icon"
          className="size-11"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="size-4 sm:size-5" /> : <Menu className="size-4 sm:size-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-[var(--settings-sidebar-width)] border-r bg-card transition duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ zIndex: Z_INDEX.drawerOverlay + 1 }}
      >
        <div className="px-component-md py-component-lg sm:px-component-lg">
          <nav className="space-y-component-xs">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors sm:text-base",
                    activeSection === item.id
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 sm:size-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-[var(--settings-sidebar-width)]">
        <div className="px-component-md py-component-lg sm:px-component-lg sm:py-component-xl lg:px-component-xl">
          <div className="mx-auto max-w-4xl">{renderContent()}</div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          style={{ zIndex: Z_INDEX.drawerOverlay }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="space-y-component-md sm:space-y-component-lg">
      <div>
        <h1 className="sm:text-heading-2xl text-balance text-heading-xl font-semibold">
          Personal information
        </h1>
      </div>

      <Card>
        <CardContent className="responsive-padding">
          <div className="space-y-component-md sm:space-y-component-lg">
            <div className="flex items-center gap-component-sm sm:gap-component-md">
              <Avatar className="size-16 sm:size-20">
                <AvatarImage src="https://bundui-images.netlify.app/avatars/10.png" />
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
              <div className="flex gap-component-xs sm:gap-component-sm">
                <Button size="sm" className="mobile-touch-target h-control-sm sm:h-control-md">
                  <Upload className="size-4" />
                  Upload image
                </Button>
                <Button variant="outline" size="sm" className="mobile-touch-target h-control-sm sm:h-control-md">
                  Remove
                </Button>
              </div>
            </div>

            {/* Personal info form */}
            <div className="grid grid-cols-1 gap-component-sm sm:gap-component-md md:grid-cols-2">
              <div className="space-y-component-xs">
                <Label htmlFor="firstName" className="text-sm sm:text-base">First name</Label>
                <Input id="firstName" defaultValue="Angelina" className="h-control-sm sm:h-control-md" />
              </div>
              <div className="space-y-component-xs">
                <Label htmlFor="userName" className="text-sm sm:text-base">User name</Label>
                <Input id="userName" defaultValue="Gotelli" className="h-control-sm sm:h-control-md" />
              </div>
            </div>

            <div className="space-y-component-xs">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="carolyn_h@hotmail.com"
                className="h-control-sm sm:h-control-md"
              />
            </div>

            <div className="space-y-component-xs">
              <Label htmlFor="phone" className="text-sm sm:text-base">Phone number</Label>
              <div className="flex gap-component-xs sm:gap-component-sm">
                <Select defaultValue="us">
                  <SelectTrigger className="h-control-sm w-20 sm:h-control-md sm:w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">🇺🇸 +1</SelectItem>
                    <SelectItem value="uk">🇬🇧 +44</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="h-control-sm flex-1 sm:h-control-md" defaultValue="121231234" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="responsive-padding">
          <CardTitle className="text-heading-md sm:text-heading-lg">Address information</CardTitle>
        </CardHeader>
        <CardContent className="responsive-padding space-y-component-sm sm:space-y-component-md">
          <div className="space-y-component-xs">
            <Label htmlFor="country" className="text-sm sm:text-base">Country</Label>
            <Select defaultValue="us">
              <SelectTrigger className="h-control-sm sm:h-control-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-component-xs">
            <Label htmlFor="address" className="text-sm sm:text-base">Address</Label>
            <Input id="address" defaultValue="123 Main St" className="h-control-sm sm:h-control-md" />
          </div>

          <div className="grid grid-cols-1 gap-component-sm sm:gap-component-md md:grid-cols-2">
            <div className="space-y-component-xs">
              <Label htmlFor="city" className="text-sm sm:text-base">City</Label>
              <Input id="city" defaultValue="New York" className="h-control-sm sm:h-control-md" />
            </div>
            <div className="space-y-component-xs">
              <Label htmlFor="postalCode" className="text-sm sm:text-base">Postal Code</Label>
              <Input id="postalCode" defaultValue="10001" className="h-control-sm sm:h-control-md" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="mobile-touch-target h-control-md sm:h-control-lg">Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-component-md sm:space-y-component-lg">
      <div>
        <h1 className="sm:text-heading-2xl text-balance text-heading-xl font-semibold">Password</h1>
        <p className="responsive-text mt-component-xs text-muted-foreground">
          Remember, your password is your digital key to your account. Keep it
          safe, keep it secure!
        </p>
      </div>

      <Card>
        <CardContent className="responsive-padding space-y-component-sm sm:space-y-component-md">
          <div className="space-y-component-xs">
            <Label htmlFor="currentPassword" className="text-sm sm:text-base">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              defaultValue="••••••••"
              className="h-control-sm sm:h-control-md"
            />
          </div>

          <div className="space-y-component-xs">
            <Label htmlFor="newPassword" className="text-sm sm:text-base">New password</Label>
            <Input id="newPassword" type="password" defaultValue="••••••••" className="h-control-sm sm:h-control-md" />
          </div>

          <div className="space-y-component-xs">
            <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              defaultValue="••••••••"
              className="h-control-sm sm:h-control-md"
            />
          </div>

          <div className="flex justify-end">
            <Button className="mobile-touch-target h-control-md sm:h-control-lg">Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="responsive-padding">
          <CardTitle className="text-heading-md sm:text-heading-lg">2-Step verification</CardTitle>
          <CardDescription className="responsive-text">
            Your account holds great value to hackers. Enable two-step
            verification to safeguard your account!
          </CardDescription>
        </CardHeader>
        <CardContent className="responsive-padding space-y-component-sm sm:space-y-component-md">
          <div className="flex items-center justify-between rounded-lg border p-component-sm sm:p-component-md">
            <div className="flex items-center gap-component-xs sm:gap-component-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-red-100 sm:size-10">
                <span className="text-sm font-semibold text-red-600">G</span>
              </div>
              <div>
                <h4 className="text-sm font-medium sm:text-base">Google Authenticator</h4>
                <p className="responsive-text text-muted-foreground">
                  Using Google Authenticator app generates time-sensitive codes
                  for secure logins.
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Activated
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-component-sm sm:p-component-md">
            <div className="flex items-center gap-component-xs sm:gap-component-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 sm:size-10">
                <span className="text-sm font-semibold text-blue-600">O</span>
              </div>
              <div>
                <h4 className="text-sm font-medium sm:text-base">Okta Verify</h4>
                <p className="responsive-text text-muted-foreground">
                  Receive push notifications from Okta Verify app on your phone
                  for quick login approval.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mobile-touch-target h-control-sm sm:h-control-md">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-component-sm sm:p-component-md">
            <div className="flex items-center gap-component-xs sm:gap-component-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-orange-100 sm:size-10">
                <span className="text-sm font-semibold text-orange-600">@</span>
              </div>
              <div>
                <h4 className="text-sm font-medium sm:text-base">E Mail verification</h4>
                <p className="responsive-text text-muted-foreground">
                  Unique codes sent to email for confirming logins.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mobile-touch-target h-control-sm sm:h-control-md">
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="space-y-component-md sm:space-y-component-lg">
      <div>
        <h1 className="sm:text-heading-2xl text-balance text-heading-xl font-semibold">Notification</h1>
      </div>

      <Card>
        <CardContent className="responsive-padding space-y-component-md sm:space-y-component-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium sm:text-base">Enable desktop notification</h3>
              <p className="responsive-text text-muted-foreground">
                Decide whether you want to be notified of new message & updates
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium sm:text-base">Enable unread notification badge</h3>
              <p className="responsive-text text-muted-foreground">
                Display a red indicator on of the notification icon when you
                have unread message
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="space-y-component-sm sm:space-y-component-md">
            <h3 className="text-sm font-medium sm:text-base">Enable unread notification badge</h3>

            <RadioGroup defaultValue="mentions" className="space-y-component-sm sm:space-y-component-md">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="all" id="all" className="mt-1" />
                <div>
                  <Label htmlFor="all" className="text-sm font-medium sm:text-base">
                    All new messages
                  </Label>
                  <p className="responsive-text text-muted-foreground">
                    Broadcast notifications to the channel for each new message
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="mentions"
                  id="mentions"
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="mentions" className="text-sm font-medium sm:text-base">
                    Mentions only
                  </Label>
                  <p className="responsive-text text-muted-foreground">
                    Only alert me in the channel if someone mentions me in a
                    message
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="nothing" id="nothing" className="mt-1" />
                <div>
                  <Label htmlFor="nothing" className="text-sm font-medium sm:text-base">
                    Nothing
                  </Label>
                  <p className="responsive-text text-muted-foreground">
                    Don&apos;t notify me anything
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium sm:text-base">Email notification</h3>
              <p className="responsive-text text-muted-foreground">
                Substance can send you email notification for any new direct
                message
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-component-sm sm:space-y-component-md">
            <div className="flex items-center space-x-3">
              <Checkbox id="news" defaultChecked />
              <div>
                <Label htmlFor="news" className="text-sm font-medium sm:text-base">
                  News & updates
                </Label>
                <p className="responsive-text text-muted-foreground">
                  New about product and features update
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox id="tips" defaultChecked />
              <div>
                <Label htmlFor="tips" className="text-sm font-medium sm:text-base">
                  Tips & tutorials
                </Label>
                <p className="responsive-text text-muted-foreground">
                  Tips & trick in order to increase your performance efficiency
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox id="offers" />
              <div>
                <Label htmlFor="offers" className="text-sm font-medium sm:text-base">
                  Offer & promotions
                </Label>
                <p className="responsive-text text-muted-foreground">
                  Promotion about product price & latest discount
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox id="reminders" />
              <div>
                <Label htmlFor="reminders" className="text-sm font-medium sm:text-base">
                  Follow up reminder
                </Label>
                <p className="responsive-text text-muted-foreground">
                  Receive notification all the reminder that have been made
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BillingSection() {
  return (
    <div className="space-y-component-md sm:space-y-component-lg">
      <div>
        <h1 className="sm:text-heading-2xl text-balance text-heading-xl font-semibold">Billing</h1>
      </div>

      <Card>
        <CardContent className="responsive-padding">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-component-xs sm:gap-component-sm">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-100 sm:size-12">
                <span className="font-semibold text-green-600">⚡</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold sm:text-base">Business board basic</h3>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    Active
                  </Badge>
                </div>
                <p className="responsive-text text-muted-foreground">
                  Billing monthly | Next payment on 02/09/2025 for{" "}
                  <span className="font-medium">$59.90</span>
                </p>
              </div>
            </div>
            <Button className="mobile-touch-target h-control-md sm:h-control-lg">Change plan</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="responsive-padding">
          <CardTitle className="text-heading-md sm:text-heading-lg">Payment method</CardTitle>
        </CardHeader>
        <CardContent className="responsive-padding space-y-component-sm sm:space-y-component-md">
          <div className="flex items-center justify-between rounded-lg border p-component-sm sm:p-component-md">
            <div className="flex items-center gap-component-xs sm:gap-component-sm">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 sm:size-10">
                <span className="text-xs font-bold text-blue-600">VISA</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium sm:text-base">Carolyn Perkins •••• 0392</span>
                  <Badge variant="outline" className="text-xs">
                    Primary
                  </Badge>
                </div>
                <p className="responsive-text text-muted-foreground">
                  Expired Dec 2025
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mobile-touch-target h-control-sm sm:h-control-md">
              Edit
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-component-sm sm:p-component-md">
            <div className="flex items-center gap-component-xs sm:gap-component-sm">
              <div className="flex size-8 items-center justify-center rounded-lg bg-orange-100 sm:size-10">
                <span className="text-xs font-bold text-orange-600">MC</span>
              </div>
              <div>
                <span className="text-sm font-medium sm:text-base">Carolyn Perkins •••• 8461</span>
                <p className="responsive-text text-muted-foreground">
                  Expired Jun 2025
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mobile-touch-target h-control-sm sm:h-control-md">
              Edit
            </Button>
          </div>

          <Button variant="outline" className="mobile-touch-target h-control-md w-full bg-transparent sm:h-control-lg">
            <Plus className="mr-2 size-4" />
            Add payment method
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="responsive-padding">
          <CardTitle className="text-heading-md sm:text-heading-lg">Transaction history</CardTitle>
        </CardHeader>
        <CardContent className="responsive-padding">
          <div className="space-y-component-sm sm:space-y-component-md">
            <div className="responsive-text grid grid-cols-5 gap-component-sm border-b pb-2 font-medium text-muted-foreground sm:gap-component-md">
              <div>REFERENCE</div>
              <div>PRODUCT</div>
              <div>STATUS</div>
              <div>DATE</div>
              <div className="text-right">AMOUNT</div>
            </div>

            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="responsive-text grid grid-cols-5 gap-component-sm py-2 sm:gap-component-md"
              >
                <div className="font-medium">{transaction.id}</div>
                <div>{transaction.product}</div>
                <div>
                  <Badge
                    variant={
                      transaction.status === "Paid" ? "default" : "secondary"
                    }
                    className={
                      transaction.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </div>
                <div>{transaction.date}</div>
                <div className="text-right font-medium">
                  {transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IntegrationsSection() {
  return (
    <div className="space-y-component-md sm:space-y-component-lg">
      <div>
        <h1 className="sm:text-heading-2xl text-balance text-heading-xl font-semibold">Integration</h1>
        <p className="responsive-text mt-component-xs text-muted-foreground">
          Supercharge your workflow using these integration
        </p>
      </div>

      <div className="space-y-component-sm sm:space-y-component-md">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardContent className="responsive-padding">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-component-xs sm:gap-component-sm">
                  <div className="text-xl sm:text-2xl">{integration.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold sm:text-base">{integration.name}</h3>
                    <p className="responsive-text text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-component-xs sm:gap-component-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mobile-touch-target h-control-sm text-muted-foreground sm:h-control-md"
                  >
                    Learn more
                  </Button>
                  <Switch defaultChecked={integration.enabled} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
