"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getParticipants,
  createParticipant,
  updateParticipant,
  deleteParticipant,
} from "../actions";
import { type NewParticipant } from "../types";

export function useParticipants(clusterId: string, organizationId?: string) {
  return useQuery({
    queryKey: ["participants", clusterId, organizationId],
    queryFn: () => getParticipants(clusterId, organizationId),
  });
}

export function useCreateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewParticipant) => createParticipant(data),
    onSuccess: () => {
      // Invalidate all participant queries to ensure UI refreshes
      queryClient.invalidateQueries({
        queryKey: ["participants"],
      });
    },
  });
}

export function useUpdateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewParticipant }) =>
      updateParticipant(id, data),
    onSuccess: () => {
      // Invalidate all participant queries to ensure UI refreshes
      queryClient.invalidateQueries({
        queryKey: ["participants"],
      });
    },
  });
}

export function useDeleteParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      organizationId,
    }: {
      id: string;
      organizationId: string;
    }) => deleteParticipant(id, organizationId),
    onSuccess: () => {
      // Invalidate all participant queries to ensure UI refreshes
      queryClient.invalidateQueries({
        queryKey: ["participants"],
      });
    },
  });
}
