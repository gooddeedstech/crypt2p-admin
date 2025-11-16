// components/SectionUserCards.tsx
"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UserAnalyticsProvider,
  useUserAnalytics,
} from "@/app/analytics/UserAnalyticsProvider";
import { ChartAreaInteractive } from "./chart-area-interactive";

const chartConfig = {
  count: {
    label: "Transactions",
    color: "var(--chart-1)",
  },
  amount: {
    label: "Amount",
    color: "var(--chart-1)",
  },
  label: { color: "var(--background)" },
} satisfies ChartConfig;

export function SectionUserCards() {
  const { topActive, topVolume, loadingTop } = useUserAnalytics();

  // Helper to format data for bar chart
  const formatActive = (data: typeof topActive) =>
    data
      ?.filter((d) => d.user)
      .map((d) => ({
        user: d.user!.slice(0, 25) + (d.user!.length > 25 ? "…" : ""),
        count: d.transactionCount,
      })) ?? [];

  const formatVolume = (data: typeof topVolume) =>
    data
      ?.filter((d) => d.user)
      .map((d) => ({
        user: d.user!.slice(0, 25) + (d.user!.length > 25 ? "…" : ""),
        amount: Number(d.totalAmount.toFixed(2)),
      })) ?? [];

  const activeData = formatActive(topActive);
  const volumeData = formatVolume(topVolume);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Card 1 – Top Active Users */}
      <Card>
        <CardHeader>
          <CardTitle>Top Active Users</CardTitle>
          <CardDescription>Most transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTop ? (
            <Skeleton className="h-48 w-full" />
          ) : activeData.length === 0 ? (
            <p className="text-center text-muted-foreground">No data</p>
          ) : (
            <ChartContainer config={chartConfig} className="h-48">
              <BarChart
                accessibilityLayer
                data={activeData}
                layout="vertical"
                margin={{ right: 16 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="user" type="category" hide />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={4}>
                  <LabelList
                    dataKey="user"
                    position="insideLeft"
                    offset={8}
                    className="fill-background"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="count"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Most active traders <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Based on transaction count
          </div>
        </CardFooter>
      </Card>

      {/* Card 2 – Top Volume Users */}
      <Card>
        <CardHeader>
          <CardTitle>Top Volume Users</CardTitle>
          <CardDescription>Highest total amount</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTop ? (
            <Skeleton className="h-48 w-full" />
          ) : volumeData.length === 0 ? (
            <p className="text-center text-muted-foreground">No data</p>
          ) : (
            <ChartContainer config={chartConfig} className="h-48">
              <BarChart
                accessibilityLayer
                data={volumeData}
                layout="vertical"
                margin={{ right: 16 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="user" type="category" hide />
                <XAxis dataKey="amount" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={4}>
                  <LabelList
                    dataKey="user"
                    position="insideLeft"
                    offset={8}
                    className="fill-background"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="amount"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(v: number) => v.toLocaleString()}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Highest spenders <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Total transaction value
          </div>
        </CardFooter>
      </Card>

      {/* Card 3 – Placeholder */}
      <UserAnalyticsProvider>
        <ChartAreaInteractive />
      </UserAnalyticsProvider>
    </div>
  );
}
