// components/LedgerComponent.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useLedger } from "@/app/ledger/LedgerProvider";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/app/auth/Provider";

export function LedgerComponent() {
  const { entries, pagination, loading, fetchEntries, credit, loadingCredit } =
    useLedger();

  const { user } = useAuth();

  // Form
  const [adminId, setAdminId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // Filters
  const [userId, setUserId] = useState("");
  const [type, setType] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !description || !amount) {
      toast.error("All fields are required");
      return;
    }

    try {
      await credit({
        adminId: user?.id || "",
        description,
        amount: Number(amount),
      });
      toast.success("Ledger credited successfully");
      setAdminId("");
      setDescription("");
      setAmount("");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleApplyFilters = () => {
    fetchEntries({
      userId: userId || undefined,
      type: type ? (type as "CR" | "DR") : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleClearFilters = () => {
    setUserId("");
    setType("");
    setStartDate("");
    setEndDate("");
    fetchEntries();
  };

  return (
    <div className="grid md:grid-cols-[30%_70%] gap-6 pr-6">
      {/* Card 1: Credit Ledger */}
      <Card>
        <CardHeader>
          <CardTitle>Add Ledger Credit</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <form onSubmit={handleCredit} className="space-y-4">
            {/* <div className="space-y-2">
              <Label htmlFor="adminId">Admin ID</Label>
              <Input
                id="adminId"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="e.g. admin_123"
                required
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Manual adjustment"
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loadingCredit}>
              {loadingCredit ? "Crediting..." : "Credit Ledger"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Card 2: Ledger Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ledger Entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 w-full">
          {/* Filters */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* <div className="space-y-2">
                <Label htmlFor="f-userId">User ID</Label>
                <Input
                  id="f-userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Filter by user"
                />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="f-type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="f-type" className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CR">Credit</SelectItem>
                    <SelectItem value="DR">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-start">Start Date</Label>
                <Input
                  id="f-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-end">End Date</Label>
                <Input
                  id="f-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear
              </Button>
              <Button size="sm" onClick={handleApplyFilters}>
                Apply
              </Button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !entries || entries.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No ledger entries found.
            </p>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* <TableHead>User ID</TableHead> */}
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Credit (₦)</TableHead>
                      <TableHead className="text-right">Debit (₦)</TableHead>
                      <TableHead className="text-right">Balance (₦)</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => (
                      <TableRow key={entry.id}>
                        {/* <TableCell className="font-mono text-xs">
                          {entry.user_id}
                        </TableCell> */}
                        <TableCell>
                          <Badge
                            variant={
                              entry.type === "CR" ? "default" : "destructive"
                            }
                          >
                            {entry.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {entry.description}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {entry.type === "CR"
                            ? Number(entry.amount).toLocaleString()
                            : 0}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {entry.type === "DR"
                            ? Number(entry.amount).toLocaleString()
                            : 0}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {Number(entry.balance).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {format(new Date(entry.created_at), "MMM d, h:mm a")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.total > pagination.limit && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} ({pagination.total} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() =>
                        fetchEntries({ page: pagination.page - 1 })
                      }
                    >
                      Prev
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={
                        pagination.page * pagination.limit >= pagination.total
                      }
                      onClick={() =>
                        fetchEntries({ page: pagination.page + 1 })
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
