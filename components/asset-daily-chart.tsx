// components/AssetDailyChart.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactionAnalytics } from "@/app/analytics/TransactionsAnalyticsProvider";

const chartConfig = {
  BTC: { label: "Bitcoin", color: "var(--chart-1)" },
  ETH: { label: "Ethereum", color: "var(--chart-2)" },
  USDT: { label: "Tether", color: "var(--chart-3)" },
  BNB: { label: "Binance Coin", color: "var(--chart-4)" },
  SOL: { label: "Solana", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function AssetDailyChart() {
  const { assetDailyData, loadingAssetDaily, fetchAssetDaily } =
    useTransactionAnalytics();

  const [selectedAsset, setSelectedAsset] = useState<string>("");

  // Auto-select first asset when data loads
  useEffect(() => {
    if (assetDailyData?.assets?.length && !selectedAsset) {
      setSelectedAsset(assetDailyData.assets[0]);
    }
  }, [assetDailyData]);

  useEffect(() => {
    fetchAssetDaily(7, "CRYPTO_TO_CASH");
  }, []);

  const handleTabChange = (value: string) => {
    const days = value.startsWith("7") ? 7 : 30;
    const type = value.includes("CASH") ? "CASH_TO_CRYPTO" : "CRYPTO_TO_CASH";
    fetchAssetDaily(days, type);
  };

  if (loadingAssetDaily)
    return (
      <div className="flex gap-4 overflow-x-auto">
        {[...Array(1)].map((_, i) => (
          <Skeleton key={i} className=" flex-1 shrink-0" />
        ))}
      </div>
    );

  if (!assetDailyData || assetDailyData.dataset.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trans. Vol. by Asset</CardTitle>
          <CardDescription>
            No data available for selected period
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Sort by date
  const sortedData = [...assetDailyData.dataset].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Transform data for selected asset only
  const chartData = sortedData.map((day) => ({
    date: day.date,
    value: Number(day[selectedAsset] || 0),
  }));

  const totalVolume = chartData.reduce((sum, d) => sum + d.value, 0).toFixed(6);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Trans. Vol. by Asset</CardTitle>
            <CardDescription>
              {selectedAsset && (
                <>
                  <span className="font-medium">
                    {chartConfig[selectedAsset as keyof typeof chartConfig]
                      ?.label || selectedAsset}
                  </span>
                  {" • "}Total:{" "}
                  <span className="font-bold">
                    {totalVolume} {selectedAsset}
                  </span>
                </>
              )}
            </CardDescription>
          </div>

          <div className="flex items-center gap-4">
            {/* Asset Dropdown */}
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {assetDailyData.assets.map((asset) => {
                  const config = chartConfig[asset as keyof typeof chartConfig];
                  return (
                    <SelectItem key={asset} value={asset}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: config?.color || "var(--chart-1)",
                          }}
                        />
                        {config?.label || asset}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="assetFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={
                    chartConfig[selectedAsset as keyof typeof chartConfig]
                      ?.color || "var(--chart-1)"
                  }
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={
                    chartConfig[selectedAsset as keyof typeof chartConfig]
                      ?.color || "var(--chart-1)"
                  }
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(new Date(value), "MMM d")}
            />
            <YAxis />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [
                `${value.toFixed(6)} ${selectedAsset}`,
                "Volume",
              ]}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={
                chartConfig[selectedAsset as keyof typeof chartConfig]?.color ||
                "var(--chart-1)"
              }
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#assetFill)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
