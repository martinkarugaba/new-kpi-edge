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
  projects: Project[];
  clusters: {
    id: string;
    name: string;
    organizations?: { id: string; name: string }[];
  }[];
}

export function ParticipantsClient({
  clusterId,
  projects,
  clusters,
}: ParticipantsClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [filters, setFilters] = useState({
    cluster: "",
    project: "",
    district: "",
    sex: "",
    isPWD: "",
  });

  const { data: participantsResult, isLoading: isLoadingParticipants } =
    useParticipants(clusterId);
  const createParticipant = useCreateParticipant();
  const updateParticipant = useUpdateParticipant();
  const deleteParticipant = useDeleteParticipant();

  // Get the current cluster's organizations
  const currentCluster = clusters.find((c) => c.id === clusterId);
  const clusterOrganizations =
    currentCluster?.organizations?.map((org) => ({
      id: org.id,
      name: org.name,
      acronym: org.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase(),
      cluster_id: clusterId,
      project_id: null,
      country: "",
      district: "",
      sub_county: "",
      parish: "",
      village: "",
      address: "",
      created_at: null,
      updated_at: null,
      cluster: currentCluster
        ? {
            id: currentCluster.id,
            name: currentCluster.name,
          }
        : null,
      project: null,
    })) || [];

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
  }) => {
    try {
      // Transform form data to match database types
      const data = {
        ...formData,
        age: parseInt(formData.age, 10),
      };

      if (editingParticipant) {
        // Make sure we have a cluster ID
        if (!clusterId) {
          toast.error("Cluster ID is required");
          return;
        }

        const result = await updateParticipant.mutateAsync({
          id: editingParticipant.id,
          data: {
            ...data,
            cluster_id: clusterId,
          },
        });
        if (!result.success) {
          throw new Error(result.error || "Failed to update participant");
        }
        toast.success("Participant updated successfully");
      } else {
        // Make sure we have a cluster ID
        if (!clusterId) {
          toast.error("Cluster ID is required");
          return;
        }

        const result = await createParticipant.mutateAsync({
          ...data,
          cluster_id: clusterId,
          project_id: data.project_id,
          firstName: data.firstName,
          lastName: data.lastName,
          country: data.country,
          district: data.district,
          subCounty: data.subCounty,
          parish: data.parish,
          village: data.village,
          sex: data.sex,
          age: data.age,
          isPWD: data.isPWD,
          isMother: data.isMother,
          isRefugee: data.isRefugee,
          designation: data.designation,
          enterprise: data.enterprise,
          contact: data.contact,
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
      const result = await deleteParticipant.mutateAsync({
        id: participant.id,
        clusterId: clusterId,
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

  // Extract unique values for filters from participants data
  const districts = Array.from(
    new Set((participantsResult?.data || []).map((p) => p.district)),
  )
    .filter(Boolean)
    .sort();

  const sexOptions = Array.from(
    new Set((participantsResult?.data || []).map((p) => p.sex)),
  ).filter(Boolean);

  // Apply filters to the data
  const filteredData = (participantsResult?.data || []).filter(
    (participant) => {
      if (filters.cluster && participant.cluster_id !== filters.cluster)
        return false;
      if (filters.district && participant.district !== filters.district)
        return false;
      if (filters.sex && participant.sex !== filters.sex) return false;
      if (filters.project && participant.project_id !== filters.project)
        return false;
      if (filters.isPWD && participant.isPWD !== filters.isPWD) return false;
      return true;
    },
  );

  return (
    <div className="container mx-auto py-10">
      <ParticipantsTable
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setIsOpen(true)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingParticipant={editingParticipant}
        handleSubmit={handleSubmit}
        isLoading={createParticipant.isPending || updateParticipant.isPending}
        projects={projects}
        // Pass through filter props
        clusterId={clusterId}
        organizations={clusterOrganizations}
        clusters={clusters}
        districts={districts}
        sexOptions={sexOptions}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}
