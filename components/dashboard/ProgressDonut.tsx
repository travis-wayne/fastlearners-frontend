"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SubjectOption = {
  label: string;
  value: string;
  color?: string; // hex or css color
};

interface ProgressDonutProps {
  options: SubjectOption[];
  value: string;
  onChange: (val: string) => void;
  progressMap: Record<string, number>; // value -> percent 0..100
  title?: string;
  description?: string;
}

export function ProgressDonut({
  options,
  value,
  onChange,
  progressMap,
  title = "Progress",
  description = "Covered vs remaining for the selected subject",
}: ProgressDonutProps) {
  const percentage = Math.max(0, Math.min(100, progressMap[value] ?? 0));
  const subjectColor =
    options.find((o) => o.value === value)?.color ?? "#3b82f6"; // tailwind blue-500

  const data = React.useMemo(
    () => [
      { name: "Completed", value: percentage, color: subjectColor },
      { name: "Remaining", value: 100 - percentage, color: "#334155" }, // slate-700
    ],
    [percentage, subjectColor],
  );

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const innerRadius = isSmallScreen ? 60 : 70;
  const outerRadius = isSmallScreen ? 80 : 90;

  return (
    <Card className="border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            {title}
          </CardTitle>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-32 border bg-background text-foreground sm:w-40">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent className="border bg-popover text-popover-foreground">
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CardDescription className="mt-1 text-gray-500 dark:text-slate-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="responsive-padding">
        <div className="relative">
          <div className="h-[12.5rem] sm:h-[13.75rem] md:h-[15.625rem]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  startAngle={90}
                  endAngle={-270}
                  stroke="#0f172a" // slate-900 background
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  onMouseEnter={(_, idx) => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={
                        activeIndex === null
                          ? 1
                          : activeIndex === index
                            ? 1
                            : 0.7
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 sm:text-4xl">
                {percentage}%
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Complete
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-component-md overflow-x-auto">
          <div className="flex items-center gap-2">
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: subjectColor }}
            />
            <span className="text-sm text-slate-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-slate-700" />
            <span className="text-sm text-slate-400">Remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
