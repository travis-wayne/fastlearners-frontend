"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/shared/icons";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string[];
  };
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useMediaQuery();
  const { logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/signin");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserRole = () => {
    if (!user.role || user.role.length === 0) return "User";
    return user.role[0].charAt(0).toUpperCase() + user.role[0].slice(1);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "moderator":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "premium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-auto w-full justify-start gap-3 p-3 hover:bg-accent/50",
              "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
              "rounded-xl border border-transparent transition-all duration-200",
              "hover:border-border/50 hover:shadow-sm",
            )}
          >
            <div className="relative">
              <Avatar className="size-10 rounded-xl shadow-sm ring-2 ring-background">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-background bg-green-500" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="mb-1 flex items-center gap-2">
                <span className="truncate text-sm font-semibold">
                  {user.name}
                </span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "px-1.5 py-0.5 text-xs font-medium",
                    getRoleBadgeColor(getUserRole()),
                  )}
                >
                  {getUserRole()}
                </Badge>
              </div>
              <span className="block truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <Icons.moreHorizontal className="ml-auto size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80 rounded-xl border border-border/50 bg-background/95 p-2 shadow-xl backdrop-blur-sm"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-3 rounded-lg bg-accent/30 p-3">
              <div className="relative">
                <Avatar className="size-12 rounded-xl shadow-md ring-2 ring-background">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-background bg-green-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="truncate text-base font-semibold">
                    {user.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "px-2 py-1 text-xs font-medium",
                      getRoleBadgeColor(getUserRole()),
                    )}
                  >
                    {getUserRole()}
                  </Badge>
                </div>
                <span className="block truncate text-sm text-muted-foreground">
                  {user.email}
                </span>
                <div className="mt-1 flex items-center gap-1">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent/80"
            >
              <Icons.user className="mr-3 size-5 text-blue-600" />
              <div className="flex flex-col">
                <span className="font-medium">My Profile</span>
                <span className="text-xs text-muted-foreground">
                  View and edit profile
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
              className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent/80"
            >
              <Icons.settings className="mr-3 size-5 text-gray-600" />
              <div className="flex flex-col">
                <span className="font-medium">Settings</span>
                <span className="text-xs text-muted-foreground">
                  Preferences & privacy
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/billing")}
              className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent/80"
            >
              <Icons.billing className="mr-3 size-5 text-green-600" />
              <div className="flex flex-col">
                <span className="font-medium">Billing</span>
                <span className="text-xs text-muted-foreground">
                  Manage subscription
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent/80"
            >
              {theme === "dark" ? (
                <Icons.sun className="mr-3 size-5 text-yellow-600" />
              ) : (
                <Icons.moon className="mr-3 size-5 text-indigo-600" />
              )}
              <div className="flex flex-col">
                <span className="font-medium">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Switch appearance
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/help")}
              className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent/80"
            >
              <Icons.help className="mr-3 size-5 text-purple-600" />
              <div className="flex flex-col">
                <span className="font-medium">Help & Support</span>
                <span className="text-xs text-muted-foreground">
                  Get assistance
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer rounded-lg p-3 text-red-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <Icons.close className="mr-3 size-5" />
            <div className="flex flex-col">
              <span className="font-medium">Sign Out</span>
              <span className="text-xs opacity-70">End your session</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
