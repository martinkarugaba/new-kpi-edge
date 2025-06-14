import { type Participant } from "../../types/types";
import { useParticipantMetrics } from "./hooks/use-participant-metrics";
import { CompactMetricCard } from "@/components/ui/compact-metric-card";
import {
  Users,
  UserCheck,
  CircleUser,
  Gauge,
  Calendar,
  CalendarRange,
  UserPlus,
  User,
} from "lucide-react";

interface DetailedParticipantMetricsProps {
  participants: Participant[];
  isLoading: boolean;
}

export function DetailedParticipantMetrics({
  participants,
  isLoading,
}: DetailedParticipantMetricsProps) {
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
  } = metrics;

  return (
    <div className="space-y-8 p-6">
      {/* Primary Metrics */}
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Primary Metrics
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CompactMetricCard
            title="Total Participants"
            value={totalParticipants}
            isLoading={isLoading}
            icon={<Users size={16} />}
            iconColor="text-primary"
          />

          <CompactMetricCard
            title="Female"
            count={totalFemales}
            percent={formatPercent(femalePercent)}
            isLoading={isLoading}
            icon={<UserCheck size={16} />}
            iconColor="text-pink-500"
          />

          <CompactMetricCard
            title="Male"
            count={totalMales}
            percent={formatPercent(malePercent)}
            isLoading={isLoading}
            icon={<CircleUser size={16} />}
            iconColor="text-blue-500"
          />

          <CompactMetricCard
            title="PWD"
            count={disabled.length}
            percent={formatPercent(disabledPercent)}
            isLoading={isLoading}
            icon={<Gauge size={16} />}
            iconColor="text-purple-500"
          />
        </div>
      </div>

      {/* Age Demographics */}
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Age Demographics
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CompactMetricCard
            title="Young Women"
            count={femalesYoung.length}
            percent={formatPercent(youngFemalePercent)}
            isLoading={isLoading}
            icon={<Calendar size={16} />}
            iconColor="text-pink-500"
          />

          <CompactMetricCard
            title="Older Women"
            count={femalesOlder.length}
            percent={formatPercent(olderFemalePercent)}
            isLoading={isLoading}
            icon={<CalendarRange size={16} />}
            iconColor="text-pink-500"
          />

          <CompactMetricCard
            title="Young Men"
            count={malesYoung.length}
            percent={formatPercent(youngMalePercent)}
            isLoading={isLoading}
            icon={<Calendar size={16} />}
            iconColor="text-blue-500"
          />

          <CompactMetricCard
            title="Older Men"
            count={malesOlder.length}
            percent={formatPercent(olderMalePercent)}
            isLoading={isLoading}
            icon={<CalendarRange size={16} />}
            iconColor="text-blue-500"
          />
        </div>
      </div>

      {/* Disability Demographics */}
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Disability Demographics
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CompactMetricCard
            title="PWD Total"
            count={disabled.length}
            percent={formatPercent(disabledPercent)}
            isLoading={isLoading}
            icon={<Gauge size={16} />}
            iconColor="text-purple-500"
          />

          <CompactMetricCard
            title="Women with Disability"
            count={disabledFemales.length}
            percent={formatPercent(disabledFemalePercent)}
            isLoading={isLoading}
            icon={<UserPlus size={16} />}
            iconColor="text-pink-500"
          />

          <CompactMetricCard
            title="Men with Disability"
            count={disabledMales.length}
            percent={formatPercent(disabledMalePercent)}
            isLoading={isLoading}
            icon={<User size={16} />}
            iconColor="text-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
