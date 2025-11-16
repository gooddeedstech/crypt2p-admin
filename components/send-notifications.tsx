// components/SendNotification.tsx
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
import { useNotifications } from "@/app/notifications/NotificationsProvider";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SendNotification() {
  const { templates, selected, selectTemplate, send, loading } =
    useNotifications();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("");

  // Auto-fill when template is selected
  useEffect(() => {
    if (selected) {
      setTitle(selected.title);
      setMessage(selected.body);
      setChannel("ALL");
    }
  }, [selected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message || !channel) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await send({ title, message, channel });
      toast.success("Notification sent successfully!");
      setTitle("");
      setMessage("");
      setChannel("");
      selectTemplate(null!);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Card 1: Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Template</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTemplate(t)}
              className={`p-4 rounded-lg border text-left transition-all ${
                selected?.id === t.id
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              <h3 className="font-medium text-sm">{t.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {t.body}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Card 2: Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select value={channel} onValueChange={setChannel} required>
                <SelectTrigger id="channel">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_APP">In-App</SelectItem>
                  <SelectItem value="PUSH">Push</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="ALL">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
