import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { MetricCard } from "./metric-card";

export function MetricCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-0 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value="$1,250.00"
        trend={{
          value: 12.5,
          isPositive: true,
          label: "Trending up this month",
        }}
        footer={{
          title: "Trending up this month",
          description: "Visitors for the last 6 months",
        }}
        icon={<IconTrendingUp className="size-4" />}
      />

      <MetricCard
        title="New Customers"
        value="1,234"
        trend={{
          value: 20,
          isPositive: false,
          label: "Down 20% this period",
        }}
        footer={{
          title: "Down 20% this period",
          description: "Acquisition needs attention",
        }}
        icon={<IconTrendingDown className="size-4" />}
      />

      <MetricCard
        title="Active Accounts"
        value="45,678"
        trend={{
          value: 12.5,
          isPositive: true,
          label: "Strong user retention",
        }}
        footer={{
          title: "Strong user retention",
          description: "Engagement exceed targets",
        }}
        icon={<IconTrendingUp className="size-4" />}
      />

      <MetricCard
        title="Growth Rate"
        value="4.5%"
        trend={{
          value: 4.5,
          isPositive: true,
          label: "Steady performance increase",
        }}
        footer={{
          title: "Steady performance increase",
          description: "Meets growth projections",
        }}
        icon={<IconTrendingUp className="size-4" />}
      />
    </div>
  );
}
