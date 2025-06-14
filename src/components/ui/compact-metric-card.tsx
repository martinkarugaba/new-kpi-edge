import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface CompactMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  className?: string;
  isLoading?: boolean;
  iconColor?: string;
}

export function CompactMetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  className,
  isLoading = false,
  iconColor = "text-primary",
}: CompactMetricCardProps) {
  return (
    <Card
      className={cn(
        "border-border/50 relative overflow-hidden border p-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={cn("rounded-full p-1.5", `${iconColor}/10`)}>
                <div className={cn(iconColor)}>{icon}</div>
              </div>
            )}
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <div className="flex items-center gap-1.5">
              <p className="text-2xl font-semibold tracking-tight tabular-nums">
                {value}
              </p>
              {subtitle && (
                <span className="text-muted-foreground text-sm">
                  {subtitle}
                </span>
              )}
            </div>
          )}
          {trend && !isLoading && (
            <div className="flex items-center text-xs">
              <span
                className={cn(
                  "flex items-center gap-0.5",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground ml-1">vs. previous</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
