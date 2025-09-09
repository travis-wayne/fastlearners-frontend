"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  Search, 
  Command, 
  Plus,
  Menu,
  Moon,
  Sun,
  LogOut,
  Settings,
  User,
  Home,
  ChevronDown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/shared/icons";
import { siteConfig } from "@/config/site";
import { getTopbarActions, getNavigationForRole } from "@/config/navigation";
import { useTheme } from "next-themes";
import { UserRole } from "@/lib/types/auth";
import { EnhancedBreadcrumb, EnhancedBreadcrumbCompact } from "@/components/layout/enhanced-breadcrumb";

interface DashboardTopbarProps {
  onMobileMenuToggle?: () => void;
}

interface Notification {
  id: string;
  type: "quiz" | "lesson" | "system" | "achievement";
  title: string;
  message: string;
  time: string;
  read: boolean;
  href?: string;
}

// Mock search data - replace with real API calls
interface SearchableItem {
  id: string;
  type: 'lesson' | 'subject' | 'user' | 'quiz' | 'action';
  title: string;
  description?: string;
  href: string;
  icon: string;
}

const mockSearchData: SearchableItem[] = [
  // Lessons
  { id: '1', type: 'lesson', title: 'Introduction to Algebra', description: 'Mathematics • Grade 9', href: '/dashboard/lessons/intro-algebra', icon: 'bookOpen' },
  { id: '2', type: 'lesson', title: 'Cell Structure and Function', description: 'Biology • Grade 10', href: '/dashboard/lessons/cell-structure', icon: 'bookOpen' },
  { id: '3', type: 'lesson', title: 'Nigerian Civil War', description: 'History • Grade 11', href: '/dashboard/lessons/nigerian-civil-war', icon: 'bookOpen' },
  
  // Subjects
  { id: '4', type: 'subject', title: 'Mathematics', description: '45 lessons available', href: '/dashboard/subjects/mathematics', icon: 'calculator' },
  { id: '5', type: 'subject', title: 'Physics', description: '38 lessons available', href: '/dashboard/subjects/physics', icon: 'atom' },
  { id: '6', type: 'subject', title: 'Chemistry', description: '42 lessons available', href: '/dashboard/subjects/chemistry', icon: 'testTube' },
  
  // Quizzes
  { id: '7', type: 'quiz', title: 'Quadratic Equations Quiz', description: 'Mathematics • 15 questions', href: '/dashboard/quizzes/quadratic-equations', icon: 'helpCircle' },
  { id: '8', type: 'quiz', title: 'Photosynthesis Quiz', description: 'Biology • 20 questions', href: '/dashboard/quizzes/photosynthesis', icon: 'helpCircle' },
  
  // Users (for admin/teacher roles)
  { id: '9', type: 'user', title: 'John Smith', description: 'Student • Grade 10A', href: '/dashboard/users/john-smith', icon: 'user' },
  { id: '10', type: 'user', title: 'Sarah Johnson', description: 'Teacher • Mathematics', href: '/dashboard/users/sarah-johnson', icon: 'graduationCap' },
];

// Mock notifications - replace with real data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "quiz",
    title: "New Quiz Available",
    message: "Mathematics Chapter 5 quiz is now ready",
    time: "5 minutes ago",
    read: false,
    href: "/dashboard/quizzes/available"
  },
  {
    id: "2", 
    type: "lesson",
    title: "Lesson Updated",
    message: "Physics: Motion and Forces has new content",
    time: "1 hour ago",
    read: false,
    href: "/dashboard/lessons/physics-motion"
  },
  {
    id: "3",
    type: "achievement",
    title: "Achievement Unlocked!",
    message: "You completed 10 consecutive quizzes",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance tonight at 2 AM",
    time: "3 hours ago",
    read: true,
  },
];

// Helper function to safely get icons
const getIcon = (iconName: string | undefined) => {
  if (!iconName) return Icons.arrowRight;
  return Icons[iconName as keyof typeof Icons] || Icons.arrowRight;
};

export function DashboardTopbar({ onMobileMenuToggle }: DashboardTopbarProps) {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  const [commandOpen, setCommandOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Get user's primary role and topbar actions
  const primaryRole = user?.role[0] || 'guest';
  const topbarActions = getTopbarActions(primaryRole);
  const navigationConfig = getNavigationForRole(primaryRole);

  // Unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard shortcut for command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Get breadcrumb from current path
  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return "Dashboard";
    
    // Convert path segments to readable breadcrumb
    return segments
      .slice(1) // Skip first segment (usually 'dashboard')
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '))
      .join(' / ');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'quiz': return '🎯';
      case 'lesson': return '📚';
      case 'system': return '⚙️';
      case 'achievement': return '🏆';
      default: return '📢';
    }
  };

  if (!user) {
    return null; // Don't show topbar if user not authenticated
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMobileMenuToggle}
            >
              <Menu className="size-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Logo & Breadcrumb */}
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Icons.logo className="size-6" />
                <span className="hidden font-bold sm:inline-block">
                  {siteConfig.name}
                </span>
              </Link>
              
              {/* Enhanced Breadcrumb */}
              <div className="hidden md:flex">
                <Separator orientation="vertical" className="h-4 mr-3" />
                <EnhancedBreadcrumb className="max-w-md" />
              </div>
              
              {/* Mobile Breadcrumb */}
              <div className="md:hidden">
                <Separator orientation="vertical" className="h-4 mr-3" />
                <EnhancedBreadcrumbCompact />
              </div>
            </div>
          </div>

          {/* Center - Global Search */}
          <div className="hidden flex-1 max-w-md mx-4 md:block">
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="mr-2 size-4" />
              Search anything...
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            {topbarActions?.primary && (
              <Link href={topbarActions.primary.href} className={cn(
                "items-center justify-center text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background select-none active:scale-[0.98]",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "h-9 px-3 rounded-md",
                "hidden sm:flex"
              )}>
                {(() => {
                  const Icon = Icons[topbarActions.primary.icon as keyof typeof Icons] || Icons.plus;
                  return <Icon className="mr-2 size-4" />;
                })()}
                {topbarActions.primary.title}
              </Link>
            )}

            {/* Secondary Actions Dropdown */}
            {topbarActions?.secondary && topbarActions.secondary.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Plus className="size-4" />
                    <ChevronDown className="ml-1 size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {topbarActions.secondary.map((action, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <Link href={action.href} className="flex items-center">
                        {(() => {
                          const Icon = Icons[action.icon as keyof typeof Icons] || Icons.plus;
                          return <Icon className="mr-2 size-4" />;
                        })()}
                        <div>
                          <div className="font-medium">{action.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Search Button (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="size-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-4" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 size-5 rounded-full p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>
                  Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={cn(
                          "flex flex-col items-start p-4 cursor-pointer",
                          !notification.read && "bg-muted/50"
                        )}
                        onClick={() => {
                          markNotificationAsRead(notification.id);
                          if (notification.href) {
                            router.push(notification.href);
                          }
                        }}
                      >
                        <div className="flex w-full items-start gap-2">
                          <span className="text-base">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 shrink-0" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
                {notifications.length > 5 && (
                  <DropdownMenuItem className="text-center">
                    <Link href="/dashboard/notifications" className="w-full">
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || undefined} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.charAt(0) || user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <Badge variant="outline" className="w-fit text-xs mt-1">
                      {primaryRole}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 size-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href={
                    primaryRole === 'student' || primaryRole === 'guardian' 
                      ? "/dashboard/settings" 
                      : `/dashboard/${primaryRole}/settings`
                  }>
                    <Settings className="mr-2 size-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/">
                    <Home className="mr-2 size-4" />
                    <span>Homepage</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="mr-2 size-4" />
                  ) : (
                    <Moon className="mr-2 size-4" />
                  )}
                  <span>Toggle theme</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Enhanced Command Palette */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search lessons, subjects, users..." />
        <CommandList>
          <CommandEmpty>No results found. Try searching for lessons, subjects, or navigation items.</CommandEmpty>
          
          {/* Quick Actions */}
          <CommandGroup heading="Quick Actions">
            {navigationConfig.quickActions.map((action, index) => {
              const Icon = getIcon(action.icon);
              return (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    setCommandOpen(false);
                    router.push(action.href);
                  }}
                >
                  <Icon className="mr-2 size-4" />
                  <div className="flex flex-col items-start">
                    <span>{action.title}</span>
                    <span className="text-xs text-muted-foreground">{action.description}</span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />
          
          {/* Lessons */}
          <CommandGroup heading="Lessons">
            {mockSearchData
              .filter(item => item.type === 'lesson')
              .map((lesson) => {
                const Icon = getIcon(lesson.icon);
                return (
                  <CommandItem
                    key={lesson.id}
                    onSelect={() => {
                      setCommandOpen(false);
                      router.push(lesson.href);
                    }}
                  >
                    <Icon className="mr-2 size-4" />
                    <div className="flex flex-col items-start">
                      <span>{lesson.title}</span>
                      <span className="text-xs text-muted-foreground">{lesson.description}</span>
                    </div>
                  </CommandItem>
                );
              })
            }
          </CommandGroup>

          <CommandSeparator />
          
          {/* Subjects */}
          <CommandGroup heading="Subjects">
            {mockSearchData
              .filter(item => item.type === 'subject')
              .map((subject) => {
                const Icon = getIcon(subject.icon);
                return (
                  <CommandItem
                    key={subject.id}
                    onSelect={() => {
                      setCommandOpen(false);
                      router.push(subject.href);
                    }}
                  >
                    <Icon className="mr-2 size-4" />
                    <div className="flex flex-col items-start">
                      <span>{subject.title}</span>
                      <span className="text-xs text-muted-foreground">{subject.description}</span>
                    </div>
                  </CommandItem>
                );
              })
            }
          </CommandGroup>

          <CommandSeparator />
          
          {/* Quizzes */}
          <CommandGroup heading="Quizzes">
            {mockSearchData
              .filter(item => item.type === 'quiz')
              .map((quiz) => {
                const Icon = getIcon(quiz.icon);
                return (
                  <CommandItem
                    key={quiz.id}
                    onSelect={() => {
                      setCommandOpen(false);
                      router.push(quiz.href);
                    }}
                  >
                    <Icon className="mr-2 size-4" />
                    <div className="flex flex-col items-start">
                      <span>{quiz.title}</span>
                      <span className="text-xs text-muted-foreground">{quiz.description}</span>
                    </div>
                  </CommandItem>
                );
              })
            }
          </CommandGroup>

          {/* Show Users only for Admin/Teacher roles */}
          {(primaryRole === 'admin' || primaryRole === 'teacher' || primaryRole === 'superadmin') && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Users">
                {mockSearchData
                  .filter(item => item.type === 'user')
                  .map((user) => {
                    const Icon = getIcon(user.icon);
                    return (
                      <CommandItem
                        key={user.id}
                        onSelect={() => {
                          setCommandOpen(false);
                          router.push(user.href);
                        }}
                      >
                        <Icon className="mr-2 size-4" />
                        <div className="flex flex-col items-start">
                          <span>{user.title}</span>
                          <span className="text-xs text-muted-foreground">{user.description}</span>
                        </div>
                      </CommandItem>
                    );
                  })
                }
              </CommandGroup>
            </>
          )}

          <CommandSeparator />
          
          {/* Navigation Items */}
          <CommandGroup heading="Navigation">
            {navigationConfig.sidebarSections.map((section) =>
              section.items.map((item) => {
                const Icon = getIcon(item.icon);
                return (
                  <CommandItem
                    key={item.href}
                    onSelect={() => {
                      setCommandOpen(false);
                      router.push(item.href!);
                    }}
                  >
                    <Icon className="mr-2 size-4" />
                    <div className="flex flex-col items-start">
                      <span>{item.title}</span>
                      <span className="text-xs text-muted-foreground">{section.title}</span>
                    </div>
                  </CommandItem>
                );
              })
            )}
          </CommandGroup>

          <CommandSeparator />
          
          {/* Settings & Account */}
          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                router.push("/dashboard/profile");
              }}
            >
              <User className="mr-2 size-4" />
              <span>Profile</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                setTheme(theme === "dark" ? "light" : "dark");
              }}
            >
              {theme === "dark" ? (
                <Sun className="mr-2 size-4" />
              ) : (
                <Moon className="mr-2 size-4" />
              )}
              <span>Toggle theme</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
