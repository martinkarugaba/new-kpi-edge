import { type Participant } from "../../types/types";
import { useParticipantMetrics } from "./hooks/use-participant-metrics";
import { TotalMetric } from "./components/total-metric";
import { GenderMetrics } from "./components/gender-metrics";
import { AgeMetrics } from "./components/age-metrics";
import { DisabilityMetrics } from "./components/disability-metrics";

interface ParticipantMetricsProps {
  participants: Participant[];
  isLoading: boolean;
}

export function ParticipantMetrics({
  participants,
  isLoading,
}: ParticipantMetricsProps) {
  // Get all metrics using the hook
  const metrics = useParticipantMetrics(participants);

  const {
    totalParticipants,
    totalFemales,
    totalMales,
    femalePercent,
    malePercent,
    femalesYoung,
    femalesOlder,
    malesYoung,
    malesOlder,
    youngFemalePercent,
    olderFemalePercent,
    youngMalePercent,
    olderMalePercent,
    disabled,
    disabledMales,
    disabledFemales,
    disabledPercent,
    disabledMalePercent,
    disabledFemalePercent,
    formatPercent,
    formatTrendPercent,
  } = metrics;

  return (
    <section className="w-full">
      <h3 className="mb-4 text-lg font-medium">Participant Overview</h3>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-0 @xl/main:grid-cols-2 @3xl/main:grid-cols-3 @5xl/main:grid-cols-4">
        {/* Total Metrics */}
        <TotalMetric
          totalParticipants={totalParticipants}
          isLoading={isLoading}
        />

        {/* Gender Metrics */}
        <GenderMetrics
          totalFemales={totalFemales}
          totalMales={totalMales}
          femalePercent={femalePercent}
          malePercent={malePercent}
          formatPercent={formatPercent}
          formatTrendPercent={formatTrendPercent}
          isLoading={isLoading}
        />

        {/* Age Metrics */}
        <AgeMetrics
          femalesYoung={femalesYoung}
          femalesOlder={femalesOlder}
          malesYoung={malesYoung}
          malesOlder={malesOlder}
          youngFemalePercent={youngFemalePercent}
          olderFemalePercent={olderFemalePercent}
          youngMalePercent={youngMalePercent}
          olderMalePercent={olderMalePercent}
          formatPercent={formatPercent}
          formatTrendPercent={formatTrendPercent}
          isLoading={isLoading}
        />

        {/* Disability Metrics */}
        <DisabilityMetrics
          disabled={disabled}
          disabledMales={disabledMales}
          disabledFemales={disabledFemales}
          disabledPercent={disabledPercent}
          disabledMalePercent={disabledMalePercent}
          disabledFemalePercent={disabledFemalePercent}
          formatPercent={formatPercent}
          formatTrendPercent={formatTrendPercent}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
