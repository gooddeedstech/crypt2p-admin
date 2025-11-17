// components/DevicePieChart.tsx
"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserAnalytics } from "@/app/analytics/UserAnalyticsProvider";

// Chart config with proper color variables
const chartConfig = {
  count: { label: "Users" },
  ANDROID: { label: "Android", color: "var(--chart-1)" },
  IOS: { label: "iOS", color: "var(--chart-2)" },
  WEB: { label: "Web", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function DevicePieChart() {
  const { deviceStats, loadingDevices } = useUserAnalytics();

  const id = "device-pie";
  const [activeDevice, setActiveDevice] = React.useState<string>("");

  // Transform data to include `fill` for Recharts
  const chartData = React.useMemo(() => {
    if (!deviceStats || deviceStats.length === 0) return [];
    return deviceStats.map((item) => ({
      ...item,
      fill: chartConfig[item.type]?.color || "var(--chart-1)",
    }));
  }, [deviceStats]);

  // Set initial active device
  React.useEffect(() => {
    if (chartData.length > 0 && !activeDevice) {
      setActiveDevice(chartData[0].type);
    }
  }, [chartData, activeDevice]);

  // Active index for highlight
  const activeIndex = React.useMemo(() => {
    return chartData.findIndex((d) => d.type === activeDevice);
  }, [chartData, activeDevice]);

  // Total users
  const totalUsers = React.useMemo(() => {
    return chartData.reduce((acc, d) => acc + d.count, 0);
  }, [chartData]);

  // Loading state
  if (loadingDevices)
    return (
      <div className="flex gap-4 overflow-x-auto">
        {[...Array(1)].map((_, i) => (
          <Skeleton key={i} className="h-[392px] flex-1 shrink-0" />
        ))}
      </div>
    );

  // Empty state
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Devices</CardTitle>
          <CardDescription>No device data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No users have logged in yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>User Devices</CardTitle>
          <CardDescription>
            Total: {totalUsers.toLocaleString()} active users
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[320px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
              onMouseEnter={(_, index) =>
                setActiveDevice(chartData[index].type)
              }
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const active = chartData[activeIndex];
                    if (!active) return null;

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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {active.count.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {active.type}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
