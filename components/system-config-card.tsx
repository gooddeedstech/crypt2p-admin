// components/SystemConfigCard.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useConfig } from "@/app/system-config/ConfigProvider";

interface Props {
  config: {
    id: string;
    setting: string;
    ngnValue: string | null;
    usdValue: string | null;
    status: "ENABLED" | "DISABLED";
    description: string;
  };
}

export function SystemConfigCard({ config }: Props) {
  const { updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);

  const [usdValue, setUsdValue] = useState<string>(config.usdValue || "");
  const [ngnValue, setNgnValue] = useState<string>(config.ngnValue || "");
  const [status, setStatus] = useState(config.status === "ENABLED");

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateConfig(config.id, {
        status: status ? "ENABLED" : "DISABLED",
        usdValue: usdValue !== "" ? usdValue : null,
        ngnValue: ngnValue !== "" ? ngnValue : null,
      });
      toast.success(`${config.setting} updated successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const isDirty =
    status !== (config.status === "ENABLED") ||
    usdValue !== (config.usdValue || "") ||
    ngnValue !== (config.ngnValue || "");

  const isLoginDisabled = config.setting === "LOGIN" && !status;

  return (
    <Card className="relative overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/5 to-transparent rounded-bl-full" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              {config.setting}
            </CardTitle>
            <CardDescription className="mt-1">
              {config.description}
            </CardDescription>
          </div>
          <Badge variant={status ? "default" : "secondary"}>
            {status ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full">
        {/* Toggle */}
        <div className="flex items-center justify-between pb-5">
          <span className="text-sm font-medium">Status</span>
          <Switch
            checked={status}
            onCheckedChange={setStatus}
            // No disable condition — LOGIN can be toggled freely
          />
        </div>

        {/* Input Fields */}
        <div className="space-y-4 flex-1">
          {["FEES", "MARGIN"].includes(config.setting) && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                USD Value
              </label>
              <Input
                type="number"
                step="0.01"
                value={usdValue}
                onChange={(e) => setUsdValue(e.target.value)}
                placeholder="0.00"
                className="mt-1"
                disabled={config.setting === "LOGIN"}
              />
            </div>
          )}

          {["MARGIN", "RATE"].includes(config.setting) && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                NGN Value
              </label>
              <Input
                type="number"
                step="0.01"
                value={ngnValue}
                onChange={(e) => setNgnValue(e.target.value)}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
          )}

          {/* Warning for LOGIN */}
          {config.setting === "LOGIN" && (
            <div
              className={`p-4 rounded-lg border mt-3 ${
                isLoginDisabled
                  ? "bg-destructive/10 border-destructive/50"
                  : "bg-amber-500/10 border-amber-500/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  className={`h-5 w-5 mt-0.5 ${
                    isLoginDisabled ? "text-destructive" : "text-amber-600"
                  }`}
                />
                <div className="text-sm">
                  <p className="font-medium">
                    {isLoginDisabled
                      ? "Warning: Login will be DISABLED"
                      : "Disabling login will prevent all users from accessing the app"}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    {isLoginDisabled
                      ? "All users will be blocked from logging into the application."
                      : "This action will immediately log out all users and block new logins."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button – pinned to bottom */}
        <div className="pt-6 mt-6">
          <Button
            onClick={handleSave}
            disabled={!isDirty || loading}
            className="w-full"
            size="sm"
            variant={isLoginDisabled && isDirty ? "destructive" : "default"}
          >
            {loading
              ? "Saving..."
              : isLoginDisabled && isDirty
              ? "Confirm & Disable Login"
              : "Update Config"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
