"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";

export interface OverviewChange {
  value: number;
  trend: "up" | "down";
}

export interface OverviewItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  iconColorClass?: string;
  change?: OverviewChange;
}

interface OverviewGridProps {
  stats: OverviewItem[];
  title?: string;
  description?: string;
}

export function OverviewGrid({
  stats,
  title = "Overview",
  description = "Quick account snapshot",
}: OverviewGridProps) {
  return (
    <Card className="h-full border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100">{title}</CardTitle>
        <CardDescription className="text-gray-500 dark:text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg bg-muted p-3">
              <div className="mb-2 flex items-center justify-between text-gray-900 dark:text-slate-100">
                <div className={`rounded-lg bg-muted p-2 ${stat.iconColorClass ?? ""}`}>
                  {stat.icon}
                </div>
                {stat.change && (
                  <Badge
                    className={`border-0 ${
                      stat.change.trend === "up"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {stat.change.trend === "up" ? (
                      <ArrowUp className="mr-1 size-3" />
                    ) : (
                      <ArrowDown className="mr-1 size-3" />
                    )}
                    {stat.change.value}%
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-slate-400">{stat.label}</div>
              <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-slate-100">{stat.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
