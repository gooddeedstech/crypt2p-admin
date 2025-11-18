// components/SupportedAssets.tsx
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useTransactionAnalytics } from "@/app/analytics/TransactionsAnalyticsProvider";

const assetColors: Record<string, string> = {
  BTC: "bg-orange-500/10",
  ETH: "bg-purple-500/10",
  USDT: "bg-green-500/10",
  USDC: "bg-blue-500/10",
  BNB: "bg-yellow-500/10",
  SOL: "bg-cyan-500/10",
  TRX: "bg-red-500/10",
};

const networkColors: Record<string, string> = {
  BTC: "bg-orange-100 text-orange-800",
  ETH: "bg-purple-100 text-purple-800",
  LTC: "bg-blue-100 text-blue-800",
  BSC: "bg-yellow-100 text-yellow-800",
  TRX: "bg-red-100 text-red-800",
  SOL: "bg-cyan-100 text-cyan-800",
  BASE: "bg-cyan-100 text-cyan-800",
  ACC: "bg-orange-100 text-orange-800",
  XLM: "bg-cyan-100 text-cyan-800",
};

export function SupportedAssets() {
  const { supportedAssets, loadingSupportedAssets } = useTransactionAnalytics();

  if (loadingSupportedAssets) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-[300px] w-[320px] shrink-0 rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (!supportedAssets || supportedAssets.length === 0) {
    return <p className="text-muted-foreground">No supported assets found.</p>;
  }

  return (
    <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
      {supportedAssets.map((asset) => {
        const iconUrl = `/images/asset-logo/${asset.code.toLowerCase()}.png`;
        const bgColor = assetColors[asset.code] || "bg-gray-500/10";

        return (
          <Card
            key={asset.code}
            className={`shrink-0 w-80 ${bgColor} border-transparent hover:-translate-y-1 transition-all duration-200 shadow-sm`}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14">
                  <Image
                    src={iconUrl}
                    alt={asset.code}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="font-bold text-xl">{asset.code}</h3>
                  <p className="text-sm text-muted-foreground">
                    {asset.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">NGN Buy</span>
                  <span className="font-semibold">
                    ₦{asset.ngnBuyPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">NGN Sell</span>
                  <span className="font-semibold">
                    ₦{asset.ngnSellPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {asset.networks.map((net) => (
                    <Badge
                      key={net.value}
                      variant="secondary"
                      className={`${
                        networkColors[net.value] || "bg-gray-100 text-gray-700"
                      } text-xs `}
                    >
                      {net.name.split(" ")[0]}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground mt-4 space-y-1">
                  <div className="flex justify-between">
                    <span>Min Buy:</span>
                    <span className="font-mono">
                      {asset.minBuyValue} {asset.code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Sell:</span>
                    <span className="font-mono">
                      {asset.maxSellValue} {asset.code}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
