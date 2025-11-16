// components/RecentTransactionsTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { useTransactionAnalytics } from "@/app/analytics/TransactionsAnalyticsProvider";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  SUCCESSFUL: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

export function RecentTransactionsTable() {
  const { transactions, loading, pagination, refetch } =
    useTransactionAnalytics();

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No transactions found.
      </p>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Converted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow
                key={tx.meta_data?.id || tx.created_at}
                className={
                  tx.type === "CASH_TO_CRYPTO"
                    ? "bg-blue-400/5"
                    : "bg-green-400/5"
                }
              >
                <TableCell className="font-medium">{tx.email}</TableCell>
                <TableCell>
                  <p>{tx.type.replaceAll("_", " ")}</p>
                </TableCell>
                <TableCell>
                  {tx.asset}/{tx.network}
                </TableCell>
                <TableCell>
                  {Number(tx.amount).toLocaleString()}{" "}
                  <span className="text-primary">
                    {tx.type === "CASH_TO_CRYPTO" ? "NGN" : tx.asset}
                  </span>
                </TableCell>
                <TableCell>
                  {Number(tx.convertedAmount).toLocaleString()}{" "}
                  <span className="text-primary">
                    {tx.type === "CASH_TO_CRYPTO" ? tx.asset : "NGN"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[tx.status] || "bg-gray-100"}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(tx.created_at), "MMM d, h:mm a")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => refetch(pagination.page - 1, pagination.limit)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => refetch(pagination.page + 1, pagination.limit)}
            >
              Next
            </Button>
          </div>
        </div>
      )} */}
    </div>
  );
}
