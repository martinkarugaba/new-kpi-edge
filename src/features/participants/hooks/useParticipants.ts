import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type NewParticipant } from "../types";
import {
  createParticipant,
  deleteParticipant,
  getParticipants,
  updateParticipant,
} from "../actions";

export function useParticipants(organizationId: string) {
  return useQuery({
    queryKey: ["participants", organizationId],
    queryFn: () => getParticipants(organizationId),
  });
}

export function useCreateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewParticipant) => createParticipant(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["participants", variables.organization_id],
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
        queryKey: ["participants", variables.data.organization_id],
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["participants", variables.organizationId],
      });
    },
  });
}
