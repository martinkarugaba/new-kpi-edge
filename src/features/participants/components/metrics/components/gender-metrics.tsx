import { IconWoman, IconMan } from "@tabler/icons-react";
import { MetricCardWrapper } from "./metric-card-wrapper";

interface GenderMetricsProps {
  totalFemales: number;
  totalMales: number;
  femalePercent: number;
  malePercent: number;
  formatPercent: (value: number) => number;
  formatTrendPercent: (value: number) => number;
  isLoading: boolean;
}

export function GenderMetrics({
  totalFemales,
  totalMales,
  femalePercent,
  malePercent,
  formatPercent,
  formatTrendPercent,
  isLoading,
}: GenderMetricsProps) {
  return (
    <>
      <MetricCardWrapper
        title="Female Participants"
        value={totalFemales}
        icon={<IconWoman className="size-4" />}
        isLoading={isLoading}
        trendPercent={formatTrendPercent(femalePercent)}
        trendLabel={`${formatPercent(femalePercent)}% of total`}
        footerTitle={`${formatPercent(femalePercent)}% of participants`}
        footerDescription="Female representation"
      />
      <MetricCardWrapper
        title="Male Participants"
        value={totalMales}
        icon={<IconMan className="size-4" />}
        isLoading={isLoading}
        trendPercent={formatTrendPercent(malePercent)}
        trendLabel={`${formatPercent(malePercent)}% of total`}
        footerTitle={`${formatPercent(malePercent)}% of participants`}
        footerDescription="Male representation"
      />
    </>
  );
}
