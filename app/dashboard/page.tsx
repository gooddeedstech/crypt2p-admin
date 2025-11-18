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
import { DashboardProvider } from "./Provider";
import { UserAnalyticsProvider } from "../analytics/UserAnalyticsProvider";
import { TransactionAnalyticsProvider } from "../analytics/TransactionsAnalyticsProvider";
import { RecentTransactionsTable } from "@/components/recent-transactions-table";
import { DevicePieChart } from "@/components/device-pie-chart";
import { SupportedAssets } from "@/components/supported-assets";
import { AssetDailyChart } from "@/components/asset-daily-chart";

export default function Page() {
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
        <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DashboardProvider>
                <SectionCards />
              </DashboardProvider>
              <TransactionAnalyticsProvider>
                <div className="pl-6">
                  <SupportedAssets />
                </div>
              </TransactionAnalyticsProvider>
              <div className="px-4 lg:px-6 grid grid-cols-3 gap-4">
                <UserAnalyticsProvider>
                  <ChartAreaInteractive />
                </UserAnalyticsProvider>
                <UserAnalyticsProvider>
                  <DevicePieChart />
                </UserAnalyticsProvider>
                <TransactionAnalyticsProvider>
                  <AssetDailyChart />
                </TransactionAnalyticsProvider>
              </div>

              <TransactionAnalyticsProvider>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Recent Transactions
                  </h2>
                  <RecentTransactionsTable />
                </div>
              </TransactionAnalyticsProvider>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
