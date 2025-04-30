"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ParticipantFormValues } from "../components/participant-form";
import {
  getParticipants,
  createParticipant,
  updateParticipant,
  deleteParticipant,
} from "../actions";
import { importParticipants } from "../actions/import-participants";
import { type NewParticipant } from "../types/types";

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

export function useDeleteParticipant(clusterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteParticipant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["participants", clusterId],
      });
    },
  });
}

export function useBulkCreateParticipants() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participants: ParticipantFormValues[]) => {
      const result = await importParticipants(participants);
      if (!result.success) {
        throw new Error(result.error || "Failed to import participants");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      // Assuming all participants are for the same cluster
      if (variables[0]) {
        queryClient.invalidateQueries({
          queryKey: ["participants", variables[0].cluster_id],
        });
      }
    },
  });
}
