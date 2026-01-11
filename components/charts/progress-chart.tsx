"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface ProgressChartProps {
  subject: string;
  progress: number;
  className?: string;
}

export function ProgressChart({
  subject,
  progress,
  className,
}: ProgressChartProps) {
  const chartData = [
    {
      subject: subject.toLowerCase(),
      progress: progress,
      fill: "var(--color-progress)",
    },
  ];

  const chartConfig = {
    progress: {
      label: "Progress",
    },
    [subject.toLowerCase()]: {
      label: subject,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className={`flex flex-col ${className || ""}`}>
      <CardHeader className="p-component-sm pb-2 sm:p-component-md sm:pb-3">
        <CardTitle className="text-base sm:text-lg">Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-component-xs p-component-sm sm:space-y-component-sm sm:p-component-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium sm:text-sm">{subject}</span>
          <Button variant="ghost" size="sm" className="h-5 text-[10px] sm:h-6 sm:text-xs">
            ▼
          </Button>
        </div>

        <div className="flex justify-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[150px] sm:max-h-[180px] lg:max-h-[200px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={250}
              innerRadius={50}
              outerRadius={75}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[66, 54]}
              />
              <RadialBar dataKey="progress" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-xl font-bold sm:text-2xl"
                          >
                            {progress}%
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>

        <div className="mt-3 flex items-center justify-center gap-3 sm:mt-4 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="size-2.5 rounded-full bg-primary sm:size-3"></div>
            <span className="text-xs text-muted-foreground sm:text-sm">Covered</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="size-2.5 rounded-full bg-muted sm:size-3"></div>
            <span className="text-xs text-muted-foreground sm:text-sm">
              What&apos;s left
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
