"use client";

import { useState } from "react";
import { ParticipantsTable } from "./participants-table";
import { toast } from "sonner";
import { type Project } from "@/features/projects/types";
import { type Participant } from "../types";
import {
  useParticipants,
  useCreateParticipant,
  useUpdateParticipant,
  useDeleteParticipant,
} from "../hooks/use-participants";
import { Card, CardContent } from "@/components/ui/card";

interface ParticipantsClientProps {
  clusterId: string;
  organizationId?: string;
  projects: Project[];
  clusters: { id: string; name: string }[];
}

export function ParticipantsClient({
  clusterId,
  organizationId,
  projects,
  clusters,
}: ParticipantsClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | undefined
  >(organizationId);

  const { data: participantsResult, isLoading: isLoadingParticipants } =
    useParticipants(clusterId, selectedOrganizationId);
  const createParticipant = useCreateParticipant();
  const updateParticipant = useUpdateParticipant();
  const deleteParticipant = useDeleteParticipant();

  const handleSubmit = async (formData: {
    firstName: string;
    lastName: string;
    country: string;
    district: string;
    subCounty: string;
    parish: string;
    village: string;
    sex: "male" | "female" | "other";
    age: string;
    isPWD: "yes" | "no";
    isMother: "yes" | "no";
    isRefugee: "yes" | "no";
    designation: string;
    enterprise: string;
    contact: string;
    project_id: string;
    organization_id?: string; // Make this optional in the form
  }) => {
    try {
      // We need a valid organization ID for creating/updating participants
      if (
        !organizationId &&
        !formData.organization_id &&
        !selectedOrganizationId
      ) {
        toast.error("Please select an organization");
        return;
      }

      // Use the selected/provided organization ID, falling back to the current organization
      const effectiveOrgId =
        formData.organization_id ||
        selectedOrganizationId ||
        organizationId ||
        "";

      // Transform form data to match database types
      const data = {
        ...formData,
        age: parseInt(formData.age, 10),
        organization_id: effectiveOrgId,
      };

      if (editingParticipant) {
        const result = await updateParticipant.mutateAsync({
          id: editingParticipant.id,
          data: {
            ...data,
            organization_id: effectiveOrgId,
          },
        });
        if (!result.success) {
          throw new Error(result.error || "Failed to update participant");
        }
        toast.success("Participant updated successfully");
      } else {
        const result = await createParticipant.mutateAsync({
          ...data,
          organization_id: effectiveOrgId,
          project_id: data.project_id,
        });
        if (!result.success) {
          throw new Error(result.error || "Failed to create participant");
        }
        toast.success("Participant created successfully");
      }
      setIsOpen(false);
      setEditingParticipant(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setIsOpen(true);
  };

  const handleDelete = async (participant: Participant) => {
    try {
      // Use participant's own organization_id if organizationId is undefined
      const effectiveOrgId =
        organizationId || participant.organization_id || "";

      const result = await deleteParticipant.mutateAsync({
        id: participant.id,
        organizationId: effectiveOrgId,
      });
      if (!result.success) {
        throw new Error(result.error || "Failed to delete participant");
      }
      toast.success("Participant deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  if (isLoadingParticipants) {
    return <div>Loading...</div>;
  }

  if (!participantsResult?.success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">
            Error loading participants: {participantsResult?.error}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get organizations for the filter dropdown
  // const getOrganizationsInCluster = async () => {
  //   // We would implement this to fetch organizations in the cluster
  //   // For now, we'll assume the data is passed through props
  // };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Participants</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="organization-filter" className="mr-2 font-medium">
              Organization:
            </label>
            <select
              id="organization-filter"
              className="h-9 w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={selectedOrganizationId || "all"}
              onChange={(e) =>
                setSelectedOrganizationId(
                  e.target.value === "all" ? undefined : e.target.value,
                )
              }
            >
              <option value="all">All Organizations</option>
              {clusters.length > 0 && organizationId && (
                <option value={organizationId}>Current Organization</option>
              )}
              {/* Here we would ideally list all organizations in the cluster */}
            </select>
          </div>
        </div>
      </div>
      <ParticipantsTable
        data={participantsResult.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setIsOpen(true)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingParticipant={editingParticipant}
        handleSubmit={handleSubmit}
        isLoading={createParticipant.isPending || updateParticipant.isPending}
        projects={projects}
      />
    </div>
  );
}
