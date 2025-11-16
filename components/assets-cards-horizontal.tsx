// components/AssetCardsHorizontal.tsx
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useTransactionAnalytics } from "@/app/analytics/TransactionsAnalyticsProvider";

const assetColors: Record<string, string> = {
  USDT: "bg-green-500/10",
  USDC: "bg-blue-500/10",
  BTC: "bg-orange-500/10",
  ETH: "bg-purple-500/10",
};

export function AssetCardsHorizontal() {
  const { assetSummary, loadingAssets } = useTransactionAnalytics();

  if (loadingAssets) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[242px] w-md shrink-0" />
        ))}
      </div>
    );
  }

  if (!assetSummary || assetSummary.length === 0) {
    return <p className="text-muted-foreground">No asset data available.</p>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 ">
      {assetSummary.map((item) => {
        const iconUrl = `/images/asset-logo/${item.asset.toLowerCase()}.png`;
        const bgColor = assetColors[item.asset] || "bg-gray-500/10";

        return (
          <Card
            key={item.asset}
            className={`shrink-0 w-md ${bgColor} border-transparent hover:-translate-y-1 transition-transform duration-200`}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="relative w-12 h-12 mb-3">
                <Image
                  src={iconUrl}
                  alt={item.asset}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <h3 className="font-semibold text-lg">{item.asset}</h3>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-sm">transactions</p>
              <p className="text-sm text-muted-foreground">
                {item.totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                })}{" "}
                {item.asset}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
