import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/app/dashboard/Provider";
import { Skeleton } from "./ui/skeleton";

export function SectionCards() {
  const { data, loading } = useDashboard();

  const getPercentageText = (direction: string, value: number) => {
    if (direction === "up") {
      return `Up by ${value}% Today`;
    } else if (direction === "down") {
      return `Down by ${value}% Today`;
    } else {
      return "Neutral Today";
    }
  };
  const getPercentageIcon = (direction: string, value: number) => {
    if (direction === "up") {
      return <IconTrendingUp className="size-4" />;
    } else if (direction === "down") {
      return <IconTrendingDown className="size-4" />;
    } else {
      return "~";
    }
  };

  if (loading)
    return (
      <div className="flex gap-4 overflow-x-auto p-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[184px] flex-1 shrink-0" />
        ))}
      </div>
    );
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.totalUsers || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {data?.changes.totalUsers.direction === "up" ? (
                <IconTrendingUp />
              ) : data?.changes.totalUsers.direction === "down" ? (
                <IconTrendingDown />
              ) : null}
              {data?.changes.totalUsers.direction === "up"
                ? "+"
                : data?.changes.totalUsers.direction === "down"
                ? "-"
                : ""}
              {data?.changes.totalUsers.value}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getPercentageText(
              data?.changes.totalUsers.direction || "neutral",
              data?.changes.totalUsers.value || 0
            )}{" "}
            {getPercentageIcon(
              data?.changes.totalUsers.direction || "neutral",
              data?.changes.totalUsers.value || 0
            )}
          </div>
          <div className="text-muted-foreground">Total Users on Crypt2p</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.activeUsers || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getPercentageText(
              data?.changes.activeUsers.direction || "neutral",
              data?.changes.activeUsers.value || 0
            )}{" "}
            {getPercentageIcon(
              data?.changes.activeUsers.direction || "neutral",
              data?.changes.activeUsers.value || 0
            )}
          </div>
          <div className="text-muted-foreground">
            Total Active Users on Crypt2p
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Deleted Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.deletedAccounts || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +1.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {/* Up by 1.3% this month <IconTrendingUp className="size-4" /> */}
          </div>
          <div className="text-muted-foreground">Total Deleted Account</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="mb-0 pb-0 gap-0!">
          {/* <CardDescription>Registered</CardDescription> */}

          <Tabs defaultValue="today" className="pb-0!">
            <div className="flex justify-between">
              <CardDescription className="flex-1">Registered</CardDescription>
              <TabsList className="grid w-full grid-cols-3 h-6 flex-1">
                <TabsTrigger className="text-xs h-5" value="today">
                  Today
                </TabsTrigger>
                <TabsTrigger className="text-xs h-5" value="month">
                  Month
                </TabsTrigger>
                <TabsTrigger className="text-xs h-5" value="year">
                  Year
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ---------- TODAY ---------- */}
            <TabsContent value="today" className="">
              <CardTitle
                className={cn(
                  "text-2xl font-semibold tabular-nums",
                  "@[250px]/card:text-3xl"
                )}
              >
                {data?.registeredToday || 0}
              </CardTitle>
            </TabsContent>

            {/* ---------- MONTH ---------- */}
            <TabsContent value="month" className="">
              <CardTitle
                className={cn(
                  "text-2xl font-semibold tabular-nums",
                  "@[250px]/card:text-3xl"
                )}
              >
                {data?.registeredThisMonth || 0}
              </CardTitle>
            </TabsContent>

            {/* ---------- YEAR ---------- */}
            <TabsContent value="year" className="">
              <CardTitle
                className={cn(
                  "text-2xl font-semibold tabular-nums",
                  "@[250px]/card:text-3xl"
                )}
              >
                {data?.registeredThisYear || 0}
              </CardTitle>
            </TabsContent>
          </Tabs>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium h-4">
            <div className="line-clamp-1 flex gap-2 font-medium ">
              {getPercentageText(
                data?.changes.registeredThisYear.direction || "neutral",
                data?.changes.registeredThisYear.value || 0
              )}{" "}
              {getPercentageIcon(
                data?.changes.registeredThisYear.direction || "neutral",
                data?.changes.registeredThisYear.value || 0
              )}
            </div>
          </div>
          <div className="text-muted-foreground">
            Total Registered in Period
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
