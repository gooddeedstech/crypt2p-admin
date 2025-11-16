// components/UsersTable.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { useUserAnalytics } from "@/app/analytics/UserAnalyticsProvider";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export function UsersTable() {
  const { users, usersPagination, loadingUsers, fetchUsers } =
    useUserAnalytics();

  const [search, setSearch] = useState("");
  const [kycLevel, setKycLevel] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<string>("");
  const [isDeleted, setIsDeleted] = useState<string>("");
  const [bvnStatus, setBvnStatus] = useState<string>("");
  const [toggling, setToggling] = useState<string | null>(null);

  const handleApply = () => {
    fetchUsers({
      search: search || undefined,
      kycLevel: kycLevel ? (Number(kycLevel) as 0 | 1 | 2) : undefined,
      isDisabled:
        isDisabled === "true"
          ? true
          : isDisabled === "false"
          ? false
          : undefined,
      isDeleted:
        isDeleted === "true" ? true : isDeleted === "false" ? false : undefined,
      bvnStatus: (bvnStatus as "pending" | "verified" | "failed") || undefined,
    });
  };

  const handleClear = () => {
    setSearch("");
    setKycLevel("");
    setIsDisabled("");
    setIsDeleted("");
    setBvnStatus("");
    fetchUsers();
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setToggling(userId);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");

      const endpoint = currentStatus
        ? `/admin/users/${userId}/enable`
        : `/admin/users/${userId}/disable`;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        `User ${currentStatus ? "enabled" : "disabled"} successfully`
      );
      fetchUsers(); // Refresh table
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update user status"
      );
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="search">Search (Email/Name)</Label>
            <Input
              id="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="kyc">KYC Level</Label>
            <Select value={kycLevel} onValueChange={setKycLevel}>
              <SelectTrigger id="kyc" className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="0">Level 0</SelectItem>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="disabled">Account Status</Label>
            <Select value={isDisabled} onValueChange={setIsDisabled}>
              <SelectTrigger id="disabled" className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Disabled</SelectItem>
                <SelectItem value="false">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deleted">Deleted</Label>
            <Select value={isDeleted} onValueChange={setIsDeleted}>
              <SelectTrigger id="deleted" className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bvn">BVN Status</Label>
            <Select value={bvnStatus} onValueChange={setBvnStatus}>
              <SelectTrigger id="bvn" className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        {loadingUsers ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !users || users.length === 0 ? (
          <p className="text-center text-muted-foreground p-4">
            No users found.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead className="w-24">Toggle Status </TableHead>{" "}
                {/* ← New */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.kycLevel === 2 ? "default" : "secondary"}
                    >
                      Level {user.kycLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.isDisabled ? "destructive" : "default"}
                    >
                      {user.isDisabled ? "Disabled" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.dateCreated), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{user.transactions.length}</TableCell>
                  <TableCell>
                    <Switch
                      checked={!user.isDisabled}
                      onCheckedChange={() =>
                        toggleUserStatus(user.id, user.isDisabled)
                      }
                      disabled={toggling === user.id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {usersPagination && usersPagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {usersPagination.page} of {usersPagination.totalPages} (
            {usersPagination.total} users)
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={usersPagination.page === 1}
              onClick={() => fetchUsers({ page: usersPagination.page - 1 })}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={usersPagination.page === usersPagination.totalPages}
              onClick={() => fetchUsers({ page: usersPagination.page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
