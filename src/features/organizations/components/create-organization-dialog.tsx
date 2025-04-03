"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrganizationForm } from "./organization-form";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Cluster } from "@/features/clusters/components/clusters-table";

type CreateOrganizationDialogProps = {
  clusters: Cluster[];
  children?: React.ReactNode;
};

export function CreateOrganizationDialog({
  clusters,
  children,
}: CreateOrganizationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const selectedClusterId = searchParams.get("clusterId");

  // Find the selected cluster or use the first one
  const selectedCluster =
    clusters.find((c) => c.id === selectedClusterId) || clusters[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button className="h-10">New Organization</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Create Organization
          </DialogTitle>
          <DialogDescription>
            Add a new organization to {selectedCluster?.name || "your cluster"}.
            Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <OrganizationForm
          clusters={clusters}
          defaultClusterId={selectedCluster?.id}
          onSuccess={() => setOpen(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
