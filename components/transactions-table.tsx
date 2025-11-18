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
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useTransactionAnalytics } from "@/app/analytics/TransactionsAnalyticsProvider";
import { TransactionFilters } from "./transaction-filters";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  SUCCESSFUL: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

export function TransactionsTable() {
  const { transactions, loading, pagination, refetch } =
    useTransactionAnalytics();
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleRowClick = (tx: any) => {
    setSelectedTx(tx);
    setOpen(true);
  };

  return (
    <>
      <div>
        <TransactionFilters />
        <div className="rounded-md border overflow-hidden">
          {loading ? (
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No transactions found.
            </p>
          ) : (
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
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      tx.type === "CASH_TO_CRYPTO"
                        ? "bg-blue-400/5"
                        : "bg-green-400/5"
                    }`}
                    onClick={() => handleRowClick(tx)}
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
                      <span className="text-primary font-medium">
                        {tx.type === "CASH_TO_CRYPTO" ? "NGN" : tx.asset}
                      </span>
                    </TableCell>
                    <TableCell>
                      {Number(tx.convertedAmount).toLocaleString()}{" "}
                      <span className="text-primary font-medium">
                        {tx.type === "CASH_TO_CRYPTO" ? tx.asset : "NGN"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={statusColors[tx.status] || "bg-gray-100"}
                      >
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
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() =>
                  refetch({
                    page: pagination.page - 1,
                    limit: pagination.limit,
                  })
                }
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  refetch({
                    page: pagination.page + 1,
                    limit: pagination.limit,
                  })
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Beautiful Transaction Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              Full details for transaction on{" "}
              {selectedTx &&
                format(new Date(selectedTx.created_at), "PPP 'at' p")}
            </DialogDescription>
          </DialogHeader>

          {selectedTx && (
            <div className="space-y-6 py-4">
              {/* User & Type */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 ">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {selectedTx.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{selectedTx.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTx.type.replaceAll("_", " ")}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge
                    variant={
                      selectedTx.status === "SUCCESSFUL"
                        ? "default"
                        : selectedTx.status === "FAILED"
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-sm"
                  >
                    {selectedTx.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Amounts */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">You Paid</p>
                  <p className="text-2xl font-bold">
                    {Number(selectedTx.amount).toLocaleString()}{" "}
                    <span className="text-primary">
                      {selectedTx.type === "CASH_TO_CRYPTO"
                        ? "NGN"
                        : selectedTx.asset}
                    </span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">You Received</p>
                  <p className="text-2xl font-bold">
                    {Number(selectedTx.convertedAmount).toLocaleString()}{" "}
                    <span className="text-primary">
                      {selectedTx.type === "CASH_TO_CRYPTO"
                        ? selectedTx.asset
                        : "NGN"}
                    </span>
                  </p>
                </div>
              </div>

              <Separator />

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Asset / Network</p>
                  <p className="font-medium">
                    {selectedTx.asset} • {selectedTx.network}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Exchange Rate</p>
                  <p className="font-medium">
                    1 {selectedTx.asset} = ₦{selectedTx.exchangeRate}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {selectedTx.meta_data?.id || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {format(new Date(selectedTx.created_at), "PPP 'at' p")}
                  </p>
                </div>
              </div>

              {/* Optional: Add blockchain explorer link if available */}
              {selectedTx.meta_data?.txHash && (
                <div className="pt-4 border-t">
                  <a
                    href={`https://etherscan.io/tx/${selectedTx.meta_data.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    View on Blockchain Explorer
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
