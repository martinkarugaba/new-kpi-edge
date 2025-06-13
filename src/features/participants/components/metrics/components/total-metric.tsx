import { IconFriends } from "@tabler/icons-react";
import { MetricCardWrapper } from "./metric-card-wrapper";

interface TotalMetricProps {
  totalParticipants: number;
  isLoading: boolean;
}

export function TotalMetric({
  totalParticipants,
  isLoading,
}: TotalMetricProps) {
  return (
    <MetricCardWrapper
      title="Total Participants"
      value={totalParticipants}
      icon={<IconFriends className="size-4" />}
      isLoading={isLoading}
      footerTitle="All registered participants"
      footerDescription="Total count across all groups"
    />
  );
}
