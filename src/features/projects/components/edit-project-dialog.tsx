"use client";

import { ProjectForm } from "./project-form";
import { useState } from "react";
import { Project } from "../types";
import { Modal } from "@/components/ui/modal";

type EditProjectDialogProps = {
  project: Project;
  onSelect?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function EditProjectDialog({
  project,
  onSelect,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: EditProjectDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use controlled or uncontrolled state
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = setControlledOpen || setUncontrolledOpen;

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Edit Project"
      description="Update the project details below."
      className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto"
    >
      <ProjectForm
        initialData={project}
        onSuccess={() => {
          setOpen(false);
          onSelect?.();
        }}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Modal>
  );
}
