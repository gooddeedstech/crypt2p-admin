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

import { useTransactionAnalytics } from "@/app/analytics/TransactionsAnalyticsProvider";
import { Skeleton } from "./ui/skeleton";

export function SectionCardsTransactions() {
  const { cards, loadingCards } = useTransactionAnalytics();

  if (loadingCards)
    return (
      <div className="flex gap-4 overflow-x-auto p-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[210px] flex-1 shrink-0" />
        ))}
      </div>
    );
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {cards?.total || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +15%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Up 15% this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total Transactions on Crypt2p
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Successful Transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {cards?.successful || 0}
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
            Down 2% this week <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Successful Transactions on Crypt2p
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {cards?.pending || 0}
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
            Up by 1.3% this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Pending Transactions on Crypt2p
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Failed Transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {cards?.failed || 0}
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
            Up by 1.3% this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Failed Transactions on Crypt2p
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Cancelled Transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {cards?.cancelled || 0}
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
            Up by 1.3% this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Cancelled Transactions on Crypt2p
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
