"use client";

import { useState } from "react";
import { ParticipantForm } from "./participant-form";
import { ParticipantsTable } from "./participants-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
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
  organizationId: string;
  projects: Project[];
}

export function ParticipantsClient({
  organizationId,
  projects,
}: ParticipantsClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);

  const { data: participantsResult, isLoading: isLoadingParticipants } =
    useParticipants(organizationId);
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
  }) => {
    try {
      // Transform form data to match database types
      const data = {
        ...formData,
        age: parseInt(formData.age, 10),
      };

      if (editingParticipant) {
        const result = await updateParticipant.mutateAsync({
          id: editingParticipant.id,
          data: {
            ...data,
            organization_id: organizationId,
          },
        });
        if (!result.success) {
          throw new Error(result.error || "Failed to update participant");
        }
        toast.success("Participant updated successfully");
      } else {
        const result = await createParticipant.mutateAsync({
          ...data,
          organization_id: organizationId,
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
        organizationId,
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

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Participants</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Participant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingParticipant ? "Edit Participant" : "Add Participant"}
              </DialogTitle>
            </DialogHeader>
            <ParticipantForm
              initialData={
                editingParticipant
                  ? {
                      ...editingParticipant,
                      age: editingParticipant.age.toString(),
                      sex: editingParticipant.sex as
                        | "male"
                        | "female"
                        | "other",
                      isPWD: editingParticipant.isPWD as "yes" | "no",
                      isMother: editingParticipant.isMother as "yes" | "no",
                      isRefugee: editingParticipant.isRefugee as "yes" | "no",
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
              isLoading={
                createParticipant.isPending || updateParticipant.isPending
              }
              projects={projects}
            />
          </DialogContent>
        </Dialog>
      </div>
      <ParticipantsTable
        data={participantsResult.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
