"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { Trophy, Target, Clock, Star } from "lucide-react";

interface ShareableAchievementCardProps {
  lessonTitle: string;
  overallScore: number;
  accuracy: number;
  timeSpent: number; // in minutes
  starRating: number; // 1-5
  userName: string;
  userAvatar?: string | null;
  completionDate: Date;
  conceptScores?: { name: string; score: number }[];
}

export const ShareableAchievementCard = forwardRef<HTMLDivElement, ShareableAchievementCardProps>(
  (
    {
      lessonTitle,
      overallScore,
      accuracy,
      timeSpent,
      starRating,
      userName,
      userAvatar,
      completionDate,
      conceptScores = [],
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="relative h-[630px] w-[1200px] overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5"
        style={{ colorScheme: "light" }}
      >
        {/* Branded Header */}
        <div className="absolute inset-x-0 top-0 flex h-20 items-center bg-primary px-8">
          <div className="flex items-center gap-3">
            <Trophy className="size-8 text-primary-foreground" />
            <span className="text-2xl font-bold text-primary-foreground">
              FastLearners Achievement
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-full flex-col px-12 pb-12 pt-28">
          {/* User Info */}
          <div className="mb-8 flex items-center gap-4">
            {userAvatar ? (
              <div className="relative size-16 overflow-hidden rounded-full border-4 border-primary">
                <Image
                  src={userAvatar}
                  alt={userName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full border-4 border-primary bg-primary/20">
                <span className="text-2xl font-bold text-primary">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold text-foreground">{userName}</h2>
              <p className="text-lg text-muted-foreground">
                Completed on {completionDate.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Main Achievement Area */}
          <div className="grid flex-1 grid-cols-2 gap-8">
            {/* Left: Progress Circle */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative size-80">
                <svg className="size-full -rotate-90">
                  <circle
                    cx="160"
                    cy="160"
                    r="140"
                    stroke="hsl(var(--muted))"
                    strokeWidth="20"
                    fill="none"
                  />
                  <circle
                    cx="160"
                    cy="160"
                    r="140"
                    stroke="hsl(var(--primary))"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 140}`}
                    strokeDashoffset={`${2 * Math.PI * 140 * (1 - overallScore / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-7xl font-bold text-primary">{overallScore}%</span>
                  <span className="mt-2 text-xl text-muted-foreground">Overall Score</span>
                </div>
              </div>
            </div>

            {/* Right: Stats and Lesson Info */}
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="line-clamp-2 text-4xl font-bold text-foreground">{lessonTitle}</h1>

              {/* Stats Grid */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
                  <Target className="size-8 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
                  <Clock className="size-8 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                    <p className="text-2xl font-bold text-foreground">{timeSpent} min</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
                  <Star className="size-8 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-5 ${
                            i < starRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Powered by FastLearners
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {conceptScores.length > 0 && (
                <span>
                  Mastered {conceptScores.filter((c) => c.score >= 80).length} of{" "}
                  {conceptScores.length} concepts
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ShareableAchievementCard.displayName = "ShareableAchievementCard";
