"use client";

import { Users, Award, TrendingUp, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Competitor {
  userId: string;
  username: string;
  avatar?: string;
  totalQuizzesCompleted: number;
  averageScore: number;
  totalPoints: number;
  rank: number;
  badges: string[];
  isOnline: boolean;
  lastActive: string;
}

interface CompetitorsListProps {
  competitors: Competitor[];
  currentUserId?: string;
  className?: string;
}

export function CompetitorsList({
  competitors,
  currentUserId,
  className,
}: CompetitorsListProps) {
  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          Top Competitors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {competitors.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No competitors yet.
            </div>
          ) : (
            competitors.map((competitor) => {
              const isCurrentUser =
                currentUserId && competitor.userId === currentUserId;

              return (
                <div
                  key={competitor.userId}
                  className={cn(
                    "flex items-center gap-4 rounded-lg border p-4 transition-colors",
                    isCurrentUser && "ring-2 ring-primary",
                    "hover:bg-muted/50"
                  )}
                >
                  {/* Rank */}
                  <div className="flex w-10 items-center justify-center">
                    <span
                      className={cn(
                        "text-lg font-bold",
                        competitor.rank <= 3
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      #{competitor.rank}
                    </span>
                  </div>

                  {/* Avatar with Online Status */}
                  <div className="relative">
                    <Avatar className="size-12">
                      <AvatarImage src={competitor.avatar} alt={competitor.username} />
                      <AvatarFallback>
                        {getInitials(competitor.username)}
                      </AvatarFallback>
                    </Avatar>
                    {competitor.isOnline && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 size-4 fill-green-500 text-green-500" />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-semibold",
                          isCurrentUser && "text-primary"
                        )}
                      >
                        {competitor.username}
                      </span>
                      {isCurrentUser && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Award className="size-3" />
                        <span>{competitor.totalQuizzesCompleted} quizzes</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="size-3" />
                        <span>{competitor.averageScore}% avg</span>
                      </div>
                      {!competitor.isOnline && (
                        <span className="text-xs text-muted-foreground">
                          {formatLastActive(competitor.lastActive)}
                        </span>
                      )}
                    </div>
                    {competitor.badges.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {competitor.badges.map((badge, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {competitor.totalPoints}
                    </div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

