"use client";

import { useQuery } from "@tanstack/react-query";
import { getParticipantMetrics } from "../actions/metrics";

export function useParticipantMetrics(clusterId: string) {
  return useQuery({
    queryKey: ["participant-metrics", clusterId],
    queryFn: () => getParticipantMetrics(clusterId),
  });
}
