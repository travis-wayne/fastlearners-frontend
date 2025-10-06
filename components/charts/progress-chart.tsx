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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">{subject}</span>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            ▼
          </Button>
        </div>

        <div className="flex justify-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[200px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={250}
              innerRadius={60}
              outerRadius={90}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[76, 64]}
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
                            className="fill-foreground text-2xl font-bold"
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

        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">Covered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-muted"></div>
            <span className="text-sm text-muted-foreground">
              What&apos;s left
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
