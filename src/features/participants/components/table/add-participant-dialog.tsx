"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type Project } from "@/features/projects/types";
import { type Participant } from "../../types";
import { type ParticipantFormValues } from "../participant-form";
import { ParticipantForm } from "../participant-form";
import { Separator } from "@/components/ui/separator";

// Extended participant type with the additional properties needed for the form
type ExtendedParticipant = Participant & {
  noOfTrainings?: string | number;
  isActive?: string;
};

interface AddParticipantDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingParticipant: ExtendedParticipant | null;
  handleSubmit: (data: ParticipantFormValues) => Promise<void>;
  isLoading: boolean;
  projects: Project[];
  clusters: { id: string; name: string }[];
  clusterId: string;
}

export function AddParticipantDialog({
  isOpen,
  setIsOpen,
  editingParticipant,
  handleSubmit,
  isLoading,
  projects,
  clusters,
}: AddParticipantDialogProps) {
  const handleOpenDialog = () => setIsOpen(true);

  // Transform the participant data to match the form's expected types
  const transformedData = editingParticipant
    ? {
        firstName: editingParticipant.firstName,
        lastName: editingParticipant.lastName,
        country: editingParticipant.country,
        district: editingParticipant.district,
        subCounty: editingParticipant.subCounty,
        parish: editingParticipant.parish,
        village: editingParticipant.village,
        sex: editingParticipant.sex as "male" | "female" | "other",
        age: editingParticipant.age.toString(),
        isPWD: editingParticipant.isPWD as "yes" | "no",
        isMother: editingParticipant.isMother as "yes" | "no",
        isRefugee: editingParticipant.isRefugee as "yes" | "no",
        designation: editingParticipant.designation,
        enterprise: editingParticipant.enterprise,
        contact: editingParticipant.contact,
        cluster_id: editingParticipant.cluster_id,
        project_id: editingParticipant.project_id,
        noOfTrainings: editingParticipant.noOfTrainings?.toString() || "0",
        isActive: (editingParticipant.isActive as "yes" | "no") || "yes",
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!editingParticipant && (
        <DialogTrigger asChild>
          <Button
            onClick={handleOpenDialog}
            className="flex items-center gap-2"
            variant="default"
          >
            <Plus className="h-3 w-4" />
            Add Participant
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="min-w-[80vw] lg:min-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg text-center font-semibold">
            {editingParticipant ? "Edit Participant" : "Add Participant"}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <ParticipantForm
          initialData={transformedData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          projects={projects}
          clusters={clusters}
        />
      </DialogContent>
    </Dialog>
  );
}
