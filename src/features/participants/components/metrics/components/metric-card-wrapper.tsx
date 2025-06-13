import React from "react";
import { MetricCard } from "@/components/ui/metric-card";

interface MetricCardWrapperProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  isLoading: boolean;
  trendPercent?: number;
  trendLabel?: string;
  footerTitle: string;
  footerDescription: string;
  isPositive?: boolean;
}

export function MetricCardWrapper({
  title,
  value,
  icon,
  isLoading,
  trendPercent,
  trendLabel,
  footerTitle,
  footerDescription,
  isPositive = true,
}: MetricCardWrapperProps) {
  return (
    <MetricCard
      title={title}
      value={isLoading ? "..." : value.toString()}
      icon={icon}
      trend={
        trendPercent
          ? {
              value: trendPercent,
              isPositive: isPositive,
              label: trendLabel || `${Math.round(trendPercent)}%`,
            }
          : undefined
      }
      footer={{
        title: footerTitle,
        description: footerDescription,
      }}
    />
  );
}
