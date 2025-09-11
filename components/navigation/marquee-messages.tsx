"use client";

import { useState, useEffect, useRef } from "react";
import { AlertCircle, Info, Megaphone, Settings, Pause, Play, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type definitions
interface MarqueeMessage {
  id: string;
  content: string;
  type: 'announcement' | 'alert' | 'info' | 'maintenance';
  isActive: boolean;
  createdAt: string;
}

interface MarqueeMessagesProps {
  apiEndpoint?: string;
  className?: string;
  autoRefreshInterval?: number; // milliseconds
}

export function MarqueeMessages({ 
  apiEndpoint = '/api/marquee-messages',
  className,
  autoRefreshInterval = 60000 // 1 minute
}: MarqueeMessagesProps) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<MarqueeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({ content: '', type: 'info' as MarqueeMessage['type'] });
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Check if user has admin permissions
  const isAdmin = user?.role && (user.role.includes('admin') || user.role.includes('superadmin'));

  const fetchMessages = async () => {
    try {
      setError(null);
      const response = await fetch(apiEndpoint);
      
      if (!response.ok) {
        // If API is not available, use mock data
        if (response.status === 404) {
          setMessages(getMockMessages());
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages.filter((msg: MarqueeMessage) => msg.isActive));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching marquee messages:', error);
      // Fallback to mock data if API fails
      setMessages(getMockMessages());
      setError('Using offline messages');
    } finally {
      setLoading(false);
    }
  };

  const getMockMessages = (): MarqueeMessage[] => [
    {
      id: '1',
      content: 'Welcome to the enhanced navigation system! Enjoy the new features.',
      type: 'announcement',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2', 
      content: 'System maintenance scheduled for tonight at 2:00 AM EST.',
      type: 'maintenance',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      content: 'New lesson upload feature now available in the teacher dashboard.',
      type: 'info',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const addMessage = async () => {
    if (!newMessage.content.trim()) return;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage.content,
          type: newMessage.type,
          isActive: true,
        }),
      });

      if (response.ok) {
        await fetchMessages();
        setNewMessage({ content: '', type: 'info' });
        setIsAdminDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`${apiEndpoint}?id=${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up auto-refresh
    const intervalId = setInterval(fetchMessages, autoRefreshInterval);
    
    return () => clearInterval(intervalId);
  }, [apiEndpoint, autoRefreshInterval]);

  const getMessageConfig = (type: MarqueeMessage['type']) => {
    switch (type) {
      case 'announcement':
        return {
          icon: Megaphone,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
        };
      case 'alert':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
        };
      case 'maintenance':
        return {
          icon: Settings,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
        };
      default: // info
        return {
          icon: Info,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
        };
    }
  };

  if (loading) {
    return (
      <div className={cn("h-12 bg-muted/50 border-t animate-pulse shadow-lg", className)}>
        <div className="flex items-center h-full px-6">
          <div className="h-4 w-64 bg-muted-foreground/20 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return null; // Don't render anything if no messages
  }

  return (
    <div className={cn("relative w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg", className)}>
      <div className="flex items-center h-12 px-4">
        {/* Pause/Play Control */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 size-8 shrink-0"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
                <span className="sr-only">{isPaused ? 'Resume' : 'Pause'} messages</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isPaused ? 'Resume' : 'Pause'} scrolling messages
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Scrolling Messages Container */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={marqueeRef}
            className={cn(
              "flex items-center space-x-8 animate-marquee",
              isPaused && "animation-paused"
            )}
            style={{
              animationDuration: `${Math.max(20, messages.length * 8)}s`,
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {messages.map((message) => {
              const config = getMessageConfig(message.type);
              const Icon = config.icon;
              
              return (
                <div
                  key={`${message.id}-${message.createdAt}`}
                  className={cn(
                    "flex items-center space-x-2 whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium border shrink-0",
                    config.color,
                    config.bgColor,
                    config.borderColor
                  )}
                >
                  <Icon className="size-3 shrink-0" />
                  <span>{message.content}</span>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-5 p-0 ml-2 opacity-70 hover:opacity-100 hover:bg-background/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(message.id);
                      }}
                    >
                      <Trash2 className="size-2" />
                      <span className="sr-only">Delete message</span>
                    </Button>
                  )}
                </div>
              );
            })}
            
            {/* Duplicate messages for seamless loop */}
            {messages.map((message) => {
              const config = getMessageConfig(message.type);
              const Icon = config.icon;
              
              return (
                <div
                  key={`duplicate-${message.id}-${message.createdAt}`}
                  className={cn(
                    "flex items-center space-x-2 whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium border shrink-0",
                    config.color,
                    config.bgColor,
                    config.borderColor
                  )}
                  aria-hidden="true"
                >
                  <Icon className="size-3 shrink-0" />
                  <span>{message.content}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 size-8 shrink-0"
              >
                <Plus className="size-3" />
                <span className="sr-only">Add message</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Marquee Message</DialogTitle>
                <DialogDescription>
                  Create a new message that will appear in the scrolling ticker.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message-content">Message Content</Label>
                  <Input
                    id="message-content"
                    placeholder="Enter your message..."
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message-type">Message Type</Label>
                  <Select
                    value={newMessage.type}
                    onValueChange={(value: MarqueeMessage['type']) => 
                      setNewMessage({ ...newMessage, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAdminDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addMessage} disabled={!newMessage.content.trim()}>
                  Add Message
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {error && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-2">
                  <AlertCircle className="size-4 text-yellow-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{error}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          animation: marquee linear infinite;
        }

        .animation-paused {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
