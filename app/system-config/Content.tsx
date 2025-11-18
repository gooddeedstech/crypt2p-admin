// components/SystemConfigDashboard.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { SystemConfigCard } from "@/components/system-config-card";
import { ConfigProvider, useConfig } from "./ConfigProvider";

function SystemConfigContent() {
  const { configs, loading, error } = useConfig();

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {configs.map((cfg) => (
        <SystemConfigCard key={cfg.id} config={cfg} />
      ))}
    </div>
  );
}

export function SystemConfigDashboard() {
  return (
    <ConfigProvider>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">System Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage fees, rates, and system settings
          </p>
        </div>
        <SystemConfigContent />
      </div>
    </ConfigProvider>
  );
}
