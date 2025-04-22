"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getParticipants,
  createParticipant,
  updateParticipant,
  deleteParticipant,
} from "../actions";
import { type NewParticipant } from "../types";

export function useParticipants(clusterId: string) {
  return useQuery({
    queryKey: ["participants", clusterId],
    queryFn: () => getParticipants(clusterId),
  });
}

export function useCreateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewParticipant) => createParticipant(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["participants", variables.cluster_id],
      });
    },
  });
}

export function useUpdateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewParticipant }) =>
      updateParticipant(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["participants", variables.data.cluster_id],
      });
    },
  });
}

export function useDeleteParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, clusterId }: { id: string; clusterId: string }) =>
      deleteParticipant(id, clusterId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["participants", variables.clusterId],
      });
    },
  });
}
