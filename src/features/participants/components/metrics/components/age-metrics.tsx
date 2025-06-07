import { IconWoman, IconMan } from "@tabler/icons-react";
import { MetricCardWrapper } from "./metric-card-wrapper";

interface AgeMetricsProps {
  femalesYoung: { length: number };
  femalesOlder: { length: number };
  malesYoung: { length: number };
  malesOlder: { length: number };
  youngFemalePercent: number;
  olderFemalePercent: number;
  youngMalePercent: number;
  olderMalePercent: number;
  formatPercent: (value: number) => number;
  formatTrendPercent: (value: number) => number;
  isLoading: boolean;
}

export function AgeMetrics({
  femalesYoung,
  femalesOlder,
  malesYoung,
  malesOlder,
  youngFemalePercent,
  olderFemalePercent,
  youngMalePercent,
  olderMalePercent,
  formatPercent,
  formatTrendPercent,
  isLoading,
}: AgeMetricsProps) {
  return (
    <>
      <MetricCardWrapper
        title="Female (15-35)"
        value={femalesYoung.length}
        icon={<IconWoman className="size-4" />}
        isLoading={isLoading}
        trendPercent={formatTrendPercent(youngFemalePercent)}
        trendLabel={`${formatPercent(youngFemalePercent)}% of females`}
        footerTitle="Young adult females"
        footerDescription="Ages 15-35 years"
      />
      <MetricCardWrapper
        title="Female (>35)"
        value={femalesOlder.length}
        icon={<IconWoman className="size-4" />}
        isLoading={isLoading}
        trendPercent={formatTrendPercent(olderFemalePercent)}
        trendLabel={`${formatPercent(olderFemalePercent)}% of females`}
        footerTitle="Adult females"
        footerDescription="Ages over 35 years"
      />
      <MetricCardWrapper
        title="Male (15-35)"
        value={malesYoung.length}
        icon={<IconMan className="size-4" />}
        isLoading={isLoading}
        trendPercent={formatTrendPercent(youngMalePercent)}
        trendLabel={`${formatPercent(youngMalePercent)}% of males`}
        footerTitle="Young adult males"
        footerDescription="Ages 15-35 years"
      />
      <MetricCardWrapper
        title="Male (>35)"
        value={malesOlder.length}
        icon={<IconMan className="size-4" />}
        isLoading={isLoading}
        trendPercent={formatTrendPercent(olderMalePercent)}
        trendLabel={`${formatPercent(olderMalePercent)}% of males`}
        footerTitle="Adult males"
        footerDescription="Ages over 35 years"
      />
    </>
  );
}
