import { IconAccessible } from "@tabler/icons-react";
import { MetricCardWrapper } from "./metric-card-wrapper";

interface DisabilityMetricsProps {
  disabled: { length: number };
  disabledMales: { length: number };
  disabledFemales: { length: number };
  disabledPercent: number;
  disabledMalePercent: number;
  disabledFemalePercent: number;
  formatPercent: (value: number) => number;
  formatTrendPercent: (value: number) => number;
  isLoading: boolean;
}

export function DisabilityMetrics({
  disabled,
  disabledMales,
  disabledFemales,
  disabledPercent,
  disabledMalePercent,
  disabledFemalePercent,
  formatPercent,
  formatTrendPercent,
  isLoading,
}: DisabilityMetricsProps) {
  return (
    <>
      <MetricCardWrapper
        title="Disabled Participants"
        value={disabled.length}
        icon={<IconAccessible className="size-4" />}
        isLoading={isLoading}
        trendPercent={formatTrendPercent(disabledPercent)}
        trendLabel={`${formatPercent(disabledPercent)}% of total`}
        footerTitle={`${formatPercent(disabledPercent)}% of participants`}
        footerDescription="Persons with disabilities"
      />
      <MetricCardWrapper
        title="Disabled Male"
        value={disabledMales.length}
        icon={<IconAccessible className="size-4" />}
        isLoading={isLoading}
        trendPercent={formatTrendPercent(disabledMalePercent)}
        trendLabel={`${formatPercent(disabledMalePercent)}% of disabled`}
        footerTitle="Male PWDs"
        footerDescription="Males with disabilities"
      />
      <MetricCardWrapper
        title="Disabled Female"
        value={disabledFemales.length}
        icon={<IconAccessible className="size-4" />}
        isLoading={isLoading}
        trendPercent={formatTrendPercent(disabledFemalePercent)}
        trendLabel={`${formatPercent(disabledFemalePercent)}% of disabled`}
        footerTitle="Female PWDs"
        footerDescription="Females with disabilities"
      />
    </>
  );
}
