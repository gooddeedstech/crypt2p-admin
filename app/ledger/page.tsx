"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "../auth/Provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/loading-screen";
import { LedgerProvider } from "./LedgerProvider";
import { LedgerComponent } from "@/components/ledger-component";

export default function Ledger() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <LoadingScreen />;
  if (!user) return null;
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Ledger Management" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <LedgerProvider>
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-6">Ledger Management</h1>
                  <LedgerComponent />
                </div>
              </LedgerProvider>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
