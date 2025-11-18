"use client";

import { Trophy, Medal, Award, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeTaken: number; // in seconds
  completedAt: string;
  quizId: string;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

export function Leaderboard({
  entries,
  currentUserId,
  className,
}: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="size-5 text-yellow-500" />;
      case 2:
        return <Medal className="size-5 text-gray-400" />;
      case 3:
        return <Medal className="size-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 border-yellow-200";
      case 2:
        return "bg-gray-50 border-gray-200";
      case 3:
        return "bg-amber-50 border-amber-200";
      default:
        return "";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="size-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No entries yet. Be the first to complete this quiz!
            </div>
          ) : (
            entries.map((entry) => {
              const isCurrentUser =
                currentUserId && entry.userId === currentUserId;
              const rankIcon = getRankIcon(entry.rank);
              const rankColor = getRankColor(entry.rank);

              return (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex items-center gap-4 rounded-lg border p-4 transition-colors",
                    rankColor,
                    isCurrentUser && "ring-2 ring-primary",
                    !rankColor && "hover:bg-muted/50"
                  )}
                >
                  {/* Rank */}
                  <div className="flex w-12 items-center justify-center">
                    {rankIcon ? (
                      rankIcon
                    ) : (
                      <span
                        className={cn(
                          "text-lg font-bold",
                          entry.rank <= 3 ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        #{entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar className="size-10">
                    <AvatarImage src={entry.avatar} alt={entry.username} />
                    <AvatarFallback>{getInitials(entry.username)}</AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-semibold",
                          isCurrentUser && "text-primary"
                        )}
                      >
                        {entry.username}
                      </span>
                      {isCurrentUser && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Time: {formatTime(entry.timeTaken)}</span>
                      <span>
                        {new Date(entry.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {entry.score}/{entry.totalPoints}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.percentage}%
                    </div>
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

