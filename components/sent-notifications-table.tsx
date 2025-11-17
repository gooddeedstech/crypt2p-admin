// components/SentNotificationsTable.tsx
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
import {
  useNotifications,
  SentNotification,
} from "@/app/notifications/NotificationsProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function SentNotificationsTable() {
  const { sent, sentPagination, loadingSent, fetchSent } = useNotifications();
  const [selected, setSelected] = useState<SentNotification | null>(null);
  const [open, setOpen] = useState(false);

  const openDialog = (n: SentNotification) => {
    setSelected(n);
    setOpen(true);
  };

  if (loadingSent) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!sent || sent.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No notifications sent yet.
      </p>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Sent At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sent.map((n) => (
              <TableRow
                key={n.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => openDialog(n)}
              >
                <TableCell className="font-medium max-w-xs truncate">
                  {n.title}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{n.channel}</Badge>
                </TableCell>
                <TableCell>{n.totalRecipients}</TableCell>
                <TableCell>
                  {format(new Date(n.createdAt), "MMM d, h:mm a")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {sentPagination && sentPagination.total > sentPagination.limit && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page {sentPagination.page} ({sentPagination.total} total)
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={sentPagination.page === 1}
              onClick={() => fetchSent(sentPagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={
                sentPagination.page * sentPagination.limit >=
                sentPagination.total
              }
              onClick={() => fetchSent(sentPagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Beautiful Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 mt-6">
              {selected?.title}
              <Badge variant="outline" className="ml-auto">
                {selected?.channel}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Sent on{" "}
              {selected &&
                format(
                  new Date(selected.createdAt),
                  "EEEE, MMMM d, yyyy 'at' h:mm a"
                )}
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="space-y-6">
            {/* Message */}
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                Message
              </h4>
              <ScrollArea className="h-32 rounded-md border p-4 bg-muted/30">
                <p className="text-sm whitespace-pre-wrap">
                  {selected?.message}
                </p>
              </ScrollArea>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">
                  Total Recipients
                </p>
                <p className="text-2xl font-bold">
                  {selected?.totalRecipients}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Notification ID</p>
                <p className="text-xs font-mono">{selected?.id}</p>
              </div>
            </div>

            {/* Optional Data */}
            {selected?.data && (
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                  Extra Data
                </h4>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                  {JSON.stringify(selected.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
