// components/TransactionFilters.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransactionAnalytics } from "@/app/analytics/TransactionsAnalyticsProvider";
import { useState } from "react";

export function TransactionFilters() {
  const { refetch } = useTransactionAnalytics();

  const [status, setStatus] = useState<
    "PENDING" | "PROCESSING" | "SUCCESSFUL" | "FAILED" | "CANCELLED" | ""
  >("");
  const [asset, setAsset] = useState<string>("");
  const [type, setType] = useState<"CRYPTO_TO_CASH" | "CASH_TO_CRYPTO" | "">(
    ""
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleApply = () => {
    refetch({
      status: status || undefined,
      asset: asset || undefined,
      type: type || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleClear = () => {
    setStatus("");
    setAsset("");
    setType("");
    setStartDate("");
    setEndDate("");
    refetch({});
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => {
              if (value === "All") return setStatus("");
              setStatus(value as any);
            }}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SUCCESSFUL">Successful</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Asset */}
        <div className="space-y-2">
          <Label htmlFor="asset">Asset</Label>
          <Input
            id="asset"
            placeholder="e.g. USDT"
            value={asset}
            onChange={(e) => setAsset(e.target.value.toUpperCase())}
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(value) => {
              if (value === "All") return setType("");
              setType(value as any);
            }}
          >
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="CASH_TO_CRYPTO">Cash to Crypto</SelectItem>
              <SelectItem value="CRYPTO_TO_CASH">Crypto to Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
  );
}
