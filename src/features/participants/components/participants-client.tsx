"use client";

import { useState } from "react";
import { ParticipantsTable } from "./participants-table";
import { toast } from "sonner";
import { type Project } from "@/features/projects/types";
import { type Participant } from "../types/types";
import { type ParticipantFormValues } from "./participant-form";
import {
  useParticipants,
  useCreateParticipant,
  useUpdateParticipant,
  useDeleteParticipant,
  useBulkCreateParticipants,
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
  const [isLoading, setIsLoading] = useState(false);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [filters, setFilters] = useState({
    cluster: "",
    project: "",
    district: "",
    sex: "",
    isPWD: "",
  });

  const handleImportParticipants = async (data: ParticipantFormValues[]) => {
    setIsLoading(true);
    const toastId = toast.loading(`Importing ${data.length} participants...`);
    try {
      const transformedData = data.map((participant) => ({
        firstName: participant.firstName,
        lastName: participant.lastName,
        country: participant.country,
        district: participant.district,
        subCounty: participant.subCounty,
        parish: participant.parish,
        village: participant.village,
        contact: participant.contact,
        designation: participant.designation,
        enterprise: participant.enterprise,
        employmentStatus: participant.employmentStatus,
        cluster_id: clusterId,
        project_id: participant.project_id,
        organization_id: participant.organization_id,
        sex: participant.sex as "male" | "female" | "other",
        age: participant.age,
        noOfTrainings: participant.noOfTrainings || "0",
        numberOfChildren: participant.numberOfChildren || "0",
        monthlyIncome: participant.monthlyIncome || "0",
        isPWD: (participant.isPWD === "yes" ? "yes" : "no") as "yes" | "no",
        isMother: (participant.isMother === "yes" ? "yes" : "no") as
          | "yes"
          | "no",
        isRefugee: (participant.isRefugee === "yes" ? "yes" : "no") as
          | "yes"
          | "no",
        isActive: (participant.isActive === "yes" ? "yes" : "no") as
          | "yes"
          | "no",
        isPermanentResident: (participant.isPermanentResident === "yes"
          ? "yes"
          : "no") as "yes" | "no",
        areParentsAlive: (participant.areParentsAlive === "yes"
          ? "yes"
          : "no") as "yes" | "no",
        mainChallenge: participant.mainChallenge || undefined,
        skillOfInterest: participant.skillOfInterest || undefined,
        expectedImpact: participant.expectedImpact || undefined,
        isWillingToParticipate: (participant.isWillingToParticipate === "yes"
          ? "yes"
          : "no") as "yes" | "no",
      }));

      const result = await bulkCreateParticipants.mutateAsync(transformedData);
      if (!result.success) {
        throw new Error(result.error || "Failed to import participants");
      }
      toast.success(`Successfully imported ${data.length} participants`, {
        id: toastId,
      });
    } catch (error) {
      console.error("Import error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to import participants",
        { id: toastId },
      );
    } finally {
      setIsLoading(false);
    }
  };

  const { data: participantsResult, isLoading: isLoadingParticipants } =
    useParticipants(clusterId);
  const createParticipant = useCreateParticipant();
  const bulkCreateParticipants = useBulkCreateParticipants();
  const updateParticipant = useUpdateParticipant();
  const deleteParticipant = useDeleteParticipant(clusterId);

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
      sub_county: [] as string[], // Changed from string to string[]
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
    cluster_id: string;
    organization_id: string;
    noOfTrainings: string;
    isActive: "yes" | "no";
    isPermanentResident: "yes" | "no";
    areParentsAlive: "yes" | "no";
    numberOfChildren: string;
    employmentStatus: string;
    monthlyIncome: string;
    mainChallenge?: string;
    skillOfInterest?: string;
    expectedImpact?: string;
    isWillingToParticipate: "yes" | "no";
  }) => {
    try {
      // Transform form data to match database types
      const data = {
        ...formData,
        age: parseInt(formData.age, 10) || 18,
        noOfTrainings: parseInt(formData.noOfTrainings || "0", 10) || 0,
        numberOfChildren: parseInt(formData.numberOfChildren || "0", 10) || 0,
        monthlyIncome: parseInt(formData.monthlyIncome || "0", 10) || 0,
        isActive: formData.isActive === "yes",
        isPermanentResident: formData.isPermanentResident === "yes",
        areParentsAlive: formData.areParentsAlive === "yes",
        isPWD: formData.isPWD === "yes",
        isMother: formData.isMother === "yes",
        isRefugee: formData.isRefugee === "yes",
        isWillingToParticipate: formData.isWillingToParticipate === "yes",
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
            isPWD: data.isPWD ? "yes" : "no",
            isMother: data.isMother ? "yes" : "no",
            isRefugee: data.isRefugee ? "yes" : "no",
            designation: data.designation,
            enterprise: data.enterprise,
            contact: data.contact,
            organization_id: data.organization_id,
            noOfTrainings: data.noOfTrainings,
            isActive: data.isActive ? "yes" : "no",
            isPermanentResident: data.isPermanentResident ? "yes" : "no",
            areParentsAlive: data.areParentsAlive ? "yes" : "no",
            numberOfChildren: data.numberOfChildren,
            employmentStatus: data.employmentStatus,
            monthlyIncome: data.monthlyIncome,
            mainChallenge: data.mainChallenge || null,
            skillOfInterest: data.skillOfInterest || null,
            expectedImpact: data.expectedImpact || null,
            isWillingToParticipate: data.isWillingToParticipate ? "yes" : "no",
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
          isPWD: data.isPWD ? "yes" : "no",
          isMother: data.isMother ? "yes" : "no",
          isRefugee: data.isRefugee ? "yes" : "no",
          designation: data.designation,
          enterprise: data.enterprise,
          contact: data.contact,
          organization_id: data.organization_id,
          noOfTrainings: data.noOfTrainings,
          isActive: data.isActive ? "yes" : "no",
          isPermanentResident: data.isPermanentResident ? "yes" : "no",
          areParentsAlive: data.areParentsAlive ? "yes" : "no",
          numberOfChildren: data.numberOfChildren,
          employmentStatus: data.employmentStatus,
          monthlyIncome: data.monthlyIncome,
          mainChallenge: data.mainChallenge || null,
          skillOfInterest: data.skillOfInterest || null,
          expectedImpact: data.expectedImpact || null,
          isWillingToParticipate: data.isWillingToParticipate ? "yes" : "no",
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

  const handleAdd = () => {
    setEditingParticipant(null);
    setIsOpen(true);
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
  // const filteredData = (participantsResult?.data || []).filter(
  //   (participant) => {
  //     if (filters.cluster && participant.cluster_id !== filters.cluster)
  //       return false;
  //     if (filters.district && participant.district !== filters.district)
  //       return false;
  //     if (filters.sex && participant.sex !== filters.sex) return false;
  //     if (filters.project && participant.project_id !== filters.project)
  //       return false;
  //     if (filters.isPWD && participant.isPWD !== filters.isPWD) return false;
  //     return true;
  //   }
  // );

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent className="p-0">
          <ParticipantsTable
            data={participantsResult?.data || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            editingParticipant={editingParticipant}
            handleSubmit={handleSubmit}
            onImportParticipants={handleImportParticipants}
            isLoading={isLoading}
            projects={projects}
            organizations={clusterOrganizations}
            clusters={clusters}
            districts={districts}
            sexOptions={sexOptions}
            filters={filters}
            setFilters={setFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}
