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

interface AddParticipantDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingParticipant: Participant | null;
  handleSubmit: (data: ParticipantFormValues) => Promise<void>;
  isLoading: boolean;
  projects: Project[];
}

export function AddParticipantDialog({
  isOpen,
  setIsOpen,
  editingParticipant,
  handleSubmit,
  isLoading,
  projects,
}: AddParticipantDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">Add Participant</span>
          <span className="lg:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {editingParticipant ? "Edit Participant" : "Add Participant"}
          </DialogTitle>
        </DialogHeader>
        <ParticipantForm
          initialData={
            editingParticipant
              ? {
                  ...editingParticipant,
                  age: editingParticipant.age.toString(),
                  sex: editingParticipant.sex as "male" | "female" | "other",
                  isPWD: editingParticipant.isPWD as "yes" | "no",
                  isMother: editingParticipant.isMother as "yes" | "no",
                  isRefugee: editingParticipant.isRefugee as "yes" | "no",
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isLoading={isLoading}
          projects={projects}
        />
      </DialogContent>
    </Dialog>
  );
}
